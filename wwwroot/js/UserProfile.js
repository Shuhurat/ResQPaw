// User Profile JavaScript
class UserProfile {
    constructor() {
        this.currentTab = this.getTabFromURL() || 'profile-info';
        this.init();
    }

    init() {
        this.setupTabSwitching();
        this.setupFormHandlers();
        this.loadTabContent();
        this.setupEventListeners();
        this.activateTabFromURL();
    }

    getTabFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tab');
    }

    activateTabFromURL() {
        const tabFromURL = this.getTabFromURL();
        if (tabFromURL) {
            this.switchTab(tabFromURL);
        }
    }

    setupTabSwitching() {
        const tabLinks = document.querySelectorAll('.sidebar-link');
        
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                this.switchTab(tabId);
                this.updateURL(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            link.querySelector('div').classList.remove('bg-gradient-to-r', 'from-amber-500', 'to-amber-600', 'text-white', 'shadow-lg');
            link.querySelector('div').classList.add('hover:bg-amber-50', 'text-gray-700', 'hover:text-amber-600');
        });

        // Add active class to current tab
        const activeLink = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.querySelector('div').classList.add('bg-gradient-to-r', 'from-amber-500', 'to-amber-600', 'text-white', 'shadow-lg');
            activeLink.querySelector('div').classList.remove('hover:bg-amber-50', 'text-gray-700', 'hover:text-amber-600');
        }

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show current tab content
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Load tab-specific content
        this.loadTabContent(tabId);
        this.currentTab = tabId;
    }

    updateURL(tabId) {
        const newUrl = window.location.pathname + '?tab=' + tabId;
        window.history.pushState({}, '', newUrl);
    }

    setupFormHandlers() {
        const profileForm = document.getElementById('profileForm');
        const settingsForm = document.getElementById('settingsForm');

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }

        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSettingsUpdate();
            });
        }

        // Add real-time validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        const passwordFields = document.querySelectorAll('input[type="password"]');
        
        passwordFields.forEach(field => {
            field.addEventListener('input', (e) => {
                this.validatePasswordStrength(e.target.value);
            });
        });
    }

    validatePasswordStrength(password) {
        const strengthBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrengthText');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let text = '';

        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;

        strengthBar.style.width = strength + '%';

        if (strength < 50) {
            strengthBar.style.background = '#EF4444';
            text = 'Weak password';
        } else if (strength < 75) {
            strengthBar.style.background = '#F59E0B';
            text = 'Medium password';
        } else {
            strengthBar.style.background = '#10B981';
            text = 'Strong password';
        }

        strengthText.textContent = text;
    }

    async loadTabContent(tabId = this.currentTab) {
        switch (tabId) {
            case 'my-posts':
                await this.loadMyPosts();
                break;
            case 'saved-pets':
                await this.loadSavedPets();
                break;
            case 'privacy':
                this.loadPrivacySettings();
                break;
        }
    }

    async loadMyPosts() {
        const postsContainer = document.querySelector('#my-posts .grid');
        if (!postsContainer) return;

        // Show loading state
        postsContainer.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="loading-spinner"></div>
            </div>
        `;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample posts data
        const posts = [
            {
                id: 1,
                title: "Found: Golden Retriever",
                description: "Found this sweet boy near Mission District. No collar but very friendly.",
                image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                date: "2 days ago",
                comments: 8
            },
            {
                id: 2,
                title: "Adoption: Sweet Tabby Cat",
                description: "Luna is looking for a forever home. She's 3 years old and very affectionate.",
                image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                date: "1 week ago",
                comments: 12
            },
            {
                id: 3,
                title: "Missing: Beagle Mix",
                description: "My dog Rocky went missing near Golden Gate Park. Please help me find him!",
                image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                date: "2 weeks ago",
                comments: 24
            }
        ];

        postsContainer.innerHTML = posts.map(post => `
            <div class="post-card bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover-lift transition-all duration-300 group">
                <div class="post-img h-48 overflow-hidden">
                    <img src="${post.image}" alt="${post.title}" 
                         class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="post-info p-6">
                    <h4 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">${post.title}</h4>
                    <p class="text-gray-600 mb-4 text-sm">${post.description}</p>
                    <div class="post-meta flex justify-between items-center text-sm text-gray-500">
                        <span class="flex items-center space-x-1">
                            <i class="far fa-calendar"></i>
                            <span>${post.date}</span>
                        </span>
                        <span class="flex items-center space-x-1">
                            <i class="far fa-comment"></i>
                            <span>${post.comments}</span>
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadSavedPets() {
        const savedPetsContainer = document.querySelector('#saved-pets .grid');
        if (!savedPetsContainer) return;

        // Show loading state
        savedPetsContainer.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="loading-spinner"></div>
            </div>
        `;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample saved pets data
        const savedPets = [
            {
                id: 1,
                name: "Bella - German Shepherd",
                description: "2 years old, female, needs an active home with experience.",
                image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                status: "Available"
            },
            {
                id: 2,
                name: "Charlie - Labrador Mix",
                description: "1 year old, male, good with kids and other pets.",
                image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                status: "Available"
            }
        ];

        savedPetsContainer.innerHTML = savedPets.map(pet => `
            <div class="saved-pet-card bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover-lift transition-all duration-300 group">
                <div class="pet-img h-48 overflow-hidden relative">
                    <img src="${pet.image}" alt="${pet.name}" 
                         class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-4 right-4">
                        <span class="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">${pet.status}</span>
                    </div>
                </div>
                <div class="pet-info p-6">
                    <h4 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">${pet.name}</h4>
                    <p class="text-gray-600 mb-4 text-sm">${pet.description}</p>
                    <div class="pet-actions flex justify-between items-center">
                        <span class="flex items-center space-x-1 text-amber-600">
                            <i class="fas fa-heart"></i>
                            <span class="text-sm">Saved</span>
                        </span>
                        <button class="adopt-btn px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                            Adopt
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to adopt buttons
        document.querySelectorAll('.adopt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Adoption request sent successfully!', 'success');
            });
        });
    }

    loadPrivacySettings() {
        const privacyContainer = document.querySelector('#privacy .space-y-6');
        if (!privacyContainer) return;

        privacyContainer.innerHTML = `
            <div class="form-group">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors duration-300">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" id="profileVisibility" class="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" checked>
                        <label for="profileVisibility" class="text-gray-700 font-medium cursor-pointer">Make profile public</label>
                    </div>
                    <i class="fas fa-info-circle text-amber-500 cursor-help" title="Your profile will be visible to other users"></i>
                </div>
            </div>
            <div class="form-group">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors duration-300">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" id="showEmail" class="w-5 h-5 text-amber-600 rounded focus:ring-amber-500" checked>
                        <label for="showEmail" class="text-gray-700 font-medium cursor-pointer">Show email to other users</label>
                    </div>
                    <i class="fas fa-info-circle text-amber-500 cursor-help" title="Your email will be visible in your public profile"></i>
                </div>
            </div>
            <div class="form-group">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors duration-300">
                    <div class="flex items-center space-x-3">
                        <input type="checkbox" id="showPhone" class="w-5 h-5 text-amber-600 rounded focus:ring-amber-500">
                        <label for="showPhone" class="text-gray-700 font-medium cursor-pointer">Show phone number to other users</label>
                    </div>
                    <i class="fas fa-info-circle text-amber-500 cursor-help" title="Your phone number will be visible in your public profile"></i>
                </div>
            </div>
            <div class="form-group p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <label class="block text-gray-700 font-semibold mb-3">Download Your Data</label>
                <p class="text-gray-600 mb-4 text-sm">You can request a copy of all your personal data stored on ResQPaw.</p>
                <button class="data-download-btn px-6 py-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    Request Data Download
                </button>
            </div>
            <div class="form-group p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                <label class="block text-gray-700 font-semibold mb-3 text-red-600">Account Deletion</label>
                <p class="text-gray-600 mb-4 text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button class="delete-account-btn px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    Delete Account
                </button>
            </div>
        `;

        // Add event listeners for privacy settings
        document.querySelector('.data-download-btn')?.addEventListener('click', () => {
            this.showNotification('Data download request has been sent to your email!', 'info');
        });

        document.querySelector('.delete-account-btn')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                this.showNotification('Account deletion scheduled. You will receive a confirmation email.', 'info');
            }
        });
    }

    async handleProfileUpdate() {
        // Show loading state
        const submitBtn = document.querySelector('#profileForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
        submitBtn.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        this.showNotification('Profile updated successfully!', 'success');
    }

    async handleSettingsUpdate() {
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        if (newPassword && newPassword !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('#settingsForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Updating...';
        submitBtn.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        this.showNotification('Settings updated successfully!', 'success');
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
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    setupEventListeners() {
        // Add any additional event listeners here
        document.addEventListener('click', (e) => {
            if (e.target.matches('.stat-item')) {
                this.showNotification('Loading statistics...', 'info');
            }
        });

        // Profile picture change
        document.querySelector('.profile-avatar')?.addEventListener('click', (e) => {
            if (e.target.matches('button, .fa-camera')) {
                this.showNotification('Profile picture update feature coming soon!', 'info');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.userProfile = new UserProfile();
});

// Add CSS for notifications
const notificationStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);