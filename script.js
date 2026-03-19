// ============================================
// JobAxis Technology Services — Main Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Header Scroll ----
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = header.offsetHeight;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Counter Animation ----
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        });
    }

    // ---- Expertise Bar Animation ----
    function animateExpertiseBars() {
        document.querySelectorAll('.expertise-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
        });
    }

    // ---- Intersection Observer for Animations ----
    const fadeElements = document.querySelectorAll(
        '.about-card, .service-card, .process-step, .expertise-card, .industry-card, .testimonial-card, .contact-item'
    );

    fadeElements.forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Stats observer
    const statsBar = document.querySelector('.hero-stats-bar');
    if (statsBar) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) animateCounters();
        }, { threshold: 0.5 }).observe(statsBar);
    }

    // Expertise observer
    const expertiseSection = document.querySelector('.expertise');
    if (expertiseSection) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) animateExpertiseBars();
        }, { threshold: 0.3 }).observe(expertiseSection);
    }

    // ---- Contact Form ----
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const span = btn.querySelector('span');
            const originalText = span.textContent;

            span.textContent = 'Message Sent!';
            btn.style.background = '#333';
            btn.disabled = true;

            setTimeout(() => {
                span.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ---- Resume File Upload UX ----
    const fileInput = document.getElementById('r-resume');
    const uploadArea = document.getElementById('fileUploadArea');
    const uploadContent = uploadArea ? uploadArea.querySelector('.file-upload-content') : null;
    const fileSelected = document.getElementById('fileSelected');
    const fileNameEl = document.getElementById('fileName');
    const fileRemove = document.getElementById('fileRemove');

    if (fileInput && uploadArea) {
        // Drag & drop
        ['dragenter', 'dragover'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length) {
                fileInput.files = files;
                showSelectedFile(files[0]);
            }
        });

        // File selected via click
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                showSelectedFile(fileInput.files[0]);
            }
        });

        // Remove file
        fileRemove.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.value = '';
            fileSelected.style.display = 'none';
            uploadContent.style.display = '';
            fileInput.style.display = '';
        });

        function showSelectedFile(file) {
            // Validate size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be under 5MB.');
                fileInput.value = '';
                return;
            }

            // Validate type
            const validTypes = ['.pdf', '.doc', '.docx'];
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!validTypes.includes(ext)) {
                alert('Please upload a PDF, DOC, or DOCX file.');
                fileInput.value = '';
                return;
            }

            fileNameEl.textContent = file.name;
            fileSelected.style.display = 'flex';
            uploadContent.style.display = 'none';
        }
    }

    // ---- Resume Form Submission (Formsubmit.co) ----
    // Formsubmit handles submission via form action redirect.
    // We just show a loading state on the button before the page navigates.
    const resumeForm = document.getElementById('resumeForm');
    if (resumeForm) {
        resumeForm.addEventListener('submit', () => {
            const btn = document.getElementById('resumeSubmitBtn');
            const span = btn.querySelector('span');
            span.textContent = 'Submitting...';
            btn.disabled = true;
        });
    }

    // ---- Active Nav Highlight ----
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
                    link.classList.add('active-link');
                }
            }
        });
    });
});
