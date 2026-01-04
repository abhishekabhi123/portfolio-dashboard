/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchMultipleStocks } from "@/lib/api/stockPrice";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 15 });

export async function POST(request: NextRequest) {
  try {
    const { stocks } = await request.json();

    if (!stocks || !Array.isArray(stocks)) {
      return NextResponse.json(
        { error: "Invalid request: stocks array required" },
        { status: 400 }
      );
    }

    const cacheKey = `portfolio_${stocks.map((s: any) => s.symbol).join("_")}`;

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached data");
      return NextResponse.json({
        data: cachedData,
        cached: true,
        timestamp: new Date(),
      });
    }

    // Fetch fresh data
    const stocksData = await fetchMultipleStocks(stocks);

    const formattedData = stocksData.map((stock) => ({
      symbol: stock.symbol,
      cmp: stock.price,
      peRatio: stock.peRatio,
      eps: stock.eps,
      timestamp: stock.timestamp,
    }));

    cache.set(cacheKey, formattedData);

    return NextResponse.json({
      data: formattedData,
      cached: false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch stock data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing single stock
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol") || "RELIANCE";
  const exchange = (searchParams.get("exchange") as "NSE" | "BSE") || "NSE";

  try {
    const { fetchCompleteStockData } = await import("@/lib/api/stockPrice");
    const data = await fetchCompleteStockData(symbol, exchange);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
