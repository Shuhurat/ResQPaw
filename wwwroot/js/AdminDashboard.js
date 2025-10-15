// Professional Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeAdminDashboard();
    initializeAnimations();
    initializeRealTimeUpdates();
    initializeInteractiveElements();
});

function initializeAdminDashboard() {
    console.log('Professional Admin Dashboard Initialized');

    // Add staggered entrance animations
    const elements = document.querySelectorAll('.stat-card, .welcome-card, .action-btn, .quick-action-btn');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-entrance');
    });
}

function initializeAnimations() {
    // Initialize GSAP animations if available, fallback to CSS
    if (typeof gsap !== 'undefined') {
        gsap.from('.dashboard-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.stat-card', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // Add hover effects with enhanced animations
    const interactiveCards = document.querySelectorAll('.stat-card, .action-btn, .quick-action-btn');

    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });

    // Emergency button special effects
    const emergencyBtn = document.querySelector('.action-btn.danger');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('mouseenter', function () {
            this.style.animation = 'emergencyGlow 1s ease-in-out infinite';
        });

        emergencyBtn.addEventListener('mouseleave', function () {
            this.style.animation = '';
        });
    }
}

function initializeRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
        updateActiveSOS();
        updateSystemMetrics();
        addRecentActivity();
    }, 5000);

    // Initialize live counters
    animateValue('.stat-card.warning .stat-value', 23, 30, 2000);
    animateValue('.stat-card.primary .stat-value', 1247, 1300, 3000);
}

function updateActiveSOS() {
    const sosElement = document.querySelector('.stat-card.warning .stat-value');
    if (sosElement) {
        const current = parseInt(sosElement.textContent);
        const change = Math.random() > 0.7 ? 1 : (Math.random() > 0.3 ? -1 : 0);
        const newValue = Math.max(0, current + change);

        if (newValue !== current) {
            animateValue('.stat-card.warning .stat-value', current, newValue, 1000);

            // Add visual feedback
            const card = sosElement.closest('.stat-card');
            card.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => card.style.animation = '', 600);
        }
    }
}

function updateSystemMetrics() {
    const metrics = document.querySelectorAll('.metric-fill');
    metrics.forEach(metric => {
        const currentWidth = parseInt(metric.style.width);
        const newWidth = Math.max(10, Math.min(95, currentWidth + (Math.random() * 20 - 10)));
        metric.style.width = `${newWidth}%`;

        const valueElement = metric.closest('.metric').querySelector('.metric-value');
        if (valueElement) {
            valueElement.textContent = `${Math.round(newWidth)}%`;
        }
    });
}

function addRecentActivity() {
    const activities = [
        { text: 'System backup completed', type: 'success', icon: 'fa-check' },
        { text: 'New user registration', type: 'info', icon: 'fa-user-plus' },
        { text: 'Database optimization', type: 'info', icon: 'fa-database' },
        { text: 'Security scan completed', type: 'success', icon: 'fa-shield-check' }
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const activityList = document.querySelector('.activity-list');

    if (activityList && Math.random() > 0.7) { // 30% chance to add new activity
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
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

        // Animate new item
        activityItem.style.animation = 'slideInRight 0.5s ease-out';
    }
}

function animateValue(selector, start, end, duration) {
    const element = document.querySelector(selector);
    if (!element) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initializeInteractiveElements() {
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.action-btn, .quick-action-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
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

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('.action-btn.primary')?.click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('.action-btn.danger')?.click();
                    break;
                case 'm':
                    e.preventDefault();
                    // Focus search or open menu
                    break;
            }
        }
    });

    // Add resize observer for responsive adjustments
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentRect.width < 768) {
                document.body.classList.add('mobile-view');
            } else {
                document.body.classList.remove('mobile-view');
            }
        }
    });

    resizeObserver.observe(document.body);
}

// Add custom CSS animations
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
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes emergencyGlow {
        0%, 100% {
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
        }
        50% {
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.6);
        }
    }
    
    .animate-entrance {
        animation: animate-entrance 0.6s ease-out both;
    }
    
    /* Performance optimizations */
    .dashboard-grid, .stat-card, .action-btn {
        will-change: transform;
    }
    
    /* Mobile optimizations */
    .mobile-view .dashboard-title {
        font-size: 2rem !important;
    }
    
    .mobile-view .action-buttons-grid {
        grid-template-columns: 1fr !important;
    }
`;
document.head.appendChild(style);

// Export functions for potential module use
window.AdminDashboard = {
    initialize: initializeAdminDashboard,
    refreshData: initializeRealTimeUpdates
};