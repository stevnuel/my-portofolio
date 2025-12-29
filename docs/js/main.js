document.addEventListener('DOMContentLoaded', function () {
    // def fungsisi awal
    initScrollAnimations();
    initSmoothScrolling();
    initActiveNavigation();
    initNavbarScroll();
    initScrollProgress();
    initTypingEffect();
    initContactForm();
    initMobileMenu();
    initScrollToTop();
    initParallax();
});

/**
 * scroll animasi menggunakan Intersection Observer API
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * scroll yang halus untuk anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * navigasi aktif berdasarkan posisi scroll
 */
function initActiveNavigation() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active-link');
            }
        });
    });
}

/**
 * navbar sticky on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-sticky');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');

    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

/**
 * efek mengetik untuk bagian Hero
 */
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');

    if (!typingElement) return;

    const texts = [
        'Fresh Graduate',
        'Machine Learning',
        'Web Development',
        'Data Enthusiast'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isWaiting) {
            setTimeout(type, 1500);
            isWaiting = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            setTimeout(type, 50);
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
                isWaiting = true;
            }
            setTimeout(type, 100);
        }
    }

    // mulai mengetik setelah jeda singkat
    setTimeout(type, 1000);
}

/**
 * penanganan Form Kontak
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const message = formData.get('message');

            // Basic validation
            if (!firstName || !lastName || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalHTML = submitButton.innerHTML;
            submitButton.innerHTML = `
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending...</span>
            `;
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                this.reset();
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

/**
 * fungsi menu mobile
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileNavBtn = document.getElementById('closeMobileNav');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.remove('hidden');
            mobileNav.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMobileNavBtn && mobileNav) {
        closeMobileNavBtn.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    if (mobileNav) {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

/**
 * scroll ke awal halaman
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * efek parallax untuk elemen blob
 */
function initParallax() {
    const blobs = document.querySelectorAll('.blob');

    if (blobs.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.05;
            blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/**
 * notip
 */
function showNotification(message, type = 'info') {
    // apus notifikasi yang ada
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }

    // buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-24 right-4 z-[200] px-6 py-4 rounded-xl shadow-2xl transform translate-x-full opacity-0 transition-all duration-300 flex items-center gap-3 max-w-sm`;

    // styling berdasarkan tipe
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #38e07b 0%, #1a9f52 100%)';
        notification.style.color = '#000';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        notification.style.color = '#fff';
    } else {
        notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        notification.style.color = '#fff';
    }

    // ikon berdasarkan tipe
    const icon = type === 'success'
        ? '<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
        : type === 'error'
            ? '<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
            : '<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

    notification.innerHTML = `${icon}<span class="font-medium">${message}</span>`;

    document.body.appendChild(notification);

    // animasi masuk
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });

    // animasi keluar dan hapus
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * penanganan download CV
 */
document.addEventListener('DOMContentLoaded', function () {
    const downloadBtn = document.querySelector('a[download]');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // tampilkan notifikasi download berhasil
            showNotification('CV berhasil didownload!', 'success');
        });
    }
});

window.closeMobileMenu = closeMobileMenu;