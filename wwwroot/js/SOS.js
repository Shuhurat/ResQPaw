// Tailwind Configuration for SOS Page
tailwind.config = {
    theme: {
        extend: {
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-reverse': 'float-reverse 8s ease-in-out infinite',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 4s infinite',
                'wiggle': 'wiggle 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(5deg)' },
                },
                'float-reverse': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(15px) rotate(-5deg)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('SOS.js loaded - checking upload section...');
    
    // File upload functionality
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadPreview = document.getElementById('uploadPreview');
    
    console.log('Upload area element:', uploadArea);
    console.log('File input element:', fileInput);
    console.log('Upload preview element:', uploadPreview);

    if (uploadArea && fileInput) {
        console.log('Upload functionality initialized');
        
        let uploadIcon = null;
        if (uploadArea.querySelector('i')) {
            uploadIcon = uploadArea.querySelector('i');
        }

        uploadArea.addEventListener('click', function () {
            console.log('Upload area clicked');
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            console.log('File dragged over upload area');
            this.classList.add('border-amber-500', 'bg-amber-50');
            this.classList.remove('border-gray-300');
            if (uploadIcon) {
                uploadIcon.classList.add('scale-110');
            }
        });

        uploadArea.addEventListener('dragleave', function () {
            console.log('File dragged out of upload area');
            this.classList.remove('border-amber-500', 'bg-amber-50');
            this.classList.add('border-gray-300');
            if (uploadIcon) {
                uploadIcon.classList.remove('scale-110');
            }
        });

        uploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            console.log('File dropped on upload area');
            this.classList.remove('border-amber-500', 'bg-amber-50');
            this.classList.add('border-gray-300');
            if (uploadIcon) {
                uploadIcon.classList.remove('scale-110');
            }

            if (e.dataTransfer.files.length > 0) {
                console.log('Files dropped:', e.dataTransfer.files.length);
                handleFiles(e.dataTransfer.files);
            }
        });

        fileInput.addEventListener('change', function () {
            console.log('File input changed, files:', this.files.length);
            if (this.files.length > 0) {
                handleFiles(this.files);
            }
        });
    } else {
        console.error('Upload elements not found!');
        console.log('Available elements:', {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            uploadPreview: document.getElementById('uploadPreview')
        });
    }

    function handleFiles(files) {
        console.log('Handling files:', files.length);
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log('Processing file:', file.name, file.type, file.size);

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showNotification('File too large: ' + file.name + '. Maximum size is 10MB.', 'error');
                continue;
            }

            // Check file type
            if (!file.type.match('image.*') && !file.type.match('video.*')) {
                showNotification('Invalid file type: ' + file.name + '. Please upload images or videos only.', 'error');
                continue;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                console.log('File read successfully:', file.name);
                
                const item = document.createElement('div');
                item.className = 'relative group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg';
                item.style.width = '7rem';
                item.style.height = '7rem';

                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'w-full h-full object-cover';
                    img.alt = 'Upload preview';
                    item.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const videoContainer = document.createElement('div');
                    videoContainer.className = 'w-full h-full bg-gray-800 flex items-center justify-center relative';
                    
                    const videoIcon = document.createElement('i');
                    videoIcon.className = 'fas fa-video text-white text-2xl';
                    
                    const videoLabel = document.createElement('span');
                    videoLabel.className = 'absolute bottom-1 left-1 text-white text-xs bg-black bg-opacity-50 px-1 rounded';
                    videoLabel.textContent = 'video';
                    
                    videoContainer.appendChild(videoIcon);
                    videoContainer.appendChild(videoLabel);
                    item.appendChild(videoContainer);
                }

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    console.log('Removing file:', file.name);
                    item.remove();
                });

                item.appendChild(removeBtn);
                
                if (uploadPreview) {
                    uploadPreview.appendChild(item);
                    console.log('File preview added to uploadPreview');
                } else {
                    console.error('uploadPreview element not found!');
                }
            };

            reader.onerror = function (error) {
                console.error('Error reading file:', error);
                showNotification('Error reading file: ' + file.name, 'error');
            };

            reader.readAsDataURL(file);
        }
    }

    // Form submission
    const sosForm = document.getElementById('sosForm');

    if (sosForm) {
        console.log('SOS form found, attaching submit handler');
        
        sosForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submission intercepted');

            // Basic validation
            const emergencyType = document.getElementById('emergencyType').value;
            const animalType = document.getElementById('animalType').value;
            const animalCondition = document.getElementById('animalCondition').value;
            const description = document.getElementById('emergencyDescription').value;
            const location = document.getElementById('location').value;
            const reporterName = document.getElementById('reporterName').value;
            const reporterPhone = document.getElementById('reporterPhone').value;

            if (!emergencyType || !animalType || !animalCondition || !description || !location || !reporterName || !reporterPhone) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i> Sending Report...';
            submitBtn.disabled = true;

            console.log('Submitting form data...');

            // Submit the actual form (remove the setTimeout and use actual form submission)
            // For now, we'll submit the form normally since you have controller logic
            this.submit();
        });
    } else {
        console.error('SOS form not found!');
    }

    // Add sparkle effect to logo on hover
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            const sparkle = this.querySelector('.sparkle');
            if (sparkle) {
                sparkle.style.animation = 'sparkle 0.5s';
            }
        });
    }
});

// Notification function
function showNotification(message, type = 'info') {
    console.log('Showing notification:', type, message);
    
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    };

    notification.className = `notification fixed top-5 right-5 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full opacity-0 ${typeStyles[type] || typeStyles.info}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export functions for global use
window.ResQPawSOS = {
    showNotification,
    handleFiles
};