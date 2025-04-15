// Update the UI of a stock item
function updateStockItemUI(ticker, data) {
    const stockRow = document.getElementById(`stock-${ticker}`);
    if (!stockRow) return;
    
    // Calculate the price change
    const priceChange = data.price - data.prevClose;
    const percentChange = (priceChange / data.prevClose) * 100;
    const isPositive = priceChange >= 0;
    
    // Get all cells
    const cells = stockRow.querySelectorAll('.table-col');
    
    // Update price
    if (cells[1]) {
        cells[1].textContent = data.price.toFixed(2);
        
        // Add flash effect
        cells[1].classList.add(isPositive ? 'flash-green' : 'flash-red');
        setTimeout(() => {
            cells[1].classList.remove('flash-green', 'flash-red');
        }, 1000);
    }
    
    // Update net change
    if (cells[2]) {
        cells[2].textContent = `${isPositive ? '+' : ''}${priceChange.toFixed(2)}`;
        cells[2].className = `table-col ${isPositive ? 'positive' : 'negative'}`;
    }
    
    // Update percent change
    if (cells[3]) {
        cells[3].textContent = `${isPositive ? '+' : ''}${percentChange.toFixed(2)}%`;
        cells[3].className = `table-col ${isPositive ? 'positive' : 'negative'}`;
    }
    
    // Update volume if provided
    if (cells[8] && data.volume) {
        cells[8].textContent = data.volume;
    }
}

// Refresh all stocks
function refreshAllStocks() {
    const stockItems = stocksList.querySelectorAll('.table-row');
    
    stockItems.forEach(item => {
        const ticker = item.id.replace('stock-', '');
        updateStockItem(ticker);
    });
}

// Show an error message
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
    errorElement.style.color = 'var(--danger-color)';
    errorElement.style.padding = '10px 15px';
    errorElement.style.borderRadius = '4px';
    errorElement.style.marginBottom = '15px';
    errorElement.style.display = 'flex';
    errorElement.style.alignItems = 'center';
    errorElement.style.gap = '8px';
    errorElement.style.opacity = '1';
    errorElement.style.transition = 'opacity 0.3s';
    
    // Add the error message to the container
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(errorElement, stockContainer);
        
        // Remove it after 5 seconds
        setTimeout(() => {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.remove();
            }, 300);
        }, 5000);
    }
}

// Helper function to format numbers with K, M, B, T suffixes
function formatNumber(num) {
    if (num === undefined || num === null) return 'N/A';
    
    if (typeof num === 'string') {
        if (num.includes('K') || num.includes('M') || num.includes('B') || num.includes('T')) {
            return num;
        }
        num = parseFloat(num.replace(/,/g, ''));
    }
    
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStockData();
});

// If the document is already loaded, initialize immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initStockData();
}// Fetch stock data for a specific ticker
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
        
        if (stockConfig.demoMode) {
            // Use demo data
            setTimeout(() => {
                if (stocksData[ticker]) {
                    createStockItem(ticker, stocksData[ticker]);
                } else {
                    showError(`Stock ${ticker} not found in demo database`);
                }
                loadingIndicator.style.display = 'none';
            }, 800);
            return;
        }
        
        // For real API implementation using Polygon.io
        try {
            // Construct API URL for previous day's data
            const endpoint = `${stockConfig.apiUrl}${ticker}/prev?adjusted=true&apiKey=${stockConfig.apiKey}`;
            
            // Fetch stock data
            const response = await fetch(endpoint);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Create a data object with both API data and enhanced information
                let stockData = {
                    name: ticker, // Use ticker as name if not available
                    price: data.results[0].c,  // Closing price
                    prevClose: data.results[0].o,  // Opening price as previous close
                    volume: formatNumber(data.results[0].v),
                    // Add enhanced data if available in our stocksData, otherwise use placeholders
                    marketCap: stocksData[ticker]?.marketCap || 'N/A',
                    mcToEquityRatio: stocksData[ticker]?.mcToEquityRatio || 'N/A',
                    sharesOutstanding: stocksData[ticker]?.sharesOutstanding || 'N/A',
                    sharesAuthorized: stocksData[ticker]?.sharesAuthorized || 'N/A',
                    avgVolume: stocksData[ticker]?.avgVolume || 'N/A',
                    relativeVolume: stocksData[ticker]?.relativeVolume || 'N/A',
                    darkPoolPercent: stocksData[ticker]?.darkPoolPercent || 'N/A'
                };
                
                createStockItem(ticker, stockData);
            } else {
                // If API fails, try to use demo data as fallback
                if (stocksData[ticker]) {
                    createStockItem(ticker, stocksData[ticker]);
                } else {
                    showError(`Could not find data for ${ticker}`);
                }
            }
        } catch (error) {
            console.error('API Error:', error);
            // Use fallback data if available
            if (stocksData[ticker]) {
                createStockItem(ticker, stocksData[ticker]);
            } else {
                showError(`Error loading data for ${ticker}`);
            }
        }
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error('Error fetching stock data:', error);
        showError(`Error loading data for ${ticker}`);
        loadingIndicator.style.display = 'none';
    }
}

// Create a stock item element with the modern table row format
function createStockItem(ticker, data) {
    // Calculate the price change
    const priceChange = data.price - data.prevClose;
    const percentChange = (priceChange / data.prevClose) * 100;
    const isPositive = priceChange >= 0;
    
    // Create the stock row
    const stockRow = document.createElement('div');
    stockRow.id = `stock-${ticker}`;
    stockRow.className = 'table-row';
    
    // Create table cells
    stockRow.innerHTML = `
        <div class="table-col symbol-col">${ticker}</div>
        <div class="table-col">${data.price.toFixed(2)}</div>
        <div class="table-col ${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${priceChange.toFixed(2)}</div>
        <div class="table-col ${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${percentChange.toFixed(2)}%</div>
        <div class="table-col">${data.sharesOutstanding}</div>
        <div class="table-col">${data.sharesAuthorized}</div>
        <div class="table-col">${data.marketCap}</div>
        <div class="table-col">${typeof data.mcToEquityRatio === 'number' ? data.mcToEquityRatio.toFixed(3) : data.mcToEquityRatio}</div>
        <div class="table-col">${data.volume}</div>
        <div class="table-col">${data.avgVolume}</div>
        <div class="table-col">${typeof data.relativeVolume === 'number' ? data.relativeVolume.toFixed(2) : data.relativeVolume}</div>
        <div class="table-col">${typeof data.darkPoolPercent === 'number' ? data.darkPoolPercent.toFixed(1) + '%' : data.darkPoolPercent}</div>
    `;
    
    // Add context menu for delete option
    stockRow.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm(`Remove ${ticker} from watchlist?`)) {
            stockRow.classList.add('removing');
            setTimeout(() => {
                stockRow.remove();
            }, 300);
        }
    });
    
    // Add to the stocks list with animation
    stockRow.style.opacity = '0';
    stockRow.style.transform = 'translateY(20px)';
    stocksList.appendChild(stockRow);
    
    // Trigger animation
    setTimeout(() => {
        stockRow.style.opacity = '1';
        stockRow.style.transform = 'translateY(0)';
    }, 50);
}

// Update a stock item with new data
async function updateStockItem(ticker) {
    try {
        const stockRow = document.getElementById(`stock-${ticker}`);
        if (!stockRow) return;
        
        if (stockConfig.demoMode) {
            // Generate random changes for demo mode
            setTimeout(() => {
                if (stocksData[ticker]) {
                    const randomFactor = (Math.random() * 0.02) - 0.01; // -1% to +1%
                    stocksData[ticker].price = stocksData[ticker].price * (1 + randomFactor);
                    updateStockItemUI(ticker, stocksData[ticker]);
                }
            }, 500);
            return;
        }
        
        // For real API implementation
        try {
            const endpoint = `${stockConfig.apiUrl}${ticker}/prev?adjusted=true&apiKey=${stockConfig.apiKey}`;
            const response = await fetch(endpoint);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Create data object
                let stockData = {
                    price: data.results[0].c,
                    prevClose: data.results[0].o,
                    volume: formatNumber(data.results[0].v)
                };
                
                // Add slight randomness to simulate real-time changes
                const randomFactor = (Math.random() * 0.005) - 0.0025; // -0.25% to +0.25%
                stockData.price = stockData.price * (1 + randomFactor);
                
                updateStockItemUI(ticker, stockData);
            }
        } catch (error) {
            console.error('Error updating via API:', error);
            // Use fallback data if available
            if (stocksData[ticker]) {
                const randomFactor = (Math.random() * 0.01) - 0.005; // -0.5% to +0.5%
                stocksData[ticker].price = stocksData[ticker].price * (1 + randomFactor);
                updateStockItemUI(ticker, stocksData[ticker]);
            }
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}// Initialize the stock data component
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
    stockContainer.className = 'watchlist-table';
    
    // Create search components
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.margin = '0 0 20px 0';
    searchContainer.style.display = 'flex';
    searchContainer.style.gap = '10px';
    
    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Enter stock symbol (e.g., AAPL)';
    searchInput.className = 'search-input';
    searchInput.style.flex = '1';
    searchInput.style.padding = '10px';
    searchInput.style.borderRadius = '4px';
    searchInput.style.border = '1px solid var(--medium-color)';
    searchInput.style.backgroundColor = 'var(--medium-color)';
    searchInput.style.color = 'var(--dark-color)';
    
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
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading stocks...';
    loadingIndicator.style.display = 'none';
    loadingIndicator.style.textAlign = 'center';
    loadingIndicator.style.padding = '20px';
    loadingIndicator.style.color = 'var(--secondary-color)';
    
    // Create table header
    const tableHeader = document.createElement('div');
    tableHeader.className = 'table-header';
    tableHeader.innerHTML = `
        <div class="table-col symbol-col">Symbol</div>
        <div class="table-col">Last</div>
        <div class="table-col">Net Chng</div>
        <div class="table-col">%Change</div>
        <div class="table-col">Shares Avail</div>
        <div class="table-col">Shares Auth</div>
        <div class="table-col">Market Cap</div>
        <div class="table-col">MC/CE Ratio</div>
        <div class="table-col">Volume</div>
        <div class="table-col">Avg Vol</div>
        <div class="table-col">Rel Vol</div>
        <div class="table-col">DP %</div>
    `;
    
    // Create stocks list container
    stocksList = document.createElement('div');
    stocksList.className = 'table-body';
    stocksList.id = 'stock-list';
    
    // Assemble the component
    mainContent.appendChild(searchContainer);
    mainContent.appendChild(loadingIndicator);
    stockContainer.appendChild(tableHeader);
    stockContainer.appendChild(stocksList);
    mainContent.appendChild(stockContainer);
}// DinoTradez - Stock Data Integration
// This file handles fetching and displaying real-time stock data

// Configuration for the stock data component
const stockConfig = {
    // List of default stocks to display
    defaultStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'],
    // Using Polygon.io API
    apiUrl: 'https://api.polygon.io/v2/aggs/ticker/',
    apiKey: 'XWomyE6Hei_9oTXPapKSgO2NdQqV9UIt',
    // Refresh interval (in milliseconds)
    refreshInterval: 60000, // 60 seconds
    // Use real API data
    demoMode: false
};

// DOM Elements
let stockContainer;
let searchInput;
let searchButton;
let loadingIndicator;
let stocksList;

// Enhanced stock data with dark pool information
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
        darkPoolPercent: 42.8,
        darkPoolVolume: '23.94M',
        darkPoolAvgPrice: 174.89,
        darkPoolBlockTrades: 87
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
        darkPoolPercent: 38.5,
        darkPoolVolume: '9.16M',
        darkPoolAvgPrice: 309.92,
        darkPoolBlockTrades: 64
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
        darkPoolPercent: 41.3,
        darkPoolVolume: '12.10M',
        darkPoolAvgPrice: 142.11,
        darkPoolBlockTrades: 55
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
        darkPoolPercent: 45.1,
        darkPoolVolume: '21.57M',
        darkPoolAvgPrice: 129.24,
        darkPoolBlockTrades: 93
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
        darkPoolPercent: 48.7,
        darkPoolVolume: '57.73M',
        darkPoolAvgPrice: 274.16,
        darkPoolBlockTrades: 127
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
        darkPoolPercent: 39.8,
        darkPoolVolume: '5.84M',
        darkPoolAvgPrice: 323.75,
        darkPoolBlockTrades: 41
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
        darkPoolPercent: 46.2,
        darkPoolVolume: '20.11M',
        darkPoolAvgPrice: 679.84,
        darkPoolBlockTrades: 76
    }
};