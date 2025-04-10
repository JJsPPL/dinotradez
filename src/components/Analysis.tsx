
import React, { useState } from 'react';
import ChartControls, { indicators } from './analysis/ChartControls';
import ChartToolbar from './analysis/ChartToolbar';
import ChartRenderer from './analysis/ChartRenderer';
import AnalysisSummary from './analysis/AnalysisSummary';
import TechnicalIndicators from './analysis/TechnicalIndicators';
import MovingAverages from './analysis/MovingAverages';
import DarkpoolData from './analysis/DarkpoolData';
import StockHeader from './analysis/StockHeader';

const Analysis = () => {
  const [activeChart, setActiveChart] = useState<string>('candlestick');
  const [activeTimeframe, setActiveTimeframe] = useState<string>('1m');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['Volume', 'MA (50)', 'Dark Pool']);
  const [isIndicatorMenuOpen, setIsIndicatorMenuOpen] = useState(false);
  const [showDarkpoolData, setShowDarkpoolData] = useState(true);
  const [showBlockTrades, setShowBlockTrades] = useState(true);
  const [symbol, setSymbol] = useState('AAPL');
  
  const toggleIndicator = (indicator: string) => {
    if (activeIndicators.includes(indicator)) {
      setActiveIndicators(activeIndicators.filter(i => i !== indicator));
      
      // Toggle related data displays
      if (indicator === 'Dark Pool') setShowDarkpoolData(false);
      if (indicator === 'Block Trades') setShowBlockTrades(false);
    } else {
      setActiveIndicators([...activeIndicators, indicator]);
      
      // Toggle related data displays
      if (indicator === 'Dark Pool') setShowDarkpoolData(true);
      if (indicator === 'Block Trades') setShowBlockTrades(true);
    }
  };

  return (
    <section id="analysis" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3 text-white">Technical Analysis</h2>
          <p className="text-gray-300 max-w-2xl">Advanced charting tools and technical indicators to analyze stock performance and identify trends.</p>
        </div>
        
        <div className="glass rounded-xl shadow-md overflow-hidden border border-gray-800">
          <div className="p-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4 bg-black/80">
            <StockHeader />
            
            <ChartControls 
              activeChart={activeChart}
              setActiveChart={setActiveChart}
              activeTimeframe={activeTimeframe}
              setActiveTimeframe={setActiveTimeframe}
              isIndicatorMenuOpen={isIndicatorMenuOpen}
              setIsIndicatorMenuOpen={setIsIndicatorMenuOpen}
              activeIndicators={activeIndicators}
              toggleIndicator={toggleIndicator}
            />
          </div>
          
          <ChartToolbar />
          <ChartRenderer activeChart={activeChart} symbol={symbol} />
          <AnalysisSummary />
        </div>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TechnicalIndicators symbol={symbol} />
          <MovingAverages symbol={symbol} />
          <DarkpoolData 
            showDarkpoolData={showDarkpoolData}
            showBlockTrades={showBlockTrades}
          />
        </div>
      </div>
    </section>
  );
};

export default Analysis;
