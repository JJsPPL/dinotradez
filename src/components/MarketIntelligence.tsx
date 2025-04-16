
import React from 'react';
import { ExternalLink, AlertTriangle, CircleDollarSign, TrendingDown } from 'lucide-react';

const MarketIntelligence = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  
  return (
    <section className="market-intelligence py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Market Intelligence</h2>
          <p className="text-muted-foreground max-w-2xl">Stay informed with critical market data and insights</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SEC Edgar S-3 Filings */}
          <div className="rounded-xl border border-gray-800 bg-black/60 shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center">
                <CircleDollarSign className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold">Latest S-3 Offerings</h3>
              </div>
              <span className="text-xs text-gray-400">Source: SEC Edgar</span>
            </div>
            
            <div className="divide-y divide-gray-800">
              {[
                { company: 'Palantir Technologies Inc (PLTR)', type: 'S-3ASR', date: '2025-04-15' },
                { company: 'Lucid Group, Inc. (LCID)', type: 'S-3ASR', date: '2025-04-14' },
                { company: 'SoFi Technologies, Inc. (SOFI)', type: 'S-3', date: '2025-04-13' },
                { company: 'Rivian Automotive, Inc. (RIVN)', type: 'S-3', date: '2025-04-12' },
                { company: 'Beyond Meat, Inc. (BYND)', type: 'S-3', date: '2025-04-11' }
              ].map((filing, index) => (
                <div key={index} className="p-3 hover:bg-gray-800/30 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{filing.company}</div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">{filing.type}</span>
                      <span className="text-xs text-gray-500">{filing.date}</span>
                      <a href="#" className="text-primary hover:text-primary/80">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <a 
                href="https://www.sec.gov/edgar/searchedgar/companysearch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:text-primary/80 text-sm"
              >
                View All S-3 Filings <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </div>
          </div>
          
          {/* High Short Interest */}
          <div className="rounded-xl border border-gray-800 bg-black/60 shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold">High Short Interest</h3>
              </div>
              <span className="text-xs text-gray-400">Source: FINRA (>1M Volume)</span>
            </div>
            
            <div className="p-3 border-b border-gray-800">
              <div className="flex items-center">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded border-gray-700 text-primary focus:ring-primary" />
                  <span>Show Lotto Picks (-90% to -99% change)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm ml-4">
                  <input type="checkbox" defaultChecked className="rounded border-gray-700 text-primary focus:ring-primary" />
                  <span>High Volume Only</span>
                </label>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Symbol</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Short %</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">10d Chg</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { symbol: 'BBBY', shortPercent: 32.14, tenDayChange: -2.12, volume: '10.5M', isLotto: true },
                    { symbol: 'CVNA', shortPercent: 19.76, tenDayChange: 0.94, volume: '6.2M', isLotto: true },
                    { symbol: 'SNDL', shortPercent: 17.24, tenDayChange: 0.51, volume: '9.8M', isLotto: true },
                    { symbol: 'GME', shortPercent: 21.43, tenDayChange: 0.50, volume: '7.1M', isLotto: false },
                    { symbol: 'AMC', shortPercent: 19.32, tenDayChange: 1.19, volume: '15.5M', isLotto: false }
                  ].map((item, index) => (
                    <tr key={index} className={`hover:bg-gray-800/30 ${item.isLotto ? 'bg-amber-900/10' : ''}`}>
                      <td className="p-3 font-medium">
                        {item.symbol}
                        {item.isLotto && <span className="ml-2 inline-block px-1.5 py-0.5 text-xs bg-amber-900/30 text-amber-400 rounded">Lotto</span>}
                      </td>
                      <td className="p-3">
                        <span className={item.shortPercent > 20 ? 'text-orange-400' : 'text-yellow-400'}>
                          {item.shortPercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={item.tenDayChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {item.tenDayChange >= 0 ? '+' : ''}{item.tenDayChange.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-3 text-gray-300">{item.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <a 
                href="https://otce.finra.org/otce/equityShortInterest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-primary hover:text-primary/80 text-sm"
              >
                View All Short Interest Data <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </div>
          </div>
          
          {/* Dark Pool Data */}
          <div className="rounded-xl border border-gray-800 bg-black/60 shadow-md overflow-hidden lg:col-span-2">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold">Dark Pool Activity</h3>
              </div>
              <span className="text-xs text-gray-400">Updated: {currentDate}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Symbol</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">DP %</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">DP Volume</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Block Trades</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Price</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-400">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { symbol: 'TSLA', darkPoolPercent: 49.2, darkPoolVolume: '59.84M', blockTrades: 134, price: 275.11, change: 1.53 },
                    { symbol: 'AAPL', darkPoolPercent: 43.5, darkPoolVolume: '26.37M', blockTrades: 96, price: 176.18, change: 0.76 },
                    { symbol: 'AMZN', darkPoolPercent: 46.7, darkPoolVolume: '22.94M', blockTrades: 102, price: 131.63, change: 1.80 },
                    { symbol: 'NVDA', darkPoolPercent: 47.8, darkPoolVolume: '21.65M', blockTrades: 89, price: 692.84, change: 11.62 },
                    { symbol: 'GME', darkPoolPercent: 56.4, darkPoolVolume: '4.12M', blockTrades: 31, price: 16.37, change: -0.24 },
                    { symbol: 'AMC', darkPoolPercent: 54.2, darkPoolVolume: '11.57M', blockTrades: 48, price: 4.83, change: -0.17 }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-800/30">
                      <td className="p-3 font-medium">{item.symbol}</td>
                      <td className="p-3">
                        <span className={item.darkPoolPercent > 50 ? 'text-red-400' : 'text-blue-400'}>
                          {item.darkPoolPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-gray-300">{item.darkPoolVolume}</td>
                      <td className="p-3 text-gray-300">{item.blockTrades}</td>
                      <td className="p-3 font-medium">${item.price.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-800 flex justify-between items-center">
              <a 
                href="#" 
                className="flex items-center text-primary hover:text-primary/80 text-sm"
              >
                View All Dark Pool Data <ExternalLink className="h-3 w-3 ml-2" />
              </a>
              <span className="text-xs text-gray-400">Data delayed by 15 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelligence;
