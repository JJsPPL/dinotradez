
import React from 'react';

const LottoWatchlist = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20" id="lottoplays">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Lotto Plays</h2>
          <p className="text-muted-foreground max-w-2xl">High risk, high potential reward stocks with {'>'}1M volume and significant negative moves</p>
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
                  <td className="p-3 font-medium">BBBY</td>
                  <td className="p-3">0.48</td>
                  <td className="p-3 text-red-400">-5.36</td>
                  <td className="p-3 text-red-400">-91.79%</td>
                  <td className="p-3 text-amber-400">4.23</td>
                  <td className="p-3 text-green-400">+0.45</td>
                  <td className="p-3 text-gray-300">119.0M</td>
                  <td className="p-3 text-gray-300">900.0M</td>
                  <td className="p-3 text-gray-300">57.12M</td>
                  <td className="p-3 text-gray-300">0.28</td>
                  <td className="p-3 text-gray-300">10.52M</td>
                  <td className="p-3 text-gray-300">8.74M</td>
                  <td className="p-3 text-gray-300">1.20</td>
                  <td className="p-3 text-gray-300">59.4%</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">SNDL</td>
                  <td className="p-3">0.63</td>
                  <td className="p-3 text-red-400">-11.37</td>
                  <td className="p-3 text-red-400">-94.78%</td>
                  <td className="p-3 text-amber-400">3.85</td>
                  <td className="p-3 text-red-400">-0.12</td>
                  <td className="p-3 text-gray-300">261.7M</td>
                  <td className="p-3 text-gray-300">2.0B</td>
                  <td className="p-3 text-gray-300">164.9M</td>
                  <td className="p-3 text-gray-300">0.54</td>
                  <td className="p-3 text-gray-300">9.8M</td>
                  <td className="p-3 text-gray-300">7.2M</td>
                  <td className="p-3 text-gray-300">1.36</td>
                  <td className="p-3 text-gray-300">47.2%</td>
                </tr>
                <tr className="hover:bg-gray-800/30">
                  <td className="p-3 font-medium">CVNA</td>
                  <td className="p-3">9.46</td>
                  <td className="p-3 text-red-400">-104.52</td>
                  <td className="p-3 text-red-400">-91.70%</td>
                  <td className="p-3 text-amber-400">5.17</td>
                  <td className="p-3 text-green-400">+0.89</td>
                  <td className="p-3 text-gray-300">105.4M</td>
                  <td className="p-3 text-gray-300">500.0M</td>
                  <td className="p-3 text-gray-300">997.9M</td>
                  <td className="p-3 text-gray-300">0.87</td>
                  <td className="p-3 text-gray-300">6.2M</td>
                  <td className="p-3 text-gray-300">5.9M</td>
                  <td className="p-3 text-gray-300">1.05</td>
                  <td className="p-3 text-gray-300">52.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LottoWatchlist;
