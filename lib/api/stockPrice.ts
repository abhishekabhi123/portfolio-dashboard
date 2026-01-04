import axios from "axios";

export interface StockData {
  symbol: string;
  price: number;
  peRatio: number | null;
  eps: number | null;
  timestamp: Date;
}

export async function fetchStockPrice(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE"
) {
  try {
    const yahooSymbol = exchange === "NSE" ? `${symbol}.NS` : `${symbol}.BO`;

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;

    const response = await axios.get(url, {
      params: {
        interval: "1d",
        range: "1d",
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const result = response.data.chart.result[0];
    const meta = result.meta;

    return {
      symbol: symbol,
      price: meta.regularMarketPrice || meta.previousClose || 0,
      previousClose: meta.previousClose || 0,
      currency: meta.currency || "INR",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
}

// Mock P/E ratios for demo
const MOCK_PE_RATIOS: Record<string, number> = {
  RELIANCE: 23.5,
  TCS: 28.3,
  HDFCBANK: 19.2,
  INFY: 25.6,
  ICICIBANK: 17.8,
  SBIN: 12.4,
  BHARTIARTL: 34.2,
  ITC: 22.1,
  HINDUNILVR: 55.3,
  LT: 28.9,
};

// Mock EPS data
const MOCK_EPS: Record<string, number> = {
  RELIANCE: 98.5,
  TCS: 125.3,
  HDFCBANK: 75.2,
  INFY: 62.8,
  ICICIBANK: 45.6,
  SBIN: 38.2,
  BHARTIARTL: 18.5,
  ITC: 12.3,
  HINDUNILVR: 42.1,
  LT: 82.4,
};

export async function fetchCompleteStockData(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE"
): Promise<StockData> {
  try {
    const priceData = await fetchStockPrice(symbol, exchange);

    return {
      symbol: symbol,
      price: priceData.price,
      peRatio: MOCK_PE_RATIOS[symbol] || null,
      eps: MOCK_EPS[symbol] || null,
      timestamp: priceData.timestamp,
    };
  } catch (error) {
    console.error(`Error fetching complete data for ${symbol}:`, error);
    return {
      symbol,
      price: 0,
      peRatio: MOCK_PE_RATIOS[symbol] || null,
      eps: MOCK_EPS[symbol] || null,
      timestamp: new Date(),
    };
  }
}

export async function fetchMultipleStocks(
  stocks: Array<{ symbol: string; exchange: "NSE" | "BSE" }>
) {
  const results: StockData[] = [];

  for (const { symbol, exchange } of stocks) {
    try {
      const data = await fetchCompleteStockData(symbol, exchange);
      results.push(data);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to fetch ${symbol}`, error);

      results.push({
        symbol,
        price: 0,
        peRatio: MOCK_PE_RATIOS[symbol] || null,
        eps: MOCK_EPS[symbol] || null,
        timestamp: new Date(),
      });
    }
  }

  return results;
}
