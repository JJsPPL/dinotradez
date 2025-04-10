
import React from 'react';
import SearchForm from './stock/SearchForm';
import StockCard from './stock/StockCard';
import { StockData } from './stock/stockSearch.types';
import { getMockData } from './stock/stockUtils';
import { toast } from 'sonner';

const StockSearch = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [stockData, setStockData] = React.useState<StockData | null>(null);
  const [searchError, setSearchError] = React.useState('');

  const fetchStockData = async (symbol: string) => {
    try {
      // Yahoo Finance API endpoint using RapidAPI
      const response = await fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${symbol}&region=US`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '1dd4d1c8c8mshb0df8f5edf37e8ap158af3jsn4a8d0d23ea54', // This is a sample key. In production, use a proper key management solution
          'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      
      // This function will be implemented in stockUtils.ts
      return data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError('Please enter a stock symbol');
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Try to fetch real data
      const data = await fetchStockData(searchQuery.trim());
      
      // Extract and transform the data using the utility function
      const stockData = getMockData(searchQuery.trim());
      setStockData(stockData);
      toast.success(`Stock data for ${searchQuery.toUpperCase()} loaded successfully`);
    } catch (error) {
      console.warn('API fetch failed, using mock data instead:', error);
      
      // Fall back to mock data
      const mockData = getMockData(searchQuery.trim());
      setStockData(mockData);
      
      // Show a toast that we're using mock data
      toast.info(`Using simulated data for ${searchQuery.toUpperCase()}`);
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
