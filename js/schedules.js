document.addEventListener('DOMContentLoaded', function() {
    // العناصر
    const filterButtons = document.querySelectorAll('.filter-btn');
    const scheduleSections = document.querySelectorAll('.schedule-section');
    const scheduleFiles = document.querySelectorAll('.schedule-file');
    const departments = document.querySelectorAll('.department-schedules');

    // تبديل بين المحاضرات والامتحانات
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس النشط من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الكلاس النشط للزر المضغوط
            button.classList.add('active');

            // الحصول على نوع الجدول (محاضرات/امتحانات)
            const type = button.dataset.type;

            // إخفاء جميع الأقسام بتأثير متلاشي
            scheduleSections.forEach(section => {
                section.style.opacity = '0';
                setTimeout(() => {
                    section.style.display = 'none';
                    if (section.classList.contains(`${type}-section`)) {
                        section.style.display = 'block';
                        setTimeout(() => {
                            section.style.opacity = '1';
                        }, 50);
                    }
                }, 300);
            });

            // إغلاق نافذة PDF إذا كانت مفتوحة
            closePdfModal();
        });
    });

    // وظائف عرض PDF
    window.openPdfModal = function(pdfUrl, title) {
        const modal = document.getElementById('pdfModal');
        const viewer = document.getElementById('pdfViewer');
        const modalTitle = document.getElementById('modalTitle');
        const downloadBtn = document.getElementById('downloadBtn');

        // تعيين العنوان والروابط
        modalTitle.textContent = title;
        viewer.src = pdfUrl;
        downloadBtn.href = pdfUrl;

        // عرض النافذة
        modal.style.display = 'block';
        
        // تمرير الصفحة إلى موقع النافذة
        modal.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // إضافة حالة التحميل للملف
        const relatedFile = document.querySelector(`[onclick*="${pdfUrl}"]`);
        if (relatedFile) {
            relatedFile.classList.add('loading');
            viewer.onload = () => {
                relatedFile.classList.remove('loading');
            };
        }
    };

    // إغلاق نافذة PDF
    window.closePdfModal = function() {
        const modal = document.getElementById('pdfModal');
        const viewer = document.getElementById('pdfViewer');
        viewer.src = '';
        modal.style.display = 'none';
    };

    // تأثير ظهور تدريجي للأقسام
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

    // مراقبة جميع الأقسام للتأثير
    departments.forEach(department => {
        department.classList.add('fade-in');
        observer.observe(department);
    });

    // معالجة أخطاء تحميل PDF
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.onerror = function() {
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'خطأ في تحميل الملف';
        this.contentDocument.body.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #dc3545;"></i>
                <p style="margin-top: 10px;">عذراً، حدث خطأ أثناء تحميل الملف</p>
            </div>
        `;
    };

    // تحسين تجربة المستخدم على الأجهزة المحمولة
    let touchStartTime;
    scheduleFiles.forEach(file => {
        file.addEventListener('touchstart', () => {
            touchStartTime = Date.now();
        });

        file.addEventListener('touchend', () => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 300) { // للنقرات السريعة فقط
                file.classList.add('tapped');
                setTimeout(() => {
                    file.classList.remove('tapped');
                }, 300);
            }
        });
    });

    // معالجة الأخطاء العامة
    window.addEventListener('error', function(e) {
        console.error('خطأ في الصفحة:', e.message);
    });

    // مراقبة أداء الصفحة
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = window.performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`زمن تحميل الصفحة: ${pageLoadTime}ms`);
        });
    }
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