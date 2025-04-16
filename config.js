// Configuration File for API Keys and Settings
const config = {
    // Alpha Vantage API credentials
    apiKey: '7DCHKM0CLGZ5LAAJ',
    baseUrl: 'https://www.alphavantage.co/query',
    
    // Update intervals (in milliseconds)
    updateInterval: 300000, // 5 minutes
    
    // Finnhub API for additional data (optional)
    // Sign up at https://finnhub.io/
    finnhubApiKey: 'YOUR_FINNHUB_API_KEY_HERE',
    finnhubBaseUrl: 'https://finnhub.io/api/v1',
    
    // Settings for the application
    maxRetries: 3,             // Number of retries on API failure
    retryDelay: 2000,          // Delay between retries (ms)
    enableLogging: true,       // Enable console logging
    marketIntelligenceUpdateInterval: 3600000, // 1 hour for market intelligence data
};

// Function to log messages if logging is enabled
function logMessage(message) {
    if (config.enableLogging) {
        console.log(`[DinoTradez] ${message}`);
    }
}

// Export the configuration
export { config, logMessage };