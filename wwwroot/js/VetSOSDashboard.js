// Vet SOS Dashboard JavaScript with Enhanced Effects
document.addEventListener('DOMContentLoaded', function () {
    initializeVetDashboard();
    initializeHoverEffects();
    initializeSignalR();
});

function initializeVetDashboard() {
    console.log('Vet Dashboard Initialized');
    
    // Add entrance animations to table rows
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.1}s`;
        row.classList.add('animate-fade-in');
    });

    // Initialize stats cards animations
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-slide-up');
    });
}

function initializeHoverEffects() {
    // Enhanced hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll(
        '.table-row, .stat-card, .action-btn, .status-badge, .animal-icon, .location-icon'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            if (this.classList.contains('table-row') || this.classList.contains('stat-card')) {
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            if (this.classList.contains('table-row') || this.classList.contains('stat-card')) {
                this.style.boxShadow = '';
            }
        });
    });

    // Special hover for table headers
    const tableHeaders = document.querySelectorAll('.table-header');
    tableHeaders.forEach(header => {
        header.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #334155, #1e293b)';
            this.style.transform = 'translateY(-2px)';
        });
        
        header.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #1e293b, #0f172a)';
            this.style.transform = 'translateY(0)';
        });
    });
}

function initializeSignalR() {
    const connection = new signalR.HubConnectionBuilder().withUrl("/soshub").build();

    // Live new SOS alerts
    connection.on("ReceiveSOS", (userName, location, description, sosId, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType) => {
        showNewSOSAlert(userName, location, description);
        playAlertSound();
        addNewSOSToTable(sosId, userName, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType, location, description);
        updateStats();
    });

    // Live status updates
    connection.on("SOSUpdated", (sosId, newStatus) => {
        updateSOSStatus(sosId, newStatus);
        updateStats();
    });

    connection.start().catch(err => console.error('SignalR connection error:', err));
}

function showNewSOSAlert(userName, location, description) {
    const alertsContainer = document.getElementById('alerts');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-card';
    alertDiv.innerHTML = `
        <strong>🚨 New Emergency SOS!</strong>
        <div><strong>Reporter:</strong> ${userName}</div>
        <div><strong>📍 Location:</strong> ${location}</div>
        <div><strong>📝 Emergency:</strong> ${description}</div>
    `;
    
    alertsContainer.appendChild(alertDiv);
    
    // Auto-remove alert after 8 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => alertDiv.remove(), 500);
    }, 8000);
}

function playAlertSound() {
    // Create emergency alert sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Emergency alert sound pattern
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.6);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.6);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.9);
    } catch (e) {
        console.log('Audio context not supported');
    }
}

function addNewSOSToTable(sosId, userName, reporterName, reporterPhone, reporterEmail, animalType, animalCondition, emergencyType, location, description) {
    if (!document.getElementById(`sos-${sosId}`)) {
        const tbody = document.getElementById('sosTableBody');
        
        // Get animal icon
        let animalIcon = 'fas fa-paw';
        if (animalType?.toLowerCase() === 'dog') animalIcon = 'fas fa-dog';
        else if (animalType?.toLowerCase() === 'cat') animalIcon = 'fas fa-cat';
        else if (animalType?.toLowerCase() === 'bird') animalIcon = 'fas fa-dove';

        const tr = document.createElement('tr');
        tr.className = 'table-row animate-fade-in';
        tr.id = `sos-${sosId}`;
        tr.innerHTML = `
            <td class="table-cell customer-cell">
                <div class="customer-info">
                    <div class="customer-email">${reporterEmail}</div>
                </div>
            </td>
            <td class="table-cell">
                <span class="emergency-type">${emergencyType}</span>
            </td>
            <td class="table-cell">
                <div class="animal-info">
                    <i class="${animalIcon} animal-icon"></i>
                    <span>${animalType}</span>
                </div>
            </td>
            <td class="table-cell">
                <span class="condition-badge">${animalCondition}</span>
            </td>
            <td class="table-cell">
                <div class="description-text">${description}</div>
            </td>
            <td class="table-cell">
                <div class="location-info">
                    <i class="fas fa-map-marker-alt location-icon"></i>
                    <span>${location}</span>
                </div>
            </td>
            <td class="table-cell">
                <div class="reporter-info">
                    <div class="reporter-name">${reporterName}</div>
                    <div class="reporter-phone">${reporterPhone}</div>
                </div>
            </td>
            <td class="table-cell">
                <span class="status-badge status-pending">Pending</span>
            </td>
            <td class="table-cell">
                <div class="time-info">
                    <div class="time-date">${new Date().toLocaleString()}</div>
                    <div class="login-time">Nothing</div>
                </div>
            </td>
            <td class="table-cell">
                <form method="post" action="/Vet/MarkContacted" class="action-form">
                    <input type="hidden" name="id" value="${sosId}" />
                    <button type="submit" class="action-btn contact-btn">
                        <i class="fas fa-phone mr-2"></i>
                        Mark Contacted
                    </button>
                </form>
            </td>
        `;

        tbody.prepend(tr);
        initializeHoverEffects(); // Re-initialize hover effects for new row
    }
}

function updateSOSStatus(sosId, newStatus) {
    const row = document.getElementById(`sos-${sosId}`);
    if (row) {
        const statusBadge = row.querySelector('.status-badge');
        const actionCell = row.querySelector('td:last-child');
        
        if (statusBadge) {
            statusBadge.textContent = newStatus;
            
            // Remove all status classes
            statusBadge.classList.remove('status-pending', 'status-contacted', 'status-completed', 'status-default');
            
            // Add new status class
            const statusClass = newStatus.toLowerCase() === 'pending' ? 'status-pending' :
                              newStatus.toLowerCase() === 'contacted' ? 'status-contacted' :
                              newStatus.toLowerCase() === 'completed' ? 'status-completed' : 'status-default';
            statusBadge.classList.add(statusClass);
            
            // Add update animation
            statusBadge.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                statusBadge.style.animation = '';
            }, 600);
        }

        // Update action button based on status
        if (actionCell) {
            if (newStatus === 'Contacted') {
                actionCell.innerHTML = `
                    <form method="post" action="/Vet/MarkCompleted" class="action-form">
                        <input type="hidden" name="id" value="${sosId}" />
                        <button type="submit" class="action-btn complete-btn">
                            <i class="fas fa-check mr-2"></i>
                            Complete
                        </button>
                    </form>
                `;
            } else if (newStatus === 'Completed') {
                actionCell.innerHTML = `
                    <span class="completed-text">
                        <i class="fas fa-check-circle mr-1"></i>
                        Completed
                    </span>
                `;
            }
        }
    }
}

function updateStats() {
    // This function would typically make an API call to get updated stats
    // For now, we'll just add a visual feedback
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    });
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
    
    @keyframes slide-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
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
    
    .animate-fade-in {
        animation: fade-in 0.6s ease-out both;
    }
    
    .animate-slide-up {
        animation: slide-up 0.6s ease-out both;
    }
`;
document.head.appendChild(style);