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
    initCertificates();
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
    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const messageData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Tampilkan loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Mengirim...</span>
            `;
            submitBtn.disabled = true;

            try {
                const response = await fetch('http://localhost:3000/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(messageData)
                });

                const result = await response.json();

                if (result.success) {
                    // Tampilkan notifikasi sukses
                    showNotification('Pesan berhasil dikirim! Terima kasih telah menghubungi saya.', 'success');
                    this.reset();
                } else {
                    showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                // Fallback: simpan ke localStorage jika server tidak aktif
                saveToLocalStorage(messageData);
                showNotification('Pesan disimpan secara lokal. Server sedang offline.', 'warning');
                this.reset();
            }

            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }

    // Fungsi untuk menyimpan ke localStorage sebagai fallback
    function saveToLocalStorage(messageData) {
        const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
        messages.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...messageData
        });
        localStorage.setItem('portfolioMessages', JSON.stringify(messages));
    }

    //tampilkan notifikasi
    function showNotification(message, type = 'success') {

        const existingNotif = document.querySelector('.notification-toast');
        if (existingNotif) existingNotif.remove();

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500'
        };

        const icons = {
            success: `<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
            error: `<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
            warning: `<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
        };

        const notification = document.createElement('div');
        notification.className = `notification-toast fixed bottom-6 right-6 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-[100] transform translate-y-full opacity-0 transition-all duration-300`;
        notification.innerHTML = `
            ${icons[type]}
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="ml-2 hover:opacity-70">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        document.body.appendChild(notification);

        // Animasi masuk
        setTimeout(() => {
            notification.classList.remove('translate-y-full', 'opacity-0');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
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
 * Certificate Inline Slider
 */
function initCertificates() {
    const slider = document.getElementById('certSlider');
    const prevBtn = document.getElementById('certPrevBtn');
    const nextBtn = document.getElementById('certNextBtn');
    const dotsContainer = document.getElementById('certDots');

    if (!slider) return;

    const cards = Array.from(slider.querySelectorAll('.cert-card'));
    
    if (cards.length === 0) return;

    // Generate dots
    cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'cert-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Sertifikat ${idx + 1}`);
        dot.addEventListener('click', () => scrollToCard(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.cert-dot');

    function scrollToCard(index) {
        const card = cards[index];
        if (card) {
            const sliderRect = slider.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const scrollLeft = slider.scrollLeft + (cardRect.left - sliderRect.left);
            slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }

    function getCurrentIndex() {
        const cardWidth = cards[0]?.offsetWidth || 300;
        return Math.round(slider.scrollLeft / cardWidth);
    }

    function scrollSlider(direction) {
        const cardWidth = cards[0]?.offsetWidth || 300;
        const currentIndex = getCurrentIndex();
        const totalCards = cards.length;

        // Jika di card terakhir dan klik next, kembali ke awal
        if (direction === 1 && currentIndex >= totalCards - 1) {
            slider.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        // Jika di card pertama dan klik prev, pergi ke terakhir
        if (direction === -1 && currentIndex <= 0) {
            const lastCardPosition = (totalCards - 1) * cardWidth;
            slider.scrollTo({ left: lastCardPosition, behavior: 'smooth' });
            return;
        }

        slider.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    }

    function updateDots() {
        const scrollLeft = slider.scrollLeft;
        const cardWidth = cards[0]?.offsetWidth || 300;
        const activeIdx = Math.round(scrollLeft / cardWidth);

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIdx);
        });
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => scrollSlider(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollSlider(1));

    slider.addEventListener('scroll', updateDots);

    updateDots();
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

document.addEventListener('DOMContentLoaded', function() {
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        // Tampilkan notifikasi sukses
        showSuccessNotification();
        
        // Hapus parameter dari URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

function showSuccessNotification() {
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-6 z-50 glass-card p-4 flex items-center gap-3 animate-slide-in';
    notification.innerHTML = `
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
            <svg class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        <div>
            <p class="font-semibold text-green-500">Pesan Terkirim!</p>
            <p class="text-sm text-[var(--text-secondary)]">Terima kasih, saya akan segera menghubungi Anda.</p>
        </div>
        <button onclick="this.parentElement.remove()" class="ml-4 text-[var(--text-secondary)] hover:text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove setelah 5 detik
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

window.closeMobileMenu = closeMobileMenu;