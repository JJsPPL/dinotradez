
import React from 'react';
import SearchForm from './stock/SearchForm';
import StockCard from './stock/StockCard';
import { StockData } from './stock/stockSearch.types';
import { toast } from 'sonner';
import { fetchStockData } from '@/utils/stockDataService';

const StockSearch = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [stockData, setStockData] = React.useState<StockData | null>(null);
  const [searchError, setSearchError] = React.useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError('Please enter a stock symbol');
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      const symbol = searchQuery.trim().toUpperCase();
      // Use our fetchStockData utility
      const apiData = await fetchStockData(symbol);
      
      if (!apiData) {
        throw new Error('Failed to fetch stock data');
      }
      
      // Convert API data to our StockData interface
      const stockData: StockData = {
        symbol: apiData.symbol,
        name: apiData.name,
        price: apiData.price,
        change: apiData.change,
        percentChange: apiData.percentChange,
        high52w: apiData.high52w || apiData.price * 1.2,
        low52w: apiData.low52w || apiData.price * 0.8,
        dayHigh: apiData.dayHigh || apiData.price * 1.02,
        dayLow: apiData.dayLow || apiData.price * 0.98,
        closePrice: apiData.closePrice || apiData.price * 0.99,
        marketCap: apiData.marketCap || 'N/A',
        sharesOutstanding: '2.5B',  // Mock data for fields not in API
        authorizedShares: '5B',     // Mock data
        marketCapToEquityRatio: 12.5, // Mock data
        dollarVolume: `$${(apiData.price * (apiData.volume || 0) / 1000000).toFixed(2)}M`,
        volume: apiData.volume || 1000000
      };
      
      setStockData(stockData);
      toast.success(`Stock data for ${symbol} loaded successfully`);
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setSearchError('Failed to load stock data. Please try again.');
      toast.error('Could not load stock data');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="search" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">Stock Search</h2>
          <p className="text-muted-foreground max-w-2xl">Enter a stock symbol to get comprehensive data and insights.</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <SearchForm 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isSearching={isSearching}
            searchError={searchError}
          />
          
          {stockData && (
            <StockCard stockData={stockData} />
          )}
        </div>
      </div>
    </section>
  );
};

export default StockSearch;
