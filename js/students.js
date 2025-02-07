document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const serviceCards = document.querySelectorAll('.service-card');

    // Intersection Observer for fade-in effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all service cards
    serviceCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Add loading state when clicking
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const href = card.getAttribute('href');
            if (href && href !== '#') {
                card.classList.add('loading');
            }
        });
    });

    // Add hover sound effect (optional)
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // يمكن إضافة صوت hover هنا
            // const hoverSound = new Audio('path/to/hover-sound.mp3');
            // hoverSound.play();
        });
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page Load Time: ${pageLoadTime}ms`);
        });
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('Page Error:', e.message);
        // يمكن إضافة تتبع الأخطاء هنا
    });
});
/*TEST*/
// Scroll to Top Functionality
document.addEventListener('DOMContentLoaded', function() {
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