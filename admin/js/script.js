// Data keys for LocalStorage
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

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.setAttribute('data-theme', document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    this.innerHTML = document.body.getAttribute('data-theme') === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
});

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
}

// Period selector
document.getElementById('period-selector').addEventListener('change', updateKPIs);

// Update KPIs
function updateKPIs() {
    const period = document.getElementById('period-selector').value;
    const patients = loadData(DATA_KEYS.patients);
    const appointments = loadData(DATA_KEYS.appointments);
    const invoices = loadData(DATA_KEYS.invoices);

    // Total patients
    document.getElementById('kpi-total-patients').textContent = patients.length;

    // Patients today (simplified: count appointments today)
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date.startsWith(today));
    const uniquePatientsToday = new Set(todayAppointments.map(a => a.patientId));
    document.getElementById('kpi-patients-today').textContent = uniquePatientsToday.size;

    // Appointments
    document.getElementById('kpi-appointments-scheduled').textContent = appointments.filter(a => a.status === 'Programmé').length;
    document.getElementById('kpi-appointments-cancelled').textContent = appointments.filter(a => a.status === 'Annulé').length;
    document.getElementById('kpi-appointments-completed').textContent = appointments.filter(a => a.status === 'Réalisé').length;

    // Revenue today
    const todayInvoices = invoices.filter(i => i.date === today && i.status === 'Payé');
    const revenueToday = todayInvoices.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    document.getElementById('kpi-revenue-today').textContent = revenueToday + ' €';

    // Unpaid invoices
    document.getElementById('kpi-unpaid-invoices').textContent = invoices.filter(i => i.status === 'Impayé').length;

    // Acts performed (simplified: count completed appointments)
    document.getElementById('kpi-acts-performed').textContent = appointments.filter(a => a.status === 'Réalisé').length;
}

// Load tables
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
    const patients = loadData(DATA_KEYS.patients);
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
    const appointments = loadData(DATA_KEYS.appointments);
    const patients = loadData(DATA_KEYS.patients);
    const team = loadData(DATA_KEYS.team);
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
    const cares = loadData(DATA_KEYS.cares);
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
    const invoices = loadData(DATA_KEYS.invoices);
    const patients = loadData(DATA_KEYS.patients);
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
    const insurances = loadData(DATA_KEYS.insurances);
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

function loadTeam() {
    const team = loadData(DATA_KEYS.team);
    const tbody = document.querySelector('#team-table tbody');
    tbody.innerHTML = '';
    team.forEach(t => {
        const row = `<tr>
            <td>${t.id}</td>
            <td>${t.nom}</td>
            <td>${t.role}</td>
            <td>${t.presence}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editTeamMember(${t.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTeamMember(${t.id})">Supprimer</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function loadRooms() {
    const rooms = loadData(DATA_KEYS.rooms);
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
    const messages = loadData(DATA_KEYS.messages);
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
    updateKPIs();
    bootstrap.Modal.getInstance(document.getElementById('addPatientModal')).hide();
    form.reset();
}

function addAppointment() {
    const form = document.getElementById('add-appointment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const appointments = loadData(DATA_KEYS.appointments);
    const newAppointment = {
        id: Date.now(),
        patientId: document.getElementById('appointment-patient').value,
        dentisteId: document.getElementById('appointment-dentiste').value,
        date: document.getElementById('appointment-date').value,
        type: document.getElementById('appointment-type').value,
        status: document.getElementById('appointment-statut').value
    };
    appointments.push(newAppointment);
    saveData(DATA_KEYS.appointments, appointments);
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
    const cares = loadData(DATA_KEYS.cares);
    const newCare = {
        id: Date.now(),
        description: document.getElementById('care-description').value,
        price: document.getElementById('care-price').value
    };
    cares.push(newCare);
    saveData(DATA_KEYS.cares, cares);
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
    const invoices = loadData(DATA_KEYS.invoices);
    const newInvoice = {
        id: Date.now(),
        patientId: document.getElementById('invoice-patient').value,
        amount: document.getElementById('invoice-amount').value,
        status: document.getElementById('invoice-status').value,
        date: new Date().toISOString().split('T')[0]
    };
    invoices.push(newInvoice);
    saveData(DATA_KEYS.invoices, invoices);
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
    const insurances = loadData(DATA_KEYS.insurances);
    const newInsurance = {
        id: Date.now(),
        name: document.getElementById('insurance-name').value,
        contact: document.getElementById('insurance-contact').value
    };
    insurances.push(newInsurance);
    saveData(DATA_KEYS.insurances, insurances);
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
    const team = loadData(DATA_KEYS.team);
    const newMember = {
        id: Date.now(),
        nom: document.getElementById('team-name').value,
        role: document.getElementById('team-role').value,
        presence: document.getElementById('team-presence').value
    };
    team.push(newMember);
    saveData(DATA_KEYS.team, team);
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
    const rooms = loadData(DATA_KEYS.rooms);
    const newRoom = {
        id: Date.now(),
        name: document.getElementById('room-name').value,
        status: document.getElementById('room-status').value
    };
    rooms.push(newRoom);
    saveData(DATA_KEYS.rooms, rooms);
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
    const messages = loadData(DATA_KEYS.messages);
    const newMessage = {
        id: Date.now(),
        subject: document.getElementById('message-subject').value,
        sender: document.getElementById('message-sender').value || 'Admin',
        recipient: document.getElementById('message-recipient').value,
        content: document.getElementById('message-content').value,
        status: document.getElementById('message-status').value,
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR')
    };
    messages.push(newMessage);
    saveData(DATA_KEYS.messages, messages);
    loadMessages();
    bootstrap.Modal.getInstance(document.getElementById('addMessageModal')).hide();
    form.reset();
    showToast('Message envoyé avec succès', 'success');
}

// Delete functions (simplified, add confirmation)
function deletePatient(id) {
    if (confirm('Supprimer ce patient ?')) {
        const patients = loadData(DATA_KEYS.patients).filter(p => p.id != id);
        saveData(DATA_KEYS.patients, patients);
        loadPatients();
        updateKPIs();
    }
}

function deleteAppointment(id) {
    if (confirm('Supprimer ce rendez-vous ?')) {
        const appointments = loadData(DATA_KEYS.appointments).filter(a => a.id != id);
        saveData(DATA_KEYS.appointments, appointments);
        loadAppointments();
        updateKPIs();
    }
}

function deleteCare(id) {
    if (confirm('Supprimer cet acte ?')) {
        const cares = loadData(DATA_KEYS.cares).filter(c => c.id != id);
        saveData(DATA_KEYS.cares, cares);
        loadCares();
    }
}

function deleteInvoice(id) {
    if (confirm('Supprimer cette facture ?')) {
        const invoices = loadData(DATA_KEYS.invoices).filter(i => i.id != id);
        saveData(DATA_KEYS.invoices, invoices);
        loadInvoices();
        updateKPIs();
    }
}

function deleteInsurance(id) {
    if (confirm('Supprimer cette mutuelle ?')) {
        const insurances = loadData(DATA_KEYS.insurances).filter(i => i.id != id);
        saveData(DATA_KEYS.insurances, insurances);
        loadInsurances();
    }
}

function deleteTeamMember(id) {
    if (confirm('Supprimer ce membre ?')) {
        const team = loadData(DATA_KEYS.team).filter(t => t.id != id);
        saveData(DATA_KEYS.team, team);
        loadTeam();
    }
}

function deleteRoom(id) {
    if (confirm('Supprimer cette salle ?')) {
        const rooms = loadData(DATA_KEYS.rooms).filter(r => r.id != id);
        saveData(DATA_KEYS.rooms, rooms);
        loadRooms();
    }
}

function deleteMessage(id) {
    if (confirm('Supprimer ce message ?')) {
        const messages = loadData(DATA_KEYS.messages).filter(m => m.id != id);
        saveData(DATA_KEYS.messages, messages);
        loadMessages();
    }
}

// Edit functions
function editPatient(id) {
    const patients = loadData(DATA_KEYS.patients);
    const patient = patients.find(p => p.id == id);
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
        updateKPIs();
        bootstrap.Modal.getInstance(document.getElementById('editPatientModal')).hide();
        showToast('Patient mis à jour avec succès', 'success');
    }
}

function editAppointment(id) {
    const appointments = loadData(DATA_KEYS.appointments);
    const appointment = appointments.find(a => a.id == id);
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
    const appointments = loadData(DATA_KEYS.appointments);
    const id = document.getElementById('edit-appointment-id').value;
    const index = appointments.findIndex(a => a.id == id);
    if (index !== -1) {
        appointments[index] = {
            ...appointments[index],
            patientId: document.getElementById('edit-appointment-patient').value,
            dentisteId: document.getElementById('edit-appointment-dentiste').value,
            date: document.getElementById('edit-appointment-date').value,
            type: document.getElementById('edit-appointment-type').value,
            status: document.getElementById('edit-appointment-statut').value
        };
        saveData(DATA_KEYS.appointments, appointments);
        loadAppointments();
        updateKPIs();
        bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal')).hide();
        showToast('Rendez-vous mis à jour avec succès', 'success');
    }
}

function editCare(id) {
    const cares = loadData(DATA_KEYS.cares);
    const care = cares.find(c => c.id == id);
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
    const cares = loadData(DATA_KEYS.cares);
    const id = document.getElementById('edit-care-id').value;
    const index = cares.findIndex(c => c.id == id);
    if (index !== -1) {
        cares[index] = {
            ...cares[index],
            description: document.getElementById('edit-care-description').value,
            price: document.getElementById('edit-care-price').value
        };
        saveData(DATA_KEYS.cares, cares);
        loadCares();
        bootstrap.Modal.getInstance(document.getElementById('editCareModal')).hide();
        showToast('Acte mis à jour avec succès', 'success');
    }
}

function editInvoice(id) {
    const invoices = loadData(DATA_KEYS.invoices);
    const invoice = invoices.find(i => i.id == id);
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
    const invoices = loadData(DATA_KEYS.invoices);
    const id = document.getElementById('edit-invoice-id').value;
    const index = invoices.findIndex(i => i.id == id);
    if (index !== -1) {
        invoices[index] = {
            ...invoices[index],
            patientId: document.getElementById('edit-invoice-patient').value,
            amount: document.getElementById('edit-invoice-amount').value,
            status: document.getElementById('edit-invoice-status').value
        };
        saveData(DATA_KEYS.invoices, invoices);
        loadInvoices();
        updateKPIs();
        bootstrap.Modal.getInstance(document.getElementById('editInvoiceModal')).hide();
        showToast('Facture mise à jour avec succès', 'success');
    }
}

function editInsurance(id) {
    const insurances = loadData(DATA_KEYS.insurances);
    const insurance = insurances.find(i => i.id == id);
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
    const insurances = loadData(DATA_KEYS.insurances);
    const id = document.getElementById('edit-insurance-id').value;
    const index = insurances.findIndex(i => i.id == id);
    if (index !== -1) {
        insurances[index] = {
            ...insurances[index],
            name: document.getElementById('edit-insurance-name').value,
            contact: document.getElementById('edit-insurance-contact').value
        };
        saveData(DATA_KEYS.insurances, insurances);
        loadInsurances();
        bootstrap.Modal.getInstance(document.getElementById('editInsuranceModal')).hide();
        showToast('Mutuelle mise à jour avec succès', 'success');
    }
}

function editTeamMember(id) {
    const team = loadData(DATA_KEYS.team);
    const member = team.find(t => t.id == id);
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
    const team = loadData(DATA_KEYS.team);
    const id = document.getElementById('edit-team-id').value;
    const index = team.findIndex(t => t.id == id);
    if (index !== -1) {
        team[index] = {
            ...team[index],
            nom: document.getElementById('edit-team-name').value,
            role: document.getElementById('edit-team-role').value,
            presence: document.getElementById('edit-team-presence').value
        };
        saveData(DATA_KEYS.team, team);
        loadTeam();
        bootstrap.Modal.getInstance(document.getElementById('editTeamMemberModal')).hide();
        showToast('Membre mis à jour avec succès', 'success');
    }
}

function editRoom(id) {
    const rooms = loadData(DATA_KEYS.rooms);
    const room = rooms.find(r => r.id == id);
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
    const rooms = loadData(DATA_KEYS.rooms);
    const id = document.getElementById('edit-room-id').value;
    const index = rooms.findIndex(r => r.id == id);
    if (index !== -1) {
        rooms[index] = {
            ...rooms[index],
            name: document.getElementById('edit-room-name').value,
            status: document.getElementById('edit-room-status').value
        };
        saveData(DATA_KEYS.rooms, rooms);
        loadRooms();
        bootstrap.Modal.getInstance(document.getElementById('editRoomModal')).hide();
        showToast('Salle mise à jour avec succès', 'success');
    }
}

function editMessage(id) {
    const messages = loadData(DATA_KEYS.messages);
    const message = messages.find(m => m.id == id);
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
    const messages = loadData(DATA_KEYS.messages);
    const id = document.getElementById('edit-message-id').value;
    const index = messages.findIndex(m => m.id == id);
    if (index !== -1) {
        messages[index] = {
            ...messages[index],
            subject: document.getElementById('edit-message-subject').value,
            sender: document.getElementById('edit-message-sender').value,
            recipient: document.getElementById('edit-message-recipient').value,
            content: document.getElementById('edit-message-content').value,
            status: document.getElementById('edit-message-status').value
        };
        saveData(DATA_KEYS.messages, messages);
        loadMessages();
        bootstrap.Modal.getInstance(document.getElementById('editMessageModal')).hide();
        showToast('Message mis à jour avec succès', 'success');
    }
}

// Settings
function saveSettings() {
    const settings = {
        tva: document.getElementById('tva').value,
        currency: document.getElementById('currency').value,
        contact: document.getElementById('contact').value
    };
    saveData(DATA_KEYS.settings, settings);
    alert('Paramètres sauvegardés');
}

function resetData() {
    if (confirm('Réinitialiser toutes les données ?')) {
        Object.values(DATA_KEYS).forEach(key => localStorage.removeItem(key));
        initData();
        loadAll();
        updateKPIs();
    }
}

// Populate selects
function populateSelects() {
    const patients = loadData(DATA_KEYS.patients);
    const team = loadData(DATA_KEYS.team);
    const patientSelects = document.querySelectorAll('#appointment-patient, #invoice-patient');
    patientSelects.forEach(select => {
        select.innerHTML = '<option value="">Sélectionner</option>';
        patients.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.nom} ${p.prenom}</option>`;
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
    loadTeam();
    loadRooms();
    loadMessages();
    loadRecentPatients();
    populateSelects();
    initChart();
}

// Initialize chart
function initChart() {
    const ctx = document.getElementById('appointmentsChart');
    if (ctx) {
        const appointments = loadData(DATA_KEYS.appointments);
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
    initData();
    loadAll();
    updateKPIs();
});



