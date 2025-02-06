// main.js
(function() {
    'use strict';

    // Constants
    const CONFIG = {
        SCROLL_THRESHOLD: 100,
        MOBILE_BREAKPOINT: 992,
        DEBOUNCE_DELAY: 150,
        SCROLL_OFFSET: 100
    };

    // DOM Elements
    const elements = {
        menuToggle: document.getElementById('menuToggle'),
        mobileMenu: document.getElementById('mobileMenu'),
        header: document.querySelector('.main-nav'),
        links: document.querySelectorAll('a[href^="#"]'),
        navLinks: document.querySelectorAll('.nav-links a, .mobile-menu a'),
        body: document.body,
        specialtyCards: document.querySelectorAll('.specialty-card'),
        activityCards: document.querySelectorAll('.activity-card'),
        sections: document.querySelectorAll('section[id]')
    };

    // State
    const state = {
        lastScroll: 0,
        isMenuOpen: false,
        isMobile: window.innerWidth < CONFIG.MOBILE_BREAKPOINT,
        isScrolling: false
    };

    // Initialize
    function init() {
        setupEventListeners();
        setupSmoothScroll();
        setupScrollAnimations();
        checkScreenSize();
        initializeAnimations();
    }

    // Event Listeners
    function setupEventListeners() {
        // Mobile Menu
        elements.menuToggle?.addEventListener('click', toggleMenu);
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscKey);

        // Scroll Events
        window.addEventListener('scroll', debounce(handleScroll, 10));
        window.addEventListener('scroll', debounce(updateActiveNavigation, 100));

        // Resize Event
        window.addEventListener('resize', debounce(checkScreenSize, CONFIG.DEBOUNCE_DELAY));

        // Intersection Observer for Animations
        setupIntersectionObserver();
    }

    // Menu Functions
    function toggleMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        elements.mobileMenu?.classList.toggle('active');
        elements.body.classList.toggle('menu-open');
        elements.menuToggle?.setAttribute('aria-expanded', state.isMenuOpen);

        if (state.isMenuOpen) {
            elements.body.style.overflow = 'hidden';
        } else {
            elements.body.style.overflow = '';
        }
    }

    function handleOutsideClick(e) {
        if (state.isMenuOpen && 
            !elements.mobileMenu?.contains(e.target) && 
            !elements.menuToggle?.contains(e.target)) {
            toggleMenu();
        }
    }

    function handleEscKey(e) {
        if (e.key === 'Escape' && state.isMenuOpen) {
            toggleMenu();
        }
    }

    // Scroll Functions
    function handleScroll() {
        if (state.isScrolling) return;

        state.isScrolling = true;
        const currentScroll = window.pageYOffset;

        // Header Hide/Show Logic
        if (currentScroll <= CONFIG.SCROLL_THRESHOLD) {
            elements.header?.classList.remove('scroll-up', 'scroll-down');
        } else if (currentScroll > state.lastScroll) {
            elements.header?.classList.remove('scroll-up');
            elements.header?.classList.add('scroll-down');
        } else {
            elements.header?.classList.remove('scroll-down');
            elements.header?.classList.add('scroll-up');
        }

        state.lastScroll = currentScroll;
        state.isScrolling = false;
    }

    // Smooth Scroll
    function setupSmoothScroll() {
        elements.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - CONFIG.SCROLL_OFFSET;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    if (state.isMenuOpen) toggleMenu();
                    updateURL(targetId);
                }
            });
        });
    }

    // Navigation Active State
    function updateActiveNavigation() {
        const fromTop = window.scrollY + CONFIG.SCROLL_OFFSET;

        elements.sections.forEach(section => {
            const { top, bottom } = section.getBoundingClientRect();
            const sectionId = section.getAttribute('id');

            if (top <= CONFIG.SCROLL_OFFSET && bottom > CONFIG.SCROLL_OFFSET) {
                elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Animations
    function setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        elements.specialtyCards.forEach(card => observer.observe(card));
        elements.activityCards.forEach(card => observer.observe(card));
    }

    function initializeAnimations() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.classList.add('fade-in');
        });
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function checkScreenSize() {
        const isMobileView = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
        
        if (isMobileView !== state.isMobile) {
            state.isMobile = isMobileView;
            if (!isMobileView && state.isMenuOpen) {
                toggleMenu();
            }
        }
    }

    function updateURL(hash) {
        window.history.pushState(null, '', hash);
    }

    // Performance Monitoring
    const performance = {
        init: function() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    const timing = window.performance.timing;
                    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                    console.log(`Page Load Time: ${pageLoadTime}ms`);
                });
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            performance.init();
        });
    } else {
        init();
        performance.init();
    }

    // Handle Page Visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden
            state.isScrolling = false;
        }
    });

    // Prevent Mobile Overscroll
    document.body.addEventListener('touchmove', function(e) {
        if (state.isMenuOpen) {
            e.preventDefault();
        }
    }, { passive: false });

})();
