// Market Intelligence Data Management
import { config, logMessage } from './config.js';

// Sample data for market intelligence sections (to be replaced with API calls)
const sampleData = {
    s3Offerings: [
        { ticker: 'PLUG', data: 'Filed S-3 on 2025-03-12 for $500M' },
        { ticker: 'SOFI', data: 'Filed S-3 on 2025-03-10 for $750M' },
        { ticker: 'LCID', data: 'Filed S-3 on 2025-03-08 for $1.2B' },
        { ticker: 'RIVN', data: 'Filed S-3 on 2025-03-05 for $2.0B' },
        { ticker: 'CHPT', data: 'Filed S-3 on 2025-03-01 for $350M' }
    ],
    highShortInterest: [
        { ticker: 'GME', data: 'Short Interest: 28.5%, Days to Cover: 4.2' },
        { ticker: 'AMC', data: 'Short Interest: 22.3%, Days to Cover: 3.8' },
        { ticker: 'BBBY', data: 'Short Interest: 19.7%, Days to Cover: 2.9' },
        { ticker: 'RIDE', data: 'Short Interest: 18.2%, Days to Cover: 3.1' },
        { ticker: 'NKLA', data: 'Short Interest: 17.5%, Days to Cover: 2.6' }
    ],
    darkPool: [
        { ticker: 'AAPL', data: 'Dark Pool Volume: 42.8%, Avg Price: $198.45' },
        { ticker: 'TSLA', data: 'Dark Pool Volume: 48.2%, Avg Price: $175.32' },
        { ticker: 'NVDA', data: 'Dark Pool Volume: 39.5%, Avg Price: $920.18' },
        { ticker: 'AMD', data: 'Dark Pool Volume: 44.7%, Avg Price: $152.30' },
        { ticker: 'MSFT', data: 'Dark Pool Volume: 38.9%, Avg Price: $415.75' }
    ]
};

// Function to fetch S-3 offerings data
async function fetchS3Offerings() {
    try {
        // In a real implementation, you would fetch this data from an API
        // For now, we'll use the sample data
        return sampleData.s3Offerings;
    } catch (error) {
        logMessage(`Error fetching S-3 offerings: ${error.message}`);
        return [];
    }
}

// Function to fetch high short interest data
async function fetchHighShortInterest() {
    try {
        // In a real implementation, you would fetch this data from an API
        // For now, we'll use the sample data
        return sampleData.highShortInterest;
    } catch (error) {
        logMessage(`Error fetching high short interest data: ${error.message}`);
        return [];
    }
}

// Function to fetch dark pool data
async function fetchDarkPoolData() {
    try {
        // In a real implementation, you would fetch this data from an API
        // For now, we'll use the sample data
        return sampleData.darkPool;
    } catch (error) {
        logMessage(`Error fetching dark pool data: ${error.message}`);
        return [];
    }
}

// Function to update all market intelligence sections
async function updateMarketIntelligence() {
    try {
        // Update S-3 Offerings
        const s3Data = await fetchS3Offerings();
        const s3Container = document.getElementById('s3-offerings');
        if (s3Container && s3Data.length > 0) {
            s3Container.innerHTML = '';
            s3Data.forEach(item => {
                const element = document.createElement('div');
                element.classList.add('intelligence-item');
                element.innerHTML = `
                    <span class="ticker">${item.ticker}</span>
                    <span class="data">${item.data}</span>
                `;
                s3Container.appendChild(element);
            });
        }
        
        // Update High Short Interest
        const shortData = await fetchHighShortInterest();
        const shortContainer = document.getElementById('high-short-interest');
        if (shortContainer && shortData.length > 0) {
            shortContainer.innerHTML = '';
            shortData.forEach(item => {
                const element = document.createElement('div');
                element.classList.add('intelligence-item');
                element.innerHTML = `
                    <span class="ticker">${item.ticker}</span>
                    <span class="data">${item.data}</span>
                `;
                shortContainer.appendChild(element);
            });
        }
        
        // Update Dark Pool
        const darkPoolData = await fetchDarkPoolData();
        const darkPoolContainer = document.getElementById('dark-pool');
        if (darkPoolContainer && darkPoolData.length > 0) {
            darkPoolContainer.innerHTML = '';
            darkPoolData.forEach(item => {
                const element = document.createElement('div');
                element.classList.add('intelligence-item');
                element.innerHTML = `
                    <span class="ticker">${item.ticker}</span>
                    <span class="data">${item.data}</span>
                `;
                darkPoolContainer.appendChild(element);
            });
        }
        
        logMessage('Market intelligence updated successfully');
    } catch (error) {
        logMessage(`Error updating market intelligence: ${error.message}`);
    }
}

// Function to initialize the market intelligence data
function initMarketIntelligence() {
    // Update market intelligence initially
    updateMarketIntelligence();
    
    // Set interval for periodic updates
    setInterval(updateMarketIntelligence, config.marketIntelligenceUpdateInterval);
}

// Export the functions
export { initMarketIntelligence, updateMarketIntelligence };