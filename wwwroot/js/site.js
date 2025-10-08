// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-reverse': 'float-reverse 8s ease-in-out infinite',
                'pulse-slow': 'pulse 3s infinite',
                'bounce-gentle': 'bounce-gentle 2s infinite',
                'text-glow': 'text-glow 2s ease-in-out infinite alternate',
                'pop-in': 'pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'card-float': 'card-float 3s ease-in-out infinite',
                'cta-pulse': 'cta-pulse 3s ease-in-out infinite',
                'fade-in': 'fade-in 1s ease-in-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-10px) rotate(2deg)' },
                },
                'float-reverse': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(8px) rotate(-2deg)' },
                },
                'bounce-gentle': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                'text-glow': {
                    '0%': { 'text-shadow': '0 0 20px rgba(245, 158, 11, 0.5)' },
                    '100%': { 'text-shadow': '0 0 30px rgba(245, 158, 11, 0.8), 0 0 40px rgba(245, 158, 11, 0.6)' },
                },
                'pop-in': {
                    '0%': { transform: 'scale(0.3) rotate(-5deg)', opacity: '0' },
                    '70%': { transform: 'scale(1.1) rotate(2deg)', opacity: '0.8' },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                },
                'card-float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                'cta-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        }
    }
}

// Card animation function
function animateCards() {
    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title-hidden');
    sectionTitles.forEach(title => {
        title.classList.remove('section-title-hidden');
        title.classList.add('animate-fade-in');
    });

    // Animate cards in each section
    const sections = [
        { sectionId: 'features-section', cardCount: 4 },
        { sectionId: 'pets-section', cardCount: 4 },
        { sectionId: 'cta-section', cardCount: 0 } // CTA section doesn't have cards
    ];

    sections.forEach((section, sectionIndex) => {
        const sectionElement = document.getElementById(section.sectionId);
        if (!sectionElement) return;
        
        const cards = sectionElement.querySelectorAll('.card-hidden');
        
        // Change background for each section
        const bgClasses = ['section-bg-1', 'section-bg-2', 'section-bg-3', 'section-bg-4', 'section-bg-5', 'section-bg-6'];
        sectionElement.classList.remove(...bgClasses);
        sectionElement.classList.add(bgClasses[sectionIndex % bgClasses.length]);
        
        // Animate cards one by one
        cards.forEach((card, cardIndex) => {
            setTimeout(() => {
                card.classList.remove('card-hidden');
                card.classList.add('animate-pop-in');
            }, (sectionIndex * 1000) + (cardIndex * 300)); // Stagger animations
        });
    });
}

// SOS Modal functionality
function initSOSModal() {
    const sosBtn = document.getElementById('sosBtn');
    if (!sosBtn) return;

    sosBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-red-600 mb-4">Emergency Assistance</h3>
                <p class="text-gray-600 mb-6">Are you sure you want to contact emergency services? This should only be used for genuine pet emergencies.</p>
                <div class="flex space-x-4 justify-center">
                    <button id="cancelSos" class="px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button id="callEmergency" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Call for Help
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('#cancelSos').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#callEmergency').addEventListener('click', function() {
            const button = this;
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Connecting...';
            button.disabled = true;
            
            setTimeout(function() {
                document.body.removeChild(modal);
                showNotification('Help is on the way! A rescuer will contact you shortly.', 'success');
            }, 2000);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const types = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    notification.className = `fixed top-4 right-4 ${types[type] || types.info} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('translate-x-0');
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start animations after a short delay
    setTimeout(animateCards, 500);
    
    // Initialize SOS modal
    initSOSModal();
    
    // Add hover effects for images
    const images = document.querySelectorAll('.image-hover');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Add scroll-triggered animations
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('animate-fade-in');
        }
    });
});

// Export functions for global use
window.ResQPaw = {
    showNotification,
    animateCards,
    initSOSModal
};