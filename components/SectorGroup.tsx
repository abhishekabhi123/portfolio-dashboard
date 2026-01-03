"use client";
import React from "react";
import { SectorSummary } from "@/lib/types/portfolio";
import PortfolioTable from "./PortfolioTable";
import { useState } from "react";

interface SectorGroupProps {
  sectorData: SectorSummary;
}

const SectorGroup = ({ sectorData }: SectorGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const gainLosePercent = (
    (sectorData.gainLoss / sectorData.totalInvestment) *
    100
  ).toFixed(2);

  const isPositive = sectorData.gainLoss >= 0;
  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div
        className="bg-gradient-to-r from-blue-50 to to-blue-100 px-6 py-4 cursor-pointer hover:from-blue-100 hover:mask-t-to-blue-200 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-blue-600 font-bold text-xl">
              {isExpanded ? "−" : "+"}
            </button>
            <h3 className="text-lg font-bold text-gray-800">
              {sectorData.sector}
            </h3>
            <span className="text-sm text-gray-600">
              ({sectorData.stocks.length} stocks)
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div>
              <div className="text-xs text-gray-600">Total Investment</div>
              <div className="text-sm font-semibold">
                ₹{sectorData.totalInvestment.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Present Value</div>
              <div className="text-sm font-semibold">
                ₹{sectorData.totalPresentValue.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Gain/Loss</div>
              <div
                className={`text-sm font-bold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}₹
                {Math.abs(sectorData.gainLoss).toLocaleString("en-IN")}
                <span className="text-xs ml-1">
                  ({isPositive ? "+" : ""}
                  {gainLosePercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4">
          <PortfolioTable data={sectorData.stocks} />
        </div>
      )}
    </div>
  );
};

export default SectorGroup;
