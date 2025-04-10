
import React from 'react';
import { StockChartsProps } from './stockSearch.types';
import { CandlestickChart, BarChart, PieChart, LineChart } from 'lucide-react';

const StockCharts = ({ stockData }: StockChartsProps) => {
  return (
    <div>
      <div className="px-6 pb-6">
        <div className="bg-secondary/30 rounded-lg p-4 h-64 flex items-center justify-center">
          <div className="text-center">
            <CandlestickChart className="h-10 w-10 mx-auto text-primary/50 mb-3" />
            <p className="text-muted-foreground">Interactive price chart will appear here</p>
            <div className="flex justify-center gap-2 mt-3">
              <button className="px-3 py-1 text-xs rounded bg-primary/10 text-primary">1D</button>
              <button className="px-3 py-1 text-xs rounded bg-secondary">1W</button>
              <button className="px-3 py-1 text-xs rounded bg-secondary">1M</button>
              <button className="px-3 py-1 text-xs rounded bg-secondary">3M</button>
              <button className="px-3 py-1 text-xs rounded bg-secondary">1Y</button>
              <button className="px-3 py-1 text-xs rounded bg-secondary">5Y</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
        <div className="bg-white dark:bg-black/70 rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 text-primary mr-2" />
            <h4 className="font-medium">Technical Analysis</h4>
          </div>
          <div className="h-40 flex items-center justify-center bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Technical indicators chart</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-black/70 rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-primary mr-2" />
            <h4 className="font-medium">Fundamental Analysis</h4>
          </div>
          <div className="h-40 flex items-center justify-center bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Financial ratios visualization</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-black/70 rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <LineChart className="h-5 w-5 text-primary mr-2" />
            <h4 className="font-medium">Performance</h4>
          </div>
          <div className="h-40 flex items-center justify-center bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Performance metrics chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCharts;
