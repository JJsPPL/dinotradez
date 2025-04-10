
import { StockData, LottoStockData } from './stockSearch.types';

// Function to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
};

// Fallback to mock data if API call fails
export const getMockData = (symbol: string): StockData => {
  // Calculate some random values based on the symbol string to simulate unique data
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rand = (min: number, max: number) => min + ((seed % 100) / 100) * (max - min);
  
  const price = rand(50, 500);
  const change = rand(-20, 20);
  const percentChange = (change / price) * 100;
  const volume = Math.floor(rand(1000000, 50000000));
  const marketCap = price * rand(1000000, 5000000000);
  
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Inc.`,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    percentChange: parseFloat(percentChange.toFixed(2)),
    high52w: parseFloat((price * 1.3).toFixed(2)),
    low52w: parseFloat((price * 0.7).toFixed(2)),
    dayHigh: parseFloat((price * 1.05).toFixed(2)),
    dayLow: parseFloat((price * 0.95).toFixed(2)),
    closePrice: parseFloat((price - change).toFixed(2)),
    marketCap: formatNumber(marketCap),
    sharesOutstanding: formatNumber(Math.floor(marketCap / price)),
    authorizedShares: formatNumber(Math.floor((marketCap / price) * 1.2)),
    marketCapToEquityRatio: parseFloat(rand(5, 50).toFixed(1)),
    dollarVolume: formatNumber(volume * price),
    volume: volume,
  };
};

// Generate mock data for lotto (penny) stocks
export const getLottoMockData = (symbol: string): LottoStockData => {
  // Calculate some random values based on the symbol string to simulate unique data
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rand = (min: number, max: number) => min + ((seed % 100) / 100) * (max - min);
  
  const price = rand(0.1, 5); // penny stocks have lower prices
  const change = rand(-0.5, 0.5);
  const percentChange = (change / price) * 100;
  const volume = Math.floor(rand(500000, 20000000));
  const marketCap = price * rand(1000000, 100000000); // smaller market caps
  
  return {
    symbol: symbol.toUpperCase(),
    companyName: `${symbol.toUpperCase()} Corp.`,
    lastPrice: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    percentChange: parseFloat(percentChange.toFixed(2)),
    volume: volume,
    marketCap: formatNumber(marketCap),
    sector: ['Technology', 'Healthcare', 'Energy', 'Consumer Cyclical', 'Basic Materials'][Math.floor(rand(0, 5))],
    marketCapRatio: parseFloat(rand(1, 15).toFixed(2)),
    newsflags: parseFloat(rand(0, 30).toFixed(1)),
    sVol: parseFloat(rand(10, 90).toFixed(1)),
    relativeVolumeStDev: parseFloat(rand(0, 10).toFixed(2)),
    shares: Math.floor(rand(1000000, 100000000)),
    catScale: parseFloat(rand(0, 3).toFixed(3)),
    putScale: parseFloat(rand(0, 3).toFixed(3)),
  };
};
