// main.js
(function() {
    'use strict';

    // Constants
    const CONFIG = {
        SCROLL_OFFSET: 100,
        MOBILE_BREAKPOINT: 992,
        SCROLL_THRESHOLD: 50,
        ANIMATION_THRESHOLD: 0.2,
        COUNTER_SPEED: 2000,
        DEBOUNCE_DELAY: 150
    };

    // DOM Elements
    const DOM = {
        body: document.body,
        header: document.querySelector('.main-nav'),
        mobileMenu: document.getElementById('mobileMenu'),
        menuToggle: document.getElementById('menuToggle'),
        navLinks: document.querySelectorAll('.nav-links a, .mobile-menu a'),
        sections: document.querySelectorAll('section[id]'),
        scrollTopBtn: document.getElementById('scrollToTop'),
        statCounters: document.querySelectorAll('.counter'),
        loadingScreen: document.getElementById('loadingScreen'),
        animatedElements: document.querySelectorAll('.animate-up, .college-card, .news-card')
    };

    // State Management
    const state = {
        isMenuOpen: false,
        isScrolling: false,
        lastScrollTop: 0,
        isMobile: window.innerWidth < CONFIG.MOBILE_BREAKPOINT
    };

    // Initialize
    function init() {
        handleLoading();
        setupEventListeners();
        initializeAnimations();
        setupIntersectionObservers();
        setActiveNavLink();
    }

    // Loading Handler
    function handleLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                DOM.loadingScreen?.classList.add('fade-out');
                setTimeout(() => {
                    DOM.loadingScreen?.remove();
                }, 500);
            }, 1000);
        });
    }

    // Event Listeners Setup
    function setupEventListeners() {
        // Mobile Menu
        DOM.menuToggle?.addEventListener('click', toggleMenu);
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscKey);

        // Scroll Events
        window.addEventListener('scroll', debounce(handleScroll, 10));
        window.addEventListener('scroll', debounce(updateActiveNavigation, 100));

        // Resize Event
        window.addEventListener('resize', debounce(handleResize, CONFIG.DEBOUNCE_DELAY));

        // Smooth Scroll
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
        });

        // Mobile Links
        const mobileLinks = document.querySelectorAll('.mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) {
                    toggleMenu();
                }
            });
        });
    }

    // Menu Functions
    function toggleMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        DOM.menuToggle?.classList.toggle('active');
        DOM.mobileMenu?.classList.toggle('active');
        DOM.body.classList.toggle('menu-open');
        
        if (DOM.mobileMenu) {
            DOM.mobileMenu.setAttribute('aria-hidden', !state.isMenuOpen);
        }
    }

    function handleOutsideClick(e) {
        if (state.isMenuOpen && 
            !DOM.mobileMenu?.contains(e.target) && 
            !DOM.menuToggle?.contains(e.target)) {
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

    // ... header logic ...

    // Scroll Top Button Visibility
    if (DOM.scrollTopBtn) {
        DOM.scrollTopBtn.classList.toggle('visible', currentScroll > CONFIG.SCROLL_THRESHOLD);
    }

    state.lastScrollTop = currentScroll;
    state.isScrolling = false;
}


    // Smooth Scroll Implementation
    document.addEventListener('DOMContentLoaded', function() {
        // Get the button
        const scrollToTopBtn = document.getElementById('scrollToTop');
    
        // Show/Hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
    
        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Active Navigation
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        DOM.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Counter Animation
    function startCounting(element) {
        const target = parseInt(element.dataset.count);
        const duration = CONFIG.COUNTER_SPEED;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Intersection Observers
    function setupIntersectionObservers() {
        // Animation Observer
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        animationObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: CONFIG.ANIMATION_THRESHOLD,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        // Counter Observer
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounting(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.5
            }
        );

        // Observe Elements
        DOM.animatedElements?.forEach(el => animationObserver.observe(el));
        DOM.statCounters?.forEach(counter => counterObserver.observe(counter));
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

    function handleResize() {
        const isMobileView = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
        
        if (isMobileView !== state.isMobile) {
            state.isMobile = isMobileView;
            if (!isMobileView && state.isMenuOpen) {
                toggleMenu();
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle Page Visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
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