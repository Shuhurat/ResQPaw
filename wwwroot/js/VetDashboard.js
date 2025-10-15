// Vet Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeVetDashboard();
    initializeHoverEffects();
    initializeAnimations();
    initializeRealTimeUpdates();
    initializeEmergencyAlerts();
});

function initializeVetDashboard() {
    console.log('Vet Dashboard Initialized');

    // Add entrance animations to elements
    const elements = document.querySelectorAll('.stat-card, .action-card, .tool-card, .protocol-card');
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-entrance');
    });

    // Initialize tooltips and interactive elements
    initializeTooltips();
    initializeQuickActions();
}

function initializeHoverEffects() {
    // Enhanced hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll(
        '.stat-card, .action-card, .tool-card, .protocol-card, .dashboard-title, .welcome-message, .intro-text, .section-title'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            if (this.classList.contains('stat-card') || this.classList.contains('action-card')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
            } else if (this.classList.contains('tool-card') || this.classList.contains('protocol-card')) {
                this.style.transform = 'translateY(-5px)';
            } else {
                this.style.transform = 'translateY(-2px)';
            }
        });

        element.addEventListener('mouseleave', function () {
            if (this.classList.contains('stat-card') || this.classList.contains('action-card')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            } else if (this.classList.contains('tool-card') || this.classList.contains('protocol-card')) {
                this.style.transform = 'translateY(0)';
            } else {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Special hover effect for vet avatar
    const vetAvatar = document.querySelector('.vet-avatar');
    if (vetAvatar) {
        vetAvatar.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.15) rotate(8deg)';
            this.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.6)';
        });

        vetAvatar.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
        });
    }
}

function initializeAnimations() {
    // Create CSS for entrance animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        .animate-entrance {
            animation: slideInUp 0.6s ease-out forwards;
            opacity: 0;
        }
        
        .welcome-header {
            animation: fadeIn 1s ease-out 0.2s forwards;
            opacity: 0;
        }
        
        .stats-section {
            animation: fadeIn 1s ease-out 0.4s forwards;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // Animate stats counters
    animateStatCounters();
}

function animateStatCounters() {
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
    // Simulate real-time updates for the dashboard
    setInterval(() => {
        updateEmergencyStats();
        checkForNewAlerts();
    }, 30000); // Update every 30 seconds

    // Initial update
    updateEmergencyStats();
}

function updateEmergencyStats() {
    // Simulate updating emergency statistics
    const emergencyStat = document.querySelector('.stat-card:nth-child(1) .stat-number');
    if (emergencyStat) {
        const current = parseInt(emergencyStat.textContent);
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(0, current + change);
        emergencyStat.textContent = newValue;

        // Update trend indicator
        const trend = emergencyStat.closest('.stat-card').querySelector('.stat-trend');
        if (trend) {
            if (change > 0) {
                trend.innerHTML = '<i class="fas fa-arrow-up"></i> New emergency';
                trend.className = 'stat-trend up';
            } else if (change < 0) {
                trend.innerHTML = '<i class="fas fa-arrow-down"></i> Case resolved';
                trend.className = 'stat-trend down';
            } else {
                trend.innerHTML = '<i class="fas fa-minus"></i> No change';
                trend.className = 'stat-trend steady';
            }
        }
    }
}

function checkForNewAlerts() {
    // Simulate checking for new emergency alerts
    const hasNewAlerts = Math.random() > 0.7; // 30% chance of new alert

    if (hasNewAlerts) {
        showNewAlertNotification();
    }
}

function showNewAlertNotification() {
    // Create and show a notification for new alerts
    const notification = document.createElement('div');
    notification.className = 'alert-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-bell"></i>
            <span>New emergency alert received!</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles for notification
    const style = document.createElement('style');
    style.textContent = `
        .alert-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
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
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.5s ease-out reverse forwards';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 5000);
}

function initializeEmergencyAlerts() {
    // Listen for emergency alert buttons
    const emergencyButtons = document.querySelectorAll('.action-btn.warning, .action-btn.primary');

    emergencyButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            if (this.classList.contains('warning') || this.getAttribute('href')?.includes('SOS')) {
                e.preventDefault();
                simulateEmergencyResponse(this);
            }
        });
    });
}

function simulateEmergencyResponse(button) {
    const originalText = button.innerHTML;

    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Emergency System...';
    button.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Connected to Emergency Network';
        button.style.background = 'linear-gradient(135deg, #10b981, #047857)';

        // Redirect after short delay if it's an SOS dashboard button
        if (button.getAttribute('href')?.includes('SOS')) {
            setTimeout(() => {
                window.location.href = button.getAttribute('href');
            }, 1000);
        } else {
            // Revert button after 3 seconds
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                if (button.classList.contains('warning')) {
                    button.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                }
            }, 3000);
        }
    }, 2000);
}

function initializeTooltips() {
    // Add tooltips to various elements
    const elementsWithTooltips = [
        { selector: '.stat-card', text: 'Click to view detailed statistics' },
        { selector: '.tool-card', text: 'Click to access this tool' },
        { selector: '.protocol-card', text: 'Emergency protocol guidelines' },
        { selector: '.vet-avatar', text: 'Your professional profile' }
    ];

    elementsWithTooltips.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(element => {
            element.setAttribute('title', item.text);
        });
    });
}

function initializeQuickActions() {
    // Add click handlers for quick access tools
    const toolCards = document.querySelectorAll('.tool-card');

    toolCards.forEach(card => {
        card.addEventListener('click', function () {
            const toolTitle = this.querySelector('.tool-title').textContent;
            showToolModal(toolTitle);
        });
    });
}

function showToolModal(toolName) {
    // Create a modal for tool access
    const modal = document.createElement('div');
    modal.className = 'tool-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Access ${toolName}</h3>
            <p>This feature is currently being developed and will be available soon.</p>
            <div class="modal-actions">
                <button class="modal-close">Got it</button>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .tool-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            animation: slideInUp 0.3s ease-out;
        }
        
        .modal-content h3 {
            color: #1e293b;
            margin-bottom: 1rem;
            font-size: 1.4rem;
        }
        
        .modal-content p {
            color: #475569;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }
        
        .modal-close {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
    `;

    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Close modal functionality
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.style.animation = 'fadeIn 0.3s ease-out reverse forwards';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Export functions for global access if needed
window.VetDashboard = {
    initializeVetDashboard,
    showNewAlertNotification,
    simulateEmergencyResponse
};