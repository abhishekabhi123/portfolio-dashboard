import axios from "axios";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://alphavantage.co/query";

export interface StockData {
  symbol: string;
  price: number;
  peRatio: number | null;
  eps: number | null;
  timestamp: Date;
}

function formatIndianSymbol(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE"
): string {
  return `${symbol}.${exchange}`;
}

export async function fetchStockPrice(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE"
) {
  try {
    const formattedSymbol = formatIndianSymbol(symbol, exchange);

    const response = await axios.get(BASE_URL, {
      params: {
        symbol: formattedSymbol,
        function: "GLOBAL_QUOTE",
        apikey: API_KEY,
      },
      timeout: 10000,
    });

    const quote = response.data["Global Quote"];

    if (!quote) {
      throw new Error(`No data for${formattedSymbol}`);
    }
    return {
      symbol,
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"]),
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`Error while fetching price for ${symbol}`, error);
    throw error;
  }
}

export async function fetchStockFundamentals(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE"
) {
  try {
    const formattedSymbol = formatIndianSymbol(symbol, exchange);

    const response = await axios.get(BASE_URL, {
      params: {
        symbol: formattedSymbol,
        function: "OVERVIEW",
        apikey: API_KEY,
      },
      timeout: 10000,
    });

    const data = response.data;

    return {
      symbol,
      peRatio: data.peRatio ? parseFloat(data.peRatio) : null,
      forwardPe: data.forwardPe ? parseFloat(data.forwardPe) : null,
      eps: data.eps ? parseFloat(data.eps) : null,
      dividendYield: data.dividendYield ? parseFloat(data.dividendYield) : null,
      marketCap: data.marketCapitalization,
      section: data.sector || "unknown",
    };
  } catch (error) {
    console.error(`Error while fetching fundamentals for ${symbol}`, error);
    throw error;
  }
}

export async function fetchCompleteStockData(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE"
): Promise<StockData> {
  try {
    const [priceData, fundamentals] = await Promise.all([
      fetchStockPrice(symbol, exchange),
      fetchStockFundamentals(symbol, exchange),
    ]);

    return {
      symbol,
      price: priceData.price,
      peRatio: fundamentals.peRatio,
      eps: fundamentals.eps,
      timestamp: priceData.timestamp,
    };
  } catch (error) {
    console.error(`Error while fetching complete data for ${symbol}`, error);
    throw error;
  }
}

export async function fetchMultipleStocks(
  stocks: Array<{ symbol: string; exchange: "NSE" | "BSE" }>
) {
  const results: Map<string, StockData> = new Map();
  const errors: string[] = [];

  for (let i = 0; i < stocks.length; i++) {
    const { symbol, exchange } = stocks[i];

    try {
      const data = await fetchCompleteStockData(symbol, exchange);
      results.set(symbol, data);

      if (i < stocks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    } catch (error) {
      errors.push(symbol);
      console.error(`Failed to fetch ${symbol}`, error);
    }
  }
  return { results, errors };
}
