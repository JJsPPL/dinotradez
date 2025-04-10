
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, Plus, Filter, RefreshCw, ArrowUpDown, X, Eye, Mail, AlertCircle, FileText, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { LottoStockData } from './stock/stockSearch.types';

enum DataSource {
  MANUAL = 'manual',
  EMAIL = 'email',
  CUSTOM = 'custom'
}

const mockLottoWatchlist: LottoStockData[] = [
  { 
    symbol: 'PWDY', 
    companyName: 'PowerDay Enterprises', 
    lastPrice: 0.87, 
    change: 0.05, 
    percentChange: 6.32, 
    volume: 14582651, 
    marketCap: '42.7M', 
    sector: 'Technology', 
    marketCapRatio: 7.8, 
    newsflags: 12.0, 
    sVol: 68.5, 
    relativeVolumeStDev: 7.67, 
    shares: 49082386, 
    catScale: 1.902, 
    putScale: 0.32 
  },
  { 
    symbol: 'CBIH', 
    companyName: 'CrownBridge Innovations', 
    lastPrice: 1.23, 
    change: -0.11, 
    percentChange: -8.21, 
    volume: 7698741, 
    marketCap: '38.4M', 
    sector: 'Healthcare', 
    marketCapRatio: 5.27, 
    newsflags: 8.0, 
    sVol: 45.5, 
    relativeVolumeStDev: 3.21, 
    shares: 31253741, 
    catScale: 0.78, 
    putScale: 1.52 
  },
  { 
    symbol: 'TWOH', 
    companyName: 'TwoHeights Corp', 
    lastPrice: 0.62, 
    change: 0.03, 
    percentChange: 5.08, 
    volume: 3965423, 
    marketCap: '18.1M', 
    sector: 'Consumer Cyclical', 
    marketCapRatio: 3.05, 
    newsflags: 15.0, 
    sVol: 58.8, 
    relativeVolumeStDev: 4.45, 
    shares: 29140620, 
    catScale: 0.514, 
    putScale: 0.093 
  }
];

const LottoWatchlist = () => {
  const { toast: useToastFn } = useToast();
  const [watchlist, setWatchlist] = useState<LottoStockData[]>(mockLottoWatchlist);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>(DataSource.MANUAL);
  const [customSourceUrl, setCustomSourceUrl] = useState('');
  const [showDataSourceForm, setShowDataSourceForm] = useState(false);
  const [manualTickerInput, setManualTickerInput] = useState('');
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  
  const refreshData = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedWatchlist = watchlist.map(stock => {
        const changeMultiplier = Math.random() > 0.5 ? 1 : -1;
        const newChange = parseFloat((stock.change + (Math.random() * 0.05 * changeMultiplier)).toFixed(2));
        const newPercentChange = parseFloat(((newChange / (stock.lastPrice - stock.change)) * 100).toFixed(2));
        const newPrice = parseFloat((stock.lastPrice + newChange).toFixed(2));
        
        return {
          ...stock,
          lastPrice: newPrice,
          change: newChange,
          percentChange: newPercentChange,
          volume: Math.floor(stock.volume * (0.95 + Math.random() * 0.1)),
          relativeVolumeStDev: parseFloat((stock.relativeVolumeStDev + (Math.random() * 0.2 - 0.1)).toFixed(2)),
        };
      });
      
      setWatchlist(updatedWatchlist);
      setIsLoading(false);
    }, 800);
  };
  
  useEffect(() => {
    refreshData();
    
    const intervalId = setInterval(refreshData, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleEmailSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailInput || !emailInput.includes('@')) {
      useToastFn({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setEmailSubscribed(true);
      setShowEmailForm(false);
      setIsLoading(false);
      useToastFn({
        title: "Success!",
        description: "You're now subscribed to watchlist updates",
        variant: "default"
      });
    }, 1000);
  };

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualTickerInput) {
      toast.error("Please enter a ticker symbol");
      return;
    }
    
    // Simple validation for ticker format
    if (!/^[A-Z0-9]{1,5}$/.test(manualTickerInput.toUpperCase())) {
      toast.error("Invalid ticker format. Please use 1-5 characters (letters or numbers)");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      // Create a new mock stock with the ticker entered
      const newStock: LottoStockData = {
        symbol: manualTickerInput.toUpperCase(),
        companyName: `${manualTickerInput.toUpperCase()} Inc.`,
        lastPrice: parseFloat((Math.random() * 5).toFixed(2)),
        change: parseFloat((Math.random() * 0.3).toFixed(2)),
        percentChange: parseFloat((Math.random() * 8).toFixed(2)),
        volume: Math.floor(Math.random() * 10000000),
        marketCap: `${parseFloat((Math.random() * 100).toFixed(1))}M`,
        sector: "Unknown",
        marketCapRatio: parseFloat((Math.random() * 10).toFixed(2)),
        newsflags: parseFloat((Math.random() * 20).toFixed(1)),
        sVol: parseFloat((Math.random() * 60).toFixed(1)),
        relativeVolumeStDev: parseFloat((Math.random() * 5).toFixed(2)),
        shares: Math.floor(Math.random() * 50000000),
        catScale: parseFloat((Math.random() * 2).toFixed(3)),
        putScale: parseFloat((Math.random() * 2).toFixed(3))
      };
      
      setWatchlist([...watchlist, newStock]);
      setManualTickerInput('');
      setShowManualForm(false);
      setIsLoading(false);
      toast.success("New ticker added", {
        description: `${newStock.symbol} has been added to your lotto watchlist.`
      });
    }, 1000);
  };

  const handleRemoveTicker = (symbol: string) => {
    setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
    toast.success("Ticker removed", {
      description: `${symbol} has been removed from your lotto watchlist.`
    });
  };

  const handleDataSourceChange = (source: DataSource) => {
    setDataSource(source);
    if (source === DataSource.MANUAL) {
      setShowManualForm(true);
    } else {
      setShowDataSourceForm(true);
    }
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any = a[sortField as keyof LottoStockData];
    let bValue: any = b[sortField as keyof LottoStockData];
    
    if (typeof aValue === 'string' && aValue.match(/^[\d.]+[KMBT]$/)) {
      const multiplier = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
      aValue = parseFloat(aValue) * multiplier[aValue.slice(-1) as keyof typeof multiplier];
      bValue = parseFloat(bValue) * multiplier[bValue.slice(-1) as keyof typeof multiplier];
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <section id="lotto-watchlist" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Lotto-Tradez Watchlist</h2>
          <p className="text-muted-foreground max-w-2xl">Track your high-risk, high-reward penny stocks with our Lotto-Tradez watchlist. Small caps with big potential.</p>
        </div>
        
        <div className="bg-black rounded-xl shadow-md overflow-hidden text-white">
          <div className="px-6 py-4 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Eye className="h-4 w-4" />
              <span>Lotto-Tradez Watchlist</span>
              <div className="inline-flex items-center px-2 py-1 ml-2 rounded-full bg-primary/20 text-primary text-xs font-medium">
                <RefreshCw className={cn("h-3 w-3 mr-1", isLoading && "animate-spin")} />
                <span>Live Data</span>
              </div>
              
              {emailSubscribed ? (
                <div className="inline-flex items-center px-2 py-1 ml-2 rounded-full bg-success/20 text-success text-xs font-medium">
                  <Mail className="h-3 w-3 mr-1" />
                  <span>Email Updates Active</span>
                </div>
              ) : (
                <button 
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  className="inline-flex items-center px-2 py-1 ml-2 rounded-full bg-gray-700 hover:bg-gray-600 text-xs font-medium transition-colors"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  <span>Enable Email Updates</span>
                </button>
              )}

              <div className="inline-flex items-center px-2 py-1 ml-2 rounded-full bg-gray-700 hover:bg-gray-600 text-xs font-medium cursor-pointer">
                <Database className="h-3 w-3 mr-1" />
                <select 
                  className="bg-transparent border-none outline-none text-gray-300 text-xs cursor-pointer"
                  value={dataSource}
                  onChange={(e) => handleDataSourceChange(e.target.value as DataSource)}
                >
                  <option value={DataSource.MANUAL} className="bg-gray-900 text-white">Manual Entry</option>
                  <option value={DataSource.EMAIL} className="bg-gray-900 text-white">Email Feed</option>
                  <option value={DataSource.CUSTOM} className="bg-gray-900 text-white">Custom Source</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-300 flex items-center gap-1 transition-colors">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </button>
              <button 
                onClick={refreshData}
                className={cn(
                  "text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-300 flex items-center gap-1 transition-colors",
                  isLoading && "bg-gray-800"
                )}
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                <span>Refresh</span>
              </button>
              <button 
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-300 flex items-center gap-1 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
          
          {showEmailForm && (
            <div className="px-6 py-3 bg-gray-900">
              <form onSubmit={handleEmailSubscribe} className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email for watchlist updates"
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-dino-600 text-white rounded hover:bg-dino-500 transition-colors"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-1">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                You'll receive intraday updates about your lotto stock picks via email
              </p>
            </div>
          )}

          {showManualForm && (
            <div className="px-6 py-3 bg-gray-900">
              <form onSubmit={handleAddTicker} className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={manualTickerInput}
                    onChange={(e) => setManualTickerInput(e.target.value.toUpperCase())}
                    placeholder="Enter ticker symbol (e.g. ABC)"
                    className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white uppercase"
                    disabled={isLoading}
                    maxLength={5}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-dino-600 text-white rounded hover:bg-dino-500 transition-colors"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add Ticker'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-1">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Add penny stocks to your lotto watchlist manually
              </p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table className="w-full watchlist-table text-gray-200">
              <TableHeader className="bg-gray-900">
                <TableRow className="border-b border-gray-800 hover:bg-transparent">
                  <TableHead className="w-10 text-gray-400">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('symbol')}
                  >
                    <div className="flex items-center">
                      <span>Symbol</span>
                      {sortField === 'symbol' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">Last</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('change')}
                  >
                    <div className="flex items-center">
                      <span>Change</span>
                      {sortField === 'change' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('percentChange')}
                  >
                    <div className="flex items-center">
                      <span>% Change</span>
                      {sortField === 'percentChange' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('marketCapRatio')}
                  >
                    <div className="flex items-center">
                      <span>Market Cap / Equity Ratio</span>
                      {sortField === 'marketCapRatio' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('newsflags')}
                  >
                    <div className="flex items-center">
                      <span>Newsflags</span>
                      {sortField === 'newsflags' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('sVol')}
                  >
                    <div className="flex items-center">
                      <span>sVol</span>
                      {sortField === 'sVol' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('marketCap')}
                  >
                    <div className="flex items-center">
                      <span>Market Cap</span>
                      {sortField === 'marketCap' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-800 text-gray-300"
                    onClick={() => handleSort('volume')}
                  >
                    <div className="flex items-center">
                      <span>Volume</span>
                      {sortField === 'volume' && (
                        <ArrowUpDown className={cn(
                          "ml-1 h-4 w-4", 
                          sortDirection === 'desc' ? "rotate-180" : ""
                        )} />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedWatchlist.map((stock) => (
                  <TableRow key={stock.symbol} className="border-b border-gray-800 hover:bg-gray-900">
                    <TableCell className="text-center">
                      <button 
                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                        onClick={() => handleRemoveTicker(stock.symbol)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </TableCell>
                    <TableCell className="font-medium text-dino-400">{stock.symbol}</TableCell>
                    <TableCell>${stock.lastPrice.toFixed(2)}</TableCell>
                    <TableCell className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                      <div className="flex items-center">
                        {stock.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className={stock.percentChange >= 0 ? "text-green-500" : "text-red-500"}>
                      {stock.percentChange >= 0 ? "+" : ""}{stock.percentChange.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-gray-200">{stock.marketCapRatio.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-200">{stock.newsflags.toFixed(1)}</TableCell>
                    <TableCell className="text-gray-200">{stock.sVol.toFixed(1)}</TableCell>
                    <TableCell className="text-gray-200">{stock.marketCap}</TableCell>
                    <TableCell className="text-gray-200">{stock.volume.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LottoWatchlist;
