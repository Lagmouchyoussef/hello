// Common JavaScript for navigation and UI interactions

document.addEventListener('DOMContentLoaded', function() {
    // Collapse all sections by default
    const sectionContents = document.querySelectorAll('.section-content');
    const sectionHeaders = document.querySelectorAll('.section-header.clickable');
    sectionContents.forEach(content => {
        content.classList.add('collapsed');
    });
    sectionHeaders.forEach(header => {
        header.classList.add('collapsed');
    });

    // Expand the section corresponding to the current page
    const currentPath = window.location.pathname.split('/').pop();
    const sectionMap = {
        'dashboard.html': 'section-rdv-toggle', // or no section for dashboard
        'Listes des Rendez-vous.html': 'section-rdv-toggle',
        'Prise en ligne.html': 'section-rdv-toggle',
        'En présentiel.html': 'section-rdv-toggle',
        'via-espace-patient.html': 'section-rdv-toggle',
        'planning-equipe.html': 'section-rdv-toggle',
        'salle-attente.html': 'section-rdv-toggle',
        'fiches-patients.html': 'section-patients-toggle',
        'dossiers-medicaux.html': 'section-patients-toggle',
        'salle-attente.html': 'section-cabinet-toggle', // duplicate, but ok
        'comptabilite-generale.html': 'section-compta-toggle',
        'paiements-recus.html': 'section-compta-toggle',
        'charges-depenses.html': 'section-compta-toggle',
        'messagerie-interne.html': 'section-com-toggle',
        'assistant-ia.html': 'section-com-toggle',
        'envoi-sms.html': 'section-com-toggle',
        'notifications.html': 'section-com-toggle',
        'messages-patients.html': 'section-com-toggle',
        'taches-rappels.html': 'section-org-toggle',
        'notes-personnelles.html': 'section-org-toggle',
        'statistiques.html': 'section-org-toggle',
        'materiel-dentaire.html': 'section-stock-toggle',
        'consommables.html': 'section-stock-toggle',
        'medicaments.html': 'section-stock-toggle',
        'ordonnances.html': 'section-docs-toggle',
        'certificats-medicaux.html': 'section-docs-toggle',
        'feuilles-de-soins.html': 'section-docs-toggle',
        'imagerie-medicale.html': 'section-docs-toggle',
        'protheses.html': 'section-docs-toggle',
        'Liste du personnel.html': 'section-users-toggle',
        'ajouter-un-membre.html': 'section-users-toggle',
        'roles-permissions.html': 'section-users-toggle',
        'planning-equipe.html': 'section-users-toggle', // duplicate
        'parametres-espace-patient.html': 'section-users-toggle',
        'gestion-des-acces.html': 'section-users-toggle',
        'dossiers-medicaux.html': 'section-users-toggle', // duplicate
        'contenu-articles.html': 'section-website-toggle',
        'design-theme.html': 'section-website-toggle',
        'referencement-seo.html': 'section-website-toggle',
        'formulaire-contact.html': 'section-website-toggle',
        'statistiques-visite.html': 'section-website-toggle',
        'mon-profil.html': 'section-config-toggle',
        'informations-cabinet.html': 'section-config-toggle',
        'parametres-facturation.html': 'section-config-toggle',
        'notifications.html': 'section-config-toggle' // duplicate
    };

    if (sectionMap[currentPath]) {
        const header = document.getElementById(sectionMap[currentPath]);
        if (header) {
            const contentId = sectionMap[currentPath].replace('-toggle', '-content');
            const content = document.getElementById(contentId);
            if (content) {
                content.classList.remove('collapsed');
                header.classList.remove('collapsed');
            }
        }
    }

    // Handle all link clicks for SPA navigation
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href') !== '#' && link.getAttribute('href').endsWith('.html')) {
            if (window.location.protocol === 'file:') {
                // For local files, let browser handle navigation
                return;
            }
            e.preventDefault();
            loadPage(link.getAttribute('href'));
        }
    });

    // Handle section header clicks for collapsible sections
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sectionId = this.id.replace('-toggle', '-content');
            const content = document.getElementById(sectionId);
            if (content) {
                const isCollapsed = content.classList.contains('collapsed');
                if (isCollapsed) {
                    content.classList.remove('collapsed');
                    this.classList.remove('collapsed');
                } else {
                    content.classList.add('collapsed');
                    this.classList.add('collapsed');
                }
            }
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
            const icon = this.querySelector('i');
            const span = this.querySelector('span');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                span.textContent = 'Mode Clair';
            } else {
                icon.className = 'fas fa-moon';
                span.textContent = 'Mode Sombre';
            }
        });
    }

    // Logout functionality (placeholder)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Implement logout logic here
            alert('Déconnexion...');
        });
    }
});

// Function to load page content dynamically
function loadPage(url) {
    // Save current scroll position
    const scrollY = window.scrollY;

    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMainContent = doc.querySelector('.main-content');
            if (newMainContent) {
                const currentMainContent = document.querySelector('.main-content');
                if (currentMainContent) {
                    currentMainContent.innerHTML = newMainContent.innerHTML;
                }
                // Update URL without reloading
                history.pushState(null, '', url);
                // Update page title
                const title = doc.querySelector('title');
                if (title) {
                    document.title = title.textContent;
                }
                // Re-attach event listeners for new content if needed
                // For example, if there are buttons or forms in the new content
                attachDynamicEventListeners();
                // Restore scroll position, clamped to content height
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                window.scrollTo(0, Math.min(scrollY, maxScroll));
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

// Function to attach event listeners to dynamically loaded content
function attachDynamicEventListeners() {
    // Add any event listeners that need to be re-attached after content change
    // For example, if there are buttons in the main content
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    // Reload the page on back/forward to keep it simple
    // Alternatively, implement history management
    window.location.reload();
});
