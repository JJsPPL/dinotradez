
import React from 'react';
import { TrendingUp } from 'lucide-react';

const Bullish = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-green-950/20" id="bullish">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center mb-8">
          <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <h2 className="text-3xl font-bold">Bullish</h2>
            <p className="text-muted-foreground">Stocks with high volume and positive momentum</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-800 bg-black/60 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Symbol</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Last</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Net Chng</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">% Change</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Short Ratio</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">SR Change</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Shares</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Auth</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Market Cap</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">MC/CE</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Volume</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Avg Vol</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">Rel Vol</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-400">DP %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">AAPL</td>
                  <td className="p-3">175.42</td>
                  <td className="p-3 text-green-400">+2.77</td>
                  <td className="p-3 text-green-400">+1.58%</td>
                  <td className="p-3 text-gray-300">1.42</td>
                  <td className="p-3 text-red-400">-0.08</td>
                  <td className="p-3 text-gray-300">15.7B</td>
                  <td className="p-3 text-gray-300">50.0B</td>
                  <td className="p-3 text-gray-300">2.74T</td>
                  <td className="p-3 text-gray-300">28.65</td>
                  <td className="p-3 text-gray-300">55.92M</td>
                  <td className="p-3 text-gray-300">61.54M</td>
                  <td className="p-3 text-gray-300">0.91</td>
                  <td className="p-3 text-gray-300">42.8%</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">MSFT</td>
                  <td className="p-3">310.87</td>
                  <td className="p-3 text-green-400">+2.65</td>
                  <td className="p-3 text-green-400">+0.85%</td>
                  <td className="p-3 text-gray-300">0.96</td>
                  <td className="p-3 text-red-400">-0.03</td>
                  <td className="p-3 text-gray-300">7.43B</td>
                  <td className="p-3 text-gray-300">24.0B</td>
                  <td className="p-3 text-gray-300">2.31T</td>
                  <td className="p-3 text-gray-300">12.43</td>
                  <td className="p-3 text-gray-300">23.79M</td>
                  <td className="p-3 text-gray-300">26.18M</td>
                  <td className="p-3 text-gray-300">0.91</td>
                  <td className="p-3 text-gray-300">38.5%</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">NVDA</td>
                  <td className="p-3">681.22</td>
                  <td className="p-3 text-green-400">+10.72</td>
                  <td className="p-3 text-green-400">+1.57%</td>
                  <td className="p-3 text-gray-300">1.84</td>
                  <td className="p-3 text-green-400">+0.12</td>
                  <td className="p-3 text-gray-300">2.47B</td>
                  <td className="p-3 text-gray-300">4.0B</td>
                  <td className="p-3 text-gray-300">1.68T</td>
                  <td className="p-3 text-gray-300">51.24</td>
                  <td className="p-3 text-gray-300">43.52M</td>
                  <td className="p-3 text-gray-300">47.89M</td>
                  <td className="p-3 text-gray-300">0.91</td>
                  <td className="p-3 text-gray-300">46.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bullish;
