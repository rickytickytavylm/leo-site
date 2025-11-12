// ========================================
// Progress Bar
// ========================================
const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateProgressBar);

// ========================================
// Navbar Blur on Scroll
// ========================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function handleNavbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleNavbar);

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
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

// ========================================
// Stats Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format numbers
        if (target === 2000 && current >= target) {
            element.textContent = '2 000+';
        } else if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString('ru-RU');
        } else if (target % 1 !== 0) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate stats when hero section is visible
            if (entry.target.classList.contains('hero-stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
            
            // Unobserve after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements (только на мобильных)
const isDesktopForAnimation = window.matchMedia('(min-width: 769px)').matches;

document.querySelectorAll('.glass-card, .hero-stats, .benefit-card').forEach(el => {
    if (!isDesktopForAnimation || el.classList.contains('hero-stats') || el.classList.contains('benefit-card')) {
        observer.observe(el);
    } else {
        el.classList.add('visible');
    }
});

// ========================================
// Cursor Glow Effect (Desktop Only)
// ========================================
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Check if device is desktop (используем переменную, определенную выше)
const isDesktop = isDesktopForAnimation;

if (isDesktop) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    // Smooth cursor follow
    function animateCursor() {
        const diffX = mouseX - cursorX;
        const diffY = mouseY - cursorY;
        
        cursorX += diffX * 0.1;
        cursorY += diffY * 0.1;
        
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hide cursor glow when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });
}

// ========================================
// Parallax Effect for Hero Mockup
// ========================================
const heroMockup = document.querySelector('.hero-mockup');

if (heroMockup && isDesktop) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.3;
        heroMockup.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// ========================================
// Feature Cards Stagger Animation
// ========================================
const featureCards = document.querySelectorAll('.feature-card');

// Применяем только на мобильных
if (!isDesktopForAnimation) {
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ========================================
// Lazy Loading Images
// ========================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// ========================================
// Performance Optimization: Debounce
// ========================================
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

// Debounce scroll events
const debouncedScroll = debounce(() => {
    updateProgressBar();
    handleNavbar();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// Button Ripple Effect
// ========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Scroll to Top on Logo Click
// ========================================
document.querySelectorAll('.logo').forEach(logo => {
    logo.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ========================================
// Prevent FOUC (Flash of Unstyled Content)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// Auto-hide scroll indicator on scroll
// ========================================
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ========================================
// Dynamic Year for Copyright
// ========================================
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('.footer-copyright');
if (copyrightElement) {
    copyrightElement.textContent = `© ${currentYear} Leo Recovery. Все права защищены.`;
}

// ========================================
// Console Message
// ========================================
console.log('%cLeo Recovery', 'color: #7c3aed; font-size: 24px; font-weight: bold;');
console.log('%cВаш путь к восстановлению начинается здесь.', 'color: #6366f1; font-size: 14px;');

// ========================================
// Analytics Events (Optional - для будущего)
// ========================================
function trackEvent(eventName, eventData) {
    // Здесь можно добавить отправку событий в аналитику
    console.log('Event:', eventName, eventData);
}

// Track button clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('download_button_clicked', {
            location: btn.closest('section')?.id || 'unknown'
        });
    });
});

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            trackEvent('section_viewed', {
                section: entry.target.id
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ========================================
// Error Handling for Images
// ========================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Failed to load image:', this.src);
        // Можно добавить placeholder вместо битой картинки
        this.style.opacity = '0.3';
    });
});

// ========================================
// Preload Critical Images
// ========================================
function preloadImage(url) {
    const img = new Image();
    img.src = url;
}

// Preload hero backgrounds
if (isDesktop) {
    preloadImage('assets/rusMocups/dekstopBackground.jpg');
} else {
    preloadImage('assets/rusMocups/mobileBackground.jpg');
}

// ========================================
// Handle External Links
// ========================================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// ========================================
// Accessibility: Focus Visible
// ========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid #7c3aed;
        outline-offset: 4px;
    }
`;
document.head.appendChild(focusStyle);

// ========================================
// Initialize Everything on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Leo Recovery landing page loaded');
    
    // Set initial state
    updateProgressBar();
    handleNavbar();
    
    // Trigger initial animations (только на мобильных)
    if (!isDesktopForAnimation) {
        setTimeout(() => {
            document.querySelectorAll('.animate-fade-in').forEach(el => {
                el.style.opacity = '1';
            });
        }, 100);
    }
});

// ========================================
// Handle Resize Events
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate layouts if needed
        updateProgressBar();
    }, 250);
});

// ========================================
// Service Worker Registration (Optional - PWA)
// ========================================
if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered', reg))
    //     .catch(err => console.log('Service Worker registration failed', err));
}

// ========================================
// Haptic Feedback (Vibration)
// ========================================
function hapticFeedback(duration = 10) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// ========================================
// Mobile Bottom Navigation
// ========================================
const mobileNav = document.querySelector('.mobile-bottom-nav');
const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
let lastScrollY = 0;
let scrollThreshold = 100;

// Show/hide mobile nav on scroll
function handleMobileNav() {
    const currentScrollY = window.pageYOffset;
    
    if (currentScrollY > scrollThreshold) {
        mobileNav.classList.add('visible');
    } else {
        mobileNav.classList.remove('visible');
    }
    
    lastScrollY = currentScrollY;
}

// Update active nav item based on scroll position
function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                const href = item.getAttribute('href').substring(1);
                
                // Map section IDs to nav items
                if (
                    (sectionId === 'home' && href === 'home') ||
                    (sectionId === 'features' && href === 'features') ||
                    (sectionId === 'download' && href === 'download') ||
                    (sectionId === 'community' && href === 'community')
                ) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Smooth scroll for mobile nav with offset
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        hapticFeedback(15); // Vibration on tap
        
        const targetId = item.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Different offsets for different sections
            let offset = 80; // Default offset for navbar
            
            if (targetId === 'features') {
                offset = 120; // More space for features section
            } else if (targetId === 'download') {
                offset = 140; // Even more space for download section
            } else if (targetId === 'home') {
                offset = 0; // No offset for home
            }
            
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Throttle scroll events
let scrollTimer;
window.addEventListener('scroll', () => {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    
    scrollTimer = setTimeout(() => {
        handleMobileNav();
        updateActiveNavItem();
    }, 10);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    handleMobileNav();
    updateActiveNavItem();
});

// ========================================
// Modal Windows
// ========================================
const aboutModal = document.getElementById('aboutModal');
const privacyModal = document.getElementById('privacyModal');

const aboutLink = document.querySelector('.about-link');
const privacyLink = document.querySelector('.privacy-link');

const modalCloseButtons = document.querySelectorAll('.modal-close');

// Open modals
if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close modals
modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal on outside click
[aboutModal, privacyModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        [aboutModal, privacyModal].forEach(modal => {
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

