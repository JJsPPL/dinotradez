// DinoTradez - Main JavaScript File

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DinoTradez application initialized');
    
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    animateHeroImage();
    initializeSmoothScrolling();
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
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('dinoTheme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        body.classList.remove('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-theme');
            
            if (body.classList.contains('dark-theme')) {
                localStorage.setItem('dinoTheme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('dinoTheme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('dinoTheme')) {
            if (e.matches) {
                body.classList.add('dark-theme');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                }
            } else {
                body.classList.remove('dark-theme');
                if (themeToggle) {
                    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                }
            }
        }
    });
}

// Animate Hero Image
function animateHeroImage() {
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        // Simple hover effect is already in CSS, but we can add more animations
        
        // Gentle floating animation
        let floatingAnimation = anime({
            targets: heroImage,
            translateY: ['-10px', '10px'],
            easing: 'easeInOutSine',
            duration: 3000,
            loop: true,
            direction: 'alternate'
        });
        
        // Add slight rotation on mousemove
        document.querySelector('.hero').addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            anime({
                targets: heroImage,
                rotateX: mouseY * 5 - 2.5,
                rotateY: mouseX * 5 - 2.5,
                easing: 'easeOutElastic(1, .8)',
                duration: 1500
            });
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

// Simulate Stock Market Data Updates
function simulateMarketUpdates() {
    // Get all market cards and portfolio values
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
                change.querySelector('p').textContent = `${isPositive ? '+' : ''}${changeAmount.toFixed(2)} (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`;
            }
        });
    }, 10000);
}

// Call the simulation function after a delay
setTimeout(simulateMarketUpdates, 3000);

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Validate email (simple validation)
            if (email && email.includes('@') && email.includes('.')) {
                // Simulate successful subscription
                emailInput.value = '';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thanks for subscribing!';
                successMessage.style.color = 'var(--success-color)';
                successMessage.style.marginTop = 'var(--spacing-sm)';
                
                // Remove any existing messages
                const existingMessage = newsletterForm.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                newsletterForm.appendChild(successMessage);
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }
});

// Add the anime.js library (a lightweight animation library)
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    script.async = true;
    document.head.appendChild(script);
})();