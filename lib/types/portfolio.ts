export interface PortfolioStock {
  particulars: string;
  symbol: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  exchange: "NSE" | "BSE";
  cmp: number;
  presentValue: number;
  gainLoss: number;
  peRatio: number | null;
  latestEarnings: string | null;
  sector: string | null;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  stocks: PortfolioStock[];
}
