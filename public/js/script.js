// Main JavaScript for Innova Soft Ultimate Website

class InnovaSoftWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initAnimations();
        this.initContactForm();
        this.initScrollEffects();
        this.initTypewriter();
        console.log('🚀 Innova Soft Ultimate Website geladen');
    }
    // Portfolio filter functionality
    initPortfolioFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    const filterValue = button.getAttribute('data-filter');
                    
                    // Filter portfolio items
                    portfolioItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 100);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.8)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }
    // Navigation functionality
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navbar = document.querySelector('.navbar');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Animations
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements
        document.addEventListener('DOMContentLoaded', () => {
            const elementsToAnimate = document.querySelectorAll(
                '.service-card, .process-step, .stat, .hero-badge'
            );
            
            elementsToAnimate.forEach(el => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
        });

        // Add CSS for animations
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
            }
            
            .service-card:nth-child(1) { transition-delay: 0.1s; }
            .service-card:nth-child(2) { transition-delay: 0.2s; }
            .service-card:nth-child(3) { transition-delay: 0.3s; }
            
            .process-step:nth-child(1) { transition-delay: 0.1s; }
            .process-step:nth-child(2) { transition-delay: 0.2s; }
            .process-step:nth-child(3) { transition-delay: 0.3s; }
            .process-step:nth-child(4) { transition-delay: 0.4s; }
        `;
        document.head.appendChild(style);
    }

    // Contact form handling
    initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verzenden...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });

                const result = await response.json();

                if (result.success) {
                    this.showNotification(result.message, 'success');
                    contactForm.reset();
                } else {
                    this.showNotification(result.message, 'error');
                }
            } catch (error) {
                this.showNotification('Er ging iets mis. Probeer het later opnieuw.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        // Form validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Dit veld is verplicht';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Voer een geldig e-mailadres in';
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Voer een geldig telefoonnummer in';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.textContent = message;
        
        field.parentElement.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    // Navigation functionality
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navbar = document.querySelector('.navbar');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking on links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Navbar scroll effect
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Initialize scroll state
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            }
        }
    }
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification styles
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #3b82f6;
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease;
                }
                
                .notification-success {
                    border-left-color: #10b981;
                }
                
                .notification-error {
                    border-left-color: #ef4444;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    cursor: pointer;
                    color: #64748b;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Scroll effects
    initScrollEffects() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
         
        });
    }

    // Typewriter effect for hero title
initTypewriter() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const texts = [
        "IT-Optimalisatie",
        ".NET Solutions", 
        "Systeembeheer",
        "Software Design",
        "Digitale Projecten",
        "IT-Partnerschap"
    ];
    
    // Maak een container voor de typewriter tekst
    const typewriterContainer = document.createElement('div');
    typewriterContainer.className = 'typewriter-container';
    typewriterContainer.style.position = 'relative';
    typewriterContainer.style.display = 'inline-block';
    
    const highlightElement = heroTitle.querySelector('.title-highlight');
    const placeholderElement = document.createElement('span');
    
    if (highlightElement) {
        // Vervang het highlight element door onze container
        highlightElement.parentNode.insertBefore(typewriterContainer, highlightElement);
        typewriterContainer.appendChild(highlightElement);
        
        // Voeg een placeholder toe voor vaste breedte
        placeholderElement.textContent = texts.reduce((a, b) => a.length > b.length ? a : b);
        placeholderElement.style.visibility = 'hidden';
        placeholderElement.style.height = '0';
        placeholderElement.style.display = 'inline-block';
        typewriterContainer.insertBefore(placeholderElement, highlightElement);
        
        // Positioneer het highlight element absoluut
        highlightElement.style.position = 'absolute';
        highlightElement.style.left = '0';
        highlightElement.style.top = '0';
        highlightElement.style.margin = '0';
        highlightElement.style.padding = '0';
    }
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            charIndex--;
            typingSpeed = 50;
        } else {
            charIndex++;
            typingSpeed = 100;
        }

        const displayedText = currentText.substring(0, charIndex);
        
        if (highlightElement) {
            highlightElement.textContent = displayedText;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InnovaSoftWebsite();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
// Cookie Consent Management
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieClose = document.getElementById('cookieClose');
    const detailsToggle = document.getElementById('detailsToggle');
    const detailsContent = document.getElementById('detailsContent');
    
    // Buttons
    const bannerAccept = document.getElementById('bannerAccept');
    const bannerCustomize = document.getElementById('bannerCustomize');
    const rejectAll = document.getElementById('rejectAll');
    const acceptSelected = document.getElementById('acceptSelected');
    const acceptAll = document.getElementById('acceptAll');
    
    // Cookie checkboxes
    const analyticsCookies = document.getElementById('analyticsCookies');
    const marketingCookies = document.getElementById('marketingCookies');

    // Check if user has already made a choice
    const hasConsent = getCookie('cookie_consent');
    
    if (!hasConsent) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Banner Accept (Essential only)
    bannerAccept.addEventListener('click', function() {
        setCookieConsent('essential');
        cookieBanner.classList.remove('show');
        showThankYouMessage('Bedankt! Uw voorkeuren zijn opgeslagen.');
    });

    // Banner Customize
    bannerCustomize.addEventListener('click', function() {
        cookieBanner.classList.remove('show');
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 300);
    });

    // Close popup
    cookieClose.addEventListener('click', function() {
        cookieConsent.classList.remove('show');
        // Show banner again if no choice was made
        if (!getCookie('cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 500);
        }
    });

    // Toggle details
    detailsToggle.addEventListener('click', function() {
        detailsContent.classList.toggle('show');
        detailsToggle.classList.toggle('active');
    });

    // Reject All (Essential only)
    rejectAll.addEventListener('click', function() {
        analyticsCookies.checked = false;
        marketingCookies.checked = false;
        setCookieConsent('essential');
        cookieConsent.classList.remove('show');
        showThankYouMessage('Alleen noodzakelijke cookies geaccepteerd.');
    });

    // Accept Selected
    acceptSelected.addEventListener('click', function() {
        const preferences = {
            analytics: analyticsCookies.checked,
            marketing: marketingCookies.checked
        };
        setCookieConsent('selected', preferences);
        cookieConsent.classList.remove('show');
        showThankYouMessage('Uw cookie voorkeuren zijn opgeslagen.');
    });

    // Accept All
    acceptAll.addEventListener('click', function() {
        analyticsCookies.checked = true;
        marketingCookies.checked = true;
        setCookieConsent('all');
        cookieConsent.classList.remove('show');
        showThankYouMessage('Alle cookies geaccepteerd. Bedankt!');
    });

    // Cookie management functions
    function setCookieConsent(type, preferences = {}) {
        const consent = {
            essential: true,
            analytics: type === 'all' || (type === 'selected' && preferences.analytics),
            marketing: type === 'all' || (type === 'selected' && preferences.marketing),
            timestamp: new Date().toISOString()
        };
        
        // Set cookie for 1 year
        setCookie('cookie_consent', JSON.stringify(consent), 365);
        
        // Apply cookie settings
        applyCookieSettings(consent);
    }

    function applyCookieSettings(consent) {
        if (consent.analytics) {
            enableAnalyticsCookies();
        } else {
            disableAnalyticsCookies();
        }
        
        if (consent.marketing) {
            enableMarketingCookies();
        } else {
            disableMarketingCookies();
        }
        
        // Always enable essential cookies
        enableEssentialCookies();
    }

    function enableAnalyticsCookies() {
        console.log('Analytics cookies enabled');
        // Add your analytics code here (Google Analytics, etc.)
    }

    function disableAnalyticsCookies() {
        console.log('Analytics cookies disabled');
        // Disable your analytics tracking here
    }

    function enableMarketingCookies() {
        console.log('Marketing cookies enabled');
        // Add your marketing tracking code here
    }

    function disableMarketingCookies() {
        console.log('Marketing cookies disabled');
        // Disable marketing tracking here
    }

    function enableEssentialCookies() {
        console.log('Essential cookies enabled');
        // Essential cookies are always enabled
    }

    // Utility functions
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function showThankYouMessage(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize based on existing consent
    const existingConsent = getCookie('cookie_consent');
    if (existingConsent) {
        try {
            const consent = JSON.parse(existingConsent);
            applyCookieSettings(consent);
            
            // Update toggle states in popup if open
            if (consent.analytics) analyticsCookies.checked = true;
            if (consent.marketing) marketingCookies.checked = true;
        } catch (e) {
            console.error('Error parsing cookie consent:', e);
        }
    }
});