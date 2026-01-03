"use client";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { PortfolioStock } from "@/lib/types/portfolio";

interface PortfolioTableProps {
  data: PortfolioStock[];
}

const PortfolioTable = ({ data }: PortfolioTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<PortfolioStock>[]>(
    () => [
      {
        accessorKey: "particulars",
        header: "particulars",
        cell: (info) => (
          <div className="font-medium text-gray-900">
            {info.getValue() as string}
            <div className="text-xs text-gray-500">
              {info.row.original.symbol}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "purchasePrice",
        header: "purchasePrice",
        cell: (info) => `₹${(info.getValue() as number).toFixed(2)}`,
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        cell: (info) =>
          (info.getValue() as number).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          }),
      },
      {
        accessorKey: "portfolioPercent",
        header: "Portfolio %",
        cell: (info) => {
          const value = info.getValue() as number;
          return (
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-sm">{value.toFixed(2)}%</span>
            </div>
          );
        },
      },
      {
        accessorKey: "exchange",
        header: "NSE/BSE",
        cell: (info) => (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "cmp",
        header: "CMP",
        cell: (info) => {
          const value = info.getValue() as number;
          return value ? (
            <span className="font-semibold">{value.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400">Loading ....</span>
          );
        },
      },
      {
        accessorKey: "presentValue",
        header: "Present Value",
        cell: (info) => {
          const value = info.getValue() as number;
          return `₹${value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`;
        },
      },
      {
        accessorKey: "gainLoss",
        header: "Gain/Loss",
        cell: (info) => {
          const value = info.getValue() as number;
          const isPositive = value >= 0;
          const percentage = (
            (value / info.row.original.investment) *
            100
          ).toFixed(2);

          return (
            <div className={isPositive ? "text-green-600" : "text-red-600"}>
              <div className="font-bold">
                {isPositive ? "+" : ""}₹
                {Math.abs(value).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs">
                {isPositive ? "+" : ""}
                {percentage}%
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "peRatio",
        header: "P/E Ratio",
        cell: (info) => {
          const value = info.getValue() as number | null;
          return value !== null ? (
            <span>{value.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400">N/A</span>
          );
        },
      },
      {
        accessorKey: "latestEarnings",
        header: "Latest Earnings",
        cell: (info) => {
          const value = info.getValue() as string | null;
          return value || <span className="text-gray-400">N/A</span>;
        },
      },
    ],
    []
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-linear-to-r from-gray-50 to-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={header.column.getToggleGroupingHandler()}
                >
                  <div className="flex items-center space-x-1">
                    <span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
};

export default PortfolioTable;
