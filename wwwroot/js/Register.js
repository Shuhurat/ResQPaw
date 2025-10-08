// Tailwind Configuration for Register Page
tailwind.config = {
    theme: {
        extend: {
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-reverse': 'float-reverse 8s ease-in-out infinite',
                'pulse-slow': 'pulse 3s infinite',
                'bounce-gentle': 'bounce-gentle 2s infinite',
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
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Password strength indicator
    if (passwordInput && passwordStrengthBar && passwordStrengthText) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                this.classList.add('input-invalid');
                this.classList.remove('input-valid');
            } else if (confirmPassword) {
                this.classList.add('input-valid');
                this.classList.remove('input-invalid');
            } else {
                this.classList.remove('input-valid', 'input-invalid');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const userType = document.getElementById('userType').value;
            const termsAgreed = document.getElementById('termsAgree').checked;
            
            if (!validateName(name)) {
                showNotification('Please enter your full name', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePassword(password)) {
                showNotification('Password must be at least 6 characters long', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!userType) {
                showNotification('Please select your user type', 'error');
                return;
            }
            
            if (!termsAgreed) {
                showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate API call
            simulateSignup(name, email, password, userType)
                .then(() => {
                    showNotification('Account created successfully! Redirecting...', 'success');
                    // Redirect to home page after successful signup
                    setTimeout(() => {
                        window.location.href = '/Home/New';
                    }, 1500);
                })
                .catch(error => {
                    showNotification(error.message, 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Real-time validation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('input-valid', 'input-invalid');
        });
    });

    // Social signup buttons
    const socialButtons = document.querySelectorAll('button[type="button"]');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.querySelector('i').className.includes('google') ? 'Google' :
                           this.querySelector('i').className.includes('facebook') ? 'Facebook' : 'Twitter';
            showNotification(`${platform} sign up coming soon!`, 'info');
        });
    });

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

// Password strength calculation
function updatePasswordStrength(password) {
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');
    
    if (!passwordStrengthBar || !passwordStrengthText) return;

    let strength = 0;
    let text = 'Password strength';
    let color = '#e74c3c';

    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;

    if (strength <= 25) {
        text = 'Weak';
        color = '#e74c3c';
    } else if (strength <= 50) {
        text = 'Fair';
        color = '#f39c12';
    } else if (strength <= 75) {
        text = 'Good';
        color = '#3498db';
    } else {
        text = 'Strong';
        color = '#2ecc71';
    }

    passwordStrengthBar.style.width = strength + '%';
    passwordStrengthBar.style.background = color;
    passwordStrengthText.textContent = text;
    passwordStrengthText.style.color = color;
}

// Validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateName(name) {
    return name.trim().length > 0;
}

function validateField(field) {
    const value = field.value.trim();
    
    switch (field.type) {
        case 'email':
            if (value && !validateEmail(value)) {
                field.classList.add('input-invalid');
                return false;
            } else if (value) {
                field.classList.add('input-valid');
            }
            break;
        case 'password':
            if (value && !validatePassword(value)) {
                field.classList.add('input-invalid');
                return false;
            } else if (value) {
                field.classList.add('input-valid');
            }
            break;
        case 'text':
            if (field.id === 'fullName' && value && !validateName(value)) {
                field.classList.add('input-invalid');
                return false;
            } else if (value) {
                field.classList.add('input-valid');
            }
            break;
        case 'select-one':
            if (!value) {
                field.classList.add('input-invalid');
                return false;
            } else {
                field.classList.add('input-valid');
            }
            break;
    }
    return true;
}

// Simulate API calls
function simulateSignup(name, email, password, userType) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful signup for demo
            if (name && email && password && userType) {
                resolve({ success: true });
            } else {
                reject(new Error('Registration failed. Please try again.'));
            }
        }, 1000);
    });
}

// Notification function
function showNotification(message, type = 'info') {
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

    notification.className = `notification fixed top-5 right-5 px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${typeStyles[type] || typeStyles.info}`;
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
window.ResQPawAuth = {
    validateEmail,
    validatePassword,
    validateName,
    updatePasswordStrength,
    showNotification
};