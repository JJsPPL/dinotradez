
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default stock data to display
const stockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 175.42,
  change: 1.37,
  percentChange: 0.78,
  marketCap: "$2.87T",
  high52w: 199.62,
  low52w: 164.11,
  volume: 45700000
};

const StockHeader = () => {
  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="font-medium mr-3 text-white flex items-center cursor-help">
            {stockData.symbol}
            <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black/95 border border-gray-800 text-white">
          <div className="space-y-1">
            <p className="font-medium">{stockData.name}</p>
            <p className="text-xs text-gray-300">NASDAQ-listed technology company</p>
            <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
              <span className="text-gray-400">Market Cap:</span>
              <span className="text-right">{stockData.marketCap}</span>
              <span className="text-gray-400">52-Week Range:</span>
              <span className="text-right">
                ${stockData.low52w?.toFixed(2)} - ${stockData.high52w?.toFixed(2)}
              </span>
              <span className="text-gray-400">Volume:</span>
              <span className="text-right">{stockData.volume?.toLocaleString()}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      <div className="text-gray-400">{stockData.name}</div>
      <div className={cn(
        "ml-4 text-sm font-medium flex items-center",
        (stockData.change || 0) >= 0 ? "text-green-400" : "text-red-400"
      )}>
        ${stockData.price?.toFixed(2)} {(stockData.percentChange || 0) >= 0 ? "+" : ""}
        {stockData.percentChange?.toFixed(2)}%
      </div>
    </div>
  );
};

export default StockHeader;
