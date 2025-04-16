// Main Application File
import { config, logMessage } from './config.js';
import { updateStockItems } from './stockData.js';
import { initMarketIntelligence } from './marketIntelligence.js';

// Function to initialize the application
function initApp() {
    logMessage('Initializing DinoTradez application...');
    
    try {
        // Get all stock elements
        const marketItems = document.querySelectorAll('.market-item');
        const watchlistItems = document.querySelectorAll('.watchlist-item');
        const lottoItems = document.querySelectorAll('.lotto-item');
        
        // Update all stock data initially
        updateAllStockData();
        
        // Initialize market intelligence
        initMarketIntelligence();
        
        // Set interval for periodic updates
        setInterval(updateAllStockData, config.updateInterval);
        
        // Setup page events
        setupEvents();
        
        logMessage('Application initialization complete');
    } catch (error) {
        logMessage(`Error initializing application: ${error.message}`);
    }
}

// Function to update all stock data
async function updateAllStockData() {
    logMessage('Updating all stock data...');
    
    try {
        // Update market overview items
        const marketItems = document.querySelectorAll('.market-item');
        if (marketItems.length > 0) {
            await updateStockItems(marketItems);
        }
        
        // Update watchlist items
        const watchlistItems = document.querySelectorAll('.watchlist-item');
        if (watchlistItems.length > 0) {
            await updateStockItems(watchlistItems);
        }
        
        // Update lotto items
        const lottoItems = document.querySelectorAll('.lotto-item');
        if (lottoItems.length > 0) {
            await updateStockItems(lottoItems);
        }
        
        // Update last refreshed time
        const now = new Date();
        logMessage(`Data update completed at ${now.toLocaleTimeString()}`);
    } catch (error) {
        logMessage(`Error updating stock data: ${error.message}`);
    }
}

// Function to setup page events
function setupEvents() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add manual refresh button functionality if present
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            updateAllStockData();
        });
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle API key configuration
function checkApiKey() {
    if (config.apiKey === 'YOUR_API_KEY_HERE') {
        const apiKeyWarning = document.createElement('div');
        apiKeyWarning.className = 'api-key-warning';
        apiKeyWarning.innerHTML = `
            <div class="warning-content">
                <h3>API Key Required</h3>
                <p>Please set your Alpha Vantage API key in the config.js file to enable live stock data.</p>
                <p>Get a free API key at <a href="https://www.alphavantage.co/support/#api-key" target="_blank">Alpha Vantage</a>.</p>
            </div>
        `;
        document.body.appendChild(apiKeyWarning);
        
        logMessage('WARNING: API key not configured. Using sample data only.');
    } else {
        logMessage('API key configured successfully. Using live stock data.');
    }
}

// Check API key on load
checkApiKey();