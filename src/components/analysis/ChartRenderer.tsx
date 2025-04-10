
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { fetchStockData } from '@/utils/stockDataService';
import axios from 'axios';

interface ChartData {
  date: string;
  value: number;
  volume: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

// Sample chart data as fallback
const sampleChartData = [
  { date: '2023-01-01', value: 171.22, volume: 45000000 },
  { date: '2023-01-02', value: 172.45, volume: 48000000 },
  { date: '2023-01-03', value: 173.86, volume: 51000000 },
  { date: '2023-01-04', value: 174.30, volume: 55000000 },
  { date: '2023-01-05', value: 172.91, volume: 62000000 },
  { date: '2023-01-06', value: 173.45, volume: 58000000 },
  { date: '2023-01-07', value: 173.94, volume: 54000000 },
  { date: '2023-01-08', value: 173.57, volume: 51000000 },
];

interface ChartRendererProps {
  activeChart: string;
  symbol?: string;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ activeChart, symbol = 'AAPL' }) => {
  const [chartData, setChartData] = useState<ChartData[]>(sampleChartData);
  const [stockStats, setStockStats] = useState({
    open: 171.22,
    high: 174.30,
    low: 171.96,
    close: 173.57,
    volume: '74.58M'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [symbol]);
  
  const fetchChartData = async () => {
    setLoading(true);
    try {
      // First fetch the basic stock data
      const basicData = await fetchStockData(symbol);
      
      // Then try to get historical data for the chart
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
      const result = response.data.chart.result[0];
      
      if (result) {
        const timestamps = result.timestamp;
        const quote = result.indicators.quote[0];
        
        // Create chart data array from API response
        const newChartData = timestamps.map((time: number, i: number) => {
          const date = new Date(time * 1000).toISOString().split('T')[0];
          return {
            date,
            value: quote.close?.[i] || 0,
            volume: quote.volume?.[i] || 0,
            open: quote.open?.[i] || 0,
            high: quote.high?.[i] || 0,
            low: quote.low?.[i] || 0,
            close: quote.close?.[i] || 0
          };
        });
        
        setChartData(newChartData);
        
        // Update stock stats
        if (basicData) {
          setStockStats({
            open: basicData.price - basicData.change,
            high: basicData.dayHigh || basicData.price * 1.01,
            low: basicData.dayLow || basicData.price * 0.99,
            close: basicData.price,
            volume: basicData.volume ? 
              `${(basicData.volume / 1000000).toFixed(2)}M` : 
              '74.58M'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Fall back to sample data
    } finally {
      setLoading(false);
    }
  };

  // Function to render the appropriate chart based on active chart type
  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Line type="monotone" dataKey="close" name="Price" stroke="#8884d8" activeDot={{ r: 8 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="volume" name="Volume" fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Area type="monotone" dataKey="close" name="Price" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'candlestick':
      default:
        // For candlestick, we simulate with a combination chart
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                formatter={(value: any, name: any) => [
                  `$${parseFloat(value).toFixed(2)}`, 
                  name === 'O' ? 'Open' : name === 'H' ? 'High' : name === 'L' ? 'Low' : 'Close'
                ]}
              />
              <Legend />
              <Bar dataKey="low" name="L" stackId="a" fill="#ef4444" />
              <Bar dataKey="high" name="H" stackId="a" fill="#22c55e" />
              <Line type="monotone" dataKey="close" name="C" stroke="#8884d8" dot={false} />
              <Line type="monotone" dataKey="open" name="O" stroke="#fca5a5" dot={false} />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="relative bg-black/70">
      <div className="flex justify-between p-4 absolute top-0 left-0 right-0 z-10 text-sm">
        <div>
          <div className="text-xs text-gray-400">Open</div>
          <div className="text-white">${stockStats.open.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">High</div>
          <div className="text-white">${stockStats.high.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Low</div>
          <div className="text-white">${stockStats.low.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Close</div>
          <div className="text-white">${stockStats.close.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Volume</div>
          <div className="text-white">{stockStats.volume}</div>
        </div>
      </div>
      
      <div className="h-96 flex items-center justify-center p-6 pt-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <div className="loader-spin"></div>
            <p className="mt-2">Loading chart data...</p>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};

export default ChartRenderer;
