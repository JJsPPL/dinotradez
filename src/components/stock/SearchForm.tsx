
import React from 'react';
import { Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchFormProps } from './stockSearch.types';

const SearchForm = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  isSearching, 
  searchError 
}: SearchFormProps) => {
  return (
    <>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter any stock symbol (e.g., AAPL, MSFT, GOOGL)"
            className="block w-full pl-10 pr-4 py-6 border border-input bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <button 
          type="submit"
          disabled={isSearching}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg disabled:opacity-70"
        >
          {isSearching ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
      
      {searchError && (
        <div className="p-4 mb-6 rounded-lg bg-destructive/10 text-destructive flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{searchError}</p>
        </div>
      )}
    </>
  );
};

export default SearchForm;
