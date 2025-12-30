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
    settings: 'dikra_settings',
    documents: 'dikra_documents'
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
    if (!localStorage.getItem(DATA_KEYS.documents)) {
        localStorage.setItem(DATA_KEYS.documents, JSON.stringify([]));
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
            let patientName;
            if (patient) {
                patientName = `${patient.nom} ${patient.prenom}`;
            } else if (a.source === 'website') {
                patientName = `${a.lastName} ${a.firstName}`;
            } else {
                patientName = 'Patient inconnu';
            }
            const time = a.date.includes('T') ? a.date.split('T')[1].substring(0, 5) : '09:00';
            const row = `<tr>
                <td>${a.id}</td>
                <td>${patientName}</td>
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
        case 'Patient arrivé': return 'info';
        case 'Patient en attente': return 'warning';
        case 'Consultation en cours': return 'primary';
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
        mutuelle: document.getElementById('patient-mutuelle').value
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

    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const duration = parseInt(document.getElementById('appointment-duration').value);
    const dateTime = `${date}T${time}`;

    // Check for conflicts
    const conflicts = dataManager.checkAppointmentConflict(dateTime, duration);
    if (conflicts.length > 0) {
        if (!confirm(`Il y a ${conflicts.length} conflit(s) détecté(s). Voulez-vous continuer ?`)) {
            return;
        }
    }

    let dentisteId = document.getElementById('appointment-dentiste').value;
    let salleId = document.getElementById('appointment-salle').value;

    // Auto-assign if not selected
    if (!dentisteId) {
        dentisteId = dataManager.autoAssignDentist(dateTime, duration);
    }
    if (!salleId) {
        salleId = dataManager.autoAssignRoom(dateTime, duration);
    }

    const appointments = loadData(DATA_KEYS.appointments);
    const newAppointment = {
        id: dataManager.generateId('Appointment'),
        patientId: document.getElementById('appointment-patient').value,
        dentisteId: dentisteId,
        salleId: salleId,
        date: dateTime,
        duration: duration,
        type: document.getElementById('appointment-type').value,
        status: document.getElementById('appointment-status').value,
        notes: document.getElementById('appointment-notes').value || '',
        dateCreation: new Date().toISOString()
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

// Edit patient (limited editing for assistant - only phone and address)
function editPatient(id) {
    const patients = loadData(DATA_KEYS.patients);
    const patient = patients.find(p => p.id == id);
    if (patient) {
        // Populate form fields (only administrative info)
        document.getElementById('edit-patient-telephone').value = patient.telephone;
        document.getElementById('edit-patient-adresse').value = patient.adresse || '';
        document.getElementById('edit-patient-id').value = patient.id;

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editPatientModal'));
        modal.show();
    }
}

// Update patient (only administrative info)
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
            telephone: document.getElementById('edit-patient-telephone').value,
            adresse: document.getElementById('edit-patient-adresse').value
        };

        saveData(DATA_KEYS.patients, patients);
        loadPatients();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPatientModal'));
        modal.hide();

        showToast('Informations administratives mises à jour avec succès', 'success');
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
        let patientName;
        if (patient) {
            patientName = `${patient.nom} ${patient.prenom}`;
        } else if (appointment.source === 'website') {
            patientName = `${appointment.lastName} ${appointment.firstName}`;
        } else {
            patientName = 'Patient inconnu';
        }
        const details = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Détails du rendez-vous</h6>
                    <p><strong>ID:</strong> ${appointment.id}</p>
                    <p><strong>Patient:</strong> ${patientName}</p>
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

// Conflict checking
function checkConflicts() {
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;
    const duration = document.getElementById('appointment-duration').value;

    if (!date || !time || !duration) return;

    const dateTime = `${date}T${time}`;
    const conflicts = dataManager.checkAppointmentConflict(dateTime, parseInt(duration));

    const alertDiv = document.getElementById('conflict-alert');
    if (conflicts.length > 0) {
        alertDiv.classList.remove('d-none');
        alertDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Conflit détecté!</strong> ${conflicts.length} rendez-vous conflictuel(s) trouvé(s).
        `;
    } else {
        alertDiv.classList.add('d-none');
    }

    // Update available dentists and rooms
    updateAvailableOptions(dateTime, parseInt(duration));
}

function updateAvailableOptions(dateTime, duration) {
    const availableDentists = dataManager.getAvailableDentists(dateTime, duration);
    const availableRooms = dataManager.getAvailableRooms(dateTime, duration);

    const dentistSelect = document.getElementById('appointment-dentiste');
    const roomSelect = document.getElementById('appointment-salle');

    // Update dentists
    const currentDentistValue = dentistSelect.value;
    dentistSelect.innerHTML = '<option value="">Auto-assigner</option>';
    availableDentists.forEach(dentist => {
        const selected = currentDentistValue == dentist.id ? 'selected' : '';
        dentistSelect.innerHTML += `<option value="${dentist.id}" ${selected}>${dentist.nom} ${dentist.prenom}</option>`;
    });

    // Update rooms
    const currentRoomValue = roomSelect.value;
    roomSelect.innerHTML = '<option value="">Auto-assigner</option>';
    availableRooms.forEach(room => {
        const selected = currentRoomValue == room.id ? 'selected' : '';
        roomSelect.innerHTML += `<option value="${room.id}" ${selected}>${room.nom}</option>`;
    });
}

function onPatientChange() {
    // Could load patient care history here
    const patientId = document.getElementById('appointment-patient').value;
    if (patientId) {
        // Load recent cares for this patient
        const cares = dataManager.getCaresByPatient(patientId);
        if (cares.length > 0) {
            const recentCare = cares[cares.length - 1];
            document.getElementById('appointment-type').value = recentCare.type || 'Consultation';
        }
    }
}

// Populate dentist and room selects
function populateDentistSelect() {
    const team = loadData(DATA_KEYS.team).filter(member => member.role === 'Dentiste');
    const selects = ['appointment-dentiste', 'edit-appointment-dentiste'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Auto-assigner</option>';
            team.forEach(member => {
                select.innerHTML += `<option value="${member.id}">${member.nom} ${member.prenom}</option>`;
            });
        }
    });
}

function populateRoomSelect() {
    const rooms = loadData(DATA_KEYS.rooms);
    const selects = ['appointment-salle', 'edit-appointment-salle'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Auto-assigner</option>';
            rooms.forEach(room => {
                select.innerHTML += `<option value="${room.id}">${room.nom}</option>`;
            });
        }
    });
}

// Billing functions for assistant
function loadFactures() {
    const bills = dataManager.getAll('bills');
    const tbody = document.getElementById('factures-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (bills.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucune facture trouvée</td></tr>';
        return;
    }

    // Sort bills by date (most recent first)
    bills.sort((a, b) => new Date(b.date) - new Date(a.date));

    bills.forEach(bill => {
        const patient = dataManager.getById('patients', bill.patientId);
        const patientName = patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu';

        const statusBadge = getStatusBadge(bill.status);

        const remainingBalance = calculateRemainingBalance(bill);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${patientName}</td>
            <td>${formatDate(bill.date)}</td>
            <td>${bill.amount} MAD</td>
            <td>${remainingBalance} MAD</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-info action-btn" onclick="viewFacture('${bill.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success action-btn" onclick="addPayment('${bill.id}')">
                    <i class="bi bi-cash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusBadge(status) {
    const badges = {
        'Payé': '<span class="badge bg-success">Payé</span>',
        'Impayé': '<span class="badge bg-warning">Impayé</span>',
        'Partiellement payé': '<span class="badge bg-info">Partiellement payé</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
}

function populatePatientSelect() {
    const patients = dataManager.getAll('patients');
    const selects = ['facture-patient'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Sélectionner un patient</option>';
            patients.forEach(patient => {
                select.innerHTML += `<option value="${patient.id}">${patient.nom} ${patient.prenom}</option>`;
            });
        }
    });
}

function populateTreatmentsSelect() {
    const cares = dataManager.getAll('cares');
    const select = document.getElementById('facture-treatments');
    if (select) {
        select.innerHTML = '';
        cares.forEach(care => {
            select.innerHTML += `<option value="${care.id}" data-price="${care.price || 0}">${care.description} - ${care.price || 0} MAD</option>`;
        });
    }
}

function addFacture() {
    const form = document.getElementById('add-facture-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const selectedTreatments = Array.from(document.getElementById('facture-treatments').selectedOptions);
    if (selectedTreatments.length === 0) {
        alert('Veuillez sélectionner au moins un traitement.');
        return;
    }

    const subtotal = selectedTreatments.reduce((sum, option) => sum + parseFloat(option.getAttribute('data-price') || 0), 0);
    const settings = dataManager.getSettings();
    const vatRate = settings.vatRate || 20;
    const vat = subtotal * (vatRate / 100);
    const total = subtotal + vat;

    const bill = {
        id: dataManager.generateId('Bill'),
        patientId: document.getElementById('facture-patient').value,
        date: document.getElementById('facture-date').value,
        amount: total.toFixed(2),
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        vatRate: vatRate,
        status: 'Impayé',
        description: selectedTreatments.map(opt => opt.text.split(' - ')[0]).join(', '),
        paymentMethod: 'Espèces',
        payments: [],
        dateCreation: new Date().toISOString(),
        treatments: selectedTreatments.map(opt => ({ id: opt.value, description: opt.text.split(' - ')[0], price: opt.getAttribute('data-price') }))
    };

    dataManager.add('bills', bill);

    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addFactureModal')).hide();
    form.reset();

    // Reload bills list
    loadFactures();

    showToast('Facture créée avec succès', 'success');
}

function viewFacture(billId) {
    const bill = dataManager.getById('bills', billId);
    if (!bill) return;

    const patient = dataManager.getById('patients', bill.patientId);
    const patientName = patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu';
    const settings = dataManager.getSettings();
    const vatRate = settings.vatRate || 20;

    const subtotal = bill.subtotal ? parseFloat(bill.subtotal) : (parseFloat(bill.amount) / (1 + vatRate / 100));
    const vat = bill.vat ? parseFloat(bill.vat) : (parseFloat(bill.amount) - subtotal);
    const totalPaid = (bill.payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
    const remaining = parseFloat(bill.amount) - totalPaid;

    let treatmentsList = '';
    if (bill.treatments && bill.treatments.length > 0) {
        treatmentsList = '<h6>Traitements</h6><ul>';
        bill.treatments.forEach(treatment => {
            treatmentsList += `<li>${treatment.description} - ${treatment.price} MAD</li>`;
        });
        treatmentsList += '</ul>';
    }

    let paymentHistory = '';
    if (bill.payments && bill.payments.length > 0) {
        paymentHistory = '<h6>Historique des paiements</h6><ul>';
        bill.payments.forEach(payment => {
            paymentHistory += `<li>${formatDate(payment.date)} - ${payment.amount} MAD (${payment.method}) ${payment.note ? '- ' + payment.note : ''}</li>`;
        });
        paymentHistory += '</ul>';
    } else {
        paymentHistory = '<p><em>Aucun paiement enregistré</em></p>';
    }

    const details = document.getElementById('view-facture-details');
    details.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Informations générales</h6>
                <p><strong>ID:</strong> ${bill.id}</p>
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Date:</strong> ${formatDate(bill.date)}</p>
                <p><strong>Statut:</strong> ${getStatusBadge(bill.status)}</p>
                <p><strong>Créé le:</strong> ${new Date(bill.dateCreation).toLocaleString('fr-FR')}</p>
            </div>
            <div class="col-md-6">
                <h6>Détails financiers</h6>
                <p><strong>Sous-total HT:</strong> ${subtotal.toFixed(2)} MAD</p>
                <p><strong>TVA (${vatRate}%):</strong> ${vat.toFixed(2)} MAD</p>
                <p><strong>Total TTC:</strong> ${bill.amount} MAD</p>
                <p><strong>Total payé:</strong> ${totalPaid.toFixed(2)} MAD</p>
                <p><strong>Reste à payer:</strong> ${remaining.toFixed(2)} MAD</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-6">
                ${treatmentsList}
            </div>
            <div class="col-md-6">
                ${paymentHistory}
            </div>
        </div>
    `;

    // Show modal
    new bootstrap.Modal(document.getElementById('viewFactureModal')).show();
}

function calculateRemainingBalance(bill) {
    const totalPaid = (bill.payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
    const remaining = parseFloat(bill.amount) - totalPaid;
    return remaining.toFixed(2);
}

function addPayment(billId) {
    const bill = dataManager.getById('bills', billId);
    if (!bill) return;

    // Set bill ID in payment modal
    document.getElementById('payment-bill-id').value = billId;
    document.getElementById('payment-remaining').textContent = calculateRemainingBalance(bill) + ' MAD';
    document.getElementById('payment-date').value = new Date().toISOString().split('T')[0];

    // Show modal
    new bootstrap.Modal(document.getElementById('addPaymentModal')).show();
}

function recordPayment() {
    const form = document.getElementById('add-payment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const billId = document.getElementById('payment-bill-id').value;
    const bill = dataManager.getById('bills', billId);
    if (!bill) return;

    const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
    const remainingBalance = parseFloat(calculateRemainingBalance(bill));

    if (paymentAmount > remainingBalance) {
        alert('Le montant du paiement ne peut pas dépasser le solde restant.');
        return;
    }

    const payment = {
        id: Date.now().toString(),
        amount: paymentAmount,
        method: document.getElementById('payment-method').value,
        date: document.getElementById('payment-date').value,
        note: document.getElementById('payment-note').value || ''
    };

    // Initialize payments array if not exists
    if (!bill.payments) {
        bill.payments = [];
    }
    bill.payments.push(payment);

    // Update bill status based on remaining balance
    const newRemaining = remainingBalance - paymentAmount;
    if (newRemaining <= 0) {
        bill.status = 'Payé';
    } else if (newRemaining < parseFloat(bill.amount)) {
        bill.status = 'Partiellement payé';
    }

    dataManager.update('bills', billId, bill);

    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addPaymentModal')).hide();
    form.reset();

    // Reload bills list
    loadFactures();

    showToast('Paiement enregistré avec succès', 'success');
}

function updateTotal() {
    const selectedTreatments = Array.from(document.getElementById('facture-treatments').selectedOptions);
    const subtotal = selectedTreatments.reduce((sum, option) => sum + parseFloat(option.getAttribute('data-price') || 0), 0);
    const settings = dataManager.getSettings();
    const vatRate = settings.vatRate || 20;
    const vat = subtotal * (vatRate / 100);
    const total = subtotal + vat;
    document.getElementById('facture-total').value = total.toFixed(2) + ' MAD';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Insurance management functions
function loadPatientInsurances() {
    const patients = loadData(DATA_KEYS.patients);
    const tbody = document.getElementById('patient-insurance-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    patients.forEach(patient => {
        const insuranceType = patient.mutuelle || 'Non spécifiée';
        const coverageRate = getCoverageRate(insuranceType);
        const documents = patient.documents || [];
        const status = documents.length > 0 ? 'Documents fournis' : 'Documents manquants';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.nom} ${patient.prenom}</td>
            <td>${insuranceType}</td>
            <td><span class="coverage-rate">${coverageRate}%</span></td>
            <td>${documents.length} document(s)</td>
            <td><span class="badge bg-${documents.length > 0 ? 'success' : 'warning'}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-info action-btn" onclick="viewPatientInsurance('${patient.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning action-btn" onclick="editPatientInsurance('${patient.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getCoverageRate(insuranceType) {
    const rates = {
        'CNSS': 80,
        'CNOPS': 85,
        'Privé': 90
    };
    return rates[insuranceType] || 0;
}

function loadClaims() {
    const claims = loadData('dikra_claims') || [];
    const patients = loadData(DATA_KEYS.patients);
    const tbody = document.getElementById('claims-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (claims.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucune réclamation trouvée</td></tr>';
        return;
    }

    claims.forEach(claim => {
        const patient = patients.find(p => p.id == claim.patientId);
        const patientName = patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu';
        const statusBadge = getClaimStatusBadge(claim.status);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${claim.id}</td>
            <td>${patientName}</td>
            <td>${claim.insuranceType}</td>
            <td>${claim.amount} MAD</td>
            <td>${statusBadge}</td>
            <td>${formatDate(claim.date)}</td>
            <td>
                <button class="btn btn-sm btn-info action-btn" onclick="viewClaim('${claim.id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning action-btn" onclick="updateClaimStatus('${claim.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getClaimStatusBadge(status) {
    const badges = {
        'Soumis': '<span class="badge bg-primary">Soumis</span>',
        'Approuvé': '<span class="badge bg-success">Approuvé</span>',
        'Rejeté': '<span class="badge bg-danger">Rejeté</span>',
        'Remboursé': '<span class="badge bg-info">Remboursé</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
}

function savePatientInsurance() {
    const form = document.getElementById('manage-insurance-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patientId = document.getElementById('insurance-patient').value;
    const insuranceType = document.getElementById('insurance-type').value;
    const insuranceNumber = document.getElementById('insurance-number').value;

    const patients = loadData(DATA_KEYS.patients);
    const patientIndex = patients.findIndex(p => p.id == patientId);

    if (patientIndex !== -1) {
        patients[patientIndex] = {
            ...patients[patientIndex],
            mutuelle: insuranceType,
            insuranceNumber: insuranceNumber,
            documents: patients[patientIndex].documents || []
        };

        saveData(DATA_KEYS.patients, patients);
        loadPatientInsurances();

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('manageInsuranceModal')).hide();
        form.reset();

        showToast('Informations d\'assurance mises à jour avec succès', 'success');
    }
}

function addClaim() {
    const form = document.getElementById('add-claim-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const claims = loadData('dikra_claims') || [];
    const newClaim = {
        id: dataManager.generateId('Claim'),
        patientId: document.getElementById('claim-patient').value,
        billId: document.getElementById('claim-bill').value,
        insuranceType: document.getElementById('claim-type').value,
        amount: parseFloat(document.getElementById('claim-amount').value),
        status: 'Soumis',
        notes: document.getElementById('claim-notes').value || '',
        date: new Date().toISOString().split('T')[0],
        dateCreation: new Date().toISOString()
    };

    claims.push(newClaim);
    saveData('dikra_claims', claims);
    loadClaims();

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addClaimModal')).hide();
    form.reset();

    showToast('Réclamation ajoutée avec succès', 'success');
}

function viewPatientInsurance(patientId) {
    const patients = loadData(DATA_KEYS.patients);
    const patient = patients.find(p => p.id == patientId);
    if (!patient) return;

    const details = `
        <div class="row">
            <div class="col-md-6">
                <h6>Informations du Patient</h6>
                <p><strong>Nom:</strong> ${patient.nom} ${patient.prenom}</p>
                <p><strong>ID:</strong> ${patient.id}</p>
                <p><strong>Téléphone:</strong> ${patient.telephone}</p>
            </div>
            <div class="col-md-6">
                <h6>Informations d'Assurance</h6>
                <p><strong>Type de Mutuelle:</strong> ${patient.mutuelle || 'Non spécifiée'}</p>
                <p><strong>Numéro d'Assurance:</strong> ${patient.insuranceNumber || 'Non spécifié'}</p>
                <p><strong>Couverture:</strong> ${getCoverageRate(patient.mutuelle || '')}%</p>
                <p><strong>Documents:</strong> ${patient.documents ? patient.documents.length : 0} fichier(s)</p>
            </div>
        </div>
    `;

    document.getElementById('view-patient-details').innerHTML = details;
    const modal = new bootstrap.Modal(document.getElementById('viewPatientModal'));
    modal.show();
}

function editPatientInsurance(patientId) {
    const patients = loadData(DATA_KEYS.patients);
    const patient = patients.find(p => p.id == patientId);
    if (!patient) return;

    // Populate form
    document.getElementById('insurance-patient').value = patient.id;
    document.getElementById('insurance-type').value = patient.mutuelle || '';
    document.getElementById('insurance-number').value = patient.insuranceNumber || '';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('manageInsuranceModal'));
    modal.show();
}

function viewClaim(claimId) {
    const claims = loadData('dikra_claims') || [];
    const patients = loadData(DATA_KEYS.patients);
    const claim = claims.find(c => c.id == claimId);
    if (!claim) return;

    const patient = patients.find(p => p.id == claim.patientId);
    const patientName = patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu';

    const details = `
        <div class="row">
            <div class="col-md-6">
                <h6>Détails de la Réclamation</h6>
                <p><strong>ID:</strong> ${claim.id}</p>
                <p><strong>Patient:</strong> ${patientName}</p>
                <p><strong>Type d'Assurance:</strong> ${claim.insuranceType}</p>
                <p><strong>Montant Réclamé:</strong> ${claim.amount} MAD</p>
            </div>
            <div class="col-md-6">
                <h6>Statut et Dates</h6>
                <p><strong>Statut:</strong> ${getClaimStatusBadge(claim.status)}</p>
                <p><strong>Date de Soumission:</strong> ${formatDate(claim.date)}</p>
                <p><strong>Notes:</strong> ${claim.notes || 'Aucune'}</p>
            </div>
        </div>
    `;

    document.getElementById('view-claim-details').innerHTML = details;
    const modal = new bootstrap.Modal(document.getElementById('viewClaimModal'));
    modal.show();
}

function updateClaimStatus(claimId) {
    const claims = loadData('dikra_claims') || [];
    const claimIndex = claims.findIndex(c => c.id == claimId);
    if (claimIndex === -1) return;

    const newStatus = prompt('Nouveau statut (Soumis/Approuvé/Rejeté/Remboursé):', claims[claimIndex].status);
    if (newStatus && ['Soumis', 'Approuvé', 'Rejeté', 'Remboursé'].includes(newStatus)) {
        claims[claimIndex].status = newStatus;
        saveData('dikra_claims', claims);
        loadClaims();
        showToast('Statut de la réclamation mis à jour', 'success');
    }
}

function populateInsurancePatientSelect() {
    const patients = loadData(DATA_KEYS.patients);
    const selects = ['insurance-patient', 'claim-patient'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Sélectionner un patient</option>';
            patients.forEach(patient => {
                select.innerHTML += `<option value="${patient.id}">${patient.nom} ${patient.prenom}</option>`;
            });
        }
    });
}

function populateBillSelect() {
    const bills = dataManager.getAll('bills') || [];
    const select = document.getElementById('claim-bill');
    if (select) {
        select.innerHTML = '<option value="">Sélectionner une facture</option>';
        bills.forEach(bill => {
            select.innerHTML += `<option value="${bill.id}">${bill.id} - ${bill.amount} MAD</option>`;
        });
    }
}

// Document management functions
function loadDocuments() {
    const documents = loadData(DATA_KEYS.documents);
    const patients = loadData(DATA_KEYS.patients);
    const accordion = document.getElementById('documents-accordion');
    if (!accordion) return;

    // Group documents by patient
    const documentsByPatient = {};
    documents.forEach(doc => {
        if (!documentsByPatient[doc.patientId]) {
            documentsByPatient[doc.patientId] = [];
        }
        documentsByPatient[doc.patientId].push(doc);
    });

    accordion.innerHTML = '';

    if (Object.keys(documentsByPatient).length === 0) {
        accordion.innerHTML = '<div class="text-center text-muted py-5">Aucun document trouvé</div>';
        return;
    }

    Object.keys(documentsByPatient).forEach((patientId, index) => {
        const patient = patients.find(p => p.id == patientId);
        const patientName = patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu';
        const patientDocs = documentsByPatient[patientId];

        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        accordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                    <i class="bi bi-person me-2"></i>${patientName} (${patientDocs.length} document(s))
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#documents-accordion">
                <div class="accordion-body">
                    <div class="documents-list">
                        ${patientDocs.map(doc => `
                            <div class="document-card d-flex align-items-center">
                                <div class="document-icon ${getDocumentIconClass(doc.type)}">
                                    <i class="${getDocumentIcon(doc.type)}"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="mb-1">${getDocumentTypeLabel(doc.type)}</h6>
                                    <small class="text-muted">${doc.fileName} - Uploadé le ${new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</small>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${doc.id}')">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDocument('${doc.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        accordion.appendChild(accordionItem);
    });
}

function getDocumentIconClass(type) {
    switch(type) {
        case 'CIN': return 'cin';
        case 'mutuelle': return 'mutuelle';
        case 'quote': return 'quote';
        case 'signed-quote': return 'signed-quote';
        default: return 'cin';
    }
}

function getDocumentIcon(type) {
    switch(type) {
        case 'CIN': return 'bi bi-person-badge';
        case 'mutuelle': return 'bi bi-shield-check';
        case 'quote': return 'bi bi-file-earmark-text';
        case 'signed-quote': return 'bi bi-file-earmark-check';
        default: return 'bi bi-file-earmark';
    }
}

function getDocumentTypeLabel(type) {
    switch(type) {
        case 'CIN': return 'Carte d\'Identité Nationale';
        case 'mutuelle': return 'Carte Mutuelle';
        case 'quote': return 'Devis';
        case 'signed-quote': return 'Devis Signé';
        default: return type;
    }
}

function uploadDocument() {
    const form = document.getElementById('upload-document-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patientId = document.getElementById('document-patient').value;
    const type = document.getElementById('document-type').value;
    const fileInput = document.getElementById('document-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Veuillez sélectionner un fichier.');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Taille maximale: 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const documents = loadData(DATA_KEYS.documents);
        const newDocument = {
            id: dataManager.generateId('Document'),
            patientId: patientId,
            type: type,
            fileName: file.name,
            fileData: e.target.result, // base64
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            dateCreation: new Date().toISOString()
        };

        documents.push(newDocument);
        saveData(DATA_KEYS.documents, documents);
        loadDocuments();

        // Close modal and reset form
        bootstrap.Modal.getInstance(document.getElementById('uploadDocumentModal')).hide();
        form.reset();
        document.getElementById('uploaded-files').innerHTML = '';

        showToast('Document uploadé avec succès', 'success');
    };
    reader.readAsDataURL(file);
}

function viewDocument(docId) {
    const documents = loadData(DATA_KEYS.documents);
    const doc = documents.find(d => d.id == docId);
    if (!doc) return;

    // Open in new window/tab
    const newWindow = window.open();
    newWindow.document.write(`
        <html>
        <head><title>${doc.fileName}</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh;">
            ${doc.fileType.startsWith('image/') ? `<img src="${doc.fileData}" style="max-width:100%; max-height:100vh;">` : `<iframe src="${doc.fileData}" style="width:100%; height:100vh; border:none;"></iframe>`}
        </body>
        </html>
    `);
}

function deleteDocument(docId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    const documents = loadData(DATA_KEYS.documents);
    const index = documents.findIndex(d => d.id == docId);
    if (index !== -1) {
        documents.splice(index, 1);
        saveData(DATA_KEYS.documents, documents);
        loadDocuments();
        showToast('Document supprimé avec succès', 'success');
    }
}

function populatePatientSelect() {
    const patients = loadData(DATA_KEYS.patients);
    const selects = document.querySelectorAll('#document-patient');

    selects.forEach(select => {
        select.innerHTML = '<option value="">Sélectionner un patient</option>';
        patients.forEach(patient => {
            select.innerHTML += `<option value="${patient.id}">${patient.nom} ${patient.prenom}</option>`;
        });
    });
}

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('document-file');

    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleDocumentFileUpload(files);
        });

        fileInput.addEventListener('change', (e) => {
            handleDocumentFileUpload(e.target.files);
        });
    }
});

function handleDocumentFileUpload(files) {
    const uploadedFiles = document.getElementById('uploaded-files');
    if (!uploadedFiles) return;

    for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
            alert(`Le fichier ${file.name} est trop volumineux. Taille maximale: 5MB`);
            continue;
        }

        const fileItem = document.createElement('div');
        fileItem.className = 'file-item d-flex align-items-center justify-content-between p-2 border rounded mb-2';
        fileItem.innerHTML = `
            <span><i class="bi bi-file-earmark me-2"></i>${file.name}</span>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeFile(this)">Supprimer</button>
        `;
        uploadedFiles.appendChild(fileItem);
    }
}

function handleFileUpload(files) {
    const uploadedFiles = document.getElementById('uploaded-files');
    if (!uploadedFiles) return;

    for (let file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert(`Le fichier ${file.name} est trop volumineux. Taille maximale: 5MB`);
            continue;
        }

        const fileItem = document.createElement('div');
        fileItem.className = 'file-item d-flex align-items-center justify-content-between p-2 border rounded mb-2';
        fileItem.innerHTML = `
            <span><i class="bi bi-file-earmark me-2"></i>${file.name}</span>
            <button type="button" class="btn btn-sm btn-danger" onclick="removeFile(this)">Supprimer</button>
        `;
        uploadedFiles.appendChild(fileItem);
    }
}

function removeFile(button) {
    button.closest('.file-item').remove();
}

// Messaging functions for assistant

function loadMessages() {
    const messages = loadData(DATA_KEYS.messages);
    const tbody = document.getElementById('messages-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Filter messages where sender or recipient is "Assistante"
    const assistantMessages = messages.filter(m => m.sender === 'Assistante' || m.recipient === 'Assistante');

    if (assistantMessages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Aucun message trouvé</td></tr>';
        return;
    }

    assistantMessages.forEach(message => {
        const statusBadge = getMessageStatusBadge(message.status);
        const actions = `<button class="btn btn-sm btn-info action-btn" onclick="viewMessage('${message.id}')"><i class="bi bi-eye"></i></button>`;
        const row = `<tr>
            <td>${message.id}</td>
            <td>${message.subject}</td>
            <td>${message.sender}</td>
            <td>${message.recipient}</td>
            <td>${statusBadge}</td>
            <td>${new Date(message.date).toLocaleDateString('fr-FR')}</td>
            <td>${actions}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function getMessageStatusBadge(status) {
    const badges = {
        'Envoyé': '<span class="badge status-envoye">Envoyé</span>',
        'Reçu': '<span class="badge status-recu">Reçu</span>',
        'Lu': '<span class="badge status-lu">Lu</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
}

function addMessage() {
    const form = document.getElementById('add-message-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const messages = loadData(DATA_KEYS.messages);
    const newMessage = {
        id: dataManager.generateId('Message'),
        subject: document.getElementById('message-subject').value,
        sender: document.getElementById('message-sender').value,
        recipient: document.getElementById('message-recipient').value,
        content: document.getElementById('message-content').value,
        status: document.getElementById('message-status').value,
        date: new Date().toISOString(),
        dateCreation: new Date().toISOString()
    };

    messages.push(newMessage);
    saveData(DATA_KEYS.messages, messages);
    loadMessages();

    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addMessageModal')).hide();
    form.reset();

    showToast('Message envoyé avec succès', 'success');
}

function viewMessage(messageId) {
    const messages = loadData(DATA_KEYS.messages);
    const message = messages.find(m => m.id == messageId);
    if (!message) return;

    const details = `
        <div class="row">
            <div class="col-md-6">
                <h6>Informations du Message</h6>
                <p><strong>ID:</strong> ${message.id}</p>
                <p><strong>Sujet:</strong> ${message.subject}</p>
                <p><strong>Expéditeur:</strong> ${message.sender}</p>
                <p><strong>Destinataire:</strong> ${message.recipient}</p>
            </div>
            <div class="col-md-6">
                <h6>Statut et Date</h6>
                <p><strong>Statut:</strong> ${getMessageStatusBadge(message.status)}</p>
                <p><strong>Date:</strong> ${new Date(message.date).toLocaleString('fr-FR')}</p>
            </div>
        </div>
        <div class="mt-3">
            <h6>Contenu du message</h6>
            <div class="message-content border p-3 rounded">${message.content}</div>
        </div>
    `;

    document.getElementById('view-message-details').innerHTML = details;
    const modal = new bootstrap.Modal(document.getElementById('viewMessageModal'));
    modal.show();
}

function populateMessagePatientSelect() {
    const patients = loadData(DATA_KEYS.patients);
    const select = document.getElementById('message-recipient');
    if (select) {
        select.innerHTML = '<option value="">Sélectionner un patient</option>';
        patients.forEach(patient => {
            select.innerHTML += `<option value="${patient.nom} ${patient.prenom}">${patient.nom} ${patient.prenom}</option>`;
        });
    }
}

// Settings management functions
function loadAssistantSettings() {
    const settings = JSON.parse(localStorage.getItem('dikra_assistant_settings') || '{}');
    const profile = JSON.parse(localStorage.getItem('dikra_assistant_profile') || '{}');

    // Load profile
    if (document.getElementById('assistant-nom')) {
        document.getElementById('assistant-nom').value = profile.nom || '';
        document.getElementById('assistant-prenom').value = profile.prenom || '';
        document.getElementById('assistant-email').value = profile.email || '';
        document.getElementById('assistant-phone').value = profile.phone || '';
    }

    // Load preferences
    const language = settings.language || 'fr';
    if (document.getElementById('language-selector')) {
        document.getElementById('language-selector').value = language;
        document.documentElement.lang = language;
    }

    const theme = settings.theme || 'light';
    if (document.getElementById('theme-toggle')) {
        document.getElementById('theme-toggle').checked = theme === 'dark';
        document.body.setAttribute('data-theme', theme);
    }
}

function saveAssistantSettings() {
    const profile = {
        nom: document.getElementById('assistant-nom').value,
        prenom: document.getElementById('assistant-prenom').value,
        email: document.getElementById('assistant-email').value,
        phone: document.getElementById('assistant-phone').value
    };

    const settings = {
        language: document.getElementById('language-selector').value,
        theme: document.getElementById('theme-toggle').checked ? 'dark' : 'light'
    };

    localStorage.setItem('dikra_assistant_profile', JSON.stringify(profile));
    localStorage.setItem('dikra_assistant_settings', JSON.stringify(settings));

    showToast('Paramètres sauvegardés avec succès', 'success');
}

function changeAssistantPassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas.');
        return;
    }

    // For demo purposes, just check if current password is not empty
    // In a real app, you'd verify against stored hash
    if (currentPassword.length < 1) {
        alert('Mot de passe actuel incorrect.');
        return;
    }

    // Store new password (in real app, hash it)
    localStorage.setItem('dikra_assistant_password', newPassword);

    // Clear form
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    showToast('Mot de passe changé avec succès', 'success');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initData();
    populatePatientSelects();
    populateDentistSelect();
    populateRoomSelect();

    // Initialize settings if on parametres page
    if (document.getElementById('assistant-nom')) {
        loadAssistantSettings();

        // Event listeners for preferences
        document.getElementById('language-selector').addEventListener('change', function() {
            const lang = this.value;
            document.documentElement.lang = lang;
            const settings = JSON.parse(localStorage.getItem('dikra_assistant_settings') || '{}');
            settings.language = lang;
            localStorage.setItem('dikra_assistant_settings', JSON.stringify(settings));
        });

        document.getElementById('theme-toggle').addEventListener('change', function() {
            const theme = this.checked ? 'dark' : 'light';
            document.body.setAttribute('data-theme', theme);
            const settings = JSON.parse(localStorage.getItem('dikra_assistant_settings') || '{}');
            settings.theme = theme;
            localStorage.setItem('dikra_assistant_settings', JSON.stringify(settings));
        });
    }

    // Initialize billing functions if on factures page
    if (document.getElementById('factures-table')) {
        loadFactures();
        populatePatientSelect();
        populateTreatmentsSelect();

        // Search functionality
        const searchInput = document.getElementById('search-facture');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('#factures-tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }
    }

    // Initialize insurance functions if on mutuelles page
    if (document.getElementById('patient-insurance-table')) {
        loadPatientInsurances();
        loadClaims();
        populateInsurancePatientSelect();
        populateBillSelect();
    }

    // Initialize documents functions if on documents page
    if (document.getElementById('documents-accordion')) {
        loadDocuments();
        populatePatientSelect();
    }

    // Initialize messaging functions if on messagerie page
    if (document.getElementById('messages-table')) {
        loadMessages();
        populateMessagePatientSelect();
    }
});
