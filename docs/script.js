// DinoTradez - Main JavaScript File

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DinoTradez application initialized');
    
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeSmoothScrolling();
    initializeWatchlists();
    initializeMarketUpdates();
    initializeShortInterestFilter();
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

// Initialize Watchlist Features
function initializeWatchlists() {
    // Add hovering effect to watchlist rows
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        // Right-click to delete watchlist item
        row.addEventListener('contextmenu', e => {
            e.preventDefault();
            const symbol = row.querySelector('.table-col').textContent;
            
            if (confirm(`Remove ${symbol} from watchlist?`)) {
                row.classList.add('removing');
                setTimeout(() => {
                    row.remove();
                }, 300);
            }
        });
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
    }, 10000); // Update every 10 seconds
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