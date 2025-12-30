
// Theme toggle functionality is handled in individual pages

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

// Period selector
document.getElementById('period-selector').addEventListener('change', updateKPIs);

// Update KPIs
function updateKPIs() {
    const stats = dataManager.getStatistics();
    document.getElementById('kpi-total-patients').textContent = stats.totalPatients;
    document.getElementById('kpi-patients-today').textContent = stats.patientsToday;
    document.getElementById('kpi-appointments-scheduled').textContent = stats.scheduledAppointments;
    document.getElementById('kpi-appointments-cancelled').textContent = stats.cancelledAppointments;
    document.getElementById('kpi-appointments-completed').textContent = stats.completedAppointments;
    document.getElementById('kpi-revenue-today').textContent = stats.revenueToday + ' €';
    document.getElementById('kpi-unpaid-invoices').textContent = stats.unpaidInvoices;
    document.getElementById('kpi-acts-performed').textContent = stats.performedActs;
}

// Load tables
function loadPatients() {
    const patients = dataManager.getAll('patients');
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
                <td>${p.adresse}</td>
                <td>${p.mutuelle}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editPatient('${p.id}')">Modifier</button>
                    <button class="btn btn-sm btn-danger" onclick="deletePatient('${p.id}')">Supprimer</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

function loadRecentPatients() {
    const patients = dataManager.getAll('patients');
    const tbody = document.querySelector('#recent-patients-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        // Show last 5 patients
        const recent = patients.slice(-5).reverse();
        recent.forEach(p => {
            const row = `<tr>
                <td>${p.nom} ${p.prenom}</td>
                <td>${p.telephone}</td>
                <td>Aujourd'hui</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewPatient('${p.id}')">Voir</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

function loadAppointments() {
    const appointments = dataManager.getAll('appointments');
    const patients = dataManager.getAll('patients');
    const team = dataManager.getAll('team');
    const tbody = document.querySelector('#appointments-table tbody');
    tbody.innerHTML = '';
    appointments.forEach(a => {
        const patient = patients.find(p => p.id == a.patientId);
        const dentiste = team.find(t => t.id == a.dentisteId);
        const row = `<tr>
            <td>${a.id}</td>
            <td>${patient ? patient.nom + ' ' + patient.prenom : ''}</td>
            <td>${dentiste ? dentiste.nom : ''}</td>
            <td>${a.date}</td>
            <td>${a.type}</td>
            <td>${a.status}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editAppointment(${a.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${a.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadCares() {
    const cares = dataManager.getAll('cares');
    const tbody = document.querySelector('#cares-table tbody');
    tbody.innerHTML = '';
    cares.forEach(c => {
        const row = `<tr>
            <td>${c.id}</td>
            <td>${c.description}</td>
            <td>${c.price} €</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editCare(${c.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCare(${c.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadInvoices() {
    const invoices = dataManager.getAll('bills');
    const patients = dataManager.getAll('patients');
    const tbody = document.querySelector('#invoices-table tbody');
    tbody.innerHTML = '';
    invoices.forEach(i => {
        const patient = patients.find(p => p.id == i.patientId);
        const row = `<tr>
            <td>${i.id}</td>
            <td>${patient ? patient.nom + ' ' + patient.prenom : ''}</td>
            <td>${i.amount} €</td>
            <td>${i.status}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editInvoice(${i.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteInvoice(${i.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadInsurances() {
    const insurances = dataManager.getAll('insurances');
    const tbody = document.querySelector('#insurances-table tbody');
    tbody.innerHTML = '';
    insurances.forEach(i => {
        const row = `<tr>
            <td>${i.id}</td>
            <td>${i.name}</td>
            <td>${i.contact}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editInsurance(${i.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteInsurance(${i.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadClaims() {
    const claims = dataManager.getAll('claims');
    const patients = dataManager.getAll('patients');
    const bills = dataManager.getAll('bills');
    const tbody = document.querySelector('#claims-table tbody');
    tbody.innerHTML = '';
    claims.forEach(c => {
        const patient = patients.find(p => p.id == c.patientId);
        const bill = bills.find(b => b.id == c.billId);
        const row = `<tr>
            <td>${c.id}</td>
            <td>${patient ? patient.nom + ' ' + patient.prenom : ''}</td>
            <td>${bill ? bill.id : ''}</td>
            <td>${c.insuranceType}</td>
            <td>${c.amount} €</td>
            <td>${c.status}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editClaim('${c.id}')">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteClaim('${c.id}')">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadTeam() {
    const team = dataManager.getAll('team');
    const tbody = document.querySelector('#team-table tbody');
    tbody.innerHTML = '';
    team.forEach(t => {
        const row = `<tr>
            <td>${t.id}</td>
            <td>${t.nom}</td>
            <td>${t.role}</td>
            <td>${t.presence}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editTeamMember('${t.id}')">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTeamMember('${t.id}')">Supprimer</button>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewTeamMemberLogs('${t.id}', '${t.nom}')">Logs</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function viewTeamMemberLogs(memberId, memberName) {
    document.getElementById('logs-member-name').textContent = memberName;
    loadActivityLogs(memberId);
    const modal = new bootstrap.Modal(document.getElementById('activityLogsModal'));
    modal.show();
}

function loadActivityLogs(userId) {
    const logs = dataManager.getAuditTrail(null, 100).filter(log => log.userId == userId);
    const container = document.getElementById('activity-logs-container');

    if (logs.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune activité enregistrée pour ce membre.</p>';
        return;
    }

    let html = '<div class="list-group">';
    logs.forEach(log => {
        const date = new Date(log.timestamp).toLocaleString('fr-FR');
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${log.action}</h6>
                    <small class="text-muted">${date}</small>
                </div>
                <p class="mb-1">${log.description}</p>
                <small class="text-muted">Rôle: ${log.userRole}</small>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function loadRooms() {
    const rooms = dataManager.getAll('rooms');
    const tbody = document.querySelector('#rooms-table tbody');
    tbody.innerHTML = '';
    rooms.forEach(r => {
        const row = `<tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>${r.status}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editRoom(${r.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRoom(${r.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadMessages() {
    const messages = dataManager.getAll('messages');
    const tbody = document.querySelector('#messages-table tbody');
    tbody.innerHTML = '';
    messages.forEach(m => {
        const row = `<tr>
            <td>${m.id}</td>
            <td>${m.subject}</td>
            <td>${m.sender}</td>
            <td>${m.recipient}</td>
            <td>${m.status}</td>
            <td>${m.date}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editMessage(${m.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteMessage(${m.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Add functions
function addPatient() {
    const form = document.getElementById('add-patient-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    disableButton(submitBtn, 'Ajout en cours...');

    const newPatient = {
        id: dataManager.generateId('Patient'),
        nom: document.getElementById('patient-nom').value,
        prenom: document.getElementById('patient-prenom').value,
        naissance: document.getElementById('patient-naissance').value,
        telephone: document.getElementById('patient-telephone').value,
        adresse: document.getElementById('patient-adresse').value,
        mutuelle: document.getElementById('patient-mutuelle').value,
        observations: document.getElementById('patient-observations').value
    };

    // Simulate processing time
    setTimeout(() => {
        dataManager.add('patients', newPatient);
        loadPatients();
        updateKPIs();
        bootstrap.Modal.getInstance(document.getElementById('addPatientModal')).hide();
        form.reset();
        enableButton(submitBtn);
        showToast('Patient ajouté avec succès', 'success');
    }, 1000);
}

function addAppointment() {
    const form = document.getElementById('add-appointment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newAppointment = {
        id: dataManager.generateId('Appointment'),
        patientId: document.getElementById('appointment-patient').value,
        dentisteId: document.getElementById('appointment-dentiste').value,
        date: document.getElementById('appointment-date').value,
        type: document.getElementById('appointment-type').value,
        status: document.getElementById('appointment-statut').value
    };
    dataManager.add('appointments', newAppointment);
    loadAppointments();
    updateKPIs();
    bootstrap.Modal.getInstance(document.getElementById('addAppointmentModal')).hide();
    form.reset();
}

function addCare() {
    const form = document.getElementById('add-care-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newCare = {
        id: dataManager.generateId('Care'),
        description: document.getElementById('care-description').value,
        price: document.getElementById('care-price').value
    };
    dataManager.add('cares', newCare);
    loadCares();
    bootstrap.Modal.getInstance(document.getElementById('addCareModal')).hide();
    form.reset();
}

function addInvoice() {
    const form = document.getElementById('add-invoice-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newInvoice = {
        id: dataManager.generateId('Bill'),
        patientId: document.getElementById('invoice-patient').value,
        amount: document.getElementById('invoice-amount').value,
        status: document.getElementById('invoice-status').value,
        date: new Date().toISOString().split('T')[0]
    };
    dataManager.add('bills', newInvoice);
    loadInvoices();
    updateKPIs();
    bootstrap.Modal.getInstance(document.getElementById('addInvoiceModal')).hide();
    form.reset();
}

function addInsurance() {
    const form = document.getElementById('add-insurance-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newInsurance = {
        id: dataManager.generateId('Insurance'),
        name: document.getElementById('insurance-name').value,
        contact: document.getElementById('insurance-contact').value
    };
    dataManager.add('insurances', newInsurance);
    loadInsurances();
    bootstrap.Modal.getInstance(document.getElementById('addInsuranceModal')).hide();
    form.reset();
}

function addTeamMember() {
    const form = document.getElementById('add-team-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newMember = {
        id: dataManager.generateId('Team'),
        nom: document.getElementById('team-name').value,
        role: document.getElementById('team-role').value,
        presence: document.getElementById('team-presence').value
    };
    dataManager.add('team', newMember);
    dataManager.logAudit('Membre ajouté', `Nouveau membre d'équipe ajouté: ${newMember.nom} (${newMember.role})`, null, newMember.id);
    loadTeam();
    bootstrap.Modal.getInstance(document.getElementById('addTeamMemberModal')).hide();
    form.reset();
}

function addRoom() {
    const form = document.getElementById('add-room-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newRoom = {
        id: dataManager.generateId('Room'),
        name: document.getElementById('room-name').value,
        status: document.getElementById('room-status').value
    };
    dataManager.add('rooms', newRoom);
    loadRooms();
    bootstrap.Modal.getInstance(document.getElementById('addRoomModal')).hide();
    form.reset();
}

function addMessage() {
    const form = document.getElementById('add-message-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newMessage = {
        id: dataManager.generateId('Message'),
        subject: document.getElementById('message-subject').value,
        sender: document.getElementById('message-sender').value || 'Admin',
        recipient: document.getElementById('message-recipient').value,
        content: document.getElementById('message-content').value,
        status: document.getElementById('message-status').value,
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR')
    };
    dataManager.add('messages', newMessage);
    loadMessages();
    bootstrap.Modal.getInstance(document.getElementById('addMessageModal')).hide();
    form.reset();
    showToast('Message envoyé avec succès', 'success');
}

// Delete functions with enhanced confirmation dialogs
function deletePatient(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.',
        () => {
            dataManager.delete('patients', id);
            loadPatients();
            updateKPIs();
            showToast('Patient supprimé avec succès', 'success');
        }
    );
}

function deleteAppointment(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.',
        () => {
            dataManager.delete('appointments', id);
            loadAppointments();
            updateKPIs();
            showToast('Rendez-vous supprimé avec succès', 'success');
        }
    );
}

function deleteCare(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer cet acte ? Cette action est irréversible.',
        () => {
            dataManager.delete('cares', id);
            loadCares();
            showToast('Acte supprimé avec succès', 'success');
        }
    );
}

function deleteInvoice(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.',
        () => {
            dataManager.delete('bills', id);
            loadInvoices();
            updateKPIs();
            showToast('Facture supprimée avec succès', 'success');
        }
    );
}

function deleteInsurance(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer cette mutuelle ? Cette action est irréversible.',
        () => {
            dataManager.delete('insurances', id);
            loadInsurances();
            showToast('Mutuelle supprimée avec succès', 'success');
        }
    );
}

function deleteTeamMember(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer ce membre d\'équipe ? Cette action est irréversible.',
        () => {
            const member = dataManager.getById('team', id);
            dataManager.logAudit('Membre supprimé', `Membre d'équipe supprimé: ${member ? member.nom : 'Inconnu'}`, null, id);
            dataManager.delete('team', id);
            loadTeam();
            showToast('Membre supprimé avec succès', 'success');
        }
    );
}

function deleteRoom(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.',
        () => {
            dataManager.delete('rooms', id);
            loadRooms();
            showToast('Salle supprimée avec succès', 'success');
        }
    );
}

function deleteMessage(id) {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.',
        () => {
            dataManager.delete('messages', id);
            loadMessages();
            showToast('Message supprimé avec succès', 'success');
        }
    );
}

// Edit functions
function editPatient(id) {
    const patient = dataManager.getById('patients', id);
    if (patient) {
        document.getElementById('edit-patient-nom').value = patient.nom;
        document.getElementById('edit-patient-prenom').value = patient.prenom;
        document.getElementById('edit-patient-naissance').value = patient.naissance;
        document.getElementById('edit-patient-telephone').value = patient.telephone;
        document.getElementById('edit-patient-adresse').value = patient.adresse;
        document.getElementById('edit-patient-mutuelle').value = patient.mutuelle;
        document.getElementById('edit-patient-observations').value = patient.observations || '';
        document.getElementById('edit-patient-id').value = patient.id;
        const modal = new bootstrap.Modal(document.getElementById('editPatientModal'));
        modal.show();
    }
}

function updatePatient() {
    const form = document.getElementById('edit-patient-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-patient-id').value;
    const updatedPatient = {
        nom: document.getElementById('edit-patient-nom').value,
        prenom: document.getElementById('edit-patient-prenom').value,
        naissance: document.getElementById('edit-patient-naissance').value,
        telephone: document.getElementById('edit-patient-telephone').value,
        adresse: document.getElementById('edit-patient-adresse').value,
        mutuelle: document.getElementById('edit-patient-mutuelle').value,
        observations: document.getElementById('edit-patient-observations').value
    };
    dataManager.update('patients', id, updatedPatient);
    loadPatients();
    updateKPIs();
    bootstrap.Modal.getInstance(document.getElementById('editPatientModal')).hide();
    showToast('Patient mis à jour avec succès', 'success');
}

function editAppointment(id) {
    const appointment = dataManager.getById('appointments', id);
    if (appointment) {
        document.getElementById('edit-appointment-patient').value = appointment.patientId;
        document.getElementById('edit-appointment-dentiste').value = appointment.dentisteId;
        document.getElementById('edit-appointment-date').value = appointment.date;
        document.getElementById('edit-appointment-type').value = appointment.type;
        document.getElementById('edit-appointment-statut').value = appointment.status;
        document.getElementById('edit-appointment-id').value = appointment.id;
        const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
        modal.show();
    }
}

function updateAppointment() {
    const form = document.getElementById('edit-appointment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-appointment-id').value;
    const updatedAppointment = {
        patientId: document.getElementById('edit-appointment-patient').value,
        dentisteId: document.getElementById('edit-appointment-dentiste').value,
        date: document.getElementById('edit-appointment-date').value,
        type: document.getElementById('edit-appointment-type').value,
        status: document.getElementById('edit-appointment-statut').value
    };
    dataManager.update('appointments', id, updatedAppointment);
    loadAppointments();
    updateKPIs();
    bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal')).hide();
    showToast('Rendez-vous mis à jour avec succès', 'success');
}

function editCare(id) {
    const care = dataManager.getById('cares', id);
    if (care) {
        document.getElementById('edit-care-description').value = care.description;
        document.getElementById('edit-care-price').value = care.price;
        document.getElementById('edit-care-id').value = care.id;
        const modal = new bootstrap.Modal(document.getElementById('editCareModal'));
        modal.show();
    }
}

function updateCare() {
    const form = document.getElementById('edit-care-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-care-id').value;
    const updatedCare = {
        description: document.getElementById('edit-care-description').value,
        price: document.getElementById('edit-care-price').value
    };
    dataManager.update('cares', id, updatedCare);
    loadCares();
    bootstrap.Modal.getInstance(document.getElementById('editCareModal')).hide();
    showToast('Acte mis à jour avec succès', 'success');
}

function editInvoice(id) {
    const invoice = dataManager.getById('bills', id);
    if (invoice) {
        document.getElementById('edit-invoice-patient').value = invoice.patientId;
        document.getElementById('edit-invoice-amount').value = invoice.amount;
        document.getElementById('edit-invoice-status').value = invoice.status;
        document.getElementById('edit-invoice-id').value = invoice.id;
        const modal = new bootstrap.Modal(document.getElementById('editInvoiceModal'));
        modal.show();
    }
}

function updateInvoice() {
    const form = document.getElementById('edit-invoice-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-invoice-id').value;
    const updatedInvoice = {
        patientId: document.getElementById('edit-invoice-patient').value,
        amount: document.getElementById('edit-invoice-amount').value,
        status: document.getElementById('edit-invoice-status').value
    };
    dataManager.update('bills', id, updatedInvoice);
    loadInvoices();
    updateKPIs();
    bootstrap.Modal.getInstance(document.getElementById('editInvoiceModal')).hide();
    showToast('Facture mise à jour avec succès', 'success');
}

function editInsurance(id) {
    const insurance = dataManager.getById('insurances', id);
    if (insurance) {
        document.getElementById('edit-insurance-name').value = insurance.name;
        document.getElementById('edit-insurance-contact').value = insurance.contact;
        document.getElementById('edit-insurance-id').value = insurance.id;
        const modal = new bootstrap.Modal(document.getElementById('editInsuranceModal'));
        modal.show();
    }
}

function updateInsurance() {
    const form = document.getElementById('edit-insurance-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-insurance-id').value;
    const updatedInsurance = {
        name: document.getElementById('edit-insurance-name').value,
        contact: document.getElementById('edit-insurance-contact').value
    };
    dataManager.update('insurances', id, updatedInsurance);
    loadInsurances();
    bootstrap.Modal.getInstance(document.getElementById('editInsuranceModal')).hide();
    showToast('Mutuelle mise à jour avec succès', 'success');
}

function addClaim() {
    const form = document.getElementById('add-claim-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const newClaim = {
        id: dataManager.generateId('Claim'),
        patientId: document.getElementById('claim-patient').value,
        billId: document.getElementById('claim-bill').value,
        insuranceType: document.getElementById('claim-type').value,
        amount: document.getElementById('claim-amount').value,
        status: 'Soumis',
        submissionDate: new Date().toISOString().split('T')[0],
        notes: document.getElementById('claim-notes').value
    };
    dataManager.add('claims', newClaim);
    loadClaims();
    bootstrap.Modal.getInstance(document.getElementById('addClaimModal')).hide();
    form.reset();
}

function editClaim(id) {
    const claim = dataManager.getById('claims', id);
    if (claim) {
        document.getElementById('edit-claim-id').value = claim.id;
        document.getElementById('edit-claim-patient').value = claim.patientId;
        document.getElementById('edit-claim-bill').value = claim.billId;
        document.getElementById('edit-claim-type').value = claim.insuranceType;
        document.getElementById('edit-claim-amount').value = claim.amount;
        document.getElementById('edit-claim-status').value = claim.status;
        document.getElementById('edit-claim-submission-date').value = claim.submissionDate || '';
        document.getElementById('edit-claim-approval-date').value = claim.approvalDate || '';
        document.getElementById('edit-claim-reimbursement-date').value = claim.reimbursementDate || '';
        document.getElementById('edit-claim-notes').value = claim.notes || '';
        const modal = new bootstrap.Modal(document.getElementById('editClaimModal'));
        modal.show();
    }
}

function updateClaim() {
    const form = document.getElementById('edit-claim-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-claim-id').value;
    const updatedClaim = {
        patientId: document.getElementById('edit-claim-patient').value,
        billId: document.getElementById('edit-claim-bill').value,
        insuranceType: document.getElementById('edit-claim-type').value,
        amount: document.getElementById('edit-claim-amount').value,
        status: document.getElementById('edit-claim-status').value,
        submissionDate: document.getElementById('edit-claim-submission-date').value,
        approvalDate: document.getElementById('edit-claim-approval-date').value,
        reimbursementDate: document.getElementById('edit-claim-reimbursement-date').value,
        notes: document.getElementById('edit-claim-notes').value
    };
    dataManager.update('claims', id, updatedClaim);
    loadClaims();
    bootstrap.Modal.getInstance(document.getElementById('editClaimModal')).hide();
    showToast('Réclamation mise à jour avec succès', 'success');
}

function deleteClaim(id) {
    if (confirm('Supprimer cette réclamation ?')) {
        dataManager.delete('claims', id);
        loadClaims();
    }
}

function editTeamMember(id) {
    const member = dataManager.getById('team', id);
    if (member) {
        document.getElementById('edit-team-name').value = member.nom;
        document.getElementById('edit-team-role').value = member.role;
        document.getElementById('edit-team-presence').value = member.presence;
        document.getElementById('edit-team-id').value = member.id;
        const modal = new bootstrap.Modal(document.getElementById('editTeamMemberModal'));
        modal.show();
    }
}

function updateTeamMember() {
    const form = document.getElementById('edit-team-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-team-id').value;
    const updatedMember = {
        nom: document.getElementById('edit-team-name').value,
        role: document.getElementById('edit-team-role').value,
        presence: document.getElementById('edit-team-presence').value
    };
    dataManager.update('team', id, updatedMember);
    dataManager.logAudit('Membre modifié', `Membre d'équipe modifié: ${updatedMember.nom} (${updatedMember.role})`, null, id);
    loadTeam();
    bootstrap.Modal.getInstance(document.getElementById('editTeamMemberModal')).hide();
    showToast('Membre mis à jour avec succès', 'success');
}

function editRoom(id) {
    const room = dataManager.getById('rooms', id);
    if (room) {
        document.getElementById('edit-room-name').value = room.name;
        document.getElementById('edit-room-status').value = room.status;
        document.getElementById('edit-room-id').value = room.id;
        const modal = new bootstrap.Modal(document.getElementById('editRoomModal'));
        modal.show();
    }
}

function updateRoom() {
    const form = document.getElementById('edit-room-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-room-id').value;
    const updatedRoom = {
        name: document.getElementById('edit-room-name').value,
        status: document.getElementById('edit-room-status').value
    };
    dataManager.update('rooms', id, updatedRoom);
    loadRooms();
    bootstrap.Modal.getInstance(document.getElementById('editRoomModal')).hide();
    showToast('Salle mise à jour avec succès', 'success');
}

function editMessage(id) {
    const message = dataManager.getById('messages', id);
    if (message) {
        document.getElementById('edit-message-subject').value = message.subject;
        document.getElementById('edit-message-sender').value = message.sender;
        document.getElementById('edit-message-recipient').value = message.recipient;
        document.getElementById('edit-message-content').value = message.content;
        document.getElementById('edit-message-status').value = message.status;
        document.getElementById('edit-message-id').value = message.id;
        const modal = new bootstrap.Modal(document.getElementById('editMessageModal'));
        modal.show();
    }
}

function updateMessage() {
    const form = document.getElementById('edit-message-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const id = document.getElementById('edit-message-id').value;
    const updatedMessage = {
        subject: document.getElementById('edit-message-subject').value,
        sender: document.getElementById('edit-message-sender').value,
        recipient: document.getElementById('edit-message-recipient').value,
        content: document.getElementById('edit-message-content').value,
        status: document.getElementById('edit-message-status').value
    };
    dataManager.update('messages', id, updatedMessage);
    loadMessages();
    bootstrap.Modal.getInstance(document.getElementById('editMessageModal')).hide();
    showToast('Message mis à jour avec succès', 'success');
}

// Settings
function saveSettings() {
    const settings = {
        tva: document.getElementById('tva').value,
        currency: document.getElementById('currency').value,
        contact: document.getElementById('contact').value
    };
    dataManager.updateSettings(settings);
    alert('Paramètres sauvegardés');
}

function resetData() {
    showConfirmationDialog(
        'Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible et supprimera toutes les informations.',
        () => {
            dataManager.resetData();
            loadAll();
            updateKPIs();
            showToast('Toutes les données ont été réinitialisées', 'success');
        }
    );
}

// Populate selects
function populateSelects() {
    const patients = dataManager.getAll('patients');
    const team = dataManager.getAll('team');
    const bills = dataManager.getAll('bills');
    const patientSelects = document.querySelectorAll('#appointment-patient, #invoice-patient, #claim-patient, #edit-claim-patient');
    patientSelects.forEach(select => {
        select.innerHTML = '<option value="">Sélectionner</option>';
        patients.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.nom} ${p.prenom}</option>`;
        });
    });
    const billSelects = document.querySelectorAll('#claim-bill, #edit-claim-bill');
    billSelects.forEach(select => {
        select.innerHTML = '<option value="">Sélectionner</option>';
        bills.forEach(b => {
            select.innerHTML += `<option value="${b.id}">${b.id} - ${b.amount} €</option>`;
        });
    });
    const dentisteSelect = document.getElementById('appointment-dentiste');
    dentisteSelect.innerHTML = '<option value="">Sélectionner</option>';
    team.forEach(t => {
        dentisteSelect.innerHTML += `<option value="${t.id}">${t.nom}</option>`;
    });
}

// Load all
function loadAll() {
    loadPatients();
    loadAppointments();
    loadCares();
    loadInvoices();
    loadInsurances();
    loadClaims();
    loadTeam();
    loadRooms();
    loadMessages();
    loadRecentPatients();
    populateSelects();
    initChart();
}

// Initialize charts
function initChart() {
    initAppointmentsEvolutionChart();
    initAppointmentsPerDayChart();
    initRevenuePerMonthChart();
    initTreatmentDistributionChart();
}

function initAppointmentsEvolutionChart() {
    const ctx = document.getElementById('appointmentsChart');
    if (ctx) {
        const appointments = dataManager.getAll('appointments');
        const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        const data = [12, 19, 15, 25, 22, 8, 5]; // Mock data

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Rendez-vous',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

function initAppointmentsPerDayChart() {
    const ctx = document.getElementById('appointmentsPerDayChart');
    if (ctx) {
        const data = dataManager.getAppointmentsPerDay(7);
        const labels = data.map(d => new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }));
        const values = data.map(d => d.count);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Rendez-vous',
                    data: values,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

function initRevenuePerMonthChart() {
    const ctx = document.getElementById('revenuePerMonthChart');
    if (ctx) {
        const data = dataManager.getRevenuePerMonth(12);
        const labels = data.map(d => {
            const date = new Date(d.month + '-01');
            return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        });
        const values = data.map(d => d.revenue);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Chiffre d\'affaires (€)',
                    data: values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' €';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

function initTreatmentDistributionChart() {
    const ctx = document.getElementById('treatmentDistributionChart');
    if (ctx) {
        const data = dataManager.getTreatmentDistribution();
        const labels = data.map(d => d.treatment);
        const values = data.map(d => d.count);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#06b6d4',
                        '#84cc16'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Additional functions
function exportData() {
    alert('Fonction d\'export en développement');
}

function markAllRead() {
    alert('Toutes les notifications marquées comme lues');
}

function viewPatient(id) {
    alert('Voir patient ' + id);
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Storage event listener for cross-tab synchronization
window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('dikra_')) {
        // Refresh data when localStorage changes from another tab
        loadAll();
        updateKPIs();
    }
});

// Init
document.addEventListener('DOMContentLoaded', function() {
    loadAll();
    updateKPIs();
});



