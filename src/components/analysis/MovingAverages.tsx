
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '@/utils/stockDataService';
import { cn } from '@/lib/utils';

interface MovingAveragesProps {
  symbol?: string;
}

interface MAData {
  period: number;
  value: number;
  type: string;
  recommendation: string;
}

const MovingAverages: React.FC<MovingAveragesProps> = ({ symbol = 'AAPL' }) => {
  const [maData, setMaData] = useState<MAData[]>([
    { period: 5, value: 172.85, type: 'MA', recommendation: 'Buy' },
    { period: 10, value: 170.93, type: 'MA', recommendation: 'Buy' },
    { period: 20, value: 168.75, type: 'MA', recommendation: 'Buy' },
    { period: 50, value: 168.12, type: 'MA', recommendation: 'Buy' },
    { period: 100, value: 170.45, type: 'MA', recommendation: 'Buy' },
    { period: 200, value: 175.36, type: 'MA', recommendation: 'Neutral' },
    { period: 5, value: 173.12, type: 'EMA', recommendation: 'Buy' },
    { period: 10, value: 171.54, type: 'EMA', recommendation: 'Buy' }
  ]);
  const [loading, setLoading] = useState(false);
  const [stockPrice, setStockPrice] = useState(0);

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stockData = await fetchStockData(symbol);
      if (stockData) {
        setStockPrice(stockData.price);
        
        // In a real application, you would fetch actual MA data from an API
        // For this demo, we'll simulate it based on the current price
        const newMaData = maData.map(ma => {
          // Create slightly different MA values based on period and current price
          const variance = (ma.period < 50) ? 
            (stockData.price * (1 + (Math.random() * 0.05) - 0.025)) : 
            (stockData.price * (1 + (Math.random() * 0.1) - 0.05));
          
          // Determine recommendation based on price relative to MA
          let recommendation = 'Neutral';
          if (variance < stockData.price * 0.98) recommendation = 'Buy';
          else if (variance > stockData.price * 1.02) recommendation = 'Sell';
          
          return {
            ...ma,
            value: parseFloat(variance.toFixed(2)),
            recommendation
          };
        });
        
        setMaData(newMaData);
      }
    } catch (error) {
      console.error("Error fetching moving averages data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationClass = (recommendation: string) => {
    switch(recommendation) {
      case 'Buy': return 'text-green-400';
      case 'Sell': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="glass rounded-xl shadow-md overflow-hidden border border-gray-800">
      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-black/80">
        <h3 className="font-medium text-white">Moving Averages</h3>
        {loading && <div className="loader-spin w-4 h-4"></div>}
      </div>
      <div className="p-6 bg-black/60">
        <div className="space-y-4">
          {maData.map((ma) => (
            <div key={`${ma.type}-${ma.period}`} className="flex justify-between">
              <span className="text-sm text-gray-300">{ma.type} ({ma.period})</span>
              <span className={cn("text-sm", getRecommendationClass(ma.recommendation))}>
                {ma.value.toFixed(2)} ({ma.recommendation})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovingAverages;
