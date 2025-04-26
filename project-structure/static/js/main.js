/**
 * Trash to Cash - Main JavaScript
 * 
 * This file contains the primary JavaScript functionality for the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode toggle
    initDarkMode();
    
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Initialize theme-specific animations
    initThemeAnimations();
});

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark');
            
            // Save preference to localStorage
            const isDarkMode = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            
            // Update toggle icon
            updateDarkModeIcon(isDarkMode);
        });
        
        // Check for saved preference
        const savedDarkMode = localStorage.getItem('darkMode');
        
        if (savedDarkMode === 'enabled') {
            document.documentElement.classList.add('dark');
            updateDarkModeIcon(true);
        } else if (savedDarkMode === 'disabled') {
            document.documentElement.classList.remove('dark');
            updateDarkModeIcon(false);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDark) {
                document.documentElement.classList.add('dark');
                updateDarkModeIcon(true);
            }
        }
    }
}

/**
 * Update dark mode toggle icon
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
function updateDarkModeIcon(isDarkMode) {
    const moonIcon = document.querySelector('#dark-mode-toggle .moon-icon');
    const sunIcon = document.querySelector('#dark-mode-toggle .sun-icon');
    
    if (moonIcon && sunIcon) {
        if (isDarkMode) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle menu icon (hamburger/close)
            const menuIcon = mobileMenuButton.querySelector('i');
            if (menuIcon) {
                if (mobileMenu.classList.contains('hidden')) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                } else {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                }
            }
        });
    }
}

/**
 * Initialize theme-specific animations
 */
function initThemeAnimations() {
    // Logo pulse animation
    const logo = document.querySelector('.logo-pulse');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.animationDuration = '0.5s';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.animationDuration = '2s';
        });
    }
    
    // Fade in elements that are in viewport on page load
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('appear');
        }
    });
    
    // Add scroll listener for fade-in elements
    window.addEventListener('scroll', function() {
        fadeElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('appear');
            }
        });
    });
}

/**
 * Check if an element is in the viewport
 * @param {Element} element - The DOM element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @returns {string} - The formatted number
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Show alert/notification
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, info, warning)
 * @param {number} duration - How long to show the alert in milliseconds
 */
function show