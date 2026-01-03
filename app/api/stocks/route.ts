/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { fetchCompleteStockData } from "@/lib/api/alphaVantage";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 15 });

export async function POST(request: NextRequest) {
  try {
    const { stocks } = await request.json();

    const cacheKey = `portfolio_${stocks.map((s: any) => s.symbol).join("_")}`;

    const cacheData = cache.get(cacheKey);

    if (cacheData) {
      return NextResponse.json({
        data: cacheData,
        cached: true,
        timestamp: new Date(),
      });
    }

    const stockData: any[] = [];

    for (const stock of stocks) {
      try {
        const data = await fetchCompleteStockData(stock.symbol, stock.exchange);
        stockData.push({
          symbol: stock.symbol,
          cmp: data.price,
          peRatio: data.peRatio,
          eps: data.eps,
          timestamp: data.timestamp,
        });
        if (stocks.indexOf(stock) < stocks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Failed to fetch ${stock.symbol}`, error);
        stockData.push({
          symbol: stock.symbol,
          cmp: null,
          peRatio: null,
          eps: null,
          error: "Failed to fetch",
        });
      }
    }
    cache.set(cacheKey, stockData);

    return NextResponse.json({
      data: stockData,
      cached: false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");
  const exchange = (searchParams.get("exchange") as "NSE" | "BSE") || "NSE";

  if (!symbol) {
    return NextResponse.json({ error: "Symbol required" }, { status: 400 });
  }
  try {
    const cacheKey = `stock_${symbol}_exchange`;
    const cacheData = cache.get(cacheKey);

    if (cacheData) {
      return NextResponse.json({ data: cacheData, cached: true });
    }
    const data = await fetchCompleteStockData(symbol, exchange);
    cache.set(cacheKey, data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}
