// Data Management System for Dental Clinic
// Handles all LocalStorage operations and data models

class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize default data structure
    initializeData() {
        const defaultData = {
            patients: [],
            bills: [],
            insurances: [],
            claims: [],
            team: [],
            rooms: [],
            chairs: [],
            messages: [],
            users: [
                {
                    id: 'USR-2024-0001',
                    email: 'admin@cabinet.ma',
                    password: 'admin123',
                    role: 'Admin',
                    permissions: ['all'],
                    active: true,
                    name: 'Admin'
                },
                {
                    id: 'USR-2024-0002',
                    email: 'assistante@cabinet.ma',
                    password: 'assistante123',
                    role: 'Assistant',
                    permissions: ['manage_appointments', 'view_patients', 'manage_bills'],
                    active: true,
                    name: 'Assistante'
                },
                {
                    id: 'USR-2024-0003',
                    email: 'dentiste@cabinet.ma',
                    password: 'dentiste123',
                    role: 'Dentist',
                    permissions: ['view_patients', 'manage_appointments', 'manage_medical_records'],
                    active: true,
                    name: 'Dentiste'
                }
            ],
            medical_records: [],
            medical_history: {},
            allergies: {},
            dental_history: {},
            consultations: [],
            procedures: [],
            dental_chart: {},
            documents: [],
            treatment_plan: {},
            financial: [],
            consents: [],
            audit_trail: [],
            notifications: [],
            settings: {
                clinicName: 'DIKRA Centre Dentaire',
                address: '123 Rue de la Santé, Casablanca',
                phone: '+212 6XX XXX XXX',
                email: 'contact@dikra-dentaire.ma',
                vatRate: 20,
                currency: 'MAD',
                tva: 20,
                lastPatientId: 0,
                lastAppointmentId: 0,
                lastCareId: 0,
                lastBillId: 0,
                lastInsuranceId: 0,
                lastClaimId: 0,
                lastTeamId: 0,
                lastRoomId: 0,
                lastChairId: 0,
                lastMessageId: 0,
                lastUserId: 3,
                lastDocumentId: 0
            }
        };

        // Initialize each data store if not exists or if users is empty
        Object.keys(defaultData).forEach(key => {
            const storageKey = `dikra_${key}`;
            const existing = localStorage.getItem(storageKey);
            if (!existing || (key === 'users' && JSON.parse(existing).length === 0)) {
                localStorage.setItem(storageKey, JSON.stringify(defaultData[key]));
            }
        });
    }

    // Generic CRUD operations
    getAll(entity) {
        return JSON.parse(localStorage.getItem(`dikra_${entity}`) || '[]');
    }

    getById(entity, id) {
        const items = this.getAll(entity);
        return items.find(item => item.id == id);
    }

    save(entity, data) {
        localStorage.setItem(`dikra_${entity}`, JSON.stringify(data));
    }

    add(entity, item) {
        const items = this.getAll(entity);
        items.push(item);
        this.save(entity, items);
        return item;
    }

    update(entity, id, updatedItem) {
        const items = this.getAll(entity);
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updatedItem };
            this.save(entity, items);
            return items[index];
        }
        return null;
    }

    delete(entity, id) {
        const items = this.getAll(entity);
        const filtered = items.filter(item => item.id != id);
        this.save(entity, filtered);
        return filtered.length < items.length;
    }

    // ID Generation
    generateId(type) {
        const settings = this.getAll('settings')[0] || {};
        const currentYear = new Date().getFullYear();
        let counter = settings[`last${type}Id`] || 0;
        counter++;
        settings[`last${type}Id`] = counter;
        this.save('settings', [settings]);

        const prefixes = {
            Patient: 'PAT',
            Appointment: 'RDV',
            Care: 'ACT',
            Bill: 'FAC',
            Insurance: 'MUT',
            Claim: 'CLM',
            Team: 'STF',
            Room: 'SAL',
            Chair: 'FTH',
            Message: 'MSG',
            User: 'USR',
            Document: 'DOC'
        };

        return `${prefixes[type]}-${currentYear}-${String(counter).padStart(4, '0')}`;
    }

    // Settings management
    getSettings() {
        return this.getAll('settings')[0] || {};
    }

    updateSettings(newSettings) {
        const currentSettings = this.getSettings();
        const updated = { ...currentSettings, ...newSettings };
        this.save('settings', [updated]);
        return updated;
    }

    // Data relationships and queries
    getPatientsByStatus(status) {
        return this.getAll('patients').filter(p => p.status === status);
    }

    getAppointmentsByPatient(patientId) {
        return this.getAll('appointments').filter(a => a.patientId == patientId);
    }

    getAppointmentsByDateRange(startDate, endDate) {
        const appointments = this.getAll('appointments');
        return appointments.filter(a => {
            const appointmentDate = new Date(a.date);
            return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
        });
    }

    getAppointmentsByStatus(status) {
        return this.getAll('appointments').filter(a => a.status === status);
    }

    // Enhanced appointment methods for conflict prevention and automatic assignment
    checkAppointmentConflict(date, duration = 60, excludeId = null) {
        const appointments = this.getAll('appointments');
        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        return appointments.filter(a => {
            if (excludeId && a.id == excludeId) return false;
            if (a.status === 'Annulé') return false;

            const aStart = new Date(a.date);
            const aEnd = new Date(aStart.getTime() + (a.duration || 60) * 60000);

            // Check for time overlap
            return (startTime < aEnd && endTime > aStart);
        });
    }

    getAvailableDentists(date, duration = 60) {
        const dentists = this.getAll('team').filter(member => member.role === 'Dentiste' && member.active);
        const conflicts = this.checkAppointmentConflict(date, duration);

        return dentists.filter(dentist => {
            // Check if dentist is already assigned to conflicting appointments
            return !conflicts.some(conflict => conflict.dentisteId == dentist.id);
        });
    }

    getAvailableRooms(date, duration = 60) {
        const rooms = this.getAll('rooms').filter(room => room.active);
        const conflicts = this.checkAppointmentConflict(date, duration);

        return rooms.filter(room => {
            // Check if room is already assigned to conflicting appointments
            return !conflicts.some(conflict => conflict.salleId == room.id);
        });
    }

    autoAssignDentist(date, duration = 60, preferredDentistId = null) {
        let availableDentists = this.getAvailableDentists(date, duration);

        if (preferredDentistId && availableDentists.some(d => d.id == preferredDentistId)) {
            return preferredDentistId;
        }

        // Simple round-robin assignment based on existing appointments count
        if (availableDentists.length > 0) {
            const dentistWorkload = availableDentists.map(dentist => ({
                id: dentist.id,
                count: this.getAll('appointments').filter(a =>
                    a.dentisteId == dentist.id &&
                    a.status !== 'Annulé' &&
                    new Date(a.date).toDateString() === new Date(date).toDateString()
                ).length
            }));

            dentistWorkload.sort((a, b) => a.count - b.count);
            return dentistWorkload[0].id;
        }

        return null;
    }

    autoAssignRoom(date, duration = 60, preferredRoomId = null) {
        let availableRooms = this.getAvailableRooms(date, duration);

        if (preferredRoomId && availableRooms.some(r => r.id == preferredRoomId)) {
            return preferredRoomId;
        }

        // Assign to room with least appointments for the day
        if (availableRooms.length > 0) {
            const roomWorkload = availableRooms.map(room => ({
                id: room.id,
                count: this.getAll('appointments').filter(a =>
                    a.salleId == room.id &&
                    a.status !== 'Annulé' &&
                    new Date(a.date).toDateString() === new Date(date).toDateString()
                ).length
            }));

            roomWorkload.sort((a, b) => a.count - b.count);
            return roomWorkload[0].id;
        }

        return null;
    }

    getAppointmentsByDateRangeWithDetails(startDate, endDate) {
        const appointments = this.getAppointmentsByDateRange(startDate, endDate);
        const patients = this.getAll('patients');
        const team = this.getAll('team');
        const rooms = this.getAll('rooms');

        return appointments.map(appointment => ({
            ...appointment,
            patient: patients.find(p => p.id == appointment.patientId),
            dentist: team.find(t => t.id == appointment.dentisteId),
            room: rooms.find(r => r.id == appointment.salleId)
        }));
    }

    getBillsByPatient(patientId) {
        return this.getAll('bills').filter(b => b.patientId == patientId);
    }
    
    getClaimsByPatient(patientId) {
        return this.getAll('claims').filter(c => c.patientId == patientId);
    }
    
    getClaimsByBill(billId) {
        return this.getAll('claims').filter(c => c.billId == billId);
    }

    getUnpaidBills() {
        return this.getAll('bills').filter(b => b.status === 'Impayé' || b.status === 'Partiellement payé');
    }

    getCaresByPatient(patientId) {
        return this.getAll('cares').filter(c => c.patientId == patientId);
    }

    getMessagesBetweenUsers(from, to) {
        return this.getAll('messages').filter(m =>
            (m.from === from && m.to === to) || (m.from === to && m.to === from)
        );
    }

    getUnreadMessages(user) {
        return this.getAll('messages').filter(m => m.to === user && !m.read);
    }

    // Document management
    addDocument(document) {
        const documents = this.getAll('documents');
        const id = this.generateId('Document');
        const docWithId = { ...document, id };
        documents.push(docWithId);
        this.save('documents', documents);
        this.logAudit('Document ajouté', `Document ${document.name} ajouté pour patient ${document.patientId}`, document.patientId);
        return docWithId;
    }

    getDocumentsByPatient(patientId) {
        return this.getAll('documents').filter(d => d.patientId == patientId);
    }

    deleteDocument(id) {
        const documents = this.getAll('documents');
        const doc = documents.find(d => d.id == id);
        if (doc) {
            this.logAudit('Document supprimé', `Document ${doc.name} supprimé`, doc.patientId);
        }
        const filtered = documents.filter(d => d.id != id);
        this.save('documents', filtered);
        return filtered.length < documents.length;
    }

    // Audit trail
    logAudit(action, description, patientId = null, userId = null) {
        const audit = this.getAll('audit_trail');
        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action,
            description,
            patientId,
            userId: userId || (this.getCurrentUser() ? this.getCurrentUser().id : 'Patient'),
            userRole: this.getCurrentUser() ? this.getCurrentUser().role : 'Patient'
        };
        audit.push(entry);
        this.save('audit_trail', audit);
    }

    getAuditTrail(patientId = null, limit = 50) {
        let audit = this.getAll('audit_trail');
        if (patientId) {
            audit = audit.filter(a => a.patientId == patientId);
        }
        audit.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return audit.slice(0, limit);
    }

    // Statistics calculations
    getStatistics() {
        const patients = this.getAll('patients');
        const appointments = this.getAll('appointments');
        const bills = this.getAll('bills');
        const cares = this.getAll('cares');

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        return {
            totalPatients: patients.length,
            patientsToday: appointments.filter(a =>
                a.date.startsWith(todayStr) && a.status === 'Réalisé'
            ).length,
            scheduledAppointments: appointments.filter(a => a.status === 'Programmé' || a.status === 'Confirmé').length,
            cancelledAppointments: appointments.filter(a => a.status === 'Annulé').length,
            completedAppointments: appointments.filter(a => a.status === 'Réalisé').length,
            revenueToday: bills.filter(b =>
                b.date === todayStr && b.status === 'Payé'
            ).reduce((sum, b) => sum + (b.amount || 0), 0),
            unpaidInvoices: this.getUnpaidBills().length,
            performedActs: cares.filter(c => c.status === 'Réalisé').length
        };
    }

    // Chart data functions
    getAppointmentsPerDay(days = 7) {
        const appointments = this.getAll('appointments');
        const result = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = appointments.filter(a => a.date.startsWith(dateStr)).length;
            result.push({
                date: dateStr,
                count: count
            });
        }
        return result;
    }

    getRevenuePerMonth(months = 12) {
        const bills = this.getAll('bills').filter(b => b.status === 'Payé');
        const result = [];
        const today = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
            const revenue = bills.filter(b => b.date && b.date.startsWith(monthStr))
                .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
            result.push({
                month: monthStr,
                revenue: revenue
            });
        }
        return result;
    }

    getTreatmentDistribution() {
        const cares = this.getAll('cares');
        const distribution = {};

        cares.forEach(care => {
            const treatment = care.description || 'Autre';
            distribution[treatment] = (distribution[treatment] || 0) + 1;
        });

        return Object.entries(distribution).map(([treatment, count]) => ({
            treatment: treatment,
            count: count
        }));
    }

    // Data export/import
    exportData() {
        const data = {};
        const entities = ['patients', 'appointments', 'cares', 'bills', 'insurances', 'claims', 'team', 'rooms', 'chairs', 'messages', 'settings'];

        entities.forEach(entity => {
            data[entity] = this.getAll(entity);
        });

        return data;
    }

    importData(data) {
        Object.keys(data).forEach(entity => {
            if (data[entity]) {
                this.save(entity, data[entity]);
            }
        });
    }

    // User authentication methods
    authenticateUser(email, password) {
        const users = this.getAll('users');
        console.log('Users loaded:', users);
        console.log('Authenticating user:', email, password);
        const user = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password && user.active);
        console.log('User found:', user);
        return user;
    }

    getCurrentUser() {
        const session = JSON.parse(localStorage.getItem('dikra_session') || 'null');
        if (session && session.expires > Date.now()) {
            return this.getById('users', session.userId);
        }
        return null;
    }

    loginUser(user) {
        const session = {
            userId: user.id,
            role: user.role,
            permissions: user.permissions,
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        localStorage.setItem('dikra_session', JSON.stringify(session));
        return session;
    }

    logoutUser() {
        localStorage.removeItem('dikra_session');
    }

    hasPermission(permission) {
        const user = this.getCurrentUser();
        return user && user.permissions.includes(permission);
    }

    isRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }

    // Password reset functionality
    generateResetToken(email) {
        const users = this.getAll('users');
        const user = users.find(u => u.email === email);
        if (user) {
            const token = Math.random().toString(36).substr(2, 9);
            const resetData = {
                userId: user.id,
                token: token,
                expires: Date.now() + (60 * 60 * 1000) // 1 hour
            };
            localStorage.setItem('dikra_reset_token', JSON.stringify(resetData));
            return token;
        }
        return null;
    }

    resetPassword(token, newPassword) {
        const resetData = JSON.parse(localStorage.getItem('dikra_reset_token') || 'null');
        if (resetData && resetData.token === token && resetData.expires > Date.now()) {
            const user = this.getById('users', resetData.userId);
            if (user) {
                this.update('users', user.id, { password: newPassword });
                localStorage.removeItem('dikra_reset_token');
                return true;
            }
        }
        return false;
    }

    // Reset all data
    resetData() {
        const entities = ['patients', 'appointments', 'cares', 'bills', 'insurances', 'claims', 'team', 'rooms', 'chairs', 'messages', 'users'];
        entities.forEach(entity => {
            localStorage.removeItem(`dikra_${entity}`);
        });
        this.initializeData();
    }

    // Enhanced patient management methods
    validatePatientData(data) {
        const errors = [];

        // Required fields
        if (!data.nom?.trim()) errors.push('Nom requis');
        if (!data.prenom?.trim()) errors.push('Prénom requis');
        if (!data.cin?.trim()) errors.push('CIN requis');
        if (!data.naissance) errors.push('Date de naissance requise');
        if (!data.telephone?.trim()) errors.push('Téléphone requis');

        // Format validations
        if (data.cin && !/^[A-Z]{1,2}\d{6}$/.test(data.cin)) {
            errors.push('Format CIN invalide (ex: AB123456)');
        }
        if (data.telephone && !/^\+212\s6\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(data.telephone)) {
            errors.push('Format téléphone invalide (+212 6XX XX XX XX)');
        }
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Format email invalide');
        }

        // Age validation (must be adult)
        if (data.naissance) {
            const birthDate = new Date(data.naissance);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) errors.push('Le patient doit être majeur');
        }

        return errors;
    }

    checkDuplicatePatient(field, value, excludeId = null) {
        const patients = this.getAll('patients');
        return patients.some(p => p[field] === value && p.id !== excludeId);
    }

    archivePatient(id, userId) {
        const patient = this.getById('patients', id);
        if (patient) {
            this.update('patients', id, {
                status: 'Archivé',
                dateArchivage: new Date().toISOString(),
                archivedBy: userId
            });
            this.logAudit('Patient archivé', `Patient ${patient.nom} ${patient.prenom} archivé`, id);
            return true;
        }
        return false;
    }

    restorePatient(id) {
        const patient = this.getById('patients', id);
        if (patient) {
            this.update('patients', id, {
                status: 'Actif',
                dateArchivage: null,
                archivedBy: null
            });
            this.logAudit('Patient restauré', `Patient ${patient.nom} ${patient.prenom} restauré`, id);
            return true;
        }
        return false;
    }

    getPatientsByFilters(filters = {}) {
        let patients = this.getAll('patients');

        if (filters.status) {
            patients = patients.filter(p => p.status === filters.status);
        }
        if (filters.mutuelle) {
            patients = patients.filter(p => p.mutuelle === filters.mutuelle);
        }
        if (filters.dateCreationStart) {
            patients = patients.filter(p => new Date(p.dateCreation) >= new Date(filters.dateCreationStart));
        }
        if (filters.dateCreationEnd) {
            patients = patients.filter(p => new Date(p.dateCreation) <= new Date(filters.dateCreationEnd));
        }
        if (filters.sexe) {
            patients = patients.filter(p => p.sexe === filters.sexe);
        }

        return patients;
    }

    exportPatientsToCSV(filters = {}) {
        const patients = this.getPatientsByFilters(filters);
        const headers = [
            'ID', 'Nom', 'Prénom', 'CIN', 'Sexe', 'Date Naissance', 'Téléphone',
            'Email', 'Adresse', 'Mutuelle', 'Numéro Mutuelle', 'Taux Remboursement',
            'Groupe Sanguin', 'Allergies', 'Maladies Chroniques', 'Traitements',
            'Antécédents Dentaires', 'Notes', 'Statut', 'Date Création'
        ];

        const csvContent = [
            headers.join(';'),
            ...patients.map(p => [
                p.id,
                p.nom,
                p.prenom,
                p.cin,
                p.sexe,
                p.naissance,
                p.telephone,
                p.email || '',
                p.adresse || '',
                p.mutuelle,
                p.numeroMutuelle || '',
                p.tauxRemboursement || 0,
                p.groupeSanguin || '',
                (p.allergies || []).join(', '),
                (p.maladiesChroniques || []).join(', '),
                (p.traitementsEnCours || []).join(', '),
                p.antecedentsDentaires || '',
                p.notesGenerales || '',
                p.status,
                p.dateCreation
            ].map(field => `"${field}"`).join(';'))
        ].join('\n');

        return csvContent;
    }

    exportPatientsToPDF(filters = {}) {
        // This would require a PDF library like jsPDF
        // For now, return basic structure that can be used with jsPDF
        const patients = this.getPatientsByFilters(filters);
        return {
            title: 'Liste des Patients - DIKRA Centre Dentaire',
            date: new Date().toLocaleDateString('fr-FR'),
            patients: patients.map(p => ({
                id: p.id,
                nomComplet: `${p.nom} ${p.prenom}`,
                telephone: p.telephone,
                mutuelle: p.mutuelle,
                status: p.status,
                dateCreation: new Date(p.dateCreation).toLocaleDateString('fr-FR')
            }))
        };
    }

    // Enhanced patient creation with validation
    createPatient(patientData) {
        const errors = this.validatePatientData(patientData);
        if (errors.length > 0) {
            throw new Error(`Erreurs de validation: ${errors.join(', ')}`);
        }

        // Check duplicates
        if (this.checkDuplicatePatient('cin', patientData.cin)) {
            throw new Error('Un patient avec ce CIN existe déjà');
        }
        if (this.checkDuplicatePatient('telephone', patientData.telephone)) {
            throw new Error('Un patient avec ce numéro de téléphone existe déjà');
        }
        if (patientData.email && this.checkDuplicatePatient('email', patientData.email)) {
            throw new Error('Un patient avec cet email existe déjà');
        }

        const patient = {
            ...patientData,
            id: this.generateId('Patient'),
            status: 'Actif',
            dateCreation: new Date().toISOString(),
            dernierRDV: null,
            prochainRDV: null,
            allergies: patientData.allergies || [],
            maladiesChroniques: patientData.maladiesChroniques || [],
            traitementsEnCours: patientData.traitementsEnCours || []
        };

        this.add('patients', patient);
        this.logAudit('Patient créé', `Nouveau patient ${patient.nom} ${patient.prenom} créé`, patient.id);
        return patient;
    }

    // Enhanced patient update with validation
    updatePatient(id, updateData) {
        const existing = this.getById('patients', id);
        if (!existing) {
            throw new Error('Patient non trouvé');
        }

        const errors = this.validatePatientData({ ...existing, ...updateData });
        if (errors.length > 0) {
            throw new Error(`Erreurs de validation: ${errors.join(', ')}`);
        }

        // Check duplicates (excluding current patient)
        if (updateData.cin && this.checkDuplicatePatient('cin', updateData.cin, id)) {
            throw new Error('Un patient avec ce CIN existe déjà');
        }
        if (updateData.telephone && this.checkDuplicatePatient('telephone', updateData.telephone, id)) {
            throw new Error('Un patient avec ce numéro de téléphone existe déjà');
        }
        if (updateData.email && this.checkDuplicatePatient('email', updateData.email, id)) {
            throw new Error('Un patient avec cet email existe déjà');
        }

        const updated = this.update('patients', id, updateData);
        this.logAudit('Patient modifié', `Patient ${existing.nom} ${existing.prenom} modifié`, id);
        return updated;
    }

    // Permanent patient deletion (Admin only)
    deletePatient(id) {
        const patient = this.getById('patients', id);
        if (!patient) {
            throw new Error('Patient non trouvé');
        }

        // Log before deletion
        this.logAudit('Patient supprimé', `Patient ${patient.nom} ${patient.prenom} supprimé définitivement`, id);

        // Remove related data
        const appointments = this.getAppointmentsByPatient(id);
        appointments.forEach(apt => this.delete('appointments', apt.id));

        const bills = this.getBillsByPatient(id);
        bills.forEach(bill => this.delete('bills', bill.id));

        const documents = this.getDocumentsByPatient(id);
        documents.forEach(doc => this.deleteDocument(doc.id));

        // Delete patient
        this.delete('patients', id);
        return true;
    }
}

// Global instance
const dataManager = new DataManager();
