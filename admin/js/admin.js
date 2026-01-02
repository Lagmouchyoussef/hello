// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = dentalDataManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../../LOGING/html/loging.html';
        return;
    }

    // Load data from unified storage
    loadDashboardStats();
    loadRecentAppointments();
    loadStaffList();
});

function loadDashboardStats() {
    const appointments = dentalDataManager.getAll('appointments');
    const patients = dentalDataManager.getAll('patients');

    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === today).length;

    // Update DOM elements
    const totalAppointmentsEl = document.getElementById('total-appointments');
    if (totalAppointmentsEl) totalAppointmentsEl.textContent = appointments.length;

    const todayAppointmentsEl = document.getElementById('today-appointments');
    if (todayAppointmentsEl) todayAppointmentsEl.textContent = todayAppointments;

    const totalPatientsEl = document.getElementById('total-patients');
    if (totalPatientsEl) totalPatientsEl.textContent = patients.length;

    // For revenue, we might need payments data, but for now placeholder
    const totalRevenueEl = document.getElementById('total-revenue');
    if (totalRevenueEl) totalRevenueEl.textContent = '0 DH'; // Placeholder
}

function loadRecentAppointments() {
    const appointments = dentalDataManager.getAll('appointments').slice(0, 5); // Recent 5

    const listEl = document.getElementById('recent-appointments-list');
    if (listEl) {
        listEl.innerHTML = appointments.length ?
            appointments.map(app => `<li>${app.patientName || 'Patient'} - ${new Date(app.date).toLocaleDateString('fr-FR')} - ${app.time}</li>`).join('') :
            '<li>Aucun rendez-vous récent.</li>';
    }
}

function loadStaffList() {
    const users = dentalDataManager.getAll('users').filter(u => u.role !== 'Patient');

    const listEl = document.getElementById('staff-list');
    if (listEl) {
        listEl.innerHTML = users.length ?
            users.map(s => `<li>${s.name} - ${s.role}</li>`).join('') :
            '<li>Aucun personnel.</li>';
    }
}
