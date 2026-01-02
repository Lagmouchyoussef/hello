const navbarHTML = `
<!-- Professional Sidebar Navigation -->
<div class="sidebar">
  <!-- Cabinet Header -->
  <div class="cabinet-header">
    <div class="cabinet-logo">
      <i class="fas fa-tooth"></i>
    </div>
    <div class="cabinet-name" id="cabinetName">Cabinet Dentaire</div>
    <div class="cabinet-subtitle">Casablanca, Maroc</div>
  </div>
  <!-- Navigation Menu -->
  <ul class="sidebar-menu">
    <!-- DASHBOARD (toujours visible, pas de dropdown) -->
    <li class="sidebar-item">
      <a href="dashboard.html" class="sidebar-link">
        <span class="sidebar-icon"><i class="fas fa-home"></i></span>
        Tableau de bord
      </a>
    </li>

    <!-- RENDEZ-VOUS -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-rdv-toggle">
        Rendez-vous
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-rdv-content">
        <div class="sidebar-item">
          <a href="Listes des Rendez-vous.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-calendar-check"></i></span>
            Liste des rendez-vous
          </a>
        </div>
        <div class="sidebar-item">
          <a href="Prise en ligne.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-globe"></i></span>
            Prise en ligne
          </a>
        </div>
        <div class="sidebar-item">
          <a href="En présentiel.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-building"></i></span>
            En présentiel
          </a>
        </div>
        <div class="sidebar-item">
          <a href="via-espace-patient.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-user-shield"></i></span>
            Via espace patient
          </a>
        </div>
      </div>
    </li>

    <!-- PATIENTS -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-patients-toggle">
        Patients
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-patients-content">
        <div class="sidebar-item">
          <a href="fiches-patients.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-user-injured"></i></span>
            Fiches patients
          </a>
        </div>
        <div class="sidebar-item">
          <a href="protheses.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-teeth"></i></span>
            Prothèses
          </a>
        </div>
        <div class="sidebar-item">
          <a href="imagerie-medicale.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-x-ray"></i></span>
            Imagerie médicale
          </a>
        </div>
      </div>
    </li>

    <!-- CABINET -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-cabinet-toggle">
        Cabinet
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-cabinet-content">
        <div class="sidebar-item">
          <a href="salle-attente.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-chair"></i></span>
            Salle d'attente
          </a>
        </div>
      </div>
    </li>

    <!-- COMPTABILITÉ -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-compta-toggle">
        Comptabilité
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-compta-content">
        <div class="sidebar-item">
          <a href="comptabilite-generale.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-calculator"></i></span>
            Comptabilité générale
          </a>
        </div>
        <div class="sidebar-item">
          <a href="paiements-recus.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-credit-card"></i></span>
            Paiements reçus
          </a>
        </div>
        <div class="sidebar-item">
          <a href="charges-depenses.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-file-invoice"></i></span>
            Charges & dépenses
          </a>
        </div>
      </div>
    </li>

    <!-- COMMUNICATION -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-com-toggle">
        Communication
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-com-content">
        <div class="sidebar-item">
          <a href="messagerie-interne.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-comments"></i></span>
            Messagerie interne
          </a>
        </div>
        <div class="sidebar-item">
          <a href="assistant-ia.html" class="sidebar-link">
            <span class="sidebar-icon">
              <div class="ai-agent-icon"><i class="fas fa-robot"></i></div>
            </span>
            Assistant IA
          </a>
        </div>
        <div class="sidebar-item">
          <a href="envoi-sms.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-sms"></i></span>
            Envoi de SMS
          </a>
        </div>
      </div>
    </li>

    <!-- ORGANISATION -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-org-toggle">
        Organisation
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-org-content">
        <div class="sidebar-item">
          <a href="taches-rappels.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-tasks"></i></span>
            Tâches & rappels
          </a>
        </div>
        <div class="sidebar-item">
          <a href="notes-personnelles.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-sticky-note"></i></span>
            Notes personnelles
          </a>
        </div>
        <div class="sidebar-item">
          <a href="statistiques.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-chart-bar"></i></span>
            Statistiques
          </a>
        </div>
      </div>
    </li>

    <!-- GESTION DES STOCKS -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-stock-toggle">
        Gestion des stocks
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-stock-content">
        <div class="sidebar-item">
          <a href="materiel-dentaire.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-box"></i></span>
            Matériel dentaire
          </a>
        </div>
        <div class="sidebar-item">
          <a href="consommables.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-vial"></i></span>
            Consommables
          </a>
        </div>
        <div class="sidebar-item">
          <a href="medicaments.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-pills"></i></span>
            Médicaments
          </a>
        </div>
      </div>
    </li>

    <!-- DOCUMENTS & FORMULAIRES -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-docs-toggle">
        Documents & formulaires
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-docs-content">
        <div class="sidebar-item">
          <a href="ordonnances.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-prescription"></i></span>
            Ordonnances
          </a>
        </div>
        <div class="sidebar-item">
          <a href="certificats-medicaux.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-file-medical"></i></span>
            Certificats médicaux
          </a>
        </div>
        <div class="sidebar-item">
          <a href="feuilles-de-soins.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-file-invoice"></i></span>
            Feuilles de soins (CNOPS/CNSS)
          </a>
        </div>
      </div>
    </li>

    <!-- UTILISATEURS -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-users-toggle">
        Utilisateurs
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-users-content">
        <div class="sidebar-item">
          <a href="Liste du personnel.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-list"></i></span>
            Liste du personnel
          </a>
        </div>
        <div class="sidebar-item">
          <a href="ajouter-un-membre.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-user-plus"></i></span>
            Ajouter un membre
          </a>
        </div>
        <div class="sidebar-item">
          <a href="roles-permissions.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-shield-alt"></i></span>
            Rôles & permissions
          </a>
        </div>
        <div class="sidebar-item">
          <a href="planning-equipe.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-calendar-check"></i></span>
            Planning de l'équipe
          </a>
        </div>
        <div class="sidebar-item">
          <a href="parametres-espace-patient.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-cog"></i></span>
            Paramètres espace patient
          </a>
        </div>
        <div class="sidebar-item">
          <a href="gestion-des-acces.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-key"></i></span>
            Gestion des accès
          </a>
        </div>
        <div class="sidebar-item">
          <a href="messages-patients.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-envelope"></i></span>
            Messages patients
          </a>
        </div>
        <div class="sidebar-item">
          <a href="dossiers-medicaux.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-file-medical"></i></span>
            Dossiers médicaux
          </a>
        </div>
      </div>
    </li>

    <!-- SITE WEB -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-website-toggle">
        Site web
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-website-content">
        <div class="sidebar-item">
          <a href="contenu-articles.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-edit"></i></span>
            Contenu & articles
          </a>
        </div>
        <div class="sidebar-item">
          <a href="design-theme.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-paint-brush"></i></span>
            Design & thème
          </a>
        </div>
        <div class="sidebar-item">
          <a href="referencement-seo.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-search"></i></span>
            Référencement (SEO)
          </a>
        </div>
        <div class="sidebar-item">
          <a href="formulaire-contact.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-envelope-open"></i></span>
            Formulaire de contact
          </a>
        </div>
        <div class="sidebar-item">
          <a href="statistiques-visite.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-chart-line"></i></span>
            Statistiques de visite
          </a>
        </div>
      </div>
    </li>

    <!-- CONFIGURATION -->
    <li class="sidebar-section">
      <div class="section-header clickable" id="section-config-toggle">
        Configuration
        <i class="fas fa-chevron-down section-chevron"></i>
      </div>
      <div class="section-content" id="section-config-content">
        <div class="sidebar-item">
          <a href="mon-profil.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-user-cog"></i></span>
            Mon profil
          </a>
        </div>
        <div class="sidebar-item">
          <a href="informations-cabinet.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-building"></i></span>
            Informations cabinet
          </a>
        </div>
        <div class="sidebar-item">
          <a href="parametres-facturation.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-file-invoice-dollar"></i></span>
            Paramètres de facturation
          </a>
        </div>
        <div class="sidebar-item">
          <a href="notifications.html" class="sidebar-link">
            <span class="sidebar-icon"><i class="fas fa-bell"></i></span>
            Notifications
          </a>
        </div>
      </div>
    </li>
  </ul>
  <!-- User Section -->
  <div class="user-section">
    <div class="user-info">
      <div class="user-avatar" id="userAvatar">DM</div>
      <div class="user-details">
        <div class="user-name" id="userName"></div>
        <div class="user-role" id="userRole"></div>
      </div>
    </div>
    <button class="theme-toggle" id="themeToggle">
      <i class="fas fa-moon"></i>
      <span>Mode Sombre</span>
    </button>
    <button class="logout-btn" id="logoutBtn">
      <i class="fas fa-sign-out-alt"></i>
      <span>Déconnexion</span>
    </button>
  </div>
</div>
`;

// Insert navbar HTML
document.getElementById('navbar-container').innerHTML = navbarHTML;

// Update user info after navbar is inserted
updateUserInfo();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('span');
const savedTheme = sessionStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  body.classList.remove('light-mode');
  body.classList.add('dark-mode');
  themeIcon.className = 'fas fa-sun';
  themeText.textContent = 'Mode Clair';
}

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeIcon.className = 'fas fa-sun';
    themeText.textContent = 'Mode Clair';
    sessionStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeIcon.className = 'fas fa-moon';
    themeText.textContent = 'Mode Sombre';
    sessionStorage.setItem('theme', 'light');
  }
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
    localStorage.removeItem('currentUser');
    alert('Déconnexion réussie !\nRedirection vers la page de connexion...');
    window.location.href = '../../LOGING/html/loging.html';
  }
});

// Load section states from localStorage
const savedStates = JSON.parse(localStorage.getItem('sidebarSections') || '{}');
document.querySelectorAll('.section-content').forEach(content => {
  const id = content.id;
  if (savedStates[id] === false) {
    content.classList.add('collapsed');
    content.previousElementSibling.classList.add('collapsed');
  } else if (savedStates[id] === true) {
    content.classList.remove('collapsed');
    content.previousElementSibling.classList.remove('collapsed');
  }
  // If not saved, keep initial state (collapsed)
});

// Collapsible section headers
document.querySelectorAll('.section-header.clickable').forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const isCollapsed = content.classList.contains('collapsed');

    // Close all other sections
    document.querySelectorAll('.section-content').forEach(el => {
      if (el !== content) {
        el.classList.add('collapsed');
        el.previousElementSibling.classList.add('collapsed');
      }
    });

    // Toggle current section
    if (isCollapsed) {
      content.classList.remove('collapsed');
      header.classList.remove('collapsed');
    } else {
      content.classList.add('collapsed');
      header.classList.add('collapsed');
    }

    // Save states to localStorage
    const states = {};
    document.querySelectorAll('.section-content').forEach(cont => {
      states[cont.id] = !cont.classList.contains('collapsed');
    });
    localStorage.setItem('sidebarSections', JSON.stringify(states));
  });
});

// Set active link based on current page
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-link').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// Update user info dynamically
function updateUserInfo() {
   const currentUser = dentalDataManager.getCurrentUser();
   if (currentUser) {
       const fullName = (currentUser.firstName || '') + ' ' + (currentUser.lastName || '').trim();
       const displayName = fullName || currentUser.name || 'Utilisateur';
       const roleDisplay = {
           'Admin': 'Administrateur',
           'Assistant': 'Assistante',
           'Patient': 'Patient'
       }[currentUser.role] || currentUser.role;

       document.getElementById('cabinetName').textContent = 'Cabinet Dentaire Al-Farabi';
       document.getElementById('userAvatar').textContent = displayName.charAt(0).toUpperCase() || 'U';
       document.getElementById('userName').textContent = displayName;
       document.getElementById('userRole').textContent = roleDisplay;
   } else {
       // Fallback if no user
       document.getElementById('cabinetName').textContent = 'Cabinet Dentaire Al-Farabi';
       document.getElementById('userAvatar').textContent = 'U';
       document.getElementById('userName').textContent = 'Utilisateur';
       document.getElementById('userRole').textContent = 'Non connecté';
   }
}

