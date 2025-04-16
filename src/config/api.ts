
// Alpha Vantage API configuration
const API_CONFIG = {
  alphaVantage: {
    apiKey: 'PACE4ZNKMN2DAKEZ', // Demo key - Replace with your actual API key
    baseUrl: 'https://www.alphavantage.co/query'
  },
  additionalData: {
    // These are mock endpoints for data not available in the free API
    shortInterest: 'https://api.dinotradez.com/v1/short-interest',
    darkPool: 'https://api.dinotradez.com/v1/dark-pool',
    blockTrades: 'https://api.dinotradez.com/v1/block-trades'
  }
};

export default API_CONFIG;
