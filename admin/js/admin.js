// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage or API
    loadDashboardStats();
    loadRecentAppointments();
    loadStaffList();

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            document.body.classList.toggle('light-mode');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Déconnexion ?')) {
                alert('Déconnecté.');
            }
        });
    }
});

function loadDashboardStats() {
    // Placeholder for loading stats
    const stats = JSON.parse(localStorage.getItem('adminStats')) || {
        totalAppointments: 0,
        todayAppointments: 0,
        totalPatients: 0,
        totalRevenue: 0
    };

    // Update DOM elements
    const totalAppointmentsEl = document.getElementById('total-appointments');
    if (totalAppointmentsEl) totalAppointmentsEl.textContent = stats.totalAppointments;

    const todayAppointmentsEl = document.getElementById('today-appointments');
    if (todayAppointmentsEl) todayAppointmentsEl.textContent = stats.todayAppointments;

    const totalPatientsEl = document.getElementById('total-patients');
    if (totalPatientsEl) totalPatientsEl.textContent = stats.totalPatients;

    const totalRevenueEl = document.getElementById('total-revenue');
    if (totalRevenueEl) totalRevenueEl.textContent = stats.totalRevenue + ' DH';
}

function loadRecentAppointments() {
    // Placeholder for loading appointments
    const appointments = JSON.parse(localStorage.getItem('adminAppointments')) || [];

    const listEl = document.getElementById('recent-appointments-list');
    if (listEl) {
        listEl.innerHTML = appointments.length ? 
            appointments.map(app => `<li>${app.patient} - ${app.date} - ${app.time}</li>`).join('') :
            '<li>Aucun rendez-vous récent.</li>';
    }
}

function loadStaffList() {
    // Placeholder for loading staff
    const staff = JSON.parse(localStorage.getItem('adminStaff')) || [];

    const listEl = document.getElementById('staff-list');
    if (listEl) {
        listEl.innerHTML = staff.length ?
            staff.map(s => `<li>${s.name} - ${s.role}</li>`).join('') :
            '<li>Aucun personnel.</li>';
    }
}
