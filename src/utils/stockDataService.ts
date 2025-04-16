import axios from 'axios';
import API_CONFIG from '@/config/api';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  high52w?: number;
  low52w?: number;
  dayHigh?: number;
  dayLow?: number;
  closePrice?: number;
  marketCap?: string;
  volume?: number;
}

// Function to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toString();
};

// Fetch real stock data from Alpha Vantage
export async function getAlphaVantageStockData(symbol: string): Promise<StockQuote | null> {
  try {
    // Global Quote endpoint for current price data
    const quoteUrl = `${API_CONFIG.alphaVantage.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.alphaVantage.apiKey}`;
    const quoteResponse = await axios.get(quoteUrl);
    const quoteData = quoteResponse.data['Global Quote'];
    
    if (!quoteData || !quoteData['01. symbol']) {
      console.warn(`No quote data found for ${symbol}`);
      return null;
    }
    
    // Overview endpoint for company information
    const overviewUrl = `${API_CONFIG.alphaVantage.baseUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${API_CONFIG.alphaVantage.apiKey}`;
    const overviewResponse = await axios.get(overviewUrl);
    const overviewData = overviewResponse.data;
    
    const price = parseFloat(quoteData['05. price']);
    const previousClose = parseFloat(quoteData['08. previous close']);
    const change = parseFloat(quoteData['09. change']);
    const percentChange = parseFloat(quoteData['10. change percent'].replace('%', ''));
    const volume = parseInt(quoteData['06. volume']);
    
    let marketCap = 'N/A';
    if (overviewData && overviewData.MarketCapitalization) {
      marketCap = formatNumber(parseFloat(overviewData.MarketCapitalization));
    }
    
    // Create stock data object
    const stockData: StockQuote = {
      symbol: quoteData['01. symbol'],
      name: overviewData?.Name || symbol,
      price: price,
      change: change,
      percentChange: percentChange,
      closePrice: previousClose,
      volume: volume,
      marketCap: marketCap,
      // These fields might not be available directly from Alpha Vantage free tier
      // We'll keep mock data for them for now
      high52w: price * 1.2,
      low52w: price * 0.8,
      dayHigh: parseFloat(quoteData['03. high']),
      dayLow: parseFloat(quoteData['04. low'])
    };
    
    return stockData;
  } catch (error) {
    console.error('Error fetching Alpha Vantage data:', error);
    return null;
  }
}

// Alternative method using Yahoo Finance API (through RapidAPI)
export async function getStockDataRapidAPI(symbol: string): Promise<StockQuote | null> {
  const options = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary',
    params: { symbol, region: 'US' },
    headers: {
      'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual RapidAPI key
      'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data;
    
    // Extract and transform the data
    const summaryDetail = data.summaryDetail || {};
    const price = data.price || {};
    
    return {
      symbol: symbol.toUpperCase(),
      name: price.longName || price.shortName || symbol.toUpperCase(),
      price: price.regularMarketPrice?.raw || 0,
      change: price.regularMarketChange?.raw || 0,
      percentChange: price.regularMarketChangePercent?.raw || 0,
      high52w: summaryDetail.fiftyTwoWeekHigh?.raw || 0,
      low52w: summaryDetail.fiftyTwoWeekLow?.raw || 0,
      dayHigh: summaryDetail.dayHigh?.raw || 0,
      dayLow: summaryDetail.dayLow?.raw || 0,
      closePrice: summaryDetail.previousClose?.raw || 0,
      marketCap: formatNumber(summaryDetail.marketCap?.raw || 0),
      volume: summaryDetail.volume?.raw || 0
    };
  } catch (error) {
    console.error('Error fetching stock data with RapidAPI:', error);
    return null;
  }
}

// Public Yahoo Finance API without needing an API key (may have limitations)
export async function getStockDataPublic(symbol: string): Promise<StockQuote | null> {
  try {
    // Using Yahoo Finance query1 endpoint
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    const result = response.data.chart.result[0];
    
    if (!result) {
      console.warn(`No data found for symbol: ${symbol}`);
      return null;
    }
    
    const quote = result.indicators.quote[0];
    const meta = result.meta;
    const timestamp = result.timestamp;
    const latestIndex = timestamp.length - 1;
    
    // Calculate price change
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const percentChange = (change / previousClose) * 100;
    
    return {
      symbol: meta.symbol,
      name: symbol, // Basic API doesn't provide company name
      price: currentPrice,
      change: change,
      percentChange: percentChange,
      dayHigh: quote.high?.[latestIndex] || 0,
      dayLow: quote.low?.[latestIndex] || 0,
      closePrice: previousClose,
      volume: quote.volume?.[latestIndex] || 0
    };
  } catch (error) {
    console.error(`Error fetching public stock data for ${symbol}:`, error);
    return null;
  }
}

// Mock data as fallback
export function getMockStockData(symbol: string): StockQuote {
  // Calculate some random values based on the symbol string to simulate unique data
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rand = (min: number, max: number) => min + ((seed % 100) / 100) * (max - min);
  
  const price = rand(50, 500);
  const change = rand(-20, 20);
  const percentChange = (change / price) * 100;
  const volume = Math.floor(rand(1000000, 50000000));
  
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
    marketCap: formatNumber(Math.floor(rand(1000000, 5000000000))),
    volume: volume
  };
}

// Main function to get stock data with fallback options
export async function fetchStockData(symbol: string): Promise<StockQuote> {
  try {
    // Try Alpha Vantage first
    const alphaVantageData = await getAlphaVantageStockData(symbol);
    if (alphaVantageData) return alphaVantageData;
    
    // If Alpha Vantage fails, try the public API 
    const publicData = await getStockDataPublic(symbol);
    if (publicData) return publicData;
    
    // If all APIs fail, use mock data
    console.warn(`Using mock data for ${symbol}`);
    return getMockStockData(symbol);
  } catch (error) {
    console.error('All stock data fetch methods failed:', error);
    return getMockStockData(symbol);
  }
}
