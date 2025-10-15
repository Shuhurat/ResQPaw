// Emergency Animal Rescue JavaScript - Bright & Clear
document.addEventListener('DOMContentLoaded', function () {
    initializeEmergencyForm();
});

function initializeEmergencyForm() {
    initializeFormValidation();
    initializeFileUpload();
    initializeFormSubmission();
    initializeHoverEffects();
    initializeSelectElements();
}

function initializeHoverEffects() {
    // Enhanced hover effects for better visibility
    const interactiveElements = document.querySelectorAll('.glass-input, .glass-textarea, .glass-select, .glass-upload, .submit-btn, .form-label');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        element.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

function initializeSelectElements() {
    const selects = document.querySelectorAll('select');

    selects.forEach(select => {
        // Set initial background for better visibility
        select.style.background = 'white';
        select.style.color = '#1f2937';
        select.style.fontWeight = '500';

        select.addEventListener('change', function () {
            validateField(this);
            if (this.value) {
                this.style.borderColor = '#16a34a';
                this.style.background = 'rgba(34, 197, 94, 0.05)';
            }
        });

        select.addEventListener('focus', function () {
            this.style.background = 'white';
            this.style.borderColor = '#dc2626';
        });

        select.addEventListener('blur', function () {
            if (!this.value) {
                this.style.background = 'white';
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
}

function initializeFormValidation() {
    const form = document.getElementById('sosForm');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        // Set initial styles for better visibility
        input.style.color = '#1f2937';
        input.style.fontWeight = '500';

        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            clearFieldError(this);
            // Add visual feedback while typing
            if (this.value.trim()) {
                this.style.borderColor = '#16a34a';
                this.style.background = 'rgba(34, 197, 94, 0.05)';
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    clearFieldError(field);

    if (!value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    }

    if (field.name === 'ReporterPhone' && value) {
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    }

    if (field.tagName === 'SELECT' && !value) {
        showFieldError(field, 'Please select an option');
        isValid = false;
    }

    // Enhanced visual feedback
    if (isValid && value) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        field.style.borderColor = '#16a34a';
        field.style.background = 'rgba(34, 197, 94, 0.05)';
    } else if (!isValid) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        field.style.borderColor = '#dc2626';
        field.style.background = 'rgba(220, 38, 38, 0.05)';
    }

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;

    field.parentNode.appendChild(errorElement);

    // Add shake animation for error
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function initializeFileUpload() {
    const fileInput = document.querySelector('.file-input');
    const uploadContainer = document.querySelector('.glass-upload');

    if (fileInput && uploadContainer) {
        uploadContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.borderColor = '#dc2626';
            this.style.background = 'rgba(220, 38, 38, 0.1)';
            this.style.transform = 'scale(1.02)';
        });

        uploadContainer.addEventListener('dragleave', function (e) {
            e.preventDefault();
            if (fileInput.files.length === 0) {
                this.style.borderColor = '#d1d5db';
                this.style.background = 'rgba(255, 255, 255, 0.9)';
                this.style.transform = 'scale(1)';
            }
        });

        uploadContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            fileInput.files = e.dataTransfer.files;
            updateFilePreview();
            this.style.transform = 'scale(1)';
        });

        uploadContainer.addEventListener('click', function () {
            fileInput.click();
        });

        fileInput.addEventListener('change', function () {
            updateFilePreview();
        });
    }
}

function updateFilePreview() {
    const fileInput = document.querySelector('.file-input');
    const uploadContainer = document.querySelector('.glass-upload');
    const uploadText = uploadContainer.querySelector('.upload-text');
    const uploadIcon = uploadContainer.querySelector('.upload-icon');

    if (fileInput.files.length > 0) {
        uploadText.textContent = `${fileInput.files.length} file(s) selected`;
        uploadText.style.color = '#15803d';
        uploadText.style.fontWeight = '700';
        uploadIcon.className = 'fas fa-check-circle upload-icon';
        uploadIcon.style.color = '#16a34a';
        uploadContainer.style.borderColor = '#16a34a';
        uploadContainer.style.background = 'rgba(34, 197, 94, 0.1)';
    } else {
        uploadText.textContent = 'Drag & drop or click to upload';
        uploadText.style.color = '#374151';
        uploadText.style.fontWeight = '600';
        uploadIcon.className = 'fas fa-cloud-upload-alt upload-icon';
        uploadIcon.style.color = '#6b7280';
        uploadContainer.style.borderColor = '#d1d5db';
        uploadContainer.style.background = 'rgba(255, 255, 255, 0.9)';
    }
}

function initializeFormSubmission() {
    const form = document.getElementById('sosForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Scroll to first error with smooth animation
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });

                // Highlight the problematic field
                const problemField = firstError.parentNode.querySelector('.glass-input, .glass-textarea, .glass-select');
                if (problemField) {
                    problemField.style.animation = 'pulse 1s ease-in-out';
                    setTimeout(() => {
                        problemField.style.animation = '';
                    }, 1000);
                }
            }
            return;
        }

        showLoadingState(submitBtn, btnText, btnLoader);

        // Simulate form submission
        setTimeout(() => {
            form.submit();
        }, 2000);
    });
}

function showLoadingState(button, text, loader) {
    button.disabled = true;
    text.classList.add('hidden');
    loader.classList.remove('hidden');
    button.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
    button.style.transform = 'scale(0.98)';
}

// Checkbox interaction with better visual feedback
document.addEventListener('DOMContentLoaded', function () {
    const stayWithAnimalCheckbox = document.getElementById('stayWithAnimal');
    if (stayWithAnimalCheckbox) {
        stayWithAnimalCheckbox.addEventListener('change', function () {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.color = '#15803d';
                label.style.fontWeight = '700';
                label.querySelector('i').style.color = '#16a34a';
                this.parentElement.style.background = 'rgba(34, 197, 94, 0.15)';
                this.parentElement.style.borderColor = 'rgba(34, 197, 94, 0.4)';
            } else {
                label.style.color = '#374151';
                label.style.fontWeight = '500';
                label.querySelector('i').style.color = '#374151';
                this.parentElement.style.background = 'rgba(239, 68, 68, 0.05)';
                this.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }
        });
    }
});

// Add CSS animations for better UX
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
        50% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
    }
`;
document.head.appendChild(style);