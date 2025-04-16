
import React from 'react';
import { TrendingDown } from 'lucide-react';

const Bearish = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-red-950/20" id="bearish">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center mb-8">
          <TrendingDown className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <h2 className="text-3xl font-bold">Bearish</h2>
            <p className="text-muted-foreground">Stocks with high volume and negative momentum</p>
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
                  <td className="p-3 font-medium">INTC</td>
                  <td className="p-3">35.67</td>
                  <td className="p-3 text-red-400">-1.75</td>
                  <td className="p-3 text-red-400">-4.68%</td>
                  <td className="p-3 text-gray-300">1.97</td>
                  <td className="p-3 text-green-400">+0.24</td>
                  <td className="p-3 text-gray-300">4.21B</td>
                  <td className="p-3 text-gray-300">10.0B</td>
                  <td className="p-3 text-gray-300">150.17B</td>
                  <td className="p-3 text-gray-300">3.24</td>
                  <td className="p-3 text-gray-300">52.63M</td>
                  <td className="p-3 text-gray-300">43.82M</td>
                  <td className="p-3 text-gray-300">1.20</td>
                  <td className="p-3 text-gray-300">44.3%</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">RIVN</td>
                  <td className="p-3">10.27</td>
                  <td className="p-3 text-red-400">-0.83</td>
                  <td className="p-3 text-red-400">-7.48%</td>
                  <td className="p-3 text-gray-300">2.43</td>
                  <td className="p-3 text-green-400">+0.31</td>
                  <td className="p-3 text-gray-300">948.3M</td>
                  <td className="p-3 text-gray-300">4.5B</td>
                  <td className="p-3 text-gray-300">9.74B</td>
                  <td className="p-3 text-gray-300">1.36</td>
                  <td className="p-3 text-gray-300">35.28M</td>
                  <td className="p-3 text-gray-300">32.56M</td>
                  <td className="p-3 text-gray-300">1.08</td>
                  <td className="p-3 text-gray-300">52.6%</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">HOOD</td>
                  <td className="p-3">16.82</td>
                  <td className="p-3 text-red-400">-1.24</td>
                  <td className="p-3 text-red-400">-6.87%</td>
                  <td className="p-3 text-gray-300">1.85</td>
                  <td className="p-3 text-green-400">+0.18</td>
                  <td className="p-3 text-gray-300">729.5M</td>
                  <td className="p-3 text-gray-300">2.5B</td>
                  <td className="p-3 text-gray-300">12.27B</td>
                  <td className="p-3 text-gray-300">2.14</td>
                  <td className="p-3 text-gray-300">18.24M</td>
                  <td className="p-3 text-gray-300">12.38M</td>
                  <td className="p-3 text-gray-300">1.47</td>
                  <td className="p-3 text-gray-300">47.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bearish;
