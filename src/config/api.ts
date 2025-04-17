
// API Configuration for DinoTradez
const API_CONFIG = {
  alphaVantage: {
    apiKey: '7DCHKM0CLGZ5LAAJ', // Demo key - Rate limited but works for demo
    baseUrl: 'https://www.alphavantage.co/query',
    timeout: 5000 // 5 seconds timeout to prevent hanging requests
  },
  additionalData: {
    // These are mock endpoints for data not available in the free API
    shortInterest: 'https://api.dinotradez.com/v1/short-interest',
    darkPool: 'https://api.dinotradez.com/v1/dark-pool',
    blockTrades: 'https://api.dinotradez.com/v1/block-trades'
  },
  fallbackToMock: true,   // Always fall back to mock data if API fails
  mockDataEnabled: true,  // Always enable mock data generation for consistent demo experience
  useRealApi: true        // Try real API first, with fallback to mock data
};

export default API_CONFIG;
