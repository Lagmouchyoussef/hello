// Assistant Space Operations using unified DentalDataManager
class AssistanteCRUD {
    constructor() {
        this.init();
    }

    init() {
        // Check authentication
        const currentUser = dentalDataManager.getCurrentUser();
        if (!currentUser) {
            window.location.href = '../../LOGING/html/loging.html';
            return;
        }
        this.loadContent();
        this.bindEvents();
    }

    // Wrapper methods for dentalDataManager
    create(section, data) {
        if (section === 'patients') {
            return dentalDataManager.createPatient(data);
        } else if (section === 'appointments') {
            return dentalDataManager.createAppointment(data);
        } else {
            return dentalDataManager.create(section, data);
        }
    }

    read(section, id) {
        return dentalDataManager.read(section, id);
    }

    update(section, id, data) {
        return dentalDataManager.update(section, id, data);
    }

    delete(section, id) {
        if (section === 'patients') {
            return dentalDataManager.deletePatient(id);
        } else {
            return dentalDataManager.delete(section, id);
        }
    }

    getAll(section) {
        return dentalDataManager.getAll(section);
    }

    // Dynamic content loading
    loadContent() {
        const hash = window.location.hash || '#dashboard';
        this.renderSection(hash.substring(1));
    }

    renderSection(section) {
        const mainContent = document.querySelector('.main-content');
        const content = this.getSectionContent(section);
        mainContent.innerHTML = `
            <div class="content-header">
                <h1 class="page-title">${this.getSectionTitle(section)}</h1>
            </div>
            ${content}
        `;
        this.bindSectionEvents(section);
    }

    getSectionTitle(section) {
        const titles = {
            dashboard: 'Tableau de bord',
            'rdv-liste': 'Liste des rendez-vous',
            'rdv-ligne': 'Prise en ligne',
            'rdv-presentiel': 'En présentiel',
            'rdv-portail': 'Via espace patient',
            'fiches-patients': 'Fiches patients',
            'ajout-patient': 'Ajouter patient',
            'salle-attente': 'Salle d\'attente',
            paiements: 'Paiements reçus',
            messagerie: 'Messagerie',
            'ai-agent': 'Assistant IA',
            sms: 'Envoi de SMS',
            taches: 'Tâches & rappels',
            notes: 'Notes personnelles',
            statistiques: 'Statistiques',
            ordonnances: 'Ordonnances',
            certificats: 'Certificats médicaux',
            'feuilles-soins': 'Feuilles de soins',
            'liste-personnel': 'Liste du personnel',
            planning: 'Planning de l\'équipe',
            'param-portail': 'Paramètres espace patient',
            'gestion-acces': 'Gestion des accès',
            'messages-patients': 'Messages patients',
            'dossiers-medicaux': 'Dossiers médicaux',
            profil: 'Mon profil',
            notifications: 'Notifications'
        };
        return titles[section] || 'Section';
    }

    getSectionContent(section) {
        switch(section) {
            case 'dashboard':
                return this.renderDashboard();
            case 'rdv-liste':
                return this.renderRendezVousList();
            case 'rdv-ligne':
                return this.renderPriseEnLigne();
            case 'rdv-presentiel':
                return this.renderEnPresentiel();
            case 'rdv-portail':
                return this.renderViaPortail();
            case 'fiches-patients':
                return this.renderFichesPatients();
            case 'ajout-patient':
                return this.renderAjoutPatient();
            case 'salle-attente':
                return this.renderSalleAttente();
            case 'paiements':
                return this.renderPaiements();
            case 'messagerie':
                return this.renderMessagerie();
            case 'ai-agent':
                return this.renderAIAgent();
            case 'sms':
                return this.renderSMS();
            case 'taches':
                return this.renderTaches();
            case 'notes':
                return this.renderNotes();
            case 'statistiques':
                return this.renderStatistiques();
            case 'ordonnances':
                return this.renderOrdonnances();
            case 'certificats':
                return this.renderCertificats();
            case 'feuilles-soins':
                return this.renderFeuillesSoins();
            case 'liste-personnel':
                return this.renderListePersonnel();
            case 'planning':
                return this.renderPlanning();
            case 'param-portail':
                return this.renderParamPortail();
            case 'gestion-acces':
                return this.renderGestionAcces();
            case 'messages-patients':
                return this.renderMessagesPatients();
            case 'dossiers-medicaux':
                return this.renderDossiersMedicaux();
            case 'profil':
                return this.renderProfil();
            case 'notifications':
                return this.renderNotifications();
            default:
                return '<p>Section en développement</p>';
        }
    }

    // Render methods for each section
    renderDashboard() {
        const appointments = this.getAll('appointments');
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter(a =>
            new Date(a.date).toDateString() === today
        ).map(a => {
            const patient = this.read('patients', a.patientId);
            return { ...a, patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu' };
        });
        const pendingPayments = this.getAll('payments').filter(p => p.status === 'pending');
        const unreadMessages = this.getAll('messages').filter(m => !m.read);
        const waitingRoom = this.getAll('waiting_room');

        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Aperçu du jour</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--medical-blue);">${todayAppointments.length}</div>
                        <div>Rendez-vous aujourd'hui</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--warning);">${waitingRoom.length}</div>
                        <div>En salle d'attente</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--success);">${pendingPayments.length}</div>
                        <div>Paiements en attente</div>
                    </div>
                    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2rem; font-weight: bold; color: var(--ai-purple);">${unreadMessages.length}</div>
                        <div>Messages non lus</div>
                    </div>
                </div>
            </div>

            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Rendez-vous d'aujourd'hui</h3>
                </div>
                <div id="today-appointments">
                    ${todayAppointments.map(a => `
                        <div class="message-item">
                            <div class="message-header">${a.patientName} - ${a.time}</div>
                            <div class="message-content">${a.type} - ${a.notes || 'Aucune note'}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.markAppointmentDone('${a.id}')">Terminé</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.cancelAppointment('${a.id}')">Annuler</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun rendez-vous aujourd\'hui</p>'}
                </div>
            </div>
        `;
    }

    renderRendezVousList() {
        const appointments = this.getAll('appointments').map(a => {
            const patient = this.read('patients', a.patientId);
            return { ...a, patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu' };
        });
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Tous les rendez-vous</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddAppointmentForm()">Nouveau RDV</button>
                </div>
                <div id="appointments-list">
                    ${appointments.map(a => `
                        <div class="message-item">
                            <div class="message-header">${a.patientName} - ${new Date(a.date).toLocaleDateString('fr-FR')} ${a.time}</div>
                            <div class="message-content">${a.type} - ${a.status} - ${a.notes || 'Aucune note'}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.editAppointment('${a.id}')">Modifier</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteAppointment('${a.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun rendez-vous</p>'}
                </div>
            </div>
        `;
    }

    renderPriseEnLigne() {
        const onlineAppointments = this.getAll('appointments').filter(a => a.source === 'online');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Rendez-vous en ligne</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showOnlineAppointmentForm()">Nouveau RDV en ligne</button>
                </div>
                <div id="online-appointments">
                    ${onlineAppointments.map(a => `
                        <div class="message-item">
                            <div class="message-header">${a.patientName} - ${new Date(a.date).toLocaleDateString('fr-FR')} ${a.time}</div>
                            <div class="message-content">${a.type} - ${a.contact} - ${a.notes || 'Aucune note'}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.confirmAppointment('${a.id}')">Confirmer</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.rejectAppointment('${a.id}')">Rejeter</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun rendez-vous en ligne</p>'}
                </div>
            </div>
        `;
    }

    renderEnPresentiel() {
        const inPersonAppointments = this.getAll('appointments').filter(a => a.source === 'presentiel');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Rendez-vous en présentiel</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showInPersonAppointmentForm()">Nouveau RDV présentiel</button>
                </div>
                <div id="inperson-appointments">
                    ${inPersonAppointments.map(a => `
                        <div class="message-item">
                            <div class="message-header">${a.patientName} - ${new Date(a.date).toLocaleDateString('fr-FR')} ${a.time}</div>
                            <div class="message-content">${a.type} - ${a.notes || 'Aucune note'}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.checkInAppointment('${a.id}')">Arrivée</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.cancelAppointment('${a.id}')">Annuler</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun rendez-vous en présentiel</p>'}
                </div>
            </div>
        `;
    }

    renderViaPortail() {
        const portalAppointments = this.getAll('appointments').filter(a => a.source === 'portail');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Rendez-vous via portail patient</h3>
                </div>
                <div id="portal-appointments">
                    ${portalAppointments.map(a => `
                        <div class="message-item">
                            <div class="message-header">${a.patientName} - ${new Date(a.date).toLocaleDateString('fr-FR')} ${a.time}</div>
                            <div class="message-content">${a.type} - ${a.notes || 'Aucune note'}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.approveAppointment('${a.id}')">Approuver</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.rejectAppointment('${a.id}')">Rejeter</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun rendez-vous via portail</p>'}
                </div>
            </div>
        `;
    }

    renderFichesPatients() {
        const patients = this.getAll('patients');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Fiches patients</h3>
                    <button class="btn btn-primary" onclick="window.location.hash='#ajout-patient'">Nouveau patient</button>
                </div>
                <div id="patients-list">
                    ${patients.map(p => `
                        <div class="message-item">
                            <div class="message-header">${p.firstName} ${p.lastName} - ${p.phone}</div>
                            <div class="message-content">Né(e) le ${new Date(p.birthDate).toLocaleDateString('fr-FR')} - ${p.address}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.viewPatient('${p.id}')">Voir fiche</button>
                                <button class="btn btn-primary" onclick="assistanteCRUD.editPatient('${p.id}')">Modifier</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deletePatient('${p.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun patient</p>'}
                </div>
            </div>
        `;
    }

    renderAjoutPatient() {
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Ajouter un nouveau patient</h3>
                </div>
                <form id="patient-form">
                    <div class="form-group">
                        <label class="form-label">Prénom</label>
                        <input type="text" class="form-control" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nom</label>
                        <input type="text" class="form-control" name="lastName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date de naissance</label>
                        <input type="date" class="form-control" name="birthDate" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Téléphone</label>
                        <input type="tel" class="form-control" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Adresse</label>
                        <textarea class="form-control" name="address" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Numéro CNOPS</label>
                        <input type="text" class="form-control" name="cnopsNumber">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Numéro CNSS</label>
                        <input type="text" class="form-control" name="cnssNumber">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notes médicales</label>
                        <textarea class="form-control" name="medicalNotes" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-send">Enregistrer le patient</button>
                </form>
            </div>
        `;
    }

    renderSalleAttente() {
        const waitingRoom = this.getAll('waiting_room');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Salle d'attente</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddToWaitingRoom()">Ajouter patient</button>
                </div>
                <div id="waiting-room-list">
                    ${waitingRoom.map(p => `
                        <div class="message-item">
                            <div class="message-header">${p.patientName} - Arrivée: ${new Date(p.arrivalTime).toLocaleTimeString('fr-FR')}</div>
                            <div class="message-content">${p.reason} - ${p.priority}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.callPatient('${p.id}')">Appeler</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.removeFromWaitingRoom('${p.id}')">Retirer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Salle d\'attente vide</p>'}
                </div>
            </div>
        `;
    }

    renderPaiements() {
        const payments = this.getAll('payments');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Paiements reçus</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddPaymentForm()">Nouveau paiement</button>
                </div>
                <div id="payments-list">
                    ${payments.map(p => `
                        <div class="message-item">
                            <div class="message-header">${p.patientName} - ${p.amount} DH</div>
                            <div class="message-content">Date: ${new Date(p.date).toLocaleDateString('fr-FR')} - ${p.method} - ${p.status}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.confirmPayment('${p.id}')">Confirmer</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.cancelPayment('${p.id}')">Annuler</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun paiement</p>'}
                </div>
            </div>
        `;
    }

    renderMessagerie() {
        const messages = this.getAll('messages');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Messagerie</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showNewMessageForm()">Nouveau message</button>
                </div>
                <div id="messages-list">
                    ${messages.map(m => `
                        <div class="message-item ${!m.read ? 'unread' : ''}">
                            <div class="message-header">${m.subject} - ${m.sender}</div>
                            <div class="message-content">${m.content}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.markAsRead('${m.id}')">Marquer lu</button>
                                <button class="btn btn-primary" onclick="assistanteCRUD.replyMessage('${m.id}')">Répondre</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteMessage('${m.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun message</p>'}
                </div>
            </div>
        `;
    }

    renderAIAgent() {
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Assistant IA</h3>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-robot" style="font-size: 4rem; color: var(--ai-purple); margin-bottom: 1rem;"></i>
                    <h4>Assistant IA Intelligent</h4>
                    <p>En développement - Bientôt disponible pour vous aider dans vos tâches quotidiennes.</p>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAIHelp()">Obtenir de l'aide IA</button>
                </div>
            </div>
        `;
    }

    renderSMS() {
        const sms = this.getAll('sms');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Envoi de SMS</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showSendSMSForm()">Nouveau SMS</button>
                </div>
                <div id="sms-list">
                    ${sms.map(s => `
                        <div class="message-item">
                            <div class="message-header">À: ${s.recipient} - ${new Date(s.sentAt).toLocaleDateString('fr-FR')}</div>
                            <div class="message-content">${s.message}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.resendSMS('${s.id}')">Renvoyer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun SMS envoyé</p>'}
                </div>
            </div>
        `;
    }

    renderTaches() {
        const tasks = this.getAll('tasks');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Tâches & rappels</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddTaskForm()">Nouvelle tâche</button>
                </div>
                <div id="tasks-list">
                    ${tasks.map(t => `
                        <div class="message-item ${t.completed ? 'completed' : ''}">
                            <div class="message-header">${t.title} - ${new Date(t.dueDate).toLocaleDateString('fr-FR')}</div>
                            <div class="message-content">${t.description}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.toggleTask('${t.id}')">${t.completed ? 'Marquer incomplète' : 'Marquer complète'}</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteTask('${t.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucune tâche</p>'}
                </div>
            </div>
        `;
    }

    renderNotes() {
        const notes = this.getAll('notes');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Notes personnelles</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddNoteForm()">Nouvelle note</button>
                </div>
                <div id="notes-list">
                    ${notes.map(n => `
                        <div class="message-item">
                            <div class="message-header">${n.title} - ${new Date(n.createdAt).toLocaleDateString('fr-FR')}</div>
                            <div class="message-content">${n.content}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.editNote('${n.id}')">Modifier</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteNote('${n.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucune note</p>'}
                </div>
            </div>
        `;
    }

    renderStatistiques() {
        const appointments = this.getAll('appointments');
        const patients = this.getAll('patients');
        const payments = this.getAll('payments');

        const todayAppointments = appointments.filter(a =>
            new Date(a.date).toDateString() === new Date().toDateString()
        ).length;

        const thisMonthAppointments = appointments.filter(a => {
            const appointmentDate = new Date(a.date);
            const now = new Date();
            return appointmentDate.getMonth() === now.getMonth() &&
                   appointmentDate.getFullYear() === now.getFullYear();
        }).length;

        const totalRevenue = payments
            .filter(p => p.status === 'confirmed')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);

        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Statistiques</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    <div style="text-align: center; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--medical-blue);">${patients.length}</div>
                        <div>Total patients</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--success);">${todayAppointments}</div>
                        <div>RDV aujourd'hui</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--warning);">${thisMonthAppointments}</div>
                        <div>RDV ce mois</div>
                    </div>
                    <div style="text-align: center; padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
                        <div style="font-size: 2.5rem; font-weight: bold; color: var(--danger);">${totalRevenue} DH</div>
                        <div>Revenus totaux</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderOrdonnances() {
        const prescriptions = this.getAll('prescriptions');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Ordonnances</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddPrescriptionForm()">Nouvelle ordonnance</button>
                </div>
                <div id="prescriptions-list">
                    ${prescriptions.map(p => `
                        <div class="message-item">
                            <div class="message-header">Dr. ${p.doctor} - ${p.patientName}</div>
                            <div class="message-content">${p.medicines.join(', ')} - ${new Date(p.date).toLocaleDateString('fr-FR')}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.printPrescription('${p.id}')">Imprimer</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deletePrescription('${p.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucune ordonnance</p>'}
                </div>
            </div>
        `;
    }

    renderCertificats() {
        const certificates = this.getAll('certificates');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Certificats médicaux</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddCertificateForm()">Nouveau certificat</button>
                </div>
                <div id="certificates-list">
                    ${certificates.map(c => `
                        <div class="message-item">
                            <div class="message-header">${c.type} - ${c.patientName}</div>
                            <div class="message-content">${c.description} - ${new Date(c.date).toLocaleDateString('fr-FR')}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.printCertificate('${c.id}')">Imprimer</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteCertificate('${c.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun certificat</p>'}
                </div>
            </div>
        `;
    }

    renderFeuillesSoins() {
        const careSheets = this.getAll('care_sheets');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Feuilles de soins (CNOPS/CNSS)</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddCareSheetForm()">Nouvelle feuille</button>
                </div>
                <div id="care-sheets-list">
                    ${careSheets.map(c => `
                        <div class="message-item">
                            <div class="message-header">${c.patientName} - ${c.type}</div>
                            <div class="message-content">${c.amount} DH - ${new Date(c.date).toLocaleDateString('fr-FR')}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.printCareSheet('${c.id}')">Imprimer</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteCareSheet('${c.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucune feuille de soins</p>'}
                </div>
            </div>
        `;
    }

    renderListePersonnel() {
        const staff = this.getAll('staff');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Liste du personnel</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddStaffForm()">Ajouter membre</button>
                </div>
                <div id="staff-list">
                    ${staff.map(s => `
                        <div class="message-item">
                            <div class="message-header">${s.firstName} ${s.lastName} - ${s.role}</div>
                            <div class="message-content">${s.email} - ${s.phone}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.editStaff('${s.id}')">Modifier</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteStaff('${s.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun membre du personnel</p>'}
                </div>
            </div>
        `;
    }

    renderPlanning() {
        const schedules = this.getAll('schedules');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Planning de l'équipe</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showAddScheduleForm()">Nouveau planning</button>
                </div>
                <div id="schedules-list">
                    ${schedules.map(s => `
                        <div class="message-item">
                            <div class="message-header">${s.staffName} - ${s.day}</div>
                            <div class="message-content">${s.startTime} - ${s.endTime} - ${s.notes || 'Aucune note'}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.editSchedule('${s.id}')">Modifier</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteSchedule('${s.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun planning</p>'}
                </div>
            </div>
        `;
    }

    renderParamPortail() {
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Paramètres espace patient</h3>
                </div>
                <form id="portal-settings-form">
                    <div class="form-group">
                        <label class="form-label">Activer l'espace patient</label>
                        <input type="checkbox" name="portalEnabled" checked>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prise de RDV en ligne</label>
                        <input type="checkbox" name="onlineBooking" checked>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Messagerie patient</label>
                        <input type="checkbox" name="patientMessaging" checked>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Accès aux documents</label>
                        <input type="checkbox" name="documentAccess" checked>
                    </div>
                    <button type="submit" class="btn-send">Sauvegarder</button>
                </form>
            </div>
        `;
    }

    renderGestionAcces() {
        const accessLogs = this.getAll('access_logs');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Gestion des accès</h3>
                </div>
                <div id="access-logs">
                    ${accessLogs.map(log => `
                        <div class="message-item">
                            <div class="message-header">${log.user} - ${log.action}</div>
                            <div class="message-content">${new Date(log.timestamp).toLocaleString('fr-FR')}</div>
                        </div>
                    `).join('') || '<p>Aucun log d\'accès</p>'}
                </div>
            </div>
        `;
    }

    renderMessagesPatients() {
        const patientMessages = this.getAll('patient_messages');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Messages patients</h3>
                    <button class="btn btn-primary" onclick="assistanteCRUD.showSendPatientMessageForm()">Nouveau message</button>
                </div>
                <div id="patient-messages-list">
                    ${patientMessages.map(m => `
                        <div class="message-item ${!m.read ? 'unread' : ''}">
                            <div class="message-header">${m.patientName} - ${m.subject}</div>
                            <div class="message-content">${m.content}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.markPatientMessageRead('${m.id}')">Marquer lu</button>
                                <button class="btn btn-primary" onclick="assistanteCRUD.replyToPatient('${m.id}')">Répondre</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun message patient</p>'}
                </div>
            </div>
        `;
    }

    renderDossiersMedicaux() {
        const medicalRecords = this.getAll('medical_records');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Dossiers médicaux</h3>
                </div>
                <div id="medical-records-list">
                    ${medicalRecords.map(r => `
                        <div class="message-item">
                            <div class="message-header">${r.patientName} - ${r.type}</div>
                            <div class="message-content">${r.description} - ${new Date(r.date).toLocaleDateString('fr-FR')}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.viewMedicalRecord('${r.id}')">Voir</button>
                                <button class="btn btn-primary" onclick="assistanteCRUD.editMedicalRecord('${r.id}')">Modifier</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucun dossier médical</p>'}
                </div>
            </div>
        `;
    }

    renderProfil() {
        const profile = dentalDataManager.getProfile() || {};
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Mon profil</h3>
                </div>
                <form id="profile-form">
                    <div class="form-group">
                        <label class="form-label">Prénom</label>
                        <input type="text" class="form-control" name="firstName" value="${profile.firstName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nom</label>
                        <input type="text" class="form-control" name="lastName" value="${profile.lastName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" value="${profile.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Téléphone</label>
                        <input type="tel" class="form-control" name="phone" value="${profile.phone || ''}">
                    </div>
                    <button type="submit" class="btn-send">Sauvegarder</button>
                </form>
            </div>
        `;
    }

    renderNotifications() {
        const notifications = this.getAll('notifications');
        return `
            <div class="assistant-card">
                <div class="card-header">
                    <h3 class="card-title">Notifications</h3>
                </div>
                <div id="notifications-list">
                    ${notifications.map(n => `
                        <div class="message-item ${!n.read ? 'unread' : ''}">
                            <div class="message-header">${n.title}</div>
                            <div class="message-content">${n.message}</div>
                            <div class="message-actions">
                                <button class="btn btn-success" onclick="assistanteCRUD.markNotificationRead('${n.id}')">Marquer lu</button>
                                <button class="btn btn-danger" onclick="assistanteCRUD.deleteNotification('${n.id}')">Supprimer</button>
                            </div>
                        </div>
                    `).join('') || '<p>Aucune notification</p>'}
                </div>
            </div>
        `;
    }

    // Event binding
    bindEvents() {
        window.addEventListener('hashchange', () => this.loadContent());
    }

    bindSectionEvents(section) {
        switch(section) {
            case 'ajout-patient':
                this.bindPatientForm();
                break;
            case 'profil':
                this.bindProfileForm();
                break;
            case 'param-portail':
                this.bindPortalSettingsForm();
                break;
        }
    }

    bindPatientForm() {
        const form = document.getElementById('patient-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                const result = this.create('patients', data);
                if (result) {
                    form.reset();
                    window.location.hash = '#fiches-patients';
                }
            });
        }
    }

    bindProfileForm() {
        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                dentalDataManager.saveProfile(data);
            });
        }
    }

    bindPortalSettingsForm() {
        const form = document.getElementById('portal-settings-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                // Convert checkboxes to boolean
                Object.keys(data).forEach(key => {
                    if (data[key] === 'on') data[key] = true;
                });
                this.create('portal_settings', data);
                alert('Paramètres sauvegardés !');
            });
        }
    }

    // CRUD methods for various sections
    showAddAppointmentForm() {
        const patients = this.getAll('patients');
        if (patients.length === 0) {
            alert('Aucun patient disponible. Veuillez ajouter un patient d\'abord.');
            return;
        }
        const patientOptions = patients.map(p => `${p.id}: ${p.firstName} ${p.lastName}`).join('\n');
        const patientId = prompt(`Sélectionnez un patient (ID: Nom):\n${patientOptions}`);
        if (!patientId) return;
        const patient = patients.find(p => p.id === patientId.split(':')[0].trim());
        if (!patient) {
            alert('Patient invalide.');
            return;
        }
        const type = prompt('Type de rendez-vous:');
        const date = prompt('Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
        const time = prompt('Heure (HH:MM):');
        if (type && date && time) {
            this.create('appointments', {
                patientId: patient.id,
                type,
                date,
                time,
                status: 'confirmed',
                source: 'manual'
            });
            this.loadContent();
        }
    }

    editAppointment(id) {
        const appointment = this.read('appointments', id);
        if (appointment) {
            const newNotes = prompt('Nouvelles notes:', appointment.notes || '');
            if (newNotes !== null) {
                this.update('appointments', id, { notes: newNotes });
                this.loadContent();
            }
        }
    }

    deleteAppointment(id) {
        if (confirm('Supprimer ce rendez-vous ?')) {
            this.delete('appointments', id);
            this.loadContent();
        }
    }

    confirmAppointment(id) {
        this.update('appointments', id, { status: 'confirmed' });
        this.loadContent();
    }

    rejectAppointment(id) {
        if (confirm('Rejeter ce rendez-vous ?')) {
            this.update('appointments', id, { status: 'rejected' });
            this.loadContent();
        }
    }

    approveAppointment(id) {
        this.update('appointments', id, { status: 'confirmed' });
        this.loadContent();
    }

    checkInAppointment(id) {
        this.update('appointments', id, { status: 'checked-in' });
        // Add to waiting room
        const appointment = this.read('appointments', id);
        if (appointment) {
            this.create('waiting_room', {
                patientName: appointment.patientName,
                arrivalTime: new Date().toISOString(),
                reason: appointment.type,
                priority: 'normal'
            });
        }
        this.loadContent();
    }

    cancelAppointment(id) {
        if (confirm('Annuler ce rendez-vous ?')) {
            this.update('appointments', id, { status: 'cancelled' });
            this.loadContent();
        }
    }

    markAppointmentDone(id) {
        this.update('appointments', id, { status: 'completed' });
        this.loadContent();
    }

    viewPatient(id) {
        const patient = this.read('patients', id);
        if (patient) {
            alert(`Patient: ${patient.firstName} ${patient.lastName}\nTéléphone: ${patient.phone}\nEmail: ${patient.email}\nAdresse: ${patient.address}`);
        }
    }

    editPatient(id) {
        const patient = this.read('patients', id);
        if (patient) {
            const newPhone = prompt('Nouveau téléphone:', patient.phone);
            if (newPhone !== null) {
                this.update('patients', id, { phone: newPhone });
                this.loadContent();
            }
        }
    }

    deletePatient(id) {
        if (confirm('Supprimer ce patient ?')) {
            this.delete('patients', id);
            this.loadContent();
        }
    }

    showAddToWaitingRoom() {
        const patientName = prompt('Nom du patient:');
        const reason = prompt('Motif:');
        if (patientName) {
            this.create('waiting_room', {
                patientName,
                arrivalTime: new Date().toISOString(),
                reason: reason || 'Consultation',
                priority: 'normal'
            });
            this.loadContent();
        }
    }

    callPatient(id) {
        const patient = this.read('waiting_room', id);
        if (patient) {
            alert(`Appeler le patient: ${patient.patientName}`);
            this.delete('waiting_room', id);
            this.loadContent();
        }
    }

    removeFromWaitingRoom(id) {
        if (confirm('Retirer ce patient de la salle d\'attente ?')) {
            this.delete('waiting_room', id);
            this.loadContent();
        }
    }

    showAddPaymentForm() {
        const patientName = prompt('Nom du patient:');
        const amount = prompt('Montant (DH):');
        const method = prompt('Méthode de paiement:');
        if (patientName && amount) {
            this.create('payments', {
                patientName,
                amount: parseFloat(amount),
                method,
                date: new Date().toISOString(),
                status: 'pending'
            });
            this.loadContent();
        }
    }

    confirmPayment(id) {
        this.update('payments', id, { status: 'confirmed' });
        this.loadContent();
    }

    cancelPayment(id) {
        if (confirm('Annuler ce paiement ?')) {
            this.update('payments', id, { status: 'cancelled' });
            this.loadContent();
        }
    }

    showNewMessageForm() {
        const subject = prompt('Sujet:');
        const content = prompt('Message:');
        const sender = prompt('Expéditeur:');
        if (subject && content) {
            this.create('messages', {
                subject,
                content,
                sender: sender || 'Système',
                read: false
            });
            this.loadContent();
        }
    }

    markAsRead(id) {
        this.update('messages', id, { read: true });
        this.loadContent();
    }

    replyMessage(id) {
        const message = this.read('messages', id);
        if (message) {
            const reply = prompt('Votre réponse:');
            if (reply) {
                this.create('messages', {
                    subject: 'Re: ' + message.subject,
                    content: reply,
                    sender: 'Assistante',
                    read: false
                });
                this.loadContent();
            }
        }
    }

    deleteMessage(id) {
        if (confirm('Supprimer ce message ?')) {
            this.delete('messages', id);
            this.loadContent();
        }
    }

    showAIHelp() {
        alert('Assistant IA: Je peux vous aider avec la gestion des rendez-vous, des patients, et l\'organisation quotidienne. Fonctionnalité en développement.');
    }

    showSendSMSForm() {
        const recipient = prompt('Numéro du destinataire:');
        const message = prompt('Message:');
        if (recipient && message) {
            this.create('sms', {
                recipient,
                message,
                sentAt: new Date().toISOString()
            });
            this.loadContent();
        }
    }

    resendSMS(id) {
        const sms = this.read('sms', id);
        if (sms) {
            this.create('sms', {
                recipient: sms.recipient,
                message: sms.message,
                sentAt: new Date().toISOString()
            });
            alert('SMS renvoyé !');
        }
    }

    showAddTaskForm() {
        const title = prompt('Titre de la tâche:');
        const description = prompt('Description:');
        const dueDate = prompt('Date d\'échéance (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
        if (title) {
            this.create('tasks', {
                title,
                description,
                dueDate,
                completed: false
            });
            this.loadContent();
        }
    }

    toggleTask(id) {
        const task = this.read('tasks', id);
        if (task) {
            this.update('tasks', id, { completed: !task.completed });
            this.loadContent();
        }
    }

    deleteTask(id) {
        if (confirm('Supprimer cette tâche ?')) {
            this.delete('tasks', id);
            this.loadContent();
        }
    }

    showAddNoteForm() {
        const title = prompt('Titre:');
        const content = prompt('Contenu:');
        if (title) {
            this.create('notes', { title, content });
            this.loadContent();
        }
    }

    editNote(id) {
        const note = this.read('notes', id);
        if (note) {
            const newContent = prompt('Nouveau contenu:', note.content);
            if (newContent !== null) {
                this.update('notes', id, { content: newContent });
                this.loadContent();
            }
        }
    }

    deleteNote(id) {
        if (confirm('Supprimer cette note ?')) {
            this.delete('notes', id);
            this.loadContent();
        }
    }

    showAddPrescriptionForm() {
        const doctor = prompt('Nom du médecin:');
        const patientName = prompt('Nom du patient:');
        const medicines = prompt('Médicaments (séparés par des virgules):');
        if (doctor && patientName && medicines) {
            this.create('prescriptions', {
                doctor,
                patientName,
                medicines: medicines.split(',').map(m => m.trim()),
                date: new Date().toISOString()
            });
            this.loadContent();
        }
    }

    printPrescription(id) {
        alert('Impression de l\'ordonnance ' + id);
    }

    deletePrescription(id) {
        if (confirm('Supprimer cette ordonnance ?')) {
            this.delete('prescriptions', id);
            this.loadContent();
        }
    }

    showAddCertificateForm() {
        const type = prompt('Type de certificat:');
        const patientName = prompt('Nom du patient:');
        const description = prompt('Description:');
        if (type && patientName) {
            this.create('certificates', {
                type,
                patientName,
                description,
                date: new Date().toISOString()
            });
            this.loadContent();
        }
    }

    printCertificate(id) {
        alert('Impression du certificat ' + id);
    }

    deleteCertificate(id) {
        if (confirm('Supprimer ce certificat ?')) {
            this.delete('certificates', id);
            this.loadContent();
        }
    }

    showAddCareSheetForm() {
        const patientName = prompt('Nom du patient:');
        const type = prompt('Type (CNOPS/CNSS):');
        const amount = prompt('Montant:');
        if (patientName && type && amount) {
            this.create('care_sheets', {
                patientName,
                type,
                amount: parseFloat(amount),
                date: new Date().toISOString()
            });
            this.loadContent();
        }
    }

    printCareSheet(id) {
        alert('Impression de la feuille de soins ' + id);
    }

    deleteCareSheet(id) {
        if (confirm('Supprimer cette feuille de soins ?')) {
            this.delete('care_sheets', id);
            this.loadContent();
        }
    }

    showAddStaffForm() {
        const firstName = prompt('Prénom:');
        const lastName = prompt('Nom:');
        const role = prompt('Rôle:');
        const email = prompt('Email:');
        const phone = prompt('Téléphone:');
        if (firstName && lastName && role) {
            this.create('staff', {
                firstName,
                lastName,
                role,
                email,
                phone
            });
            this.loadContent();
        }
    }

    editStaff(id) {
        const staff = this.read('staff', id);
        if (staff) {
            const newPhone = prompt('Nouveau téléphone:', staff.phone);
            if (newPhone !== null) {
                this.update('staff', id, { phone: newPhone });
                this.loadContent();
            }
        }
    }

    deleteStaff(id) {
        if (confirm('Supprimer ce membre du personnel ?')) {
            this.delete('staff', id);
            this.loadContent();
        }
    }

    showAddScheduleForm() {
        const staffName = prompt('Nom du membre:');
        const day = prompt('Jour:');
        const startTime = prompt('Heure de début:');
        const endTime = prompt('Heure de fin:');
        if (staffName && day && startTime && endTime) {
            this.create('schedules', {
                staffName,
                day,
                startTime,
                endTime
            });
            this.loadContent();
        }
    }

    editSchedule(id) {
        const schedule = this.read('schedules', id);
        if (schedule) {
            const newNotes = prompt('Nouvelles notes:', schedule.notes || '');
            if (newNotes !== null) {
                this.update('schedules', id, { notes: newNotes });
                this.loadContent();
            }
        }
    }

    deleteSchedule(id) {
        if (confirm('Supprimer ce planning ?')) {
            this.delete('schedules', id);
            this.loadContent();
        }
    }

    showSendPatientMessageForm() {
        const patientName = prompt('Nom du patient:');
        const subject = prompt('Sujet:');
        const content = prompt('Message:');
        if (patientName && subject && content) {
            this.create('patient_messages', {
                patientName,
                subject,
                content,
                read: false
            });
            this.loadContent();
        }
    }

    markPatientMessageRead(id) {
        this.update('patient_messages', id, { read: true });
        this.loadContent();
    }

    replyToPatient(id) {
        const message = this.read('patient_messages', id);
        if (message) {
            const reply = prompt('Votre réponse:');
            if (reply) {
                this.create('patient_messages', {
                    patientName: message.patientName,
                    subject: 'Re: ' + message.subject,
                    content: reply,
                    read: false
                });
                this.loadContent();
            }
        }
    }

    viewMedicalRecord(id) {
        const record = this.read('medical_records', id);
        if (record) {
            alert(`Dossier médical: ${record.patientName}\nType: ${record.type}\nDescription: ${record.description}\nDate: ${new Date(record.date).toLocaleDateString('fr-FR')}`);
        }
    }

    editMedicalRecord(id) {
        const record = this.read('medical_records', id);
        if (record) {
            const newDesc = prompt('Nouvelle description:', record.description);
            if (newDesc !== null) {
                this.update('medical_records', id, { description: newDesc });
                this.loadContent();
            }
        }
    }

    markNotificationRead(id) {
        this.update('notifications', id, { read: true });
        this.loadContent();
    }

    deleteNotification(id) {
        if (confirm('Supprimer cette notification ?')) {
            this.delete('notifications', id);
            this.loadContent();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.assistanteCRUD = new AssistanteCRUD();
});
