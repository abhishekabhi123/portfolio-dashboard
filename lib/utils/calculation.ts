import { PortfolioStock, SectorSummary } from "../types/portfolio";

export function calculateInvestment(
  purchasePrice: number,
  quantity: number
): number {
  return purchasePrice * quantity;
}

export function calculatePercentValue(cmp: number, quantity: number): number {
  return cmp * quantity;
}

export function calculateGainLoss(
  presentValue: number,
  investment: number
): number {
  return presentValue - investment;
}

export function calculatePortfolioPercent(
  investment: number,
  totalInvestment: number
): number {
  return (investment / totalInvestment) * 100;
}

export function groupBySector(stocks: PortfolioStock[]): SectorSummary[] {
  const sectorMap = new Map<string, PortfolioStock[]>();

  stocks.forEach((stock) => {
    if (!sectorMap.has(stock.sector)) {
      sectorMap.set(stock.sector, []);
    }
    sectorMap.get(stock.sector)!.push(stock);
  });

  const sectorSummaries: SectorSummary[] = [];

  sectorMap.forEach((stocks, sector) => {
    const totalInvestment = stocks.reduce(
      (sum, stock) => sum + stock.investment,
      0
    );
    const totalPresentValue = stocks.reduce(
      (sum, stock) => sum + stock.presentValue,
      0
    );
    const gainLoss = totalPresentValue - totalInvestment;

    sectorSummaries.push({
      sector,
      totalInvestment,
      totalPresentValue,
      gainLoss,
      stocks,
    });
  });

  return sectorSummaries;
}

export function calculateTotals(stocks: PortfolioStock[]) {
  const totalInvestment = stocks.reduce(
    (sum, stock) => sum + stock.investment,
    0
  );
  const totalPresentValue = stocks.reduce(
    (sum, stock) => sum + stock.presentValue,
    0
  );
  const totalGainLoss = totalPresentValue - totalInvestment;

  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
  };
}
