// Emergency SOS Dashboard - Ultra Professional JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
    initializeSignalR();
    initializeInteractions();
});

function initializeDashboard() {
    console.log('🔄 Emergency SOS Dashboard Initialized');

    // Add professional entrance animations
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
        card.classList.add('animate-fade-in');
    });

    // Add hover effects to titles
    initializeTitleHoverEffects();

    // Initialize real-time stats
    updateStats();

    // Add professional loading states
    addProfessionalLoadingStates();
}

function initializeTitleHoverEffects() {
    const dashboardTitle = document.querySelector('.dashboard-title');
    const dashboardSubtitle = document.querySelector('.dashboard-subtitle');
    const sectionTitle = document.querySelector('.section-title');

    if (dashboardTitle) {
        dashboardTitle.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-6px) scale(1.08)';
        });

        dashboardTitle.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    if (dashboardSubtitle) {
        dashboardSubtitle.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
        });

        dashboardSubtitle.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    }

    if (sectionTitle) {
        sectionTitle.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        sectionTitle.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
}

function initializeSignalR() {
    // Ultra Professional SignalR Connection
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/sosHub")
        .withAutomaticReconnect([0, 1000, 3000, 5000, 10000])
        .build();

    // Professional connection status handling
    connection.onreconnecting((error) => {
        console.warn('🔄 Reconnecting to SOS Hub...', error);
        showProfessionalConnectionStatus("Reconnecting to emergency hub...", "warning");
    });

    connection.onreconnected((connectionId) => {
        console.log('✅ Reconnected to SOS Hub with connection ID:', connectionId);
        showProfessionalConnectionStatus("Reconnected to emergency hub", "success");
        updateStats();
    });

    connection.onclose((error) => {
        console.error('❌ Disconnected from SOS Hub:', error);
        showProfessionalConnectionStatus("Disconnected from emergency hub", "error");
    });

    // When a new SOS is received - Using exact parameters from your backend
    connection.on("ReceiveSOS", function (customerName, location, description, sosId, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType) {
        console.log('🚨 New SOS Alert Received:', {
            customerName, location, description, sosId,
            reporterName, reporterPhone, reporterEmail,
            animalType, animalCondition, emergencyType
        });
        handleNewSOSAlert(customerName, location, description, sosId, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType);
    });

    // Professional connection startup
    connection.start()
        .then(() => {
            console.log('✅ SignalR Connected to Emergency Hub');
            showProfessionalConnectionStatus("Connected to emergency hub - Monitoring for SOS alerts", "success");
            addProfessionalConnectionIndicator();
        })
        .catch(err => {
            console.error('❌ SignalR Connection Failed:', err);
            showProfessionalConnectionStatus("Failed to connect to emergency hub", "error");
            showProfessionalRetryButton();
        });

    // Store connection globally
    window.sosConnection = connection;
}

function handleNewSOSAlert(customerName, location, description, sosId, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType) {
    // Create ultra professional alert banner
    createUltraProfessionalAlertBanner(customerName, location, description, reporterName, animalType, animalCondition, emergencyType);

    // Add new row to table with professional animation
    addProfessionalSOSTableRow(customerName, location, description, sosId, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType);

    // Update statistics with professional animation
    updateStats();

    // Show professional desktop notification
    showProfessionalDesktopNotification(customerName, emergencyType, location);

    // Play professional notification sound
    playProfessionalNotificationSound();
}

function createUltraProfessionalAlertBanner(customerName, location, description, reporterName, animalType, animalCondition, emergencyType) {
    const alertBox = document.createElement("div");
    alertBox.className = "alert-banner";
    alertBox.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex items-start space-x-4">
                <div class="text-2xl mt-1 animate-pulse">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-xl font-bold mb-4">🚨 NEW EMERGENCY ALERT</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Customer:</strong> ${customerName}</div>
                        <div><strong>Reporter:</strong> ${reporterName}</div>
                        <div><strong>Location:</strong> ${location}</div>
                        <div><strong>Animal:</strong> ${animalType}</div>
                        <div><strong>Condition:</strong> ${animalCondition}</div>
                        <div><strong>Emergency:</strong> ${emergencyType}</div>
                    </div>
                    <div class="mt-3 p-3 bg-white bg-opacity-20 rounded-lg">
                        <strong>Description:</strong> ${description}
                    </div>
                </div>
            </div>
            <button onclick="professionalDismissAlert(this)" 
                    class="text-white hover:text-yellow-200 text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 ml-4">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.getElementById("alert-container").prepend(alertBox);

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        if (alertBox.parentElement) {
            professionalDismissAlert(alertBox.querySelector('button'));
        }
    }, 10000);
}

function professionalDismissAlert(button) {
    const alertBox = button.closest('.alert-banner');
    if (alertBox) {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateX(100%) scale(0.9)';
        alertBox.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => alertBox.remove(), 400);
    }
}

function addProfessionalSOSTableRow(customerName, location, description, sosId, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType) {
    const newRow = document.createElement("tr");
    newRow.className = "table-row animate-fade-in bg-blue-50 border-l-4 border-l-blue-500";
    newRow.id = `sos-${sosId}`;
    newRow.innerHTML = `
        <td class="table-cell customer-cell">
            <div class="customer-info">
                <div class="customer-email">${customerName}</div>
            </div>
        </td>
        <td class="table-cell">
            <span class="reporter-name">${reporterName}</span>
        </td>
        <td class="table-cell">
            <span class="phone-number">${reporterPhone}</span>
        </td>
        <td class="table-cell">
            <span class="email-address">${reporterEmail}</span>
        </td>
        <td class="table-cell">
            <span class="animal-type-badge">${animalType}</span>
        </td>
        <td class="table-cell">
            <span class="condition-text">${animalCondition}</span>
        </td>
        <td class="table-cell">
            <span class="emergency-type-badge">${emergencyType}</span>
        </td>
        <td class="table-cell">
            <span class="location-text">${location}</span>
        </td>
        <td class="table-cell">
            <span class="message-text" title="${description}">${description}</span>
        </td>
        <td class="table-cell">
            <span class="status-badge pending">Pending</span>
        </td>
        <td class="table-cell">
            <span class="timestamp">${new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })}</span>
        </td>
    `;

    document.getElementById("sosTableBody").prepend(newRow);

    // Remove highlight after 4 seconds
    setTimeout(() => {
        newRow.classList.remove('bg-blue-50', 'border-l-blue-500');
        newRow.classList.add('border-l-transparent');
    }, 4000);

    // Update stats
    updateStats();
}

function updateStats() {
    const totalEmergencies = document.querySelectorAll('#sosTableBody tr').length;
    const pendingCount = document.querySelectorAll('.status-badge.pending').length;
    const completedCount = document.querySelectorAll('.status-badge.completed').length;

    // Update stats numbers with professional animation
    const statsNumbers = document.querySelectorAll('.stats-number');
    if (statsNumbers.length >= 4) {
        professionalAnimateNumberChange(statsNumbers[0], pendingCount);
        statsNumbers[1].textContent = '0'; // Contested (hardcoded)
        professionalAnimateNumberChange(statsNumbers[2], completedCount);
        professionalAnimateNumberChange(statsNumbers[3], totalEmergencies);
    }
}

function professionalAnimateNumberChange(element, newValue) {
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue === newValue) return;

    element.classList.add('stats-update');
    element.textContent = newValue;

    setTimeout(() => {
        element.classList.remove('stats-update');
    }, 800);
}

function showProfessionalConnectionStatus(message, type) {
    const statusDiv = document.createElement("div");
    statusDiv.className = `connection-status ${type}`;
    statusDiv.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-${getProfessionalStatusIcon(type)} text-lg"></i>
            <span class="flex-1 font-medium">${message}</span>
            <button onclick="professionalDismissAlert(this)" 
                    class="text-current hover:opacity-70 transition-opacity duration-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Remove any existing status messages
    const existingStatus = document.querySelector('.connection-status');
    if (existingStatus) {
        existingStatus.remove();
    }

    document.getElementById('alert-container').prepend(statusDiv);

    // Auto remove after 8 seconds
    setTimeout(() => {
        if (statusDiv.parentElement) {
            professionalDismissAlert(statusDiv.querySelector('button'));
        }
    }, 8000);
}

function getProfessionalStatusIcon(type) {
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

function showProfessionalDesktopNotification(customerName, emergencyType, location) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification("🚨 Emergency SOS Alert", {
            body: `Type: ${emergencyType}\nFrom: ${customerName}\nLocation: ${location}`,
            icon: '/favicon.ico',
            tag: 'sos-alert',
            requireInteraction: true,
            silent: false
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("🚨 Emergency SOS Alert", {
                    body: `Type: ${emergencyType}\nFrom: ${customerName}\nLocation: ${location}`,
                    icon: '/favicon.ico',
                    tag: 'sos-alert'
                });
            }
        });
    }
}

function playProfessionalNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Professional emergency sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log("Audio context not supported");
    }
}

function initializeInteractions() {
    // Ultra professional hover effects
    const interactiveElements = document.querySelectorAll('.stats-card, .table-row, .status-badge');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            if (this.classList.contains('stats-card')) {
                this.style.transform = 'translateY(-8px)';
            } else if (this.classList.contains('table-row')) {
                this.style.transform = 'translateX(8px)';
            } else {
                this.style.transform = 'scale(1.1)';
            }
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Professional row click handlers
    document.getElementById('sosTableBody').addEventListener('click', function (e) {
        const row = e.target.closest('.table-row');
        if (row && !e.target.closest('.status-badge')) {
            // Future: Show detailed emergency view
            console.log('Emergency row clicked for details:', row);
        }
    });
}

function addProfessionalConnectionIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'fixed top-6 right-6 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-xl border-2 border-white';
    indicator.title = 'Connected to Emergency Hub';
    indicator.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.5)';
    document.body.appendChild(indicator);
}

function showProfessionalRetryButton() {
    const retryBtn = document.createElement('button');
    retryBtn.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold';
    retryBtn.innerHTML = '<i class="fas fa-redo-alt mr-2"></i>Retry Connection';
    retryBtn.onclick = () => window.location.reload();
    document.body.appendChild(retryBtn);
}

function addProfessionalLoadingStates() {
    const tableBody = document.getElementById('sosTableBody');
    if (tableBody && tableBody.children.length === 0) {
        const loadingRow = document.createElement('tr');
        loadingRow.innerHTML = `
            <td colspan="11" class="table-cell text-center py-12">
                <div class="flex flex-col items-center space-y-4">
                    <div class="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div class="text-center">
                        <div class="text-gray-600 font-semibold mb-1">Loading Emergency Requests</div>
                        <div class="text-gray-400 text-sm">Preparing your dashboard...</div>
                    </div>
                </div>
            </td>
        `;
        tableBody.appendChild(loadingRow);
    }
}

// Add ultra professional CSS animations
const ultraProfessionalStyles = document.createElement('style');
ultraProfessionalStyles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .stats-update {
        animation: professionalPulse 0.8s ease-in-out;
    }
    
    @keyframes professionalPulse {
        0%, 100% { 
            transform: scale(1);
            color: #1e293b;
        }
        25% {
            transform: scale(1.2);
            color: #3b82f6;
        }
        50% { 
            transform: scale(1.1);
            color: #8b5cf6;
        }
        75% {
            transform: scale(1.15);
            color: #ec4899;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .border-3 {
        border-width: 3px;
    }
`;
document.head.appendChild(ultraProfessionalStyles);

// Export for global access
window.EmergencyDashboard = {
    handleNewSOSAlert,
    updateStats,
    professionalDismissAlert
};