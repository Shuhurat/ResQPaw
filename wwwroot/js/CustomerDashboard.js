// Customer Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeCustomerDashboard();
    initializeHoverEffects();
    initializeAnimations();
    initializeRealTimeUpdates();
});

function initializeCustomerDashboard() {
    console.log('Customer Dashboard Initialized');

    // Add entrance animations to elements
    const elements = document.querySelectorAll('.stat-card, .action-card, .activity-item');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-entrance');
    });
}

function initializeHoverEffects() {
    // Enhanced hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll(
        '.stat-card, .action-card, .activity-item, .dashboard-title, .welcome-message, .intro-text, .section-title'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            if (this.classList.contains('stat-card') || this.classList.contains('action-card')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
            } else {
                this.style.transform = 'translateY(-2px)';
            }
        });

        element.addEventListener('mouseleave', function () {
            if (this.classList.contains('stat-card') || this.classList.contains('action-card')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            } else {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Special hover for emergency action card
    const emergencyCard = document.querySelector('.action-card.emergency');
    if (emergencyCard) {
        emergencyCard.addEventListener('mouseenter', function () {
            this.style.animation = 'emergencyGlow 1s ease-in-out infinite';
        });

        emergencyCard.addEventListener('mouseleave', function () {
            this.style.animation = '';
        });
    }
}

function initializeAnimations() {
    // Add ripple effect to action cards
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Animate stats counting up
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });
}

function initializeRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateActivityStatus();
        updateStats();
    }, 8000);
}

function updateActivityStatus() {
    const activities = [
        { text: 'New message from support team', type: 'info', icon: 'fa-comment' },
        { text: 'SOS request status updated', type: 'warning', icon: 'fa-sync' },
        { text: 'Emergency contact available', type: 'success', icon: 'fa-phone' }
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const activityList = document.querySelector('.activity-list');

    if (activityList && Math.random() > 0.8) { // 20% chance to add new activity
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item animate-entrance';
        activityItem.innerHTML = `
            <div class="activity-icon ${randomActivity.type}">
                <i class="fas ${randomActivity.icon}"></i>
            </div>
            <div class="activity-content">
                <span class="activity-text">${randomActivity.text}</span>
                <span class="activity-time">just now</span>
            </div>
        `;

        activityList.prepend(activityItem);

        // Remove oldest activity if more than 5
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    }
}

function updateStats() {
    // Simulate stat updates
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const current = parseInt(stat.textContent);
        const change = Math.random() > 0.7 ? 1 : 0;
        const newValue = current + change;

        if (change > 0) {
            // Add visual feedback
            const card = stat.closest('.stat-card');
            card.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes animate-entrance {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1); 
        }
        50% { 
            transform: scale(1.05); 
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes emergencyGlow {
        0%, 100% {
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
        }
        50% {
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4);
        }
    }
    
    .animate-entrance {
        animation: animate-entrance 0.6s ease-out both;
    }
`;
document.head.appendChild(style);

// Export functions for potential module use
window.CustomerDashboard = {
    initialize: initializeCustomerDashboard,
    refresh: initializeRealTimeUpdates
};