import pandas as pd
import yfinance as yf
import requests
from bs4 import BeautifulSoup as bs
import time
import re

# Configuration
min_avg_vol = 500000             # Minimum average daily volume threshold
threshold_change_percent = -2   # Only process tickers with changePercent less than this value

def scrape_stock_data():
    """Scrape stock data from centralcharts.com (from script #2)"""
    print("Scraping stock data from centralcharts.com...")
    start_time = time.time()
    pages = []
    for page_number in range(1, 26):
        url_start = 'https://www.centralcharts.com/en/price-list-ranking/'
        url_end = 'ALL/desc/ts_76-chix-us-nasdaq-otcbb--qc_3-previous-close-change?p='
        url = url_start + url_end + str(page_number)
        pages.append(url)
    
    values_list = []
    for page in pages:
        webpage = requests.get(page)
        soup = bs(webpage.text, 'html.parser')
        stock_table = soup.find('table', class_='tabMini tabQuotes')
        if stock_table:
            tr_tag_list = stock_table.find_all('tr')
            for each_tr_tag in tr_tag_list[1:]:
                td_tag_list = each_tr_tag.find_all('td')
                if len(td_tag_list) >= 9:
                    row_values = []
                    for each_td_tag in td_tag_list[0:9]:
                        new_value = each_td_tag.text.strip()
                        row_values.append(new_value)
                    values_list.append(row_values)
        else:
            print(f"No stock table found on page: {page}")
    
    print(f"Scraping completed in {time.time() - start_time:.2f} seconds")
    return values_list

def parse_scraped_data(values_list):
    """Convert scraped data to DataFrame and prepare for processing"""
    # Create column names based on typical structure of centralcharts.com tables
    column_names = [
        "securitiesInformationProcessorSymbolIdentifier",  # Ticker symbol
        "name",                                            # Company name
        "last",                                            # Last price
        "changePercent",                                   # Change percentage
        "changeValue",                                     # Change value
        "open",                                            # Open price
        "high",                                            # High price
        "low",                                             # Low price
        "volume"                                           # Volume
    ]
    
    # Create DataFrame from scraped data
    scraped_df = pd.DataFrame(values_list, columns=column_names)
    
    # Clean and convert data types
    scraped_df["changePercent"] = scraped_df["changePercent"].str.replace('%', '').str.replace(',', '.').astype(float)
    
    # Calculate average daily volume (use volume as a proxy if no specific average is provided)
    scraped_df["volume"] = scraped_df["volume"].str.replace(',', '').astype(float)
    scraped_df["averageDailyVolumeQuantity"] = scraped_df["volume"]
    
    return scraped_df

def filter_tickers(df):
    """Filter tickers based on volume and change percent criteria"""
    # Filter rows based on same criteria as original script
    filtered_df = df[
        (df["averageDailyVolumeQuantity"] >= min_avg_vol) &
        (df["changePercent"] < threshold_change_percent)
    ]
    
    # Further filter to only include tickers with less than 5 characters
    filtered_df = filtered_df[
        filtered_df["securitiesInformationProcessorSymbolIdentifier"]
        .str.strip().str.len() < 5
    ]
    
    return filtered_df

def get_ticker_data(ticker_list):
    """Get detailed data for each ticker using yfinance (from script #1)"""
    data = []
    print("Processing the following tickers:", ticker_list)
    
    # Process each ticker from the filtered list
    for ticker in ticker_list:
        try:
            ticker_obj = yf.Ticker(ticker)
            # Retrieve data for a 1-day period
            history = ticker_obj.history(period="1d")
            info = ticker_obj.info
            data.append({
                "ticker": ticker,
                "price_history": history,
                "shares_available": info.get("totalShares"),
                "authorized_shares": info.get("maxShares"),
                "volume": info.get("volume"),
                "relative_volume": info.get("relativeVolume"),
                "dollar_volume": info.get("marketCap"),
                "average_dollar_volume": info.get("avgDollarVolume"),
                "imbalance_trades": info.get("imbalanceTrades"),
                "market_cap": info.get("marketCap"),
                "market_cap_common_equity_ratio": info.get("marketCapCommonEquityRatio")
            })
            # Brief delay to help mitigate rate-limiting issues
            time.sleep(1)
        except Exception as e:
            print(f"There was an error processing ticker {ticker}: {e}")
    
    return data

def main():
    # Step 1: Scrape stock data from centralcharts.com
    scraped_data = scrape_stock_data()
    
    # Step 2: Parse the scraped data into a usable DataFrame
    tickers_df = parse_scraped_data(scraped_data)
    
    # Step 3: Filter tickers based on volume and change percent criteria
    filtered_df = filter_tickers(tickers_df)
    
    # Step 4: Extract ticker symbols from the filtered DataFrame
    tickers_list = filtered_df["securitiesInformationProcessorSymbolIdentifier"].dropna().tolist()
    
    if not tickers_list:
        print("No tickers met the filtering criteria.")
        return
    
    # Step 5: Get detailed data for each ticker using yfinance
    ticker_data = get_ticker_data(tickers_list)
    
    # Step 6: Create a DataFrame from the collected data
    df = pd.DataFrame(ticker_data)
    
    # Step 7: Filter for stocks with significant imbalance trades
    if not df.empty:
        # Filter for imbalance trades if the column exists and has values
        if "imbalance_trades" in df.columns and not df["imbalance_trades"].isna().all():
            imbalance_trades_df = df[df["imbalance_trades"] > 100]
            print("\nStocks with Imbalance Trades Greater Than 100:")
            if not imbalance_trades_df.empty:
                print(imbalance_trades_df[['ticker', 'imbalance_trades']].head())
            else:
                print("No stocks found with imbalance trades greater than 100.")
        
        # Display the results
        print("\nFetched data for filtered tickers:")
        print(df.head())
    else:
        print("No data was collected for the filtered tickers.")

if __name__ == "__main__":
    main()