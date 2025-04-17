
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '@/utils/stockDataService';
import { ArrowUp, ArrowDown, Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  type?: 'stock' | 'crypto' | 'commodity' | 'bond';
}

// Mock data to use as fallback when API calls fail
const mockTickerData: TickerItem[] = [
  { symbol: 'AAPL', price: 175.42, change: 1.37, percentChange: 0.79, type: 'stock' },
  { symbol: 'MSFT', price: 310.87, change: 2.65, percentChange: 0.86, type: 'stock' },
  { symbol: 'GOOGL', price: 142.76, change: 2.21, percentChange: 1.57, type: 'stock' },
  { symbol: 'AMZN', price: 129.83, change: 1.36, percentChange: 1.06, type: 'stock' },
  { symbol: 'NVDA', price: 681.22, change: 10.72, percentChange: 1.60, type: 'stock' },
  { symbol: 'META', price: 324.62, change: 4.52, percentChange: 1.41, type: 'stock' },
  { symbol: 'TSLA', price: 273.58, change: -7.41, percentChange: -2.64, type: 'stock' },
  { symbol: 'BTC', price: 42871.35, change: 426.18, percentChange: 1.00, type: 'crypto' },
  { symbol: 'GLD', price: 183.27, change: -0.43, percentChange: -0.23, type: 'commodity' },
  { symbol: 'TNX', price: 4.328, change: 0.036, percentChange: 0.84, type: 'bond' }
];

const StockTicker = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>(mockTickerData);
  const [loading, setLoading] = useState(false);
  
  const popularSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM', 'V', 'WMT',
    'BTC', 'GLD', 'TNX' // Bitcoin, Gold, 10-year Treasury
  ];
  
  useEffect(() => {
    // Start with mock data immediately
    setTickerData(mockTickerData);
    
    const loadTickerData = async () => {
      setLoading(true);
      try {
        console.log('Fetching stock data...');
        const promises = popularSymbols.map(symbol => fetchStockData(symbol));
        const results = await Promise.allSettled(promises);
        
        const successfulResults = results
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(data => data && data.symbol);
        
        const enhancedResults = successfulResults.map(item => {
          let type: 'stock' | 'crypto' | 'commodity' | 'bond' = 'stock';
          
          if (item.symbol === 'BTC') {
            type = 'crypto';
          } else if (item.symbol === 'GLD') {
            type = 'commodity';
          } else if (item.symbol === 'TNX') {
            type = 'bond';
          }
          
          return { ...item, type };
        });
        
        if (enhancedResults.length > 0) {
          console.log('Successfully loaded ticker data:', enhancedResults);
          setTickerData(enhancedResults as TickerItem[]);
        } else {
          console.warn('No successful API results, keeping mock data');
          // Mock data already set initially
        }
      } catch (error) {
        console.error('Failed to load ticker data:', error);
        // Mock data already set initially
      } finally {
        setLoading(false);
      }
    };
    
    // Try to load real data after component mounts
    loadTickerData();
    
    const interval = setInterval(() => {
      loadTickerData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-black/50 py-1 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker">
          {tickerData.map((item) => (
            <div key={item.symbol} className="ticker-item">
              {item.type === 'crypto' && <Bitcoin className="h-3 w-3 inline mr-1 text-orange-400" />}
              {item.type === 'commodity' && <TrendingDown className="h-3 w-3 inline mr-1 text-yellow-400" />}
              {item.type === 'bond' && <TrendingUp className="h-3 w-3 inline mr-1 text-blue-400" />}
              <span className="font-medium mr-2">{item.symbol}</span>
              <span>${item.price.toFixed(2)}</span>
              <span className={item.change >= 0 ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {item.change >= 0 ? (
                  <ArrowUp className="h-3 w-3 inline mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 inline mr-1" />
                )}
                {Math.abs(item.percentChange).toFixed(2)}%
              </span>
            </div>
          ))}
          
          {/* Repeat for continuous scrolling */}
          {tickerData.map((item) => (
            <div key={`repeat-${item.symbol}`} className="ticker-item">
              {item.type === 'crypto' && <Bitcoin className="h-3 w-3 inline mr-1 text-orange-400" />}
              {item.type === 'commodity' && <TrendingDown className="h-3 w-3 inline mr-1 text-yellow-400" />}
              {item.type === 'bond' && <TrendingUp className="h-3 w-3 inline mr-1 text-blue-400" />}
              <span className="font-medium mr-2">{item.symbol}</span>
              <span>${item.price.toFixed(2)}</span>
              <span className={item.change >= 0 ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {item.change >= 0 ? (
                  <ArrowUp className="h-3 w-3 inline mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 inline mr-1" />
                )}
                {Math.abs(item.percentChange).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;
