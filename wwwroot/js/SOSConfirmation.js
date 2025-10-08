// SOS Confirmation Page JavaScript
class SOSConfirmation {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupEventListeners();
        this.startProgressSimulation();
        this.setupInteractiveElements();
    }

    setupAnimations() {
        // Animate elements on page load
        this.animateOnScroll();
        
        // Add entrance animations to cards
        const cards = document.querySelectorAll('.confirmation-details, .next-steps, .emergency-contact');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }

    animateOnScroll() {
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

        // Observe all interactive elements
        document.querySelectorAll('.detail-item, .step-item, .contact-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupEventListeners() {
        // Add click effects to buttons
        const buttons = document.querySelectorAll('.action-buttons a');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.addRippleEffect(e);
            });
        });

        // Add hover sounds (optional)
        this.setupHoverSounds();
        
        // Copy case ID to clipboard
        this.setupCopyToClipboard();
    }

    addRippleEffect(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    setupHoverSounds() {
        // Optional: Add sound effects on hover
        const interactiveElements = document.querySelectorAll('.detail-item, .step-item, .contact-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                // You can add subtle sound effects here
                this.createHoverSound();
            });
        });
    }

    createHoverSound() {
        // Create a subtle hover sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Audio context not supported or autoplay restricted
            console.log('Audio not supported');
        }
    }

    setupCopyToClipboard() {
        const caseIdElement = document.getElementById('caseId');
        if (caseIdElement) {
            caseIdElement.style.cursor = 'pointer';
            caseIdElement.title = 'Click to copy Case ID';
            
            caseIdElement.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(caseIdElement.textContent);
                    this.showNotification('Case ID copied to clipboard!', 'success');
                } catch (err) {
                    console.error('Failed to copy: ', err);
                    this.showNotification('Failed to copy Case ID', 'error');
                }
            });
        }
    }

    startProgressSimulation() {
        const progressBar = document.querySelector('.progress-bar-animation');
        const progressText = document.getElementById('progressText');
        const steps = [
            { width: '25%', text: 'Team Dispatched' },
            { width: '50%', text: 'En Route' },
            { width: '75%', text: 'On Site' },
            { width: '100%', text: 'Animal Safe' }
        ];

        let currentStep = 0;

        const simulateProgress = () => {
            if (currentStep < steps.length) {
                progressBar.style.width = steps[currentStep].width;
                progressText.textContent = steps[currentStep].text;
                currentStep++;
                
                if (currentStep < steps.length) {
                    setTimeout(simulateProgress, 3000); // Update every 3 seconds
                }
            }
        };

        // Start simulation after initial delay
        setTimeout(simulateProgress, 2000);
    }

    setupInteractiveElements() {
        // Add parallax effect to background elements
        this.setupParallax();
        
        // Add confetti effect on page load
        this.createConfetti();
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element, .floating-element-2');
            
            parallaxElements.forEach(element => {
                const speed = element.classList.contains('floating-element') ? 0.5 : 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    createConfetti() {
        const confettiCount = 50;
        const colors = ['#10B981', '#059669', '#F59E0B', '#D97706', '#EF4444'];
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors);
            }, i * 50);
        }
    }

    createConfettiPiece(colors) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            top: -10px;
            left: ${Math.random() * 100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            opacity: 0.8;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${360 * Math.random()}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #EF4444, #DC2626)'};
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}

// Add CSS for animations
const confirmationStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
}
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = confirmationStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.sosConfirmation = new SOSConfirmation();
});