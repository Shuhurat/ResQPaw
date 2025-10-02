// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
 // Simple JavaScript for interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            // Add animation to feature cards on scroll
            const featureCards = document.querySelectorAll('.feature-card');
           
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
           
            featureCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });

            // SOS Button functionality
            const sosBtn = document.getElementById('sosBtn');
            const sosModal = document.getElementById('sosModal');
            const cancelSos = document.getElementById('cancelSos');
            const callEmergency = document.getElementById('callEmergency');

            sosBtn.addEventListener('click', function(e) {
                e.preventDefault();
                sosModal.style.display = 'flex';
            });

            cancelSos.addEventListener('click', function() {
                sosModal.style.display = 'none';
            });

            callEmergency.addEventListener('click', function() {
                alert('Connecting to emergency services...');
                // In a real implementation, this would trigger a call or API request
                setTimeout(function() {
                    sosModal.style.display = 'none';
                    alert('Help is on the way! A rescuer will contact you shortly.');
                }, 2000);
            });

            // Close modal if clicked outside
            window.addEventListener('click', function(e) {
                if (e.target === sosModal) {
                    sosModal.style.display = 'none';
                }
            });
        });