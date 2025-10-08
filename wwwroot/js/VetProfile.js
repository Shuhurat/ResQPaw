// vet-profile.js - Advanced JavaScript for vet profile page

class VetProfilePage {
    constructor() {
        this.currentTab = 'about';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        this.initializeParticles();
    }

    setupEventListeners() {
        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });

            // Add hover effects
            button.addEventListener('mouseenter', this.addButtonHover.bind(this));
            button.addEventListener('mouseleave', this.removeButtonHover.bind(this));
        });

        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.service-item, .review-item, .specialty-item, .btn-primary, .btn-outline');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', this.addElementHover.bind(this));
            element.addEventListener('mouseleave', this.removeElementHover.bind(this));
        });

        // Text hover effects
        const textElements = document.querySelectorAll('.hover-text-amber, .section-title, h1, h2, h3, h4');
        textElements.forEach(element => {
            element.addEventListener('mouseenter', this.addTextHover.bind(this));
            element.addEventListener('mouseleave', this.removeTextHover.bind(this));
        });

        // Book appointment button - fixed selector
        const bookButton = document.querySelector('.book-appointment-btn');
        if (bookButton) {
            bookButton.addEventListener('click', (e) => {
                const vetId = bookButton.getAttribute('data-vet-id');
                this.handleBookAppointment(vetId);
            });
        }
    }

    switchTab(tabId) {
        // Remove active class from all buttons and contents
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to clicked button and corresponding content
        const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(tabId);
        
        if (targetButton) targetButton.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
        
        this.currentTab = tabId;
        
        // Add animation to new tab content
        this.animateTabContent(tabId);
    }

    animateTabContent(tabId) {
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.classList.add('animate-fadeInUp');
            setTimeout(() => {
                tabContent.classList.remove('animate-fadeInUp');
            }, 600);
        }
    }

    initializeAnimations() {
        // Add animation delays to elements
        const animatedElements = document.querySelectorAll('.profile-card, .service-item, .review-item, .specialty-item');
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('animate-fadeInUp');
        });

        // Initialize profile avatar animation
        const profileAvatar = document.querySelector('.profile-avatar');
        if (profileAvatar) {
            profileAvatar.classList.add('animate-fadeInUp');
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Observe all animated elements
        document.querySelectorAll('.profile-card, .service-item, .review-item, .specialty-item, .availability-item').forEach(element => {
            observer.observe(element);
        });
    }

    initializeParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        // Clear existing particles
        particlesContainer.innerHTML = '';

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 15 + 5}px;
                height: ${Math.random() * 15 + 5}px;
                animation-delay: ${Math.random() * 10}s;
                opacity: ${Math.random() * 0.2 + 0.1};
            `;
            particlesContainer.appendChild(particle);
        }
    }

    addButtonHover(event) {
        event.target.classList.add('hover-lift');
    }

    removeButtonHover(event) {
        event.target.classList.remove('hover-lift');
    }

    addElementHover(event) {
        event.target.classList.add('hover-lift', 'glow-effect');
    }

    removeElementHover(event) {
        event.target.classList.remove('hover-lift', 'glow-effect');
    }

    addTextHover(event) {
        event.target.classList.add('text-glow');
    }

    removeTextHover(event) {
        event.target.classList.remove('text-glow');
    }

    handleBookAppointment(vetId) {
        // Show loading state
        const button = document.querySelector('.book-appointment-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Booking...';
        button.disabled = true;

        // Get vet details for the modal
        const vetName = document.querySelector('.profile-info h2').textContent;
        const clinicElement = document.querySelector('.clinic-info-item span');
        const clinicName = clinicElement ? clinicElement.textContent : 'the clinic';

        // Send booking request to server
        fetch('/Veterinarians/BookAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': this.getAntiForgeryToken()
            },
            body: JSON.stringify({
                vetId: parseInt(vetId),
                appointmentDate: new Date().toISOString()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                this.showBookingModal(vetName, clinicName, data.message);
            } else {
                this.showErrorModal('Booking Failed', data.message || 'Unable to book appointment. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Fallback to client-side modal if server request fails
            this.showBookingModal(vetName, clinicName, 'Your appointment request has been received. The clinic will contact you shortly to confirm your appointment.');
        })
        .finally(() => {
            // Restore button state
            button.innerHTML = originalText;
            button.disabled = false;
        });
    }

    getAntiForgeryToken() {
        // Get anti-forgery token if exists
        const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
        return tokenElement ? tokenElement.value : '';
    }

    showBookingModal(vetName, clinicName, message = null) {
        const modalMessage = message || `Your appointment request with <span class="font-semibold text-amber-600">${vetName}</span> at <span class="font-semibold">${clinicName}</span> has been received. The clinic will contact you shortly to confirm your appointment.`;
        
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl">
                <div class="text-center">
                    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-calendar-check text-green-600 text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">Appointment Request Sent!</h3>
                    <div class="text-gray-600 mb-6 leading-relaxed">
                        ${modalMessage}
                    </div>
                    <button class="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all duration-300 btn-primary w-full glow-effect">
                        <i class="fas fa-check mr-2"></i>Got It!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate modal in
        setTimeout(() => {
            const modalContent = modal.querySelector('div');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 100);

        // Close modal on button click
        const closeButton = modal.querySelector('button');
        closeButton.addEventListener('click', () => {
            this.animateModalOut(modal);
        });

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.animateModalOut(modal);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                this.animateModalOut(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        }.bind(this));
    }

    showErrorModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl">
                <div class="text-center">
                    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-4">${title}</h3>
                    <div class="text-gray-600 mb-6 leading-relaxed">
                        ${message}
                    </div>
                    <button class="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all duration-300 btn-primary w-full">
                        <i class="fas fa-redo mr-2"></i>Try Again
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate modal in
        setTimeout(() => {
            const modalContent = modal.querySelector('div');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 100);

        // Close modal on button click
        const closeButton = modal.querySelector('button');
        closeButton.addEventListener('click', () => {
            this.animateModalOut(modal);
        });

        // Close modal on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.animateModalOut(modal);
            }
        });
    }

    animateModalOut(modal) {
        const modalContent = modal.querySelector('div');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Initialize the vet profile page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.vetProfilePage = new VetProfilePage();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .scale-95 {
        transform: scale(0.95);
    }
    
    .scale-100 {
        transform: scale(1);
    }
    
    .opacity-0 {
        opacity: 0;
    }
    
    .opacity-100 {
        opacity: 1;
    }
    
    /* Loading spinner animation */
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Enhanced modal animations */
    .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
`;
document.head.appendChild(style);