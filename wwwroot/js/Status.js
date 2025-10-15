// Status Page JavaScript with Enhanced Effects
document.addEventListener('DOMContentLoaded', function () {
    initializeStatusPage();
    initializeHoverEffects();
    initializeSignalR();
});

function initializeStatusPage() {
    console.log('SOS Status Page Initialized');

    // Add loading animation to cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
}

function initializeHoverEffects() {
    // Enhanced hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll(
        '.glass-card, .status-badge, .media-image, .action-btn, .info-item, .detail-item'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Special hover for status badges
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });

        badge.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0)';
        });
    });
}

function initializeSignalR() {
    const connection = new signalR.HubConnectionBuilder().withUrl("/soshub").build();

    // Live new SOS alerts
    connection.on("ReceiveSOS", (
        userName, location, description, sosId,
        reporterName, reporterPhone, reporterEmail,
        animalType, animalCondition, emergencyType, mediaPaths
    ) => {
        showNewSOSAlert(userName, location, description);
        playAlertSound();
        addNewSOSCard(sosId, reporterName, reporterPhone, animalType, emergencyType, description, location, mediaPaths);
    });

    // Live status updates
    connection.on("SOSUpdated", (sosId, newStatus) => {
        updateSOSStatus(sosId, newStatus);
        if (newStatus === "Contacted") {
            showContactedToast();
        }
    });

    connection.start().catch(err => console.error('SignalR connection error:', err));
}

function showNewSOSAlert(userName, location, description) {
    const alertsContainer = document.getElementById('alerts');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-card';
    alertDiv.innerHTML = `
        <strong>🚨 New SOS Alert!</strong>
        <div>From: <strong>${userName}</strong></div>
        <div>📍 ${location}</div>
        <div>${description}</div>
    `;

    alertsContainer.appendChild(alertDiv);

    // Auto-remove alert after 8 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => alertDiv.remove(), 500);
    }, 8000);
}

function playAlertSound() {
    // Create a simple alert sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Emergency alert sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (e) {
        console.log('Audio context not supported');
    }
}

function addNewSOSCard(sosId, reporterName, reporterPhone, animalType, emergencyType, description, location, mediaPaths) {
    if (!document.getElementById(`sos-${sosId}`)) {
        const container = document.getElementById('sosContainer');

        let mediaHtml = "";
        if (mediaPaths) {
            mediaHtml = `
                <div class="media-gallery">
                    <p class="media-label">Attached Media:</p>
                    <div class="media-grid">
                        ${mediaPaths.split(',').map(path =>
                `<img src="${path}" alt="SOS Media" class="media-image" />`
            ).join('')}
                    </div>
                </div>
            `;
        }

        const col = document.createElement('div');
        col.className = 'glass-card sos-card animate-fade-in';
        col.id = `sos-${sosId}`;
        col.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${animalType} - ${emergencyType}</h3>
                    <div class="status-badge status-pending">Pending</div>
                </div>
                <div class="reporter-info">
                    <div class="info-item">
                        <i class="fas fa-user mr-2"></i>
                        <span>${reporterName}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-phone mr-2"></i>
                        <span>${reporterPhone}</span>
                    </div>
                </div>
                <p class="card-description">${description}</p>
                <div class="details-grid">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt mr-2"></i>
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock mr-2"></i>
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${new Date().toLocaleString()}</span>
                    </div>
                </div>
                ${mediaHtml}
            </div>
        `;

        container.prepend(col);
        initializeHoverEffects(); // Re-initialize hover effects for new card
    }
}

function updateSOSStatus(sosId, newStatus) {
    const card = document.getElementById(`sos-${sosId}`);
    if (card) {
        const badge = card.querySelector('.status-badge');
        if (badge) {
            badge.textContent = newStatus;

            // Remove all status classes
            badge.classList.remove('status-pending', 'status-accepted', 'status-contacted', 'status-completed', 'status-default');

            // Add new status class
            const statusClass = newStatus.toLowerCase() === 'pending' ? 'status-pending' :
                newStatus.toLowerCase() === 'accepted' ? 'status-accepted' :
                    newStatus.toLowerCase() === 'contacted' ? 'status-contacted' :
                        newStatus.toLowerCase() === 'completed' ? 'status-completed' : 'status-default';
            badge.classList.add(statusClass);

            // Add update animation
            badge.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                badge.style.animation = '';
            }, 500);
        }
    }
}

function showContactedToast() {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-3 text-xl"></i>
            <div class="toast-body">✅ Your SOS has been contacted by a vet!</div>
        </div>
    `;

    const alertsContainer = document.getElementById('alerts');
    alertsContainer.appendChild(toast);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .animate-fade-in {
        animation: fade-in 0.6s ease-out;
    }
`;
document.head.appendChild(style);