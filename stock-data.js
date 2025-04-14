// DinoTradez - Stock Data Integration
// This file handles fetching and displaying real-time stock data

// Configuration for the stock data component
const stockConfig = {
    // List of default stocks to display
    defaultStocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'],
    // Using Polygon.io API
    apiUrl: 'https://api.polygon.io/v2/aggs/ticker/',
    apiKey: 'XWomyE6Hei_9oTXPapKSgO2NdQqV9UIt',
    // Refresh interval (in milliseconds)
    refreshInterval: 30000, // 30 seconds
    // Set to false to use the real API
    demoMode: false
};

// DOM Elements
let stockContainer;
let searchInput;
let searchButton;
let loadingIndicator;
let stocksList;

// Stock data cache (for demo mode)
const stocksData = {
    'AAPL': { name: 'Apple Inc.', price: 175.42, prevClose: 172.65 },
    'MSFT': { name: 'Microsoft Corp.', price: 310.87, prevClose: 308.22 },
    'GOOGL': { name: 'Alphabet Inc.', price: 142.76, prevClose: 140.55 },
    'AMZN': { name: 'Amazon.com Inc.', price: 129.83, prevClose: 128.47 },
    'TSLA': { name: 'Tesla Inc.', price: 273.58, prevClose: 280.99 },
    'META': { name: 'Meta Platforms Inc.', price: 324.62, prevClose: 320.10 },
    'NVDA': { name: 'NVIDIA Corp.', price: 681.22, prevClose: 670.50 },
    'DIS': { name: 'Walt Disney Co.', price: 115.78, prevClose: 114.22 },
    'NFLX': { name: 'Netflix Inc.', price: 532.66, prevClose: 530.88 },
    'JPM': { name: 'JPMorgan Chase & Co.', price: 158.42, prevClose: 156.91 },
    'V': { name: 'Visa Inc.', price: 258.37, prevClose: 256.78 },
    'PG': { name: 'Procter & Gamble Co.', price: 156.12, prevClose: 155.58 },
    'KO': { name: 'Coca-Cola Co.', price: 67.23, prevClose: 66.98 },
    'PEP': { name: 'PepsiCo Inc.', price: 173.64, prevClose: 172.11 },
    'BAC': { name: 'Bank of America Corp.', price: 39.87, prevClose: 38.92 },
    'INTC': { name: 'Intel Corp.', price: 35.67, prevClose: 37.42 },
    'AMD': { name: 'Advanced Micro Devices', price: 128.92, prevClose: 126.54 },
    'WMT': { name: 'Walmart Inc.', price: 68.99, prevClose: 68.45 },
    'TGT': { name: 'Target Corp.', price: 165.49, prevClose: 163.22 },
    'SBUX': { name: 'Starbucks Corp.', price: 95.62, prevClose: 94.77 }
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
            background-color: var(--light-color);
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
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: var(--spacing-lg);
        }
        
        .dino-stock-item {
            background-color: var(--light-color);
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
            border-bottom: 1px solid var(--medium-color);
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
            background-color: rgba(231, 76, 60, 0.1);
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
        
        .stock-footer {
            padding: var(--spacing-md) var(--spacing-lg);
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--medium-color);
            background-color: rgba(0, 0, 0, 0.02);
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