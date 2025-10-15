// Landing page JavaScript design
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    initializeMobileMenu();
    initializeAnimations();
    initializeSOSButton();
    initializeScrollEffects();
    initializeParallax();
    //initializeCursorEffects();
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            // Animate icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
}

// Advanced Animations and Effects
function initializeAnimations() {
    // Add floating animation to elements
    const floatingElements = document.querySelectorAll('.float-animation');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

    // hover sound effects to buttons
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            createRippleEffect(this);
        });
    });
}

// Ripple Effect for Buttons
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}


const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes emergency-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Scroll Animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Add staggered animation
                if (entry.target.classList.contains('feature-card') ||
                    entry.target.classList.contains('glass-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1;
                    entry.target.style.transitionDelay = `${delay}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.feature-card, .glass-card, .hover-lift').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Parallax Effect
function initializeParallax() {
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// SOS Button Enhancement
function initializeSOSButton() {
    const sosButton = document.querySelector('.sos-btn-round');
    if (sosButton) {
        sosButton.addEventListener('mouseenter', function () {
            this.style.animation = 'emergency-pulse 0.5s infinite';
        });

        sosButton.addEventListener('mouseleave', function () {
            this.style.animation = 'sos-pulse 2s infinite';
        });

        // Click effect
        sosButton.addEventListener('click', function (e) {
            createClickWave(this);
        });
    }
}

function createClickWave(element) {
    const wave = document.createElement('div');
    wave.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.6);
        transform: scale(0);
        animation: click-wave 0.6s ease-out;
        pointer-events: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    `;

    element.appendChild(wave);
    setTimeout(() => wave.remove(), 600);
}

// click wave animation to CSS
const waveStyle = document.createElement('style');
waveStyle.textContent = `
    @keyframes click-wave {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
`;
document.head.appendChild(waveStyle);

// Cursor Effects
`function initializeCursorEffects() {
    const cursor = document.createElement('div');
    cursor.style.cssText = 
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(245, 158, 11, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    ;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .glass-card, .nav-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'rgba(239, 68, 68, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(245, 158, 11, 0.5)';
        });
    });
}`

// Utility function for showing loading states
function showLoading(element) {
    element.disabled = true;
    const originalText = element.innerHTML;
    element.innerHTML = '<div class="spinner"></div>';
    return () => {
        element.disabled = false;
        element.innerHTML = originalText;
    };
}

// Enhanced form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            const resetButton = showLoading(submitButton);
            // Reset button after 3 seconds if still disabled (fallback)
            setTimeout(resetButton, 3000);
        }
    });
});

// Export functions for global access
window.showLoading = showLoading;
window.createRippleEffect = createRippleEffect;