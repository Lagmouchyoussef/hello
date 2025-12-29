// DIKRA Centre Dentaire - Professional Dental Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavbar();
    initializeAppointmentForm();
    initializeLoginForm();
    initializeGallery();
    initializeAnimations();
    initializeContactForm();
});

// Navbar functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Login form functionality
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Connexion...';
        submitBtn.disabled = true;

        // Get form data
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simulate login (replace with actual authentication)
        setTimeout(() => {
            // Reset loading state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Simple validation (replace with real authentication)
            if (email && password) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();

                // Show success message
                showMessage('success', 'Connexion réussie ! Redirection vers votre compte...');

                // Simulate redirect (replace with actual redirect)
                setTimeout(() => {
                    window.location.href = 'http://127.0.0.1:5500/patient/html/dashboard.html';
                }, 1500);
            } else {
                showMessage('error', 'Veuillez saisir vos identifiants.');
            }

            // Reset form
            form.reset();
        }, 1500);
    });
}

// Appointment form functionality
function initializeAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.classList.add('loading');

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Generate provisional patient ID
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const provisionalId = `STW-${year}-${randomNum}`;

        // Create appointment object
        const appointment = {
            id: dataManager.generateId('Appointment'),
            patientId: provisionalId, // Provisional ID for new patients
            firstName: data.prenom,
            lastName: data.nom,
            email: data.email,
            phone: data.telephone,
            service: data.service,
            message: data.message || '',
            date: new Date().toISOString().split('T')[0], // Today's date as request date
            time: '09:00', // Default time
            status: 'En attente', // Waiting for confirmation
            createdAt: new Date().toISOString(),
            source: 'website' // Mark as coming from website
        };

        // Save appointment to localStorage
        dataManager.add('appointments', appointment);

        // Simulate form submission delay
        setTimeout(() => {
            // Reset loading state
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('loading');

            // Show success message with provisional ID
            showMessage('success', `Votre demande de rendez-vous a été envoyée avec succès ! Votre ID provisoire est : <strong>${provisionalId}</strong>. Nous vous contacterons bientôt pour confirmer votre rendez-vous.`);

            // Reset form
            form.reset();
        }, 2000);
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            showMessage('success', 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
            contactForm.reset();
        }, 1500);
    });
}

// Gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.overlay h5').textContent;

            // Create modal for image preview
            createImageModal(img.src, title);
        });
    });
}

// Create image modal
function createImageModal(src, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeModal()"></div>
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <img src="${src}" alt="${title}">
            <h3>${title}</h3>
        </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
        }
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            background: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .modal-content img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 4px;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 30px;
            cursor: pointer;
            color: #333;
        }
    `;
    document.head.appendChild(style);

    // Close modal function
    window.closeModal = function() {
        modal.remove();
        style.remove();
    };
}

// Animation functionality
function initializeAnimations() {
    // Add fade-in animation to sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Animate counters when about section is visible
                if (entry.target.id === 'about') {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// Message display function
function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;

    // Insert after form
    const form = document.querySelector('#appointmentForm') || document.querySelector('#contactForm');
    if (form) {
        form.appendChild(messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// WhatsApp integration
function openWhatsApp() {
    const phone = "0663697709";
    const message = "Bonjour, je souhaite prendre rendez-vous au Centre Dentaire DIKRA.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Phone call function
function callPhone() {
    const phone = "+21252115212";
    window.location.href = `tel:${phone}`;
}

// Email function
function sendEmail() {
    const email = "centredentairedikra@gmail.com";
    const subject = "Demande de rendez-vous - Centre Dentaire DIKRA";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = url;
}

// Instagram function
function openInstagram() {
    const username = "centredentairedikra";
    window.open(`https://instagram.com/${username}`, '_blank');
}

// Utility functions
function debounce(func, wait) {
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

// Add loading class to body during page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Add CSS for loaded state
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadStyle);
