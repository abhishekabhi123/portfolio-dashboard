"use client";
import React from "react";

interface PortfolioSummaryProps {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  lastUpdated: Date;
}

const PortfolioSummary = ({
  totalInvestment,
  totalPresentValue,
  totalGainLoss,
  lastUpdated,
}: PortfolioSummaryProps) => {
  const isPositive = totalGainLoss >= 0;
  const gainLossPercent = ((totalGainLoss / totalInvestment) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Total Investment</div>
        <div className="text-2xl font-bold text-gray-900">
          ₹{totalInvestment.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Present Value</div>
        <div className="text-2xl font-bold text-gray-900">
          ₹{totalPresentValue.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Total Gain/Loss</div>
        <div
          className={`text-2xl font-bold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}₹
          {Math.abs(totalGainLoss).toLocaleString("en-IN")}
        </div>
        <div
          className={`text-sm ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {gainLossPercent}%
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Last Updated</div>
        <div className="text-lg font-semibold text-gray-900">
          {lastUpdated.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="text-xs text-gray-500">
          {lastUpdated.toLocaleDateString("en-IN")}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
