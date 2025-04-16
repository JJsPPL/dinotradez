
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '@/utils/stockDataService';
import { ArrowUp, ArrowDown, Bitcoin, TrendingUp, Gold } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  type?: 'stock' | 'crypto' | 'commodity' | 'bond';
}

const StockTicker = () => {
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const popularSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM', 'V', 'WMT',
    'BTC', 'GLD', 'TNX' // Bitcoin, Gold, 10-year Treasury
  ];
  
  useEffect(() => {
    const loadTickerData = async () => {
      setLoading(true);
      try {
        const promises = popularSymbols.map(symbol => fetchStockData(symbol));
        const results = await Promise.allSettled(promises);
        
        const successfulResults = results
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(data => data && data.symbol);
        
        // Add type information for special assets
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
        
        setTickerData(enhancedResults as TickerItem[]);
      } catch (error) {
        console.error('Failed to load ticker data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTickerData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadTickerData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading && tickerData.length === 0) {
    return (
      <div className="bg-black/50 py-1 text-center text-sm text-gray-400">
        Loading market data...
      </div>
    );
  }
  
  return (
    <div className="bg-black/50 py-1 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker">
          {tickerData.map((item) => (
            <div key={item.symbol} className="ticker-item">
              {item.type === 'crypto' && <Bitcoin className="h-3 w-3 inline mr-1 text-orange-400" />}
              {item.type === 'commodity' && <Gold className="h-3 w-3 inline mr-1 text-yellow-400" />}
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
          
          {/* Repeat the ticker items for a seamless loop */}
          {tickerData.map((item) => (
            <div key={`repeat-${item.symbol}`} className="ticker-item">
              {item.type === 'crypto' && <Bitcoin className="h-3 w-3 inline mr-1 text-orange-400" />}
              {item.type === 'commodity' && <Gold className="h-3 w-3 inline mr-1 text-yellow-400" />}
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
