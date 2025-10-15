// Admin Monitor JavaScript
document.addEventListener('DOMContentLoaded', function () {
    initializeAdminMonitor();
});

function initializeAdminMonitor() {
    initializeSignalR();
    initializeTableInteractions();
    initializeAutoRefresh();
    initializeStatsUpdate();
}

function initializeSignalR() {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/sosHub")
        .withAutomaticReconnect()
        .build();

    // Update connection status
    connection.onreconnecting(() => {
        updateConnectionStatus('Reconnecting...', 'warning');
    });

    connection.onreconnected(() => {
        updateConnectionStatus('Connected to SOS Hub', 'success');
    });

    connection.onclose(() => {
        updateConnectionStatus('Connection Lost', 'error');
    });

    // Handle new SOS alerts
    connection.on("ReceiveSOS", (userName, address, message, sosId, emergencyType, animalType, animalCondition, reporterName, reporterPhone, reporterEmail) => {
        showNewSOSAlert(userName, address, message);
        playAlertSound();
        addOrUpdateSOSRow(sosId, userName, emergencyType, animalType, animalCondition, message, address, reporterName, reporterPhone, reporterEmail);
        updateStats();
    });

    // Handle SOS updates
    connection.on("SOSUpdated", (sosId, newStatus) => {
        updateSOSStatus(sosId, newStatus);
        updateStats();
    });

    // Start connection
    connection.start()
        .then(() => {
            updateConnectionStatus('Connected to SOS Hub', 'success');
            console.log("✅ Connected to SOS Hub");
        })
        .catch(err => {
            updateConnectionStatus('Connection Failed', 'error');
            console.error("❌ SignalR connection error:", err);
        });

    // Store connection globally for other functions
    window.sosConnection = connection;
}

function updateConnectionStatus(message, type) {
    const statusElement = document.getElementById('connectionStatus');
    const types = {
        success: { bg: 'bg-green-100', text: 'text-green-800', icon: 'fa-circle text-green-500' },
        warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'fa-exclamation-triangle text-yellow-500' },
        error: { bg: 'bg-red-100', text: 'text-red-800', icon: 'fa-times-circle text-red-500' }
    };

    statusElement.className = `inline-flex items-center px-4 py-2 rounded-full ${types[type].bg} ${types[type].text}`;
    statusElement.innerHTML = `<i class="fas ${types[type].icon} mr-2"></i>${message}`;
}

function showNewSOSAlert(userName, address, message) {
    const alertsContainer = document.getElementById('alerts');

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger animate-pulse';
    alertDiv.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-triangle text-red-500 text-xl mt-1"></i>
            </div>
            <div class="ml-3 flex-1">
                <div class="font-bold text-red-800">🚨 New SOS Alert!</div>
                <div class="mt-1 text-red-700">
                    <strong>${userName}</strong> needs immediate assistance
                </div>
                <div class="text-sm text-red-600">
                    <i class="fas fa-map-marker-alt mr-1"></i>${address}
                </div>
                <div class="text-sm text-red-600 mt-1">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    alertsContainer.prepend(alertDiv);

    // Auto-remove alert after 10 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 10000);
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
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio context not supported');
    }
}

function addOrUpdateSOSRow(sosId, userName, emergencyType, animalType, animalCondition, description, location, reporterName, reporterPhone, reporterEmail) {
    const tbody = document.getElementById('sosTableBody');
    let existingRow = document.getElementById(`sos-${sosId}`);

    if (!existingRow) {
        const newRow = document.createElement('tr');
        newRow.id = `sos-${sosId}`;
        newRow.className = 'hover:bg-gray-50 transition-colors duration-200 new-sos';

        newRow.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${userName}</div>
            </td>
            <td class="px-6 py-4">
                <span class="emergency-badge">${emergencyType}</span>
            </td>
            <td class="px-6 py-4">
                <span class="animal-badge">${animalType}</span>
            </td>
            <td class="px-6 py-4">
                <span class="condition-badge">${animalCondition}</span>
            </td>
            <td class="px-6 py-4 max-w-xs">
                <div class="text-sm text-gray-600 truncate" title="${description}">${description}</div>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>
                    ${location}
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm">
                    <div class="font-medium text-gray-900">${reporterName}</div>
                    <div class="text-gray-500">
                        <i class="fas fa-phone mr-1"></i>${reporterPhone}
                    </div>
                    <div class="text-gray-500">
                        <i class="fas fa-envelope mr-1"></i>${reporterEmail}
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="status-badge status-pending">Pending</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <i class="fas fa-clock mr-2 text-gray-400"></i>
                ${new Date().toLocaleString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span class="text-gray-400 italic">Waiting</span>
            </td>
        `;

        tbody.prepend(newRow);
    }
}

function updateSOSStatus(sosId, newStatus) {
    const row = document.getElementById(`sos-${sosId}`);
    if (row) {
        const statusCell = row.querySelector('.status-badge');
        const actionCell = row.querySelector('td:last-child');

        // Update status with animation
        statusCell.classList.add('updating');
        setTimeout(() => {
            statusCell.className = `status-badge status-${newStatus.toLowerCase()}`;
            statusCell.textContent = newStatus;
            statusCell.classList.remove('updating');
        }, 300);

        // Update action button
        if (newStatus === 'Contacted') {
            actionCell.innerHTML = `
                <form method="post" action="/SOS/MarkDone" class="inline">
                    <input type="hidden" name="id" value="${sosId}" />
                    <button class="action-btn bg-green-600 hover:bg-green-700 text-white">
                        <i class="fas fa-check mr-1"></i>Mark as Done
                    </button>
                </form>
            `;
        } else if (newStatus === 'Done') {
            actionCell.innerHTML = `
                <span class="text-green-600 font-semibold">
                    <i class="fas fa-check-circle mr-1"></i>Completed
                </span>
            `;
        }
    }
}

function initializeTableInteractions() {
    // Add click handlers for action buttons
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const sosId = e.target.dataset.id;
            if (confirm("Are you sure you want to delete this SOS request?")) {
                const response = await fetch(`/SOS/Delete/${sosId}`, { method: "POST" });
                if (response.ok) {
                    document.getElementById(`sos-${sosId}`).remove();
                    updateStats();
                } else {
                    alert("Failed to delete SOS request.");
                }
            }
        }
    });

    // Add hover effects to table rows
    const tableRows = document.querySelectorAll('#sosTableBody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.01)';
        });

        row.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

function initializeAutoRefresh() {
    // Auto-refresh stats every 30 seconds
    setInterval(updateStats, 30000);
}

function updateStats() {
    // This would typically make an API call to get updated stats
    // For now, we'll just recalculate from the current table data
    const rows = document.querySelectorAll('#sosTableBody tr');
    const stats = {
        total: rows.length,
        pending: 0,
        contacted: 0,
        done: 0
    };

    rows.forEach(row => {
        const status = row.querySelector('.status-badge').textContent;
        if (status === 'Pending') stats.pending++;
        else if (status === 'Contacted') stats.contacted++;
        else if (status === 'Done') stats.done++;
    });

    // Update stats cards with animation
    animateCounter('total', stats.total);
    animateCounter('pending', stats.pending);
    animateCounter('contacted', stats.contacted);
    animateCounter('done', stats.done);
}

function animateCounter(type, newValue) {
    const element = document.querySelector(`.stats-card:nth-child(${getStatsIndex(type)}) .text-2xl`);
    if (element) {
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

function getStatsIndex(type) {
    const types = { total: 1, pending: 2, contacted: 3, done: 4 };
    return types[type] || 1;
}

// Export functions for global access
window.updateSOSStatus = updateSOSStatus;
window.showNewSOSAlert = showNewSOSAlert;