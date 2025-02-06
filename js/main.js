// Main JavaScript File (main.js)
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
        DOM.menuToggle?.addEventListener('click', toggleMobileMenu);
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

        // Scroll Top Button
        DOM.scrollTopBtn?.addEventListener('click', scrollToTop);
    }

    // Mobile Menu Functions
    function toggleMobileMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        DOM.mobileMenu?.classList.toggle('active');
        DOM.menuToggle?.setAttribute('aria-expanded', state.isMenuOpen);
        DOM.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
        
        // Animate menu icon
        if (DOM.menuToggle) {
            DOM.menuToggle.classList.toggle('active');
        }
    }

    function handleOutsideClick(e) {
        if (state.isMenuOpen && 
            !DOM.mobileMenu?.contains(e.target) && 
            !DOM.menuToggle?.contains(e.target)) {
            toggleMobileMenu();
        }
    }

    function handleEscKey(e) {
        if (e.key === 'Escape' && state.isMenuOpen) {
            toggleMobileMenu();
        }
    }

    // Scroll Functions
    function handleScroll() {
        if (state.isScrolling) return;
        
        state.isScrolling = true;
        const currentScroll = window.pageYOffset;

        // Header Hide/Show Logic
        if (currentScroll <= CONFIG.SCROLL_THRESHOLD) {
            DOM.header?.classList.remove('scroll-up', 'scroll-down');
        } else if (currentScroll > state.lastScrollTop) {
            DOM.header?.classList.remove('scroll-up');
            DOM.header?.classList.add('scroll-down');
        } else {
            DOM.header?.classList.remove('scroll-down');
            DOM.header?.classList.add('scroll-up');
        }

        // Scroll Top Button Visibility
        toggleScrollTopButton(currentScroll);

        state.lastScrollTop = currentScroll;
        state.isScrolling = false;
    }

    function toggleScrollTopButton(currentScroll) {
        if (DOM.scrollTopBtn) {
            if (currentScroll > CONFIG.SCROLL_THRESHOLD) {
                DOM.scrollTopBtn.classList.add('visible');
            } else {
                DOM.scrollTopBtn.classList.remove('visible');
            }
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Smooth Scroll Implementation
    function handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - CONFIG.SCROLL_OFFSET;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            if (state.isMenuOpen) {
                toggleMobileMenu();
            }

            // Update URL without page jump
            window.history.pushState(null, '', targetId);
        }
    }
        // Animations and Intersection Observers
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
            DOM.animatedElements.forEach(el => animationObserver.observe(el));
            DOM.statCounters.forEach(counter => counterObserver.observe(counter));
        }
    
        // Counter Animation
        function startCounting(element) {
            const target = parseInt(element.dataset.count);
            const duration = CONFIG.COUNTER_SPEED;
            const step = target / (duration / 16); // 60fps
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
    
            requestAnimationFrame(updateCounter);
        }
    
        // Navigation Active State
        function updateActiveNavigation() {
            const fromTop = window.scrollY + CONFIG.SCROLL_OFFSET;
    
            DOM.sections.forEach(section => {
                const { top, bottom } = section.getBoundingClientRect();
                const sectionId = section.getAttribute('id');
    
                if (top <= CONFIG.SCROLL_OFFSET && bottom > CONFIG.SCROLL_OFFSET) {
                    DOM.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    
        // Resize Handler
        function handleResize() {
            const isMobileView = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
            
            if (isMobileView !== state.isMobile) {
                state.isMobile = isMobileView;
                if (!isMobileView && state.isMenuOpen) {
                    toggleMobileMenu();
                }
            }
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
    
        // Performance Monitoring
        const Performance = {
            metrics: {},
    
            start(label) {
                this.metrics[label] = performance.now();
            },
    
            end(label) {
                if (this.metrics[label]) {
                    const duration = performance.now() - this.metrics[label];
                    console.log(`${label}: ${duration.toFixed(2)}ms`);
                    delete this.metrics[label];
                }
            },
    
            measure(label, callback) {
                this.start(label);
                callback();
                this.end(label);
            }
        };
    
        // Form Validation
        const FormValidator = {
            patterns: {
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                phone: /^[0-9]{11}$/,
                name: /^[\u0600-\u06FF\s]{2,}$/
            },
    
            validate(form) {
                let isValid = true;
                const errors = {};
    
                form.querySelectorAll('[data-validate]').forEach(field => {
                    const rules = field.dataset.validate.split(',');
                    
                    rules.forEach(rule => {
                        const value = field.value.trim();
                        
                        switch(rule) {
                            case 'required':
                                if (!value) {
                                    errors[field.name] = 'هذا الحقل مطلوب';
                                    isValid = false;
                                }
                                break;
                            case 'email':
                                if (!this.patterns.email.test(value)) {
                                    errors[field.name] = 'البريد الإلكتروني غير صحيح';
                                    isValid = false;
                                }
                                break;
                            case 'phone':
                                if (!this.patterns.phone.test(value)) {
                                    errors[field.name] = 'رقم الهاتف غير صحيح';
                                    isValid = false;
                                }
                                break;
                            case 'name':
                                if (!this.patterns.name.test(value)) {
                                    errors[field.name] = 'الاسم يجب أن يكون بالعربية';
                                    isValid = false;
                                }
                                break;
                        }
                    });
                });
    
                return { isValid, errors };
            },
    
            showErrors(form, errors) {
                form.querySelectorAll('.error-message').forEach(el => el.remove());
                
                Object.keys(errors).forEach(fieldName => {
                    const field = form.querySelector(`[name="${fieldName}"]`);
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.textContent = errors[fieldName];
                    field.parentNode.appendChild(errorDiv);
                });
            }
        };
    
        // Error Handler
        const ErrorHandler = {
            handle(error, context) {
                console.error(`Error in ${context}:`, error);
                
                // You can implement error tracking service here
                if (typeof window.errorTracker !== 'undefined') {
                    window.errorTracker.log({
                        error: error.message,
                        context,
                        timestamp: new Date(),
                        url: window.location.href
                    });
                }
            }
        };
    
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
