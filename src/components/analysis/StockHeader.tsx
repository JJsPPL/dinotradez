
import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, RefreshCw } from 'lucide-react';
import { fetchStockData, StockQuote } from '@/utils/stockDataService';
import { cn } from '@/lib/utils';

const StockHeader = () => {
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const symbol = 'AAPL'; // Default symbol

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const data = await fetchStockData(symbol);
      setStockData(data);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="font-medium mr-3 text-white flex items-center cursor-help">
            {stockData?.symbol || symbol}
            <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black/95 border border-gray-800 text-white">
          <div className="space-y-1">
            <p className="font-medium">{stockData?.name || `${symbol} Inc.`}</p>
            <p className="text-xs text-gray-300">NASDAQ-listed technology company</p>
            <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
              <span className="text-gray-400">Market Cap:</span>
              <span className="text-right">{stockData?.marketCap || "$2.87T"}</span>
              <span className="text-gray-400">52-Week Range:</span>
              <span className="text-right">
                ${stockData?.low52w?.toFixed(2) || "164.11"} - ${stockData?.high52w?.toFixed(2) || "199.62"}
              </span>
              <span className="text-gray-400">Volume:</span>
              <span className="text-right">{stockData?.volume?.toLocaleString() || "45.7M"}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      <div className="text-gray-400">{stockData?.name || "Apple Inc."}</div>
      <div className={cn(
        "ml-4 text-sm font-medium flex items-center",
        (stockData?.change || 0) >= 0 ? "text-green-400" : "text-red-400"
      )}>
        ${stockData?.price.toFixed(2) || "173.57"} {(stockData?.percentChange || 0) >= 0 ? "+" : ""}
        {stockData?.percentChange.toFixed(2) || "1.37"}%
      </div>
      {loading ? (
        <RefreshCw className="ml-2 h-3 w-3 animate-spin text-gray-400" />
      ) : (
        <button 
          onClick={loadStockData} 
          className="ml-2 text-gray-400 hover:text-white"
          title="Refresh stock data"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default StockHeader;
