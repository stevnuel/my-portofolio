document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions when page loads
    initSmoothScrolling();
    initActiveNavigation();
    initContactForm();
    initMobileMenu();
    
});

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
function initActiveNavigation() {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
 * Contact form handling
 */
function initContactForm() {
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const firstName = formData.get('firstName') || document.querySelector('input[type="text"]').value;
            const lastName = formData.get('lastName') || document.querySelectorAll('input[type="text"]')[1].value;
            const email = formData.get('email') || document.querySelector('input[type="email"]').value;
            const subject = formData.get('subject') || document.querySelectorAll('input[type="text"]')[2].value;
            const message = formData.get('message') || document.querySelector('textarea').value;
            
            // Basic validation
            if (!firstName || !lastName || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function initMobileMenu() {
    // Add mobile menu toggle functionality here if needed
    const navMenu = document.querySelector('nav .hidden');
    
    // Create mobile menu button if it doesn't exist
    if (navMenu && window.innerWidth < 768) {
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'md:hidden flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-white hover:border-white';
        mobileMenuButton.innerHTML = `
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
        `;
        
        // Add mobile menu functionality
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('hidden');
        });
    }
}

// CV Download functionality
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.querySelector('a[download]');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Check if file exists
            const fileName = this.getAttribute('href');
            
            // Show download feedback
            const originalText = this.querySelector('span').textContent;
            const span = this.querySelector('span');
            
            // Change button text temporarily
            span.textContent = 'Downloading...';
            this.style.pointerEvents = 'none';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                span.textContent = originalText;
                this.style.pointerEvents = 'auto';
                
                // Show success message
                showNotification('CV berhasil didownload!', 'success');
            }, 2000);
        });
    }
});

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Email validation utility function
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Utility function to add loading states
 * @param {HTMLElement} element - Element to add loading state to
 */
function addLoadingState(element) {
    element.classList.add('loading');
    element.disabled = true;
}

/**
 * Utility function to remove loading states
 * @param {HTMLElement} element - Element to remove loading state from
 */
function removeLoadingState(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

/**
 * Scroll to top functionality
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('#scrollToTop');
    if (scrollButton) {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Export functions for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSmoothScrolling,
        initActiveNavigation,
        initContactForm,
        isValidEmail,
        scrollToTop
    };
}