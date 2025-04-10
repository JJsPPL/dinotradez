
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  high52w: number;
  low52w: number;
  dayHigh: number;
  dayLow: number;
  closePrice: number;
  marketCap: string;
  sharesOutstanding: string;
  authorizedShares: string;
  marketCapToEquityRatio: number;
  dollarVolume: string;
  volume: number;
}

export interface LottoStockData {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap: string;
  marketCapRatio: number;
  newsflags: number;
  sVol: number;
  relativeVolumeStDev: number;
  sector: string;
  shares: number;
  catScale: number;
  putScale: number;
}

export interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  isSearching: boolean;
  searchError: string;
}

export interface StockCardProps {
  stockData: StockData;
}

export interface StockInfoProps {
  stockData: StockData;
}

export interface StockChartsProps {
  stockData: StockData;
}

export interface PriceRangeProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  low: number;
  high: number;
}

export interface StockStatProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subValue?: string;
}
