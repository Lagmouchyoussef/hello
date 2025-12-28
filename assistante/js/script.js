// Assistant-specific JavaScript functions
// This file contains functions specific to the assistant role

// Data keys (shared with admin)
const DATA_KEYS = {
    patients: 'dikra_patients',
    appointments: 'dikra_appointments',
    cares: 'dikra_cares',
    invoices: 'dikra_invoices',
    insurances: 'dikra_insurances',
    team: 'dikra_team',
    rooms: 'dikra_rooms',
    messages: 'dikra_messages',
    settings: 'dikra_settings'
};

// Initialize data
function initData() {
    if (!localStorage.getItem(DATA_KEYS.patients)) {
        localStorage.setItem(DATA_KEYS.patients, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.appointments)) {
        localStorage.setItem(DATA_KEYS.appointments, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.cares)) {
        localStorage.setItem(DATA_KEYS.cares, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.invoices)) {
        localStorage.setItem(DATA_KEYS.invoices, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.insurances)) {
        localStorage.setItem(DATA_KEYS.insurances, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.team)) {
        localStorage.setItem(DATA_KEYS.team, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.rooms)) {
        localStorage.setItem(DATA_KEYS.rooms, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.messages)) {
        localStorage.setItem(DATA_KEYS.messages, JSON.stringify([]));
    }
    if (!localStorage.getItem(DATA_KEYS.settings)) {
        localStorage.setItem(DATA_KEYS.settings, JSON.stringify({
            tva: 20,
            currency: '€',
            contact: 'contact@dikra.com'
        }));
    }
}

// Load data
function loadData(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// Save data
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

// Load patients (assistant view - can add but limited edit)
function loadPatients() {
    const patients = loadData(DATA_KEYS.patients);
    const tbody = document.querySelector('#patients-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        patients.forEach(p => {
            const row = `<tr>
                <td>${p.id}</td>
                <td>${p.nom}</td>
                <td>${p.prenom}</td>
                <td>${p.naissance}</td>
                <td>${p.telephone}</td>
                <td>${p.adresse || '-'}</td>
                <td>${p.mutuelle || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewPatient('${p.id}')">Voir</button>
                    <button class="btn btn-sm btn-warning" onclick="editPatient('${p.id}')">Modifier</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

// Load appointments (assistant can manage appointments)
function loadAppointments() {
    const appointments = loadData(DATA_KEYS.appointments);
    const patients = loadData(DATA_KEYS.patients);
    const tbody = document.querySelector('#appointments-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        appointments.forEach(a => {
            const patient = patients.find(p => p.id == a.patientId);
            const time = a.date.includes('T') ? a.date.split('T')[1].substring(0, 5) : '09:00';
            const row = `<tr>
                <td>${a.id}</td>
                <td>${patient ? patient.nom + ' ' + patient.prenom : 'Patient inconnu'}</td>
                <td>${new Date(a.date).toLocaleDateString('fr-FR')}</td>
                <td>${time}</td>
                <td>${a.type || 'Consultation'}</td>
                <td><span class="badge bg-${getStatusColor(a.status)}">${a.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editAppointment(${a.id})">Modifier</button>
                    <button class="btn btn-sm btn-info" onclick="viewAppointment(${a.id})">Voir</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

// Helper function for status colors
function getStatusColor(status) {
    switch(status) {
        case 'Confirmé': return 'success';
        case 'En attente': return 'warning';
        case 'Annulé': return 'danger';
        case 'Terminé': return 'secondary';
        default: return 'primary';
    }
}

// Add patient (assistant can add patients)
function addPatient() {
    const form = document.getElementById('add-patient-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patients = loadData(DATA_KEYS.patients);
    const year = new Date().getFullYear();
    const sequential = (patients.length + 1).toString().padStart(4, '0');
    const newPatient = {
        id: `PAT-${year}-${sequential}`,
        nom: document.getElementById('patient-nom').value,
        prenom: document.getElementById('patient-prenom').value,
        naissance: document.getElementById('patient-naissance').value,
        telephone: document.getElementById('patient-telephone').value,
        adresse: document.getElementById('patient-adresse').value,
        mutuelle: document.getElementById('patient-mutuelle').value,
        observations: document.getElementById('patient-observations').value
    };

    patients.push(newPatient);
    saveData(DATA_KEYS.patients, patients);
    loadPatients();

    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal'));
    modal.hide();
    form.reset();

    showToast('Patient ajouté avec succès', 'success');
}

// Add appointment (assistant can schedule appointments)
function addAppointment() {
    const form = document.getElementById('add-appointment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const appointments = loadData(DATA_KEYS.appointments);
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const dateTime = `${date}T${time}`;

    const newAppointment = {
        id: Date.now(),
        patientId: document.getElementById('appointment-patient').value,
        date: dateTime,
        type: document.getElementById('appointment-type').value,
        status: document.getElementById('appointment-status').value,
        notes: document.getElementById('appointment-notes').value || ''
    };

    appointments.push(newAppointment);
    saveData(DATA_KEYS.appointments, appointments);
    loadAppointments();

    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAppointmentModal'));
    modal.hide();
    form.reset();

    showToast('Rendez-vous créé avec succès', 'success');
}

// Edit patient (limited editing for assistant)
function editPatient(id) {
    const patients = loadData(DATA_KEYS.patients);
    const patient = patients.find(p => p.id == id);
    if (patient) {
        // Populate form fields
        document.getElementById('edit-patient-nom').value = patient.nom;
        document.getElementById('edit-patient-prenom').value = patient.prenom;
        document.getElementById('edit-patient-naissance').value = patient.naissance;
        document.getElementById('edit-patient-telephone').value = patient.telephone;
        document.getElementById('edit-patient-adresse').value = patient.adresse || '';
        document.getElementById('edit-patient-mutuelle').value = patient.mutuelle || '';
        document.getElementById('edit-patient-observations').value = patient.observations || '';
        document.getElementById('edit-patient-id').value = patient.id;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editPatientModal'));
        modal.show();
    }
}

// Update patient
function updatePatient() {
    const form = document.getElementById('edit-patient-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patients = loadData(DATA_KEYS.patients);
    const id = document.getElementById('edit-patient-id').value;
    const index = patients.findIndex(p => p.id == id);

    if (index !== -1) {
        patients[index] = {
            ...patients[index],
            nom: document.getElementById('edit-patient-nom').value,
            prenom: document.getElementById('edit-patient-prenom').value,
            naissance: document.getElementById('edit-patient-naissance').value,
            telephone: document.getElementById('edit-patient-telephone').value,
            adresse: document.getElementById('edit-patient-adresse').value,
            mutuelle: document.getElementById('edit-patient-mutuelle').value,
            observations: document.getElementById('edit-patient-observations').value
        };

        saveData(DATA_KEYS.patients, patients);
        loadPatients();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPatientModal'));
        modal.hide();

        showToast('Patient modifié avec succès', 'success');
    }
}

// Edit appointment
function editAppointment(id) {
    const appointments = loadData(DATA_KEYS.appointments);
    const appointment = appointments.find(a => a.id == id);
    if (appointment) {
        // Populate form fields
        document.getElementById('edit-appointment-patient').value = appointment.patientId;
        document.getElementById('edit-appointment-date').value = appointment.date.split('T')[0];
        document.getElementById('edit-appointment-time').value = appointment.date.split('T')[1] ? appointment.date.split('T')[1].substring(0, 5) : '';
        document.getElementById('edit-appointment-type').value = appointment.type || '';
        document.getElementById('edit-appointment-status').value = appointment.status;
        document.getElementById('edit-appointment-notes').value = appointment.notes || '';
        document.getElementById('edit-appointment-id').value = appointment.id;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
        modal.show();
    }
}

// Update appointment
function updateAppointment() {
    const form = document.getElementById('edit-appointment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const appointments = loadData(DATA_KEYS.appointments);
    const id = document.getElementById('edit-appointment-id').value;
    const index = appointments.findIndex(a => a.id == id);

    if (index !== -1) {
        const date = document.getElementById('edit-appointment-date').value;
        const time = document.getElementById('edit-appointment-time').value;
        const dateTime = `${date}T${time}`;

        appointments[index] = {
            ...appointments[index],
            patientId: document.getElementById('edit-appointment-patient').value,
            date: dateTime,
            type: document.getElementById('edit-appointment-type').value,
            status: document.getElementById('edit-appointment-status').value,
            notes: document.getElementById('edit-appointment-notes').value
        };

        saveData(DATA_KEYS.appointments, appointments);
        loadAppointments();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal'));
        modal.hide();

        showToast('Rendez-vous modifié avec succès', 'success');
    }
}

// View patient details
function viewPatient(id) {
    const patients = loadData(DATA_KEYS.patients);
    const patient = patients.find(p => p.id == id);
    if (patient) {
        const details = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Informations personnelles</h6>
                    <p><strong>ID:</strong> ${patient.id}</p>
                    <p><strong>Nom:</strong> ${patient.nom} ${patient.prenom}</p>
                    <p><strong>Date de naissance:</strong> ${patient.naissance}</p>
                    <p><strong>Téléphone:</strong> ${patient.telephone}</p>
                </div>
                <div class="col-md-6">
                    <h6>Informations médicales</h6>
                    <p><strong>Adresse:</strong> ${patient.adresse || 'Non spécifiée'}</p>
                    <p><strong>Mutuelle:</strong> ${patient.mutuelle || 'Non spécifiée'}</p>
                    <p><strong>Observations:</strong> ${patient.observations || 'Aucune'}</p>
                </div>
            </div>
        `;

        document.getElementById('view-patient-details').innerHTML = details;
        const modal = new bootstrap.Modal(document.getElementById('viewPatientModal'));
        modal.show();
    }
}

// View appointment details
function viewAppointment(id) {
    const appointments = loadData(DATA_KEYS.appointments);
    const patients = loadData(DATA_KEYS.patients);
    const appointment = appointments.find(a => a.id == id);
    if (appointment) {
        const patient = patients.find(p => p.id == appointment.patientId);
        const details = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Détails du rendez-vous</h6>
                    <p><strong>ID:</strong> ${appointment.id}</p>
                    <p><strong>Patient:</strong> ${patient ? patient.nom + ' ' + patient.prenom : 'Patient inconnu'}</p>
                    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Heure:</strong> ${appointment.date.split('T')[1] ? appointment.date.split('T')[1].substring(0, 5) : '09:00'}</p>
                </div>
                <div class="col-md-6">
                    <h6>Informations supplémentaires</h6>
                    <p><strong>Type:</strong> ${appointment.type || 'Consultation'}</p>
                    <p><strong>Statut:</strong> <span class="badge bg-${getStatusColor(appointment.status)}">${appointment.status}</span></p>
                    <p><strong>Notes:</strong> ${appointment.notes || 'Aucune'}</p>
                </div>
            </div>
        `;

        // For simplicity, we'll use the patient view modal
        document.getElementById('view-patient-details').innerHTML = details;
        const modal = new bootstrap.Modal(document.getElementById('viewPatientModal'));
        modal.show();
    }
}

// Populate patient selects
function populatePatientSelects() {
    const patients = loadData(DATA_KEYS.patients);
    const selects = document.querySelectorAll('#appointment-patient, #edit-appointment-patient');

    selects.forEach(select => {
        select.innerHTML = '<option value="">Sélectionner un patient</option>';
        patients.forEach(patient => {
            select.innerHTML += `<option value="${patient.id}">${patient.nom} ${patient.prenom}</option>`;
        });
    });
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initData();
    populatePatientSelects();
});
