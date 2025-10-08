// vet.js - Enhanced with 6 additional Bangladeshi vets and improved interactions

class VeterinariansPage {
    constructor() {
        this.vetsData = [];
        this.filteredVets = [];
        this.currentFilters = {
            vetName: '',
            clinicName: '',
            specialization: '',
            species: '',
            location: '',
            availability: ''
        };
        this.init();
    }

    init() {
        this.loadVetsData();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupIntersectionObserver();
    }

    loadVetsData() {
        // Enhanced Bangladeshi veterinarians data with 6 additional vets
        this.vetsData = [
            {
                id: 1,
                name: "Dr. Ayesha Rahman",
                clinic: "Dhaka Pet Care Center",
                specialty: "Surgery & Emergency Care",
                experience: "12 years",
                location: "Dhaka",
                rating: 4.9,
                reviews: 142,
                status: "available",
                species: ["dog", "cat"],
                availability: "now",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Specializing in surgical procedures and emergency pet care with over a decade of experience. Available for consultations and emergency cases.",
                languages: ["Bengali", "English"],
                education: "DVM, Bangladesh Agricultural University",
                consultationFee: "৳1,500"
            },
            {
                id: 2,
                name: "Dr. Mohammad Ali",
                clinic: "Chittagong Animal Hospital",
                specialty: "Dermatology & Allergy",
                experience: "9 years",
                location: "Chittagong",
                rating: 4.8,
                reviews: 98,
                status: "available",
                species: ["dog", "cat", "bird"],
                availability: "today",
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Expert in diagnosing and treating pet skin conditions and allergies. Special interest in canine dermatology.",
                languages: ["Bengali", "English", "Hindi"],
                education: "DVM, Chittagong Veterinary College",
                consultationFee: "৳1,200"
            },
            {
                id: 3,
                name: "Dr. Fatima Begum",
                clinic: "Sylhet Veterinary Clinic",
                specialty: "Dentistry & Oral Surgery",
                experience: "11 years",
                location: "Sylhet",
                rating: 4.7,
                reviews: 87,
                status: "busy",
                species: ["dog", "cat", "small"],
                availability: "weekend",
                image: "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Specialized training in veterinary dentistry and oral surgery procedures. Certified by the International Veterinary Dentistry Association.",
                languages: ["Bengali", "English"],
                education: "DVM, Sylhet Agricultural University",
                consultationFee: "৳1,800"
            },
            {
                id: 4,
                name: "Dr. Rahim Khan",
                clinic: "Khulna Pet Hospital",
                specialty: "Cardiology",
                experience: "15 years",
                location: "Khulna",
                rating: 4.9,
                reviews: 112,
                status: "available",
                species: ["dog", "cat"],
                availability: "emergency",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Leading cardiology specialist with extensive experience in heart conditions. Performs echocardiograms and cardiac surgeries.",
                languages: ["Bengali", "English"],
                education: "DVM, Royal Veterinary College, UK",
                consultationFee: "৳2,500"
            },
            {
                id: 5,
                name: "Dr. Nusrat Jahan",
                clinic: "Rajshahi Animal Care",
                specialty: "Ophthalmology",
                experience: "8 years",
                location: "Rajshahi",
                rating: 4.6,
                reviews: 76,
                status: "away",
                species: ["dog", "cat", "bird", "reptile"],
                availability: "today",
                image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Specialist in eye diseases and vision problems in pets. Performs cataract surgeries and treats various ocular conditions.",
                languages: ["Bengali", "English"],
                education: "DVM, Rajshahi University",
                consultationFee: "৳1,600"
            },
            {
                id: 6,
                name: "Dr. Sohel Ahmed",
                clinic: "Barisal Veterinary Center",
                specialty: "General Practice",
                experience: "14 years",
                location: "Barisal",
                rating: 4.8,
                reviews: 134,
                status: "available",
                species: ["dog", "cat", "bird", "small", "exotic"],
                availability: "now",
                image: "https://images.unsplash.com/photo-1584467735871-8db9ac8e5e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Comprehensive care for all types of pets with a focus on preventive medicine. Special interest in exotic animal medicine.",
                languages: ["Bengali", "English"],
                education: "DVM, Bangladesh Agricultural University",
                consultationFee: "৳1,000"
            },
            // Additional 6 Bangladeshi Veterinarians
            {
                id: 7,
                name: "Dr. Tasnim Hossain",
                clinic: "Dhaka Animal Specialists",
                specialty: "Internal Medicine",
                experience: "10 years",
                location: "Dhaka",
                rating: 4.7,
                reviews: 91,
                status: "available",
                species: ["dog", "cat"],
                availability: "today",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Specialist in internal medicine with expertise in diagnosing complex medical conditions. Focuses on endocrine and gastrointestinal disorders.",
                languages: ["Bengali", "English"],
                education: "DVM, Bangladesh Agricultural University",
                consultationFee: "৳1,700"
            },
            {
                id: 8,
                name: "Dr. Kamal Uddin",
                clinic: "Chittagong Pet Wellness",
                specialty: "Orthopedic Surgery",
                experience: "13 years",
                location: "Chittagong",
                rating: 4.9,
                reviews: 118,
                status: "busy",
                species: ["dog", "cat"],
                availability: "weekend",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Expert in orthopedic surgeries including fracture repairs, joint replacements, and cruciate ligament repairs. Uses advanced surgical techniques.",
                languages: ["Bengali", "English"],
                education: "DVM, Chittagong Veterinary College",
                consultationFee: "৳2,200"
            },
            {
                id: 9,
                name: "Dr. Sabrina Chowdhury",
                clinic: "Sylhet Exotic Animal Clinic",
                specialty: "Exotic Animal Medicine",
                experience: "7 years",
                location: "Sylhet",
                rating: 4.5,
                reviews: 63,
                status: "available",
                species: ["bird", "reptile", "small", "exotic"],
                availability: "now",
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Specialist in exotic animal medicine with focus on birds, reptiles, and small mammals. Provides specialized care for uncommon pets.",
                languages: ["Bengali", "English"],
                education: "DVM, Sylhet Agricultural University",
                consultationFee: "৳1,900"
            },
            {
                id: 10,
                name: "Dr. Arif Hassan",
                clinic: "Khulna Emergency Vet",
                specialty: "Emergency & Critical Care",
                experience: "11 years",
                location: "Khulna",
                rating: 4.8,
                reviews: 105,
                status: "available",
                species: ["dog", "cat", "bird"],
                availability: "emergency",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Specialized in emergency veterinary medicine and critical care. Available 24/7 for urgent pet medical needs and trauma cases.",
                languages: ["Bengali", "English"],
                education: "DVM, Bangladesh Agricultural University",
                consultationFee: "৳2,000"
            },
            {
                id: 11,
                name: "Dr. Nasrin Akter",
                clinic: "Rajshahi Pet Hospital",
                specialty: "Behavioral Medicine",
                experience: "9 years",
                location: "Rajshahi",
                rating: 4.6,
                reviews: 88,
                status: "available",
                species: ["dog", "cat"],
                availability: "today",
                image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Expert in animal behavior and psychological issues. Helps pets with anxiety, aggression, and other behavioral problems.",
                languages: ["Bengali", "English"],
                education: "DVM, Rajshahi University",
                consultationFee: "৳1,400"
            },
            {
                id: 12,
                name: "Dr. Fahim Reza",
                clinic: "Barisal Animal Wellness",
                specialty: "Preventive Medicine",
                experience: "16 years",
                location: "Barisal",
                rating: 4.9,
                reviews: 127,
                status: "available",
                species: ["dog", "cat", "bird", "small"],
                availability: "now",
                image: "https://images.unsplash.com/photo-1584467735871-8db9ac8e5e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Focuses on preventive care, vaccinations, and wellness programs. Believes in proactive healthcare for long, healthy pet lives.",
                languages: ["Bengali", "English"],
                education: "DVM, Bangladesh Agricultural University",
                consultationFee: "৳1,100"
            }
        ];

        this.filteredVets = [...this.vetsData];
        this.renderVetCards();
    }

    setupEventListeners() {
        // Search and filter events with enhanced hover effects
        const searchInputs = document.querySelectorAll('#vet-name, #clinic-name, .filter-select');
        searchInputs.forEach(input => {
            input.addEventListener('mouseenter', this.addHoverEffect.bind(this));
            input.addEventListener('mouseleave', this.removeHoverEffect.bind(this));
            input.addEventListener('focus', this.addFocusEffect.bind(this));
            input.addEventListener('blur', this.removeFocusEffect.bind(this));
        });

        document.getElementById('vet-name').addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        document.getElementById('clinic-name').addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        document.getElementById('specialization').addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('species').addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('location').addEventListener('change', this.handleFilter.bind(this));
        document.getElementById('availability').addEventListener('change', this.handleFilter.bind(this));
        
        // Enhanced button events with hover effects
        const buttons = document.querySelectorAll('#search-button, #reset-filters, .btn-primary, .btn-secondary, .btn-outline');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', this.addButtonHover.bind(this));
            button.addEventListener('mouseleave', this.removeButtonHover.bind(this));
        });

        document.getElementById('search-button').addEventListener('click', this.handleSearch.bind(this));
        document.getElementById('reset-filters').addEventListener('click', this.resetFilters.bind(this));

        // Enhanced text hover effects
        const hoverTexts = document.querySelectorAll('.hover-text-amber, .section-title, h1, h2, h3, p');
        hoverTexts.forEach(text => {
            text.addEventListener('mouseenter', this.addTextHover.bind(this));
            text.addEventListener('mouseleave', this.removeTextHover.bind(this));
        });

        // Book appointment buttons only (View Profile is now a regular link)
        document.addEventListener('click', this.handleAppointmentBooking.bind(this));
    }

    addHoverEffect(event) {
        event.target.classList.add('hover-lift');
    }

    removeHoverEffect(event) {
        event.target.classList.remove('hover-lift');
    }

    addFocusEffect(event) {
        event.target.classList.add('glow-effect');
    }

    removeFocusEffect(event) {
        event.target.classList.remove('glow-effect');
    }

    addButtonHover(event) {
        event.target.classList.add('hover-lift');
    }

    removeButtonHover(event) {
        event.target.classList.remove('hover-lift');
    }

    addTextHover(event) {
        if (event.target.classList.contains('hover-text-amber') || 
            event.target.tagName === 'H1' || 
            event.target.tagName === 'H2' || 
            event.target.tagName === 'H3') {
            event.target.classList.add('text-glow');
        }
    }

    removeTextHover(event) {
        event.target.classList.remove('text-glow');
    }

    initializeAnimations() {
        // Initialize typewriter effect
        this.typewriterEffect();
        
        // Initialize floating elements
        this.initializeFloatingElements();
        
        // Initialize particle background
        this.initializeParticles();

        // Initialize feature card animations
        this.initializeFeatureCards();
    }

    initializeFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-fadeInUp');
        });
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

        // Observe all vet cards and feature cards
        document.querySelectorAll('.vet-card, .feature-card, .section-title').forEach(card => {
            observer.observe(card);
        });
    }

    typewriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('typewriter');
        }
    }

    initializeFloatingElements() {
        const floatingElements = document.querySelectorAll('.float-animation');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.5}s`;
        });
    }

    initializeParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                animation-delay: ${Math.random() * 10}s;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            particlesContainer.appendChild(particle);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleSearch() {
        this.updateCurrentFilters();
        this.filterVets();
    }

    handleFilter() {
        this.updateCurrentFilters();
        this.filterVets();
    }

    updateCurrentFilters() {
        this.currentFilters = {
            vetName: document.getElementById('vet-name').value.toLowerCase(),
            clinicName: document.getElementById('clinic-name').value.toLowerCase(),
            specialization: document.getElementById('specialization').value,
            species: document.getElementById('species').value,
            location: document.getElementById('location').value,
            availability: document.getElementById('availability').value
        };
    }

    filterVets() {
        this.filteredVets = this.vetsData.filter(vet => {
            return (
                (this.currentFilters.vetName === '' || 
                 vet.name.toLowerCase().includes(this.currentFilters.vetName) || 
                 vet.clinic.toLowerCase().includes(this.currentFilters.vetName)) &&
                (this.currentFilters.clinicName === '' || 
                 vet.clinic.toLowerCase().includes(this.currentFilters.clinicName)) &&
                (this.currentFilters.specialization === '' || 
                 vet.specialty.toLowerCase().includes(this.currentFilters.specialization)) &&
                (this.currentFilters.species === '' || 
                 vet.species.includes(this.currentFilters.species)) &&
                (this.currentFilters.location === '' || 
                 vet.location.toLowerCase() === this.currentFilters.location) &&
                (this.currentFilters.availability === '' || 
                 vet.availability === this.currentFilters.availability)
            );
        });

        this.renderVetCards();
        this.highlightSearchTerms();
        this.animateResults();
    }

    renderVetCards() {
        const container = document.getElementById('vet-cards-container');
        
        if (this.filteredVets.length === 0) {
            container.innerHTML = this.getNoResultsHTML();
            return;
        }

        container.innerHTML = this.filteredVets.map(vet => this.createVetCardHTML(vet)).join('');
        
        // Re-initialize intersection observer for new cards
        setTimeout(() => this.setupIntersectionObserver(), 100);
    }

    createVetCardHTML(vet) {
        const statusClass = this.getStatusClass(vet.status);
        const statusText = this.getStatusText(vet.status);
        const speciesBadges = vet.species.map(species => 
            `<span class="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mr-1 mb-1 hover-lift">${species}</span>`
        ).join('');

        return `
            <div class="vet-card bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group relative animate-fadeInUp">
                <div class="relative h-56 overflow-hidden">
                    <img src="${vet.image}" alt="${vet.name}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <span class="absolute top-4 right-4 px-3 py-1 ${statusClass} text-white text-sm font-bold rounded-full shadow-lg">
                        ${statusText}
                    </span>
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 class="text-xl font-bold text-white group-hover:text-amber-200 transition-colors duration-300">${vet.name}</h3>
                        <p class="text-amber-300 font-semibold text-sm">${vet.clinic}</p>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-amber-600 font-bold text-lg hover-text-amber">${vet.specialty}</span>
                        <span class="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded hover-lift">${vet.experience}</span>
                    </div>
                    <p class="text-gray-600 mb-4 leading-relaxed hover-text-amber">${vet.description}</p>
                    
                    <div class="mb-4">
                        ${speciesBadges}
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div class="flex items-center hover-text-amber">
                            <i class="fas fa-graduation-cap text-amber-500 mr-2"></i>
                            <span>${vet.education.split(',')[0]}</span>
                        </div>
                        <div class="flex items-center hover-text-amber">
                            <i class="fas fa-comments text-amber-500 mr-2"></i>
                            <span>${vet.languages.join(', ')}</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-gray-600 flex items-center text-sm hover-text-amber">
                            <i class="fas fa-map-marker-alt text-amber-500 mr-1"></i> 
                            ${vet.location}
                        </span>
                        <span class="text-amber-600 font-bold flex items-center hover-text-amber">
                            <i class="fas fa-star text-yellow-400 mr-1"></i> 
                            ${vet.rating} (${vet.reviews} reviews)
                        </span>
                    </div>
                    
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-green-600 font-semibold hover-text-amber">${vet.consultationFee}</span>
                        <span class="text-sm text-gray-500 hover-text-amber">Consultation Fee</span>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button class="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all duration-300 transform group-hover:-translate-y-1 btn-primary glow-effect"
                                data-vet-id="${vet.id}" data-action="book">
                            <i class="fas fa-calendar-check mr-2"></i>Book Appointment
                        </button>
                        <a href="/Veterinarians/VetProfile/${vet.id}" class="px-4 py-3 border-2 border-amber-600 text-amber-600 rounded-xl font-bold hover:bg-amber-600 hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 btn-outline text-center">
                            <i class="fas fa-eye mr-2"></i>View Profile
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        const statusClasses = {
            'available': 'status-available',
            'busy': 'status-busy',
            'away': 'status-away'
        };
        return statusClasses[status] || 'status-busy';
    }

    getStatusText(status) {
        const statusTexts = {
            'available': 'Available Now',
            'busy': 'Currently Busy',
            'away': 'Away'
        };
        return statusTexts[status] || 'Unknown';
    }

    getNoResultsHTML() {
        return `
            <div class="col-span-full text-center py-16 animate-fadeInUp">
                <div class="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 hover-lift">
                    <i class="fas fa-search text-amber-600 text-3xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2 hover-text-amber">No veterinarians found</h3>
                <p class="text-gray-600 max-w-md mx-auto mb-6 hover-text-amber">
                    Try adjusting your search filters or search terms to find more results.
                </p>
                <button onclick="vetPage.resetFilters()" 
                        class="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all duration-300 btn-primary glow-effect">
                    Reset All Filters
                </button>
            </div>
        `;
    }

    highlightSearchTerms() {
        // Implementation for highlighting search terms in results
    }

    animateResults() {
        const cards = document.querySelectorAll('.vet-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-fadeInUp');
        });
    }

    resetFilters() {
        document.getElementById('vet-name').value = '';
        document.getElementById('clinic-name').value = '';
        document.getElementById('specialization').value = '';
        document.getElementById('species').value = '';
        document.getElementById('location').value = '';
        document.getElementById('availability').value = '';
        
        this.currentFilters = {
            vetName: '',
            clinicName: '',
            specialization: '',
            species: '',
            location: '',
            availability: ''
        };
        
        this.filteredVets = [...this.vetsData];
        this.renderVetCards();
        
        // Add visual feedback for reset
        const resetButton = document.getElementById('reset-filters');
        resetButton.classList.add('glow-effect');
        setTimeout(() => resetButton.classList.remove('glow-effect'), 1000);
    }

    handleAppointmentBooking(event) {
        // Only handle book appointment buttons, View Profile is now a regular link
        if (event.target.matches('[data-action="book"]') || event.target.closest('[data-action="book"]')) {
            const button = event.target.matches('[data-action="book"]') ? event.target : event.target.closest('[data-action="book"]');
            const vetId = button.getAttribute('data-vet-id');
            const vet = this.vetsData.find(v => v.id == vetId);
            
            if (vet) {
                this.showBookingModal(vet);
            }
        }
    }

    showBookingModal(vet) {
        // Simple alert for demo - replace with actual modal implementation
        alert(`Booking appointment with ${vet.name} from ${vet.clinic}\n\nContact: Please call the clinic directly or visit their website to schedule an appointment.`);
    }
}

// Initialize the veterinarians page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.vetPage = new VeterinariansPage();
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
`;
document.head.appendChild(style);