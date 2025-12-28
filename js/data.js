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
            appointments: [],
            cares: [],
            bills: [],
            insurances: [],
            team: [],
            rooms: [],
            chairs: [],
            messages: [],
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
                lastTeamId: 0,
                lastRoomId: 0,
                lastChairId: 0,
                lastMessageId: 0
            }
        };

        // Initialize each data store if not exists
        Object.keys(defaultData).forEach(key => {
            if (!localStorage.getItem(`dikra_${key}`)) {
                localStorage.setItem(`dikra_${key}`, JSON.stringify(defaultData[key]));
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
            Team: 'STF',
            Room: 'SAL',
            Chair: 'FTH',
            Message: 'MSG'
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

    getBillsByPatient(patientId) {
        return this.getAll('bills').filter(b => b.patientId == patientId);
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

    // Data export/import
    exportData() {
        const data = {};
        const entities = ['patients', 'appointments', 'cares', 'bills', 'insurances', 'team', 'rooms', 'chairs', 'messages', 'settings'];

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

    // Reset all data
    resetData() {
        const entities = ['patients', 'appointments', 'cares', 'bills', 'insurances', 'team', 'rooms', 'chairs', 'messages'];
        entities.forEach(entity => {
            localStorage.removeItem(`dikra_${entity}`);
        });
        this.initializeData();
    }
}

// Global instance
const dataManager = new DataManager();
