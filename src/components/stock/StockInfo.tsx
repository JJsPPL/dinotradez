
import React from 'react';
import { StockInfoProps, PriceRangeProps, StockStatProps } from './stockSearch.types';
import { Calendar, Clock, DollarSign, BarChart } from 'lucide-react';

const PriceRange = ({ title, icon, current, low, high }: PriceRangeProps) => {
  return (
    <div className="rounded-lg bg-secondary/50 p-4">
      <div className="flex items-center text-sm text-muted-foreground mb-1">
        {icon}
        <span>{title}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-xs text-muted-foreground">Low</div>
          <div className="font-semibold">${low.toFixed(2)}</div>
        </div>
        <div className="h-1 flex-grow mx-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ 
              width: `${((current - low) / (high - low)) * 100}%` 
            }}
          ></div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">High</div>
          <div className="font-semibold">${high.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

const StockStat = ({ title, icon, value, subValue }: StockStatProps) => {
  return (
    <div className="rounded-lg bg-secondary/50 p-4">
      <div className="flex items-center text-sm text-muted-foreground mb-1">
        {icon}
        <span>{title}</span>
      </div>
      <div className="font-semibold mt-1">{value}</div>
      {subValue && (
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span className="text-xs">{subValue}</span>
        </div>
      )}
    </div>
  );
};

const StockInfo = ({ stockData }: StockInfoProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        <PriceRange 
          title="52-Week Range"
          icon={<Calendar className="h-4 w-4 mr-1" />}
          current={stockData.price}
          low={stockData.low52w}
          high={stockData.high52w}
        />
        
        <PriceRange 
          title="Day Range"
          icon={<Clock className="h-4 w-4 mr-1" />}
          current={stockData.price}
          low={stockData.dayLow}
          high={stockData.dayHigh}
        />
        
        <StockStat 
          title="Market Cap"
          icon={<DollarSign className="h-4 w-4 mr-1" />}
          value={stockData.marketCap}
          subValue={`Market Cap/Equity Ratio: ${stockData.marketCapToEquityRatio.toFixed(1)}`}
        />
        
        <StockStat 
          title="Volume"
          icon={<BarChart className="h-4 w-4 mr-1" />}
          value={stockData.volume.toLocaleString()}
          subValue={`Dollar Volume: ${stockData.dollarVolume}`}
        />
      </div>
      
      <div className="px-6 pb-6">
        <div className="space-y-4">
          <h4 className="font-medium">Key Statistics</h4>
          <ul className="space-y-2">
            <li className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Previous Close</span>
              <span className="font-medium">${stockData.closePrice.toFixed(2)}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Shares Outstanding</span>
              <span className="font-medium">{stockData.sharesOutstanding}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Authorized Shares</span>
              <span className="font-medium">{stockData.authorizedShares}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Market Cap/Common Equity Ratio</span>
              <span className="font-medium">{stockData.marketCapToEquityRatio.toFixed(1)}</span>
            </li>
            <li className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Dollar Volume</span>
              <span className="font-medium">{stockData.dollarVolume}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockInfo;
