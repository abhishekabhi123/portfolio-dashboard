"use client";

import { useState, useEffect, useCallback } from "react";
import PortfolioSummary from "@/components/PortfolioSummary";
import SectorGroup from "@/components/SectorGroup";
import { PortfolioStock, SectorSummary } from "@/lib/types/portfolio";
import { initialPortfolio } from "@/lib/data/samplePortfolio";
import { groupBySector, calculateTotals } from "@/lib/utils/calculation";

export default function DashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioStock[]>([]);
  const [sectorGroups, setSectorGroups] = useState<SectorSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [nextUpdate, setNextUpdate] = useState(15);
  const [refreshKey, setRefreshKey] = useState(0);

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
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      const stocksData = result.data;

      if (!stocksData) {
        throw new Error("No data in response");
      }

      const totalInvestment = initialPortfolio.reduce(
        (sum, stock) => sum + stock.purchasePrice * stock.quantity,
        0
      );

      const enrichedPortfolio: PortfolioStock[] = initialPortfolio.map(
        (stock, index) => {
          const apiData = stocksData[index] || {};
          const investment = stock.purchasePrice * stock.quantity;
          const cmp = apiData.cmp || stock.purchasePrice;
          const presentValue = cmp * stock.quantity;
          const gainLoss = presentValue - investment;
          const portfolioPercent = (investment / totalInvestment) * 100;

          return {
            particulars: stock.particulars,
            symbol: stock.symbol,
            purchasePrice: stock.purchasePrice,
            quantity: stock.quantity,
            investment,
            portfolioPercent,
            exchange: stock.exchange,
            cmp,
            presentValue,
            gainLoss,
            peRatio: apiData.peRatio || null,
            latestEarnings: apiData.eps ? `₹${apiData.eps.toFixed(2)}` : null,
            sector: stock.sector,
          };
        }
      );

      setPortfolioData(enrichedPortfolio);
      setSectorGroups(groupBySector(enrichedPortfolio));
      setLastUpdated(new Date());
      setIsLoading(false);

      console.log("Data loaded successfully");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      setIsLoading(false);
    }
  }, []);

  const handleManualRefresh = () => {
    setNextUpdate(15);
    setRefreshKey((prev) => prev + 1);
    fetchStockData();
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(() => {
      fetchStockData();
      setNextUpdate(15);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchStockData, refreshKey]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setNextUpdate((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const totals =
    portfolioData.length > 0 ? calculateTotals(portfolioData) : null;

  if (isLoading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              fetchStockData();
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
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
                Real-time stock portfolio tracking
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
                onClick={handleManualRefresh}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <p className="mt-1">Yahoo Finance API | Indian Markets (NSE/BSE)</p>
        </div>
      </main>
    </div>
  );
}
