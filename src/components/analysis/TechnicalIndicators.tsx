
import React, { useState, useEffect } from 'react';
import { fetchStockData } from '@/utils/stockDataService';

interface TechnicalIndicatorsProps {
  symbol?: string;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ symbol = 'AAPL' }) => {
  const [indicators, setIndicators] = useState({
    rsi: { value: 58.4, recommendation: 'Neutral' },
    macd: { value: 1.25, recommendation: 'Buy' },
    stochastic: { value: 76.3, recommendation: 'Sell' },
    adx: { value: 24.7, recommendation: 'Neutral' },
    cci: { value: 102.5, recommendation: 'Buy' },
    bb: { value: 'Middle', recommendation: 'Neutral' },
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchIndicatorData();
  }, [symbol]);
  
  const fetchIndicatorData = async () => {
    setLoading(true);
    try {
      const stockData = await fetchStockData(symbol);
      if (stockData) {
        // In a real application, you would calculate these indicators from price data
        // or fetch from a financial indicators API
        // For this demo, we'll simulate data
        
        // Generate a seed based on stock price to get consistent but different values
        const seed = stockData.price * 100;
        const pseudoRandom = (min: number, max: number) => {
          return min + ((seed % 100) / 100) * (max - min);
        };
        
        setIndicators({
          rsi: {
            value: parseFloat(pseudoRandom(30, 70).toFixed(1)),
            recommendation: pseudoRandom(0, 1) > 0.5 ? 'Buy' : 'Neutral'
          },
          macd: {
            value: parseFloat(pseudoRandom(-2, 2).toFixed(2)),
            recommendation: pseudoRandom(0, 1) > 0.6 ? 'Buy' : 'Neutral'
          },
          stochastic: {
            value: parseFloat(pseudoRandom(20, 80).toFixed(1)),
            recommendation: pseudoRandom(0, 1) > 0.7 ? 'Sell' : 'Neutral'
          },
          adx: {
            value: parseFloat(pseudoRandom(15, 35).toFixed(1)),
            recommendation: 'Neutral'
          },
          cci: {
            value: parseFloat(pseudoRandom(-150, 150).toFixed(1)),
            recommendation: pseudoRandom(0, 1) > 0.5 ? 'Buy' : 'Neutral'
          },
          bb: {
            value: pseudoRandom(0, 1) > 0.5 ? 'Upper' : 'Middle',
            recommendation: pseudoRandom(0, 1) > 0.5 ? 'Sell' : 'Neutral'
          },
        });
      }
    } catch (error) {
      console.error("Error fetching technical indicators:", error);
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
        <h3 className="font-medium text-white">Technical Indicators</h3>
        {loading && <div className="loader-spin w-4 h-4"></div>}
      </div>
      <div className="p-6 bg-black/60">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">RSI (14)</span>
            <span className={getRecommendationClass(indicators.rsi.recommendation)}>
              {indicators.rsi.value} ({indicators.rsi.recommendation})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">MACD (12,26,9)</span>
            <span className={getRecommendationClass(indicators.macd.recommendation)}>
              {indicators.macd.value} ({indicators.macd.recommendation})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">Stochastic (14,3,3)</span>
            <span className={getRecommendationClass(indicators.stochastic.recommendation)}>
              {indicators.stochastic.value} ({indicators.stochastic.recommendation})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">ADX (14)</span>
            <span className={getRecommendationClass(indicators.adx.recommendation)}>
              {indicators.adx.value} ({indicators.adx.recommendation})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">CCI (20)</span>
            <span className={getRecommendationClass(indicators.cci.recommendation)}>
              {indicators.cci.value} ({indicators.cci.recommendation})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-300">Bollinger Bands (20)</span>
            <span className={getRecommendationClass(indicators.bb.recommendation)}>
              {indicators.bb.value} ({indicators.bb.recommendation})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;
