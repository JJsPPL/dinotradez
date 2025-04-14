// Create a stock item element
function createStockItem(ticker, data) {
    // Generate a random price change if in demo mode
    if (stockConfig.demoMode) {
        // Adjust the price slightly for realism
        const randomFactor = (Math.random() * 0.02) - 0.01; // -1% to +1%
        data.price = data.price * (1 + randomFactor);
    }
    
    // Calculate the price change
    const priceChange = data.price - data.prevClose;
    const percentChange = (priceChange / data.prevClose) * 100;
    const isPositive = priceChange >= 0;
    
    // Create the stock item
    const stockItem = document.createElement('div');
    stockItem.id = `stock-${ticker}`;
    stockItem.className = `dino-stock-item ${isPositive ? 'positive' : 'negative'}`;
    
    // Stock header content
    const stockHeader = document.createElement('div');
    stockHeader.className = 'stock-header';
    stockHeader.innerHTML = `
        <div class="stock-symbol">${ticker}</div>
        <div class="stock-name">${data.name || 'Unknown Company'}</div>
        <button class="stock-delete" title="Remove from watchlist">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Stock body content
    const stockBody = document.createElement('div');
    stockBody.className = 'stock-body';
    stockBody.innerHTML = `
        <div class="stock-price">${data.price.toFixed(2)}</div>
        <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
            ${isPositive ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} (${Math.abs(percentChange).toFixed(2)}%)
        </div>
    `;
    
    // Stock details content - advanced data
    const stockDetails = document.createElement('div');
    stockDetails.className = 'stock-details';
    
    // Create tabs for different data categories
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'stock-tabs';
    tabsContainer.innerHTML = `
        <button class="tab-button active" data-tab="overview">Overview</button>
        <button class="tab-button" data-tab="dark-pool">Dark Pool</button>
        <button class="tab-button" data-tab="short-interest">Short Interest</button>
    `;
    
    // Create tab content
    const tabContentContainer = document.createElement('div');
    tabContentContainer.className = 'tab-content-container';
    
    // Overview tab content
    const overviewContent = document.createElement('div');
    overviewContent.className = 'tab-content active';
    overviewContent.dataset.tab = 'overview';
    overviewContent.innerHTML = `
        <div class="data-row">
            <div class="data-label">Market Cap:</div>
            <div class="data-value">${data.marketCap || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">MC/Equity Ratio:</div>
            <div class="data-value">${data.mcToEquityRatio ? data.mcToEquityRatio.toFixed(2) : 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Shares Outstanding:</div>
            <div class="data-value">${data.sharesOutstanding || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Shares Authorized:</div>
            <div class="data-value">${data.sharesAuthorized || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Volume:</div>
            <div class="data-value">${data.volume || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Avg Volume:</div>
            <div class="data-value">${data.avgVolume || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Relative Volume:</div>
            <div class="data-value">${data.relativeVolume ? data.relativeVolume.toFixed(2) : 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">52 Week High:</div>
            <div class="data-value">${data.week52High ? data.week52High.toFixed(2) : 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">52 Week Low:</div>
            <div class="data-value">${data.week52Low ? data.week52Low.toFixed(2) : 'N/A'}</div>
        </div>
    `;
    
    // Dark Pool tab content
    const darkPoolContent = document.createElement('div');
    darkPoolContent.className = 'tab-content';
    darkPoolContent.dataset.tab = 'dark-pool';
    darkPoolContent.innerHTML = `
        <div class="data-row">
            <div class="data-label">Dark Pool %:</div>
            <div class="data-value">${data.darkPoolPercent ? data.darkPoolPercent.toFixed(2) + '%' : 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Dark Pool Volume:</div>
            <div class="data-value">${data.darkPoolVolume || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Dark Pool Avg Price:</div>
            <div class="data-value">${data.darkPoolAvgPrice ? data.darkPoolAvgPrice.toFixed(2) : 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Block Trades:</div>
            <div class="data-value">${data.darkPoolBlockTrades || 'N/A'}</div>
        </div>
        <div class="dark-pool-chart">
            <div class="chart-placeholder">Dark Pool Activity Chart</div>
        </div>
    `;
    
    // Short Interest tab content
    const shortInterestContent = document.createElement('div');
    shortInterestContent.className = 'tab-content';
    shortInterestContent.dataset.tab = 'short-interest';
    shortInterestContent.innerHTML = `
        <div class="data-row">
            <div class="data-label">Short Interest:</div>
            <div class="data-value">${data.shortInterest || 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Short % of Float:</div>
            <div class="data-value ${data.shortPercent > 15 ? 'warning' : ''}">${data.shortPercent ? data.shortPercent.toFixed(2) + '%' : 'N/A'}</div>
        </div>
        <div class="data-row">
            <div class="data-label">Short % Change:</div>
            <div class="data-value ${data.shortPercentChange > 0 ? 'positive' : data.shortPercentChange < 0 ? 'negative' : ''}">
                ${data.shortPercentChange ? (data.shortPercentChange > 0 ? '+' : '') + data.shortPercentChange.toFixed(2) + '%' : 'N/A'}
            </div>
        </div>
        <div class="short-interest-chart">
            <div class="chart-placeholder">Short Interest Trend Chart</div>
        </div>
    `;
    
    // Add tab content to container
    tabContentContainer.appendChild(overviewContent);
    tabContentContainer.appendChild(darkPoolContent);
    tabContentContainer.appendChild(shortInterestContent);
    
    // Combine details
    stockDetails.appendChild(tabsContainer);
    stockDetails.appendChild(tabContentContainer);
    
    // Stock footer content - actions
    const stockFooter = document.createElement('div');
    stockFooter.className = 'stock-footer';
    stockFooter.innerHTML = `
        <button class="btn-mini">
            <i class="fas fa-chart-line"></i> Chart
        </button>
        <button class="btn-mini">
            <i class="fas fa-info-circle"></i> Details
        </button>
        <button class="btn-mini">
            <i class="fas fa-bell"></i> Alert
        </button>
    `;
    
    // Assemble all parts
    stockItem.appendChild(stockHeader);
    stockItem.appendChild(stockBody);
    stockItem.appendChild(stockDetails);
    stockItem.appendChild(stockFooter);
    
    // Add event listeners for tabs
    const tabButtons = stockItem.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const tabContents = stockItem.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabName = this.dataset.tab;
            stockItem.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
        });
    });
    
    // Add delete functionality
    stockItem.querySelector('.stock-delete').addEventListener('click', () => {
        stockItem.classList.add('removing');
        setTimeout(() => {
            stockItem.remove();
        }, 300);
    });
    
    // Add demo functionality for buttons
    stockItem.querySelectorAll('.btn-mini').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            alert(`Feature coming soon: ${action} for ${ticker}`);
        });
    });
    
    // Add to the stocks list with animation
    stockItem.style.opacity = '0';
    stockItem.style.transform = 'translateY(20px)';
    stocksList.appendChild(stockItem);
    
    // Trigger animation
    setTimeout(() => {
        stockItem.style.opacity = '1';
        stockItem.style.transform = 'translateY(0)';
    }, 50);
}// DinoTradez - Stock Data Integration
// This file handles fetching and displaying real-time stock data

// Configuration for the stock data component
const stockConfig = {
    // List of default stocks to display
    defaultStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'GME', 'AMC'],
    // Using Polygon.io API
    apiUrl: 'https://api.polygon.io/v2/aggs/ticker/',
    apiKey: 'XWomyE6Hei_9oTXPapKSgO2NdQqV9UIt',
    // Refresh interval (in milliseconds)
    refreshInterval: 30000, // 30 seconds
    // Set to true to use the demo data instead of the API
    demoMode: true
};

// DOM Elements
let stockContainer;
let searchInput;
let searchButton;
let loadingIndicator;
let stocksList;

// Stock data cache (for demo mode and enhanced data that might not be available from API)
const stocksData = {
    'AAPL': { 
        name: 'Apple Inc.', 
        price: 175.42, 
        prevClose: 172.65,
        marketCap: '2.74T',
        mcToEquityRatio: 28.65,
        sharesOutstanding: '15.7B',
        sharesAuthorized: '50.0B',
        volume: '55.92M',
        avgVolume: '61.54M',
        relativeVolume: 0.91,
        volStdDev: 0.21,
        week52High: 182.94,
        week52Low: 142.73,
        darkPoolPercent: 42.8,
        darkPoolVolume: '23.94M',
        darkPoolAvgPrice: 174.89,
        darkPoolBlockTrades: 87,
        shortInterest: '92.75M',
        shortPercent: 5.91,
        shortPercentChange: 0.22
    },
    'MSFT': { 
        name: 'Microsoft Corp.', 
        price: 310.87, 
        prevClose: 308.22,
        marketCap: '2.31T',
        mcToEquityRatio: 12.43,
        sharesOutstanding: '7.43B',
        sharesAuthorized: '24.0B',
        volume: '23.79M',
        avgVolume: '26.18M',
        relativeVolume: 0.91,
        volStdDev: 0.17,
        week52High: 315.95,
        week52Low: 245.61,
        darkPoolPercent: 38.5,
        darkPoolVolume: '9.16M',
        darkPoolAvgPrice: 309.92,
        darkPoolBlockTrades: 64,
        shortInterest: '38.42M',
        shortPercent: 0.52,
        shortPercentChange: -0.03
    },
    'GOOGL': { 
        name: 'Alphabet Inc.', 
        price: 142.76, 
        prevClose: 140.55,
        marketCap: '1.78T',
        mcToEquityRatio: 5.78,
        sharesOutstanding: '12.47B',
        sharesAuthorized: '30.0B',
        volume: '29.31M',
        avgVolume: '28.15M',
        relativeVolume: 1.04,
        volStdDev: 0.25,
        week52High: 153.78,
        week52Low: 95.44,
        darkPoolPercent: 41.3,
        darkPoolVolume: '12.10M',
        darkPoolAvgPrice: 142.11,
        darkPoolBlockTrades: 55,
        shortInterest: '36.89M',
        shortPercent: 0.30,
        shortPercentChange: -0.05
    },
    'AMZN': { 
        name: 'Amazon.com Inc.', 
        price: 129.83, 
        prevClose: 128.47,
        marketCap: '1.35T',
        mcToEquityRatio: 13.27,
        sharesOutstanding: '10.42B',
        sharesAuthorized: '25.0B',
        volume: '47.82M',
        avgVolume: '51.33M',
        relativeVolume: 0.93,
        volStdDev: 0.31,
        week52High: 145.86,
        week52Low: 101.26,
        darkPoolPercent: 45.1,
        darkPoolVolume: '21.57M',
        darkPoolAvgPrice: 129.24,
        darkPoolBlockTrades: 93,
        shortInterest: '72.13M',
        shortPercent: 0.69,
        shortPercentChange: 0.08
    },
    'TSLA': { 
        name: 'Tesla Inc.', 
        price: 273.58, 
        prevClose: 280.99,
        marketCap: '872.48B',
        mcToEquityRatio: 18.75,
        sharesOutstanding: '3.19B',
        sharesAuthorized: '6.0B',
        volume: '118.54M',
        avgVolume: '97.12M',
        relativeVolume: 1.22,
        volStdDev: 0.47,
        week52High: 299.29,
        week52Low: 138.80,
        darkPoolPercent: 48.7,
        darkPoolVolume: '57.73M',
        darkPoolAvgPrice: 274.16,
        darkPoolBlockTrades: 127,
        shortInterest: '121.56M',
        shortPercent: 3.81,
        shortPercentChange: 0.34
    },
    'META': { 
        name: 'Meta Platforms Inc.', 
        price: 324.62, 
        prevClose: 320.10,
        marketCap: '828.15B',
        mcToEquityRatio: 5.96,
        sharesOutstanding: '2.55B',
        sharesAuthorized: '10.0B',
        volume: '14.68M',
        avgVolume: '16.23M',
        relativeVolume: 0.90,
        volStdDev: 0.22,
        week52High: 326.20,
        week52Low: 138.27,
        darkPoolPercent: 39.8,
        darkPoolVolume: '5.84M',
        darkPoolAvgPrice: 323.75,
        darkPoolBlockTrades: 41,
        shortInterest: '28.72M',
        shortPercent: 1.13,
        shortPercentChange: -0.04
    },
    'NVDA': { 
        name: 'NVIDIA Corp.', 
        price: 681.22, 
        prevClose: 670.50,
        marketCap: '1.68T',
        mcToEquityRatio: 51.24,
        sharesOutstanding: '2.47B',
        sharesAuthorized: '4.0B',
        volume: '43.52M',
        avgVolume: '47.89M',
        relativeVolume: 0.91,
        volStdDev: 0.38,
        week52High: 746.11,
        week52Low: 204.21,
        darkPoolPercent: 46.2,
        darkPoolVolume: '20.11M',
        darkPoolAvgPrice: 679.84,
        darkPoolBlockTrades: 76,
        shortInterest: '33.58M',
        shortPercent: 1.36,
        shortPercentChange: 0.15
    },
    'GME': { 
        name: 'GameStop Corp.', 
        price: 28.43, 
        prevClose: 27.89,
        marketCap: '8.68B',
        mcToEquityRatio: 6.18,
        sharesOutstanding: '305.4M',
        sharesAuthorized: '1.0B',
        volume: '7.14M',
        avgVolume: '5.82M',
        relativeVolume: 1.23,
        volStdDev: 0.92,
        week52High: 63.92,
        week52Low: 15.41,
        darkPoolPercent: 55.2,
        darkPoolVolume: '3.94M',
        darkPoolAvgPrice: 28.15,
        darkPoolBlockTrades: 29,
        shortInterest: '63.92M',
        shortPercent: 20.93,
        shortPercentChange: 3.42
    },
    'AMC': { 
        name: 'AMC Entertainment', 
        price: 7.28, 
        prevClose: 7.05,
        marketCap: '3.79B',
        mcToEquityRatio: 7.48,
        sharesOutstanding: '521.4M',
        sharesAuthorized: '2.0B',
        volume: '15.47M',
        avgVolume: '12.76M',
        relativeVolume: 1.21,
        volStdDev: 0.86,
        week52High: 62.30,
        week52Low: 3.55,
        darkPoolPercent: 61.8,
        darkPoolVolume: '9.56M',
        darkPoolAvgPrice: 7.15,
        darkPoolBlockTrades: 37,
        shortInterest: '94.54M',
        shortPercent: 18.13,
        shortPercentChange: 2.78
    },
    'BBBY': { 
        name: 'Bed Bath & Beyond', 
        price: 0.48, 
        prevClose: 0.44,
        marketCap: '57.12M',
        mcToEquityRatio: 0.28,
        sharesOutstanding: '119.0M',
        sharesAuthorized: '900.0M',
        volume: '10.52M',
        avgVolume: '8.74M',
        relativeVolume: 1.20,
        volStdDev: 1.23,
        week52High: 33.29,
        week52Low: 0.36,
        darkPoolPercent: 59.4,
        darkPoolVolume: '6.25M',
        darkPoolAvgPrice: 0.46,
        darkPoolBlockTrades: 14,
        shortInterest: '35.72M',
        shortPercent: 30.02,
        shortPercentChange: 5.14
    }
};

// Initialize the stock data component
function initStockData() {
    console.log('Initializing DinoTradez stock data...');
    
    // Create the stock container if it doesn't exist
    createStockContainer();
    
    // Load the default stocks
    stockConfig.defaultStocks.forEach(ticker => {
        fetchStockData(ticker);
    });
    
    // Set up a timer to refresh the data
    setInterval(() => {
        refreshAllStocks();
    }, stockConfig.refreshInterval);
}

// Create the stock container and UI elements
function createStockContainer() {
    // Get the main content container
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // Check if container already exists
    const existingContainer = document.getElementById('dino-stock-container');
    if (existingContainer) {
        stockContainer = existingContainer;
        return;
    }
    
    // Create main container
    stockContainer = document.createElement('div');
    stockContainer.id = 'dino-stock-container';
    stockContainer.className = 'dino-stock-container';
    
    // Create search components
    const searchContainer = document.createElement('div');
    searchContainer.className = 'dino-search-container';
    
    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Enter stock symbol (e.g., AAPL)';
    searchInput.className = 'dino-search-input';
    
    searchButton = document.createElement('button');
    searchButton.textContent = 'Add to Watchlist';
    searchButton.className = 'btn btn-primary';
    searchButton.addEventListener('click', () => {
        const ticker = searchInput.value.trim().toUpperCase();
        if (ticker) {
            fetchStockData(ticker);
            searchInput.value = '';
        }
    });
    
    // Add enter key support
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const ticker = searchInput.value.trim().toUpperCase();
            if (ticker) {
                fetchStockData(ticker);
                searchInput.value = '';
            }
        }
    });
    
    // Add search components to search container
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    
    // Create loading indicator
    loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'dino-loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading stocks...';
    loadingIndicator.style.display = 'none';
    
    // Create stocks list container
    stocksList = document.createElement('div');
    stocksList.id = 'dino-stocks-list';
    stocksList.className = 'dino-stocks-list';
    
    // Assemble the component
    stockContainer.appendChild(searchContainer);
    stockContainer.appendChild(loadingIndicator);
    stockContainer.appendChild(stocksList);
    
    // Add it to the page
    mainContent.appendChild(stockContainer);
}

// Fetch stock data for a specific ticker
async function fetchStockData(ticker) {
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    
    try {
        // Check if we already have this stock
        const existingStock = document.getElementById(`stock-${ticker}`);
        if (existingStock) {
            // Update the existing stock
            updateStockItem(ticker);
            loadingIndicator.style.display = 'none';
            return;
        }
        
        // In demo mode, use cached data or generate random data
        if (stockConfig.demoMode) {
            setTimeout(() => {
                if (stocksData[ticker]) {
                    // Use cached data
                    createStockItem(ticker, stocksData[ticker]);
                } else {
                    // Generate random data for unknown ticker
                    showError(`Stock ${ticker} not found in demo database`);
                }
                loadingIndicator.style.display = 'none';
            }, 800); // Add a small delay for realism
            return;
        }
        
        // For real API implementation using Polygon.io
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Format dates for API
        const todayFormatted = formatDate(now);
        const yesterdayFormatted = formatDate(yesterday);
        
        // Construct API URL for previous day's data
        const endpoint = `${stockConfig.apiUrl}${ticker}/prev?adjusted=true&apiKey=${stockConfig.apiKey}`;
        
        // Fetch stock data
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Get company name (in real implementation, you might want to make a separate API call for this)
            // For now we'll use a simplified approach
            let companyName = ticker;
            if (stocksData[ticker]) {
                companyName = stocksData[ticker].name;
            }
            
            // Create data object in the format expected by createStockItem
            const stockData = {
                name: companyName,
                price: data.results[0].c,  // Closing price
                prevClose: data.results[0].o  // Opening price as previous close
            };
            
            createStockItem(ticker, stockData);
        } else {
            showError(`Could not find data for ${ticker}`);
        }
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error fetching stock data:', error);
        showError(`Error loading data for ${ticker}`);
        loadingIndicator.style.display = 'none';
    }
}

// Helper function to format date for API
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Create a stock item element
function createStockItem(ticker, data) {
    // Generate a random price change if in demo mode
    if (stockConfig.demoMode) {
        // Adjust the price slightly for realism
        const randomFactor = (Math.random() * 0.02) - 0.01; // -1% to +1%
        data.price = data.price * (1 + randomFactor);
    }
    
    // Calculate the price change
    const priceChange = data.price - data.prevClose;
    const percentChange = (priceChange / data.prevClose) * 100;
    const isPositive = priceChange >= 0;
    
    // Create the stock item
    const stockItem = document.createElement('div');
    stockItem.id = `stock-${ticker}`;
    stockItem.className = `dino-stock-item ${isPositive ? 'positive' : 'negative'}`;
    
    // Stock content
    stockItem.innerHTML = `
        <div class="stock-header">
            <div class="stock-symbol">${ticker}</div>
            <div class="stock-name">${data.name || 'Unknown Company'}</div>
            <button class="stock-delete" title="Remove from watchlist">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="stock-body">
            <div class="stock-price">$${data.price.toFixed(2)}</div>
            <div class="stock-change ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '▲' : '▼'} $${Math.abs(priceChange).toFixed(2)} (${Math.abs(percentChange).toFixed(2)}%)
            </div>
        </div>
        <div class="stock-footer">
            <button class="btn-mini">
                <i class="fas fa-chart-line"></i> Chart
            </button>
            <button class="btn-mini">
                <i class="fas fa-info-circle"></i> Details
            </button>
            <button class="btn-mini">
                <i class="fas fa-bell"></i> Alert
            </button>
        </div>
    `;
    
    // Add delete functionality
    stockItem.querySelector('.stock-delete').addEventListener('click', () => {
        stockItem.classList.add('removing');
        setTimeout(() => {
            stockItem.remove();
        }, 300);
    });
    
    // Add demo functionality for buttons
    stockItem.querySelectorAll('.btn-mini').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            alert(`Feature coming soon: ${action} for ${ticker}`);
        });
    });
    
    // Add to the stocks list with animation
    stockItem.style.opacity = '0';
    stockItem.style.transform = 'translateY(20px)';
    stocksList.appendChild(stockItem);
    
    // Trigger animation
    setTimeout(() => {
        stockItem.style.opacity = '1';
        stockItem.style.transform = 'translateY(0)';
    }, 50);
}

// Update a stock item with new data
async function updateStockItem(ticker) {
    try {
        const stockItem = document.getElementById(`stock-${ticker}`);
        if (!stockItem) return;
        
        // Get demo data
        if (stockConfig.demoMode) {
            setTimeout(() => {
                if (stocksData[ticker]) {
                    // Generate a random change
                    const randomFactor = (Math.random() * 0.02) - 0.01; // -1% to +1%
                    stocksData[ticker].price = stocksData[ticker].price * (1 + randomFactor);
                    
                    // Update UI
                    updateStockItemUI(ticker, stocksData[ticker]);
                }
            }, 500);
            return;
        }
        
        // For real API calls using Polygon.io
        try {
            // Construct API URL for previous day's data
            const endpoint = `${stockConfig.apiUrl}${ticker}/prev?adjusted=true&apiKey=${stockConfig.apiKey}`;
            
            // Fetch stock data
            const response = await fetch(endpoint);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Get company name (using the existing name in the DOM to avoid extra API calls)
                const nameElement = stockItem.querySelector('.stock-name');
                let companyName = ticker;
                
                if (nameElement) {
                    companyName = nameElement.textContent;
                } else if (stocksData[ticker]) {
                    companyName = stocksData[ticker].name;
                }
                
                // Create data object in the format expected by updateStockItemUI
                const stockData = {
                    name: companyName,
                    price: data.results[0].c,  // Closing price
                    prevClose: data.results[0].o  // Opening price as previous close
                };
                
                // Add a small random variation to make it seem more real-time
                const randomFactor = (Math.random() * 0.005) - 0.0025; // -0.25% to +0.25%
                stockData.price = stockData.price * (1 + randomFactor);
                
                updateStockItemUI(ticker, stockData);
            }
        } catch (error) {
            console.error('Error updating stock data:', error);
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

// Update the UI of a stock item
function updateStockItemUI(ticker, data) {
    const stockItem = document.getElementById(`stock-${ticker}`);
    if (!stockItem) return;
    
    // Calculate the price change
    const priceChange = data.price - data.prevClose;
    const percentChange = (priceChange / data.prevClose) * 100;
    const isPositive = priceChange >= 0;
    
    // Update price and change
    const priceElement = stockItem.querySelector('.stock-price');
    const changeElement = stockItem.querySelector('.stock-change');
    
    if (priceElement) {
        priceElement.textContent = `${data.price.toFixed(2)}`;
        
        // Add flash effect
        priceElement.classList.add(isPositive ? 'flash-green' : 'flash-red');
        setTimeout(() => {
            priceElement.classList.remove('flash-green', 'flash-red');
        }, 1000);
    }
    
    if (changeElement) {
        changeElement.className = `stock-change ${isPositive ? 'positive' : 'negative'}`;
        changeElement.textContent = `${isPositive ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} (${Math.abs(percentChange).toFixed(2)}%)`;
    }
    
    // Update item class
    stockItem.className = `dino-stock-item ${isPositive ? 'positive' : 'negative'}`;
}

// Refresh all stocks
function refreshAllStocks() {
    const stockItems = stocksList.querySelectorAll('.dino-stock-item');
    
    stockItems.forEach(item => {
        const ticker = item.id.replace('stock-', '');
        updateStockItem(ticker);
    });
}

// Show an error message
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'dino-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Add the error message to the container
    stockContainer.insertBefore(errorElement, stocksList);
    
    // Remove it after 5 seconds
    setTimeout(() => {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 5000);
}

// Add custom styles
function addStockStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Stock Component Styles */
        .dino-stock-container {
            margin-bottom: var(--spacing-xl);
        }
        
        .dino-search-container {
            display: flex;
            margin-bottom: var(--spacing-lg);
            gap: var(--spacing-md);
        }
        
        .dino-search-input {
            flex-grow: 1;
            padding: var(--spacing-md);
            border: 1px solid var(--medium-color);
            border-radius: var(--border-radius-md);
            font-family: var(--body-font);
            font-size: 1rem;
            background-color: var(--medium-color);
            color: var(--dark-color);
            transition: border-color var(--transition-fast);
        }
        
        .dino-search-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(29, 169, 119, 0.2);
        }
        
        .dino-loading-indicator {
            text-align: center;
            padding: var(--spacing-lg);
            color: var(--secondary-color);
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
        }
        
        .dino-stocks-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: var(--spacing-lg);
        }
        
        .dino-stock-item {
            background-color: var(--medium-color);
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: transform var(--transition-fast), box-shadow var(--transition-fast), opacity var(--transition-fast);
            border-top: 4px solid var(--primary-color);
            opacity: 1;
        }
        
        .dino-stock-item.positive {
            border-top-color: var(--success-color);
        }
        
        .dino-stock-item.negative {
            border-top-color: var(--danger-color);
        }
        
        .dino-stock-item:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        .dino-stock-item.removing {
            opacity: 0;
            transform: translateY(20px);
        }
        
        .stock-header {
            padding: var(--spacing-md) var(--spacing-lg);
            position: relative;
            border-bottom: 1px solid var(--light-color);
        }
        
        .stock-symbol {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: var(--spacing-xs);
        }
        
        .stock-name {
            font-size: 0.9rem;
            color: var(--secondary-color);
        }
        
        .stock-delete {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            background: none;
            border: none;
            color: var(--secondary-color);
            cursor: pointer;
            font-size: 1rem;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        
        .stock-delete:hover {
            background-color: rgba(231, 76, 60, 0.2);
            color: var(--danger-color);
        }
        
        .stock-body {
            padding: var(--spacing-lg);
            text-align: center;
        }
        
        .stock-price {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: var(--spacing-sm);
            transition: color var(--transition-fast);
        }
        
        .stock-change {
            font-size: 1rem;
            font-weight: 500;
        }
        
        .stock-change.positive {
            color: var(--success-color);
        }
        
        .stock-change.negative {
            color: var(--danger-color);
        }
        
        /* Detailed Stock Data Styles */
        .stock-details {
            border-top: 1px solid var(--light-color);
            padding: var(--spacing-md);
        }
        
        .stock-tabs {
            display: flex;
            border-bottom: 1px solid var(--light-color);
            margin-bottom: var(--spacing-md);
        }
        
        .tab-button {
            background: none;
            border: none;
            padding: var(--spacing-sm) var(--spacing-md);
            color: var(--secondary-color);
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            position: relative;
            transition: color var(--transition-fast);
        }
        
        .tab-button:hover {
            color: var(--primary-color);
        }
        
        .tab-button.active {
            color: var(--primary-color);
        }
        
        .tab-button.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--primary-color);
        }
        
        .tab-content-container {
            position: relative;
            min-height: 200px;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .data-row {
            display: flex;
            justify-content: space-between;
            padding: var(--spacing-xs) 0;
            font-size: 0.85rem;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
        }
        
        .data-label {
            color: var(--secondary-color);
        }
        
        .data-value {
            font-weight: 500;
        }
        
        .data-value.warning {
            color: var(--warning-color);
        }
        
        .chart-placeholder {
            margin-top: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: var(--border-radius-md);
            text-align: center;
            color: var(--secondary-color);
            font-style: italic;
        }
        
        .stock-footer {
            padding: var(--spacing-md) var(--spacing-lg);
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--light-color);
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        .btn-mini {
            background: none;
            border: none;
            color: var(--secondary-color);
            font-size: 0.85rem;
            cursor: pointer;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--border-radius-sm);
            transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        
        .btn-mini:hover {
            background-color: rgba(29, 169, 119, 0.1);
            color: var(--primary-color);
        }
        
        .dino-error {
            background-color: rgba(231, 76, 60, 0.1);
            color: var(--danger-color);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--border-radius-md);
            margin-bottom: var(--spacing-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            opacity: 1;
            transition: opacity var(--transition-medium);
        }
        
        /* Flash animations for price updates */
        .flash-green {
            animation: flashGreen 1s ease;
        }
        
        .flash-red {
            animation: flashRed 1s ease;
        }
        
        @keyframes flashGreen {
            0%, 100% { color: inherit; }
            50% { color: var(--success-color); }
        }
        
        @keyframes flashRed {
            0%, 100% { color: inherit; }
            50% { color: var(--danger-color); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .dino-stocks-list {
                grid-template-columns: 1fr;
            }
            
            .tab-button {
                padding: var(--spacing-xs) var(--spacing-sm);
                font-size: 0.8rem;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStockData();
    addStockStyles();
});

// If the document is already loaded, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initStockData();
    addStockStyles();
}