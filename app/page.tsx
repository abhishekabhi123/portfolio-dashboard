"use client";

import { useState, useEffect, useCallback } from "react";
import PortfolioSummary from "@/components/PortfolioSummary";
import SectorGroup from "@/components/SectorGroup";
import { PortfolioStock, SectorSummary } from "@/lib/types/portfolio";
import { initialPortfolio } from "@/lib/data/samplePortfolio";

import {
  calculateInvestment,
  calculatePresentValue,
  calculateGainLoss,
  calculatePortfolioPercent,
  groupBySector,
  calculateTotals,
} from "@/lib/utils/calculation";
import { init } from "next/dist/compiled/webpack/webpack";
export default function DashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioStock[]>([]);
  const [sectorGroups, setSectorGroups] = useState<SectorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [nextUpdate, setNextUpdate] = useState(15);

  const fetchStockData = useCallback(async () => {
    try {
      setError(null);
      const stocks = initialPortfolio.map((stock) => ({
        symbol: stock.symbol,
        exchange: stock.exchange,
      }));

      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stocks }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const result = await response.json();
      const stockData = result.data;

      const totalInvestment = initialPortfolio.reduce(
        (sum, stock) =>
          sum + calculateInvestment(stock.purchasePrice, stock.quantity),
        0
      );

      const enrichedPortfolio: PortfolioStock[] = initialPortfolio.map(
        (stock, index) => {
          const apiData = stockData[index];
          const investment = calculateInvestment(
            stock.purchasePrice,
            stock.quantity
          );
          const cmp = apiData?.cmp || stock.purchasePrice;
          const presentValue = calculatePresentValue(cmp, stock.quantity);
          const gainLoss = calculateGainLoss(presentValue, investment);
          const portfolioPercent = calculatePortfolioPercent(
            investment,
            totalInvestment
          );

          return {
            ...stock,
            investment,
            cmp,
            presentValue,
            gainLoss,
            portfolioPercent,
            peRatio: apiData?.peRatio || null,
            latestEarnings: apiData?.eps ? `₹${apiData.eps.toFixed(2)}` : null,
          };
        }
      );
      setPortfolioData(enrichedPortfolio);

      const grouped = groupBySector(enrichedPortfolio);
      setSectorGroups(grouped);

      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStockData();
      setNextUpdate(15);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchStockData]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setNextUpdate((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const totals =
    portfolioData.length > 0 ? calculateTotals(portfolioData) : null;

  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Portfolio Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Real time stock portfolio tracking
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  Next update in {nextUpdate}s
                </span>
              </div>
              <button
                onClick={fetchStockData}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {totals && (
          <PortfolioSummary
            totalInvestment={totals.totalInvestment}
            totalPresentValue={totals.totalPresentValue}
            totalGainLoss={totals.totalGainLoss}
            lastUpdated={lastUpdated}
          />
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            Sector-wise Holdings
          </h2>

          {sectorGroups.length > 0 ? (
            sectorGroups.map((sectorGroup) => (
              <SectorGroup key={sectorGroup.sector} sectorData={sectorGroup} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">No portfolio data available</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data updates automatically every 15 seconds</p>
          <p className="mt-1">
            Powered by Alpha Vantage API | Indian Stock Markets (NSE/BSE)
          </p>
        </div>
      </main>
    </div>
  );
}
