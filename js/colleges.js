document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const collegeCards = document.querySelectorAll('.college-card');

    // Filter Function
    function filterColleges(category) {
        collegeCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('fade-in', 'visible');
                }, 100);
            } else {
                card.classList.remove('fade-in', 'visible');
                card.style.display = 'none';
            }
        });
    }

    // Event Listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter colleges
            const category = button.dataset.filter;
            filterColleges(category);
        });
    });

    // Animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all college cards
    collegeCards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
});