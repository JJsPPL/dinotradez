// Stock Data Fetching and Management
import { config, logMessage } from './config.js';

// Function to fetch stock data from Alpha Vantage
async function getStockQuote(symbol) {
    try {
        const url = `${config.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${config.apiKey}`;
        logMessage(`Fetching stock data for ${symbol}...`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we got valid data back
        if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
            return data['Global Quote'];
        } else if (data.Note) {
            // API limit reached or other issue noted by Alpha Vantage
            logMessage(`API message: ${data.Note}`);
            return null;
        } else {
            logMessage(`No data returned for ${symbol}`);
            return null;
        }
    } catch (error) {
        logMessage(`Error fetching stock data for ${symbol}: ${error.message}`);
        return null;
    }
}

// Function to fetch crypto data
async function getCryptoQuote(symbol) {
    try {
        // For crypto, we'll use a different endpoint
        const url = `${config.baseUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol.split('-')[0]}&to_currency=USD&apikey=${config.apiKey}`;
        logMessage(`Fetching crypto data for ${symbol}...`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data['Realtime Currency Exchange Rate']) {
            const quote = data['Realtime Currency Exchange Rate'];
            // Transform the data to match our stock quote structure
            return {
                '01. symbol': symbol,
                '05. price': quote['5. Exchange Rate'],
                '09. change': '0', // Alpha Vantage doesn't provide change for crypto in this endpoint
                '10. change percent': '0%'
            };
        } else if (data.Note) {
            logMessage(`API message: ${data.Note}`);
            return null;
        } else {
            logMessage(`No data returned for ${symbol}`);
            return null;
        }
    } catch (error) {
        logMessage(`Error fetching crypto data for ${symbol}: ${error.message}`);
        return null;
    }
}

// Function to get short interest data
async function getShortInterestData(symbol) {
    try {
        // This is where you would fetch short interest data
        // Since Alpha Vantage doesn't provide this directly, you'd need another API
        // For now, we'll simulate it with random data
        
        const shortRatio = (Math.random() * 10).toFixed(2);
        const shortChange = (Math.random() * 6 - 3).toFixed(2);
        
        return {
            shortRatio: shortRatio,
            shortChange: shortChange
        };
    } catch (error) {
        logMessage(`Error fetching short interest data for ${symbol}: ${error.message}`);
        return {
            shortRatio: 'N/A',
            shortChange: 'N/A'
        };
    }
}

// Function to update a single stock/market item
async function updateStockItem(element) {
    try {
        const symbol = element.dataset.symbol;
        if (!symbol) {
            logMessage('No symbol found for element');
            return;
        }
        
        // Determine if this is a crypto symbol
        const isCrypto = symbol.includes('-USD');
        
        // Fetch the appropriate data
        const quoteData = isCrypto ? await getCryptoQuote(symbol) : await getStockQuote(symbol);
        
        if (!quoteData) {
            logMessage(`No data returned for ${symbol}`);
            return;
        }
        
        // Update price
        const priceElement = element.querySelector('.stock-price');
        if (priceElement) {
            const price = parseFloat(quoteData['05. price']).toFixed(2);
            priceElement.textContent = `$${price}`;
        }
        
        // Update change
        const changeElement = element.querySelector('.stock-change');
        if (changeElement) {
            let change = quoteData['09. change'] || '0';
            let changePercent = quoteData['10. change percent'] || '0%';
            
            // Format the numbers
            change = parseFloat(change).toFixed(2);
            if (!changePercent.includes('%')) {
                changePercent = parseFloat(changePercent).toFixed(2) + '%';
            }
            
            changeElement.textContent = `${change > 0 ? '+' : ''}${change} (${changePercent})`;
            
            // Add color styling based on change
            if (parseFloat(change) > 0) {
                changeElement.classList.add('positive-change');
                changeElement.classList.remove('negative-change');
            } else if (parseFloat(change) < 0) {
                changeElement.classList.add('negative-change');
                changeElement.classList.remove('positive-change');
            } else {
                changeElement.classList.remove('positive-change', 'negative-change');
            }
        }
        
        // Update short interest data if this is a watchlist item
        if (element.classList.contains('watchlist-item')) {
            const shortData = await getShortInterestData(symbol);
            
            const shortRatioElement = element.querySelector('.short-ratio');
            if (shortRatioElement && shortData.shortRatio) {
                shortRatioElement.textContent = `Short Ratio: ${shortData.shortRatio}`;
            }
            
            const shortChangeElement = element.querySelector('.short-change');
            if (shortChangeElement && shortData.shortChange) {
                const shortChangeValue = parseFloat(shortData.shortChange);
                const prefix = shortChangeValue > 0 ? '+' : '';
                shortChangeElement.textContent = `Short Change: ${prefix}${shortData.shortChange}%`;
                
                if (shortChangeValue > 0) {
                    shortChangeElement.classList.add('positive-change');
                    shortChangeElement.classList.remove('negative-change');
                } else if (shortChangeValue < 0) {
                    shortChangeElement.classList.add('negative-change');
                    shortChangeElement.classList.remove('positive-change');
                }
            }
        }
    } catch (error) {
        logMessage(`Error updating element for ${element.dataset.symbol}: ${error.message}`);
    }
}

// Function to update all stock items in a collection
async function updateStockItems(elements) {
    const updatePromises = [];
    
    // Process in small batches to avoid API rate limits
    const batchSize = 5;
    for (let i = 0; i < elements.length; i += batchSize) {
        const batch = Array.from(elements).slice(i, i + batchSize);
        
        // Process this batch
        for (const element of batch) {
            updatePromises.push(updateStockItem(element));
        }
        
        // Wait for this batch to complete before continuing
        await Promise.allSettled(updatePromises);
        
        // If we have more items to process, add a delay
        if (i + batchSize < elements.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Export the functions
export { getStockQuote, getCryptoQuote, getShortInterestData, updateStockItem, updateStockItems };