
import React from 'react';
import { StockCardProps } from './stockSearch.types';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import StockInfo from './StockInfo';
import StockCharts from './StockCharts';

const StockCard = ({ stockData }: StockCardProps) => {
  return (
    <div className="animate-scale-in">
      <div className="bg-white dark:bg-black/70 rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{stockData.symbol}</h3>
              <span className="text-muted-foreground">{stockData.name}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xl font-semibold mr-4">${stockData.price.toFixed(2)}</span>
              <span className={cn(
                "flex items-center text-sm font-medium",
                stockData.change >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {stockData.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stockData.change >= 0 ? "+" : ""}{stockData.change.toFixed(2)} ({stockData.change >= 0 ? "+" : ""}{stockData.percentChange.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
              Add to Watchlist
            </button>
          </div>
        </div>
        
        <StockInfo stockData={stockData} />
        
        <StockCharts stockData={stockData} />
      </div>
    </div>
  );
};

export default StockCard;
