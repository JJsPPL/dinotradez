// DinoTradez - Main JavaScript File

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DinoTradez application initialized');
    
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeSearchFunctionality();
    initializeMarketUpdates();
    initializeShortInterestFilter();
    initializeResponsiveTables();
});

// Mobile Navigation
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.navbar-menu a, .mobile-menu a');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            if (mobileMenu.classList.contains('active')) {
                mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Set active link based on current scroll position
    window.addEventListener('scroll', function() {
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// Dark/Light Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('dinoTheme');
    
    // Default to dark theme if no saved preference
    if (!savedTheme || savedTheme === 'dark') {
        // Dark theme is default, no need to add class
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        // Light theme
        body.classList.add('light-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('light-theme');
            
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('dinoTheme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                localStorage.setItem('dinoTheme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Stock Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const stockTable = document.querySelector('.stock-watchlist .data-table tbody');
    
    if (!searchInput || !searchButton || !stockTable) return;
    
    // Helper function to show messages
    function showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type}`;
        messageEl.textContent = message;
        messageEl.style.position = 'fixed';
        messageEl.style.top = '20px';
        messageEl.style.right = '20px';
        messageEl.style.padding = '10px 20px';
        messageEl.style.borderRadius = '4px';
        messageEl.style.zIndex = '9999';
        messageEl.style.transition = 'opacity 0.3s ease';
        
        if (type === 'error') {
            messageEl.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
        } else if (type === 'success') {
            messageEl.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
        } else {
            messageEl.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
        }
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 3000);
    }

    // Add stock to the watchlist (now fetches from API)
    async function addStockToWatchlist(ticker) {
        ticker = ticker.toUpperCase();
        console.log("Searching for ticker:", ticker); // DEBUG

        // Check if stock already exists in the table
        const existingRows = stockTable.querySelectorAll('tr');
        for (let row of existingRows) {
            if (row.querySelector('td').textContent === ticker) {
                showMessage(`${ticker} is already in your watchlist`, 'info');
                return;
            }
        }

        // Fetch live stock data
        showMessage(`Fetching data for ${ticker}...`, 'info');
        let stockData;
        try {
            // Use from window
            stockData = await window.fetchStockData(ticker);
            console.log("Raw API response for", ticker, ":", stockData); // DEBUG
        } catch (e) {
            console.error("API call failed for ticker", ticker, e); // DEBUG
            showMessage(`API failed for ${ticker}: ${e}`, 'error');
            return;
        }
        if (!stockData) {
            console.warn("No stock data returned for", ticker); // DEBUG
            showMessage(`Stock ${ticker} not found`, 'error');
            return;
        }
        // Some fields might not be available, check for their presence!
        const isPositive = stockData.change >= 0;
        const price = stockData.price || stockData.ask || 0;
        const netChange = stockData.change || 0;
        const percentChange = stockData.changesPercentage || 0;
        const shares = stockData.sharesOutstanding || '-';
        const auth = '-';
        const marketCap = stockData.marketCap || '-';
        const mcRatio = '-';
        const volume = stockData.volume || '-';
        const avgVol = stockData.avgVolume || '-';
        const relVol = '-';
        const dp = '-';
        // Dummy values for Short Ratio - you should plug in real API data here if available
        const shortRatio = stockData.shortRatio || (Math.random() * 4 + 0.5).toFixed(2);
        const prevShortRatio = stockData.prevShortRatio || (shortRatio * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2);
        const percShortChange = prevShortRatio !== 0 ? (((shortRatio - prevShortRatio) / prevShortRatio) * 100).toFixed(1) : "0.0";
        const shortRatioClass = percShortChange >= 0 ? 'positive' : 'negative';

        // Create row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="symbol-col">${ticker}</td>
            <td>${Number(price).toFixed(2)}</td>
            <td class="${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${Number(netChange).toFixed(2)}</td>
            <td class="${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${Number(percentChange).toFixed(2)}%</td>
            <td>${shares}</td>
            <td>${auth}</td>
            <td>${marketCap}</td>
            <td>${mcRatio}</td>
            <td>${volume}</td>
            <td>${avgVol}</td>
            <td>${relVol}</td>
            <td>${dp}</td>
            <td>${shortRatio}</td>
            <td class="${shortRatioClass}">${percShortChange > 0 ? '+' : ''}${percShortChange}%</td>
        `;

        // Add right-click to remove
        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Remove ${ticker} from watchlist?`)) {
                row.classList.add('removing');
                setTimeout(() => {
                    row.remove();
                    showMessage(`${ticker} removed from watchlist`, 'success');
                }, 300);
            }
        });

        // Add to table with animation
        row.style.opacity = '0';
        stockTable.appendChild(row);
        setTimeout(() => {
            row.style.opacity = '1';
        }, 50);

        showMessage(`${ticker} added to watchlist`, 'success');
    }

    // Event listeners
    searchButton.addEventListener('click', () => {
        const ticker = searchInput.value.trim();
        if (ticker) {
            addStockToWatchlist(ticker);
            searchInput.value = '';
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const ticker = searchInput.value.trim();
            if (ticker) {
                addStockToWatchlist(ticker);
                searchInput.value = '';
            }
        }
    });
}

// Simulate Market Data Updates
function initializeMarketUpdates() {
    // Get all market cards
    const marketValues = document.querySelectorAll('.market-value');
    const marketChanges = document.querySelectorAll('.market-change');
    
    // Update values every 10 seconds
    setInterval(() => {
        marketValues.forEach((value, index) => {
            // Get current value
            let currentValue = parseFloat(value.textContent.replace(',', ''));
            
            // Generate random change (-0.5% to +0.5%)
            const changePercent = (Math.random() - 0.45) * 1;
            const changeAmount = currentValue * (changePercent / 100);
            const newValue = currentValue + changeAmount;
            
            // Update the displayed value
            value.textContent = newValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            
            // Update the change display
            if (marketChanges[index]) {
                const change = marketChanges[index];
                const isPositive = changeAmount >= 0;
                
                change.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
                const changeText = change.querySelector('p');
                if (changeText) {
                    changeText.textContent = `${isPositive ? '+' : ''}${changeAmount.toFixed(2)} (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`;
                }
            }
        });

        // New: Update BTC, Gold, Yield cards
        const btcValueEl = document.getElementById('btc-value');
        const btcChangeEl = document.getElementById('btc-change');
        if (btcValueEl && btcChangeEl) {
            let val = Number(btcValueEl.textContent.replace(/,/g, ''));
            const change = ((Math.random() - 0.45) * 1000);
            val += change;
            btcValueEl.textContent = val.toLocaleString(undefined, {maximumFractionDigits: 2});
            const isPos = change >= 0;
            btcChangeEl.className = `market-change ${isPos ? 'positive' : 'negative'}`;
            btcChangeEl.querySelector('p').textContent = `${isPos ? '+' : ''}${change.toFixed(0)} (${isPos ? '+' : ''}${(change/val*100).toFixed(1)}%)`;
        }
        const goldValueEl = document.getElementById('gold-value');
        const goldChangeEl = document.getElementById('gold-change');
        if (goldValueEl && goldChangeEl) {
            let val = Number(goldValueEl.textContent.replace(/,/g, ''));
            const change = ((Math.random() - 0.5) * 10);
            val += change;
            goldValueEl.textContent = val.toLocaleString(undefined, {maximumFractionDigits: 2});
            const isPos = change >= 0;
            goldChangeEl.className = `market-change ${isPos ? 'positive' : 'negative'}`;
            goldChangeEl.querySelector('p').textContent = `${isPos ? '+' : ''}${change.toFixed(0)} (${isPos ? '+' : ''}${(change/val*100).toFixed(1)}%)`;
        }
        const yieldValueEl = document.getElementById('yield-value');
        const yieldChangeEl = document.getElementById('yield-change');
        if (yieldValueEl && yieldChangeEl) {
            let val = Number(yieldValueEl.textContent);
            const change = ((Math.random() - 0.5) * 0.05);
            val += change;
            yieldValueEl.textContent = val.toFixed(2);
            const isPos = change >= 0;
            yieldChangeEl.className = `market-change ${isPos ? 'positive' : 'negative'}`;
            yieldChangeEl.querySelector('p').textContent = `${isPos ? '+' : ''}${change.toFixed(2)} (${isPos ? '+' : ''}${(change/val*100).toFixed(2)}%)`;
        }
    }, 10000); // Update every 10 seconds
    
    // Also update the stock prices in the tables
    setInterval(() => {
        // Get all tables
        const tables = document.querySelectorAll('.data-table');
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                // Get price cell (second column)
                const priceCell = row.querySelector('td:nth-child(2)');
                if (!priceCell) return;
                
                // Get current price
                const currentPrice = parseFloat(priceCell.textContent);
                if (isNaN(currentPrice)) return;
                
                // Generate random change (-0.5% to +0.5%)
                const changePercent = (Math.random() - 0.45) * 1;
                const changeAmount = currentPrice * (changePercent / 100);
                const newPrice = currentPrice + changeAmount;
                
                // Update price cell
                priceCell.textContent = newPrice.toFixed(2);
                
                // Update change cells (3rd and 4th columns)
                const netChangeCell = row.querySelector('td:nth-child(3)');
                const percentChangeCell = row.querySelector('td:nth-child(4)');
                
                if (netChangeCell && percentChangeCell) {
                    // Get current values
                    let netChange = parseFloat(netChangeCell.textContent.replace(/[+\-]/, ''));
                    let percentChange = parseFloat(percentChangeCell.textContent.replace(/[+\-]/, '').replace('%', ''));
                    
                    // Adjust with new random values
                    netChange = netChange + changeAmount;
                    percentChange = percentChange + changePercent;
                    
                    // Determine if positive or negative
                    const isPositive = netChange >= 0;
                    
                    // Update cells
                    netChangeCell.textContent = `${isPositive ? '+' : ''}${netChange.toFixed(2)}`;
                    netChangeCell.className = isPositive ? 'positive' : 'negative';
                    
                    percentChangeCell.textContent = `${isPositive ? '+' : ''}${percentChange.toFixed(2)}%`;
                    percentChangeCell.className = isPositive ? 'positive' : 'negative';
                }
            });
        });
    }, 15000); // Update every 15 seconds
}

// Initialize filtering for the High Short Interest section
function initializeShortInterestFilter() {
    // Get the filter checkboxes
    const lottoFilter = document.getElementById('lotto-filter');
    const volumeFilter = document.getElementById('volume-filter');
    
    // Get all short interest items
    const shortItems = document.querySelectorAll('.short-interest-item');
    
    // Apply filters when checkboxes change
    if (lottoFilter) {
        lottoFilter.addEventListener('change', applyFilters);
    }
    
    if (volumeFilter) {
        volumeFilter.addEventListener('change', applyFilters);
    }
    
    // Initial filter application
    applyFilters();
    
    // Filter function
    function applyFilters() {
        const showLotto = lottoFilter?.checked ?? true;
        const showHighVolume = volumeFilter?.checked ?? true;
        
        shortItems.forEach(item => {
            const isLotto = item.classList.contains('lotto');
            const volumeText = item.querySelector('.short-column:nth-child(4)').textContent;
            const volume = parseFloat(volumeText.replace(/[^0-9.]/g, ''));
            const isHighVolume = volumeText.includes('M') && volume >= 1;
            
            // Show item if:
            // 1. It's a lotto pick and lotto filter is on, OR it's not a lotto pick and lotto filter is off
            // 2. It has high volume and volume filter is on, OR volume filter is off
            const showItem = 
                (isLotto && showLotto || !isLotto && !showLotto) &&
                (isHighVolume && showHighVolume || !showHighVolume);
            
            item.style.display = showItem ? '' : 'none';
        });
    }
}

// Make tables more responsive
function initializeResponsiveTables() {
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        const headerCells = table.querySelectorAll('th');
        
        // Add responsive behavior for smaller screens
        if (window.innerWidth < 768) {
            // On smaller screens, show fewer columns
            headerCells.forEach((cell, index) => {
                if (index > 5) {
                    cell.style.display = 'none';
                    
                    // Hide corresponding data cells
                    const columnCells = table.querySelectorAll(`td:nth-child(${index + 1})`);
                    columnCells.forEach(dataCell => {
                        dataCell.style.display = 'none';
                    });
                }
            });
        }
    });
    
    // Listen for window resize
    window.addEventListener('resize', () => {
        tables.forEach(table => {
            const headerCells = table.querySelectorAll('th');
            
            if (window.innerWidth < 768) {
                // On smaller screens, show fewer columns
                headerCells.forEach((cell, index) => {
                    if (index > 5) {
                        cell.style.display = 'none';
                        
                        // Hide corresponding data cells
                        const columnCells = table.querySelectorAll(`td:nth-child(${index + 1})`);
                        columnCells.forEach(dataCell => {
                            dataCell.style.display = 'none';
                        });
                    }
                });
            } else {
                // On larger screens, show all columns
                headerCells.forEach((cell, index) => {
                    cell.style.display = '';
                    
                    // Show corresponding data cells
                    const columnCells = table.querySelectorAll(`td:nth-child(${index + 1})`);
                    columnCells.forEach(dataCell => {
                        dataCell.style.display = '';
                    });
                });
            }
        });
    });
}
