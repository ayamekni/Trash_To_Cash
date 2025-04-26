/**
 * Trash to Cash - Animation Utilities
 * 
 * This file contains animations and transitions used across the application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations for page elements
    initPageAnimations();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Initialize any interactive elements
    initInteractiveElements();
});

/**
 * Initialize page load animations
 */
function initPageAnimations() {
    // Stagger animations for lists or grids
    gsap.utils.toArray('.stagger-fade-in').forEach(function(container) {
        const elements = container.querySelectorAll('.stagger-item');
        
        gsap.from(elements, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });
    });
    
    // Animate hero elements
    gsap.utils.toArray('.hero-element').forEach(function(element) {
        gsap.from(element, {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
            delay: 0.2
        });
    });
    
    // Animate counters
    gsap.utils.toArray('.counter-animation').forEach(function(counter) {
        const target = parseFloat(counter.getAttribute('data-target') || 0);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = parseFloat(counter.getAttribute('data-duration') || 2);
        const decimals = parseInt(counter.getAttribute('data-decimals') || 0);
        
        gsap.to(counter, {
            innerHTML: target,
            duration: duration,
            ease: "power2.out",
            snap: { innerHTML: 1 / (10 ** decimals) },
            onUpdate: function() {
                counter.innerHTML = prefix + parseFloat(counter.innerHTML).toFixed(decimals) + suffix;
            }
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    // Register ScrollTrigger plugin if it exists
    if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Fade in elements on scroll
        gsap.utils.toArray('.scroll-fade-in').forEach(function(element) {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out"
            });
        });
        
        // Scale elements on scroll
        gsap.utils.toArray('.scroll-scale').forEach(function(element) {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)"
            });
        });
    }
}

/**
 * Initialize interactive elements that have animations
 */
function initInteractiveElements() {
    // Hover animations for interactive cards
    gsap.utils.toArray('.animate-hover-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Button animations
    gsap.utils.toArray('.animate-button').forEach(function(button) {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.5)"
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.5)"
            });
        });
    });
}

/**
 * Function to animate counters with comma formatting
 * @param {string} selector - The CSS selector for counter elements
 * @param {number} duration - Animation duration in seconds
 */
function animateCounters(selector, duration = 2) {
    const counters = document.querySelectorAll(selector);
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        
        if (isNaN(target)) return;
        
        const formatter = new Intl.NumberFormat('en-US');
        let startTime = null;
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            
            // Easing function for smoother animation
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(eased * target);
            
            counter.textContent = formatter.format(currentValue);
            
            if (progress < 1) {
                window.requestAnimationFrame(updateCounter);
            }
        }
        
        window.requestAnimationFrame(updateCounter);
    });
}

/**
 * Function to create a typing effect for text elements
 * @param {string} selector - The CSS selector for text elements
 * @param {number} speed - Typing speed in milliseconds per character
 * @param {number} delay - Delay before typing starts in milliseconds
 */
function typeWriterEffect(selector, speed = 50, delay = 0) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }, delay);
    });
}