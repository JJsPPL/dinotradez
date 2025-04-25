
/**
 * Fetches stock data from Yahoo Finance API via RapidAPI.
 * @param {string} ticker - The stock ticker (e.g., 'AAPL')
 * @returns {Promise<Object>} - Stock data object or null if not found
 */
export async function fetchStockData(ticker) {
    const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote?ticker=${ticker}&type=STOCKS`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
            'x-rapidapi-key': '48b0ef34e6msh9fe72fb5f0d3e4ap126332jsn1e6298c105ee'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (data && data.body && data.body.length > 0) {
            return data.body[0];
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
    return null;
}
