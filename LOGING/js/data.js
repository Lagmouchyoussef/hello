// Unified Data Manager for Dental Office Management System
class DentalDataManager {
    constructor() {
        this.storageKeys = {
            users: 'dental_users',
            patients: 'dental_patients',
            appointments: 'dental_appointments',
            roles: 'dental_roles',
            currentUser: 'dental_currentUser'
        };
        this.initData();
    }

    initData() {
        // Initialize default roles if not exist
        if (!this.getAll('roles').length) {
            this.save('roles', [
                { id: '1', name: 'Admin', permissions: ['all'], createdAt: new Date().toISOString() },
                { id: '2', name: 'Assistant', permissions: ['read', 'write_patients', 'write_appointments'], createdAt: new Date().toISOString() },
                { id: '3', name: 'Patient', permissions: ['read_own'], createdAt: new Date().toISOString() }
            ]);
        }

        // Initialize default users if they don't exist
        const users = this.getAll('users');
        if (!users.find(u => u.email === 'admin@cabinet.ma')) {
            users.push({
                id: '1',
                email: 'admin@cabinet.ma',
                password: 'admin123',
                role: 'Admin',
                name: 'Admin',
                avatar: 'A',
                createdAt: new Date().toISOString()
            });
        }
        if (!users.find(u => u.email === 'assistante@cabinet.ma')) {
            users.push({
                id: '2',
                email: 'assistante@cabinet.ma',
                password: 'assistante123',
                role: 'Assistant',
                name: 'Hind Alaoui',
                avatar: 'HA',
                createdAt: new Date().toISOString()
            });
        }
        if (users.length > 0) {
            this.save('users', users);
        }
    }

    // Generic CRUD operations
    create(section, data) {
        const items = this.getAll(section);
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        data.id = id;
        data.createdAt = new Date().toISOString();
        items.push(data);
        this.save(section, items);
        return id;
    }

    read(section, id) {
        const items = this.getAll(section);
        return items.find(item => item.id === id);
    }

    update(section, id, data) {
        const items = this.getAll(section);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            data.updatedAt = new Date().toISOString();
            items[index] = { ...items[index], ...data };
            this.save(section, items);
            return true;
        }
        return false;
    }

    delete(section, id) {
        const items = this.getAll(section);
        const filtered = items.filter(item => item.id !== id);
        this.save(section, filtered);
        return filtered.length !== items.length;
    }

    getAll(section) {
        const data = localStorage.getItem(this.storageKeys[section]);
        return data ? JSON.parse(data) : [];
    }

    save(section, items) {
        localStorage.setItem(this.storageKeys[section], JSON.stringify(items));
    }

    // Authentication
    authenticateUser(email, password) {
        const users = this.getAll('users');
        return users.find(user => user.email === email && user.password === password);
    }

    loginUser(user) {
        localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(user));
    }

    logoutUser() {
        localStorage.removeItem(this.storageKeys.currentUser);
    }

    getCurrentUser() {
        const stored = localStorage.getItem(this.storageKeys.currentUser);
        return stored ? JSON.parse(stored) : null;
    }

    // Role management (Admin only)
    createRole(name, permissions) {
        const currentUser = this.getCurrentUser();
        if (currentUser?.role !== 'Admin') {
            this.showMessage('Action refusée : seul l\'Admin peut créer des rôles.', 'error');
            return null;
        }
        const roles = this.getAll('roles');
        if (roles.find(r => r.name === name)) {
            this.showMessage('Ce rôle existe déjà.', 'error');
            return null;
        }
        const id = this.create('roles', { name, permissions });
        this.showMessage('Rôle créé avec succès.', 'success');
        return id;
    }

    // User management (Admin only)
    createUser(email, password, role, name) {
        const currentUser = this.getCurrentUser();
        if (currentUser?.role !== 'Admin') {
            this.showMessage('Action refusée : seul l\'Admin peut créer des comptes.', 'error');
            return null;
        }
        const users = this.getAll('users');
        if (users.find(u => u.email === email)) {
            this.showMessage('Un utilisateur avec cet email existe déjà.', 'error');
            return null;
        }
        const roles = this.getAll('roles');
        if (!roles.find(r => r.name === role)) {
            this.showMessage('Rôle invalide.', 'error');
            return null;
        }
        const id = this.create('users', { email, password, role, name, avatar: name.charAt(0).toUpperCase() });
        this.showMessage('Utilisateur créé avec succès.', 'success');
        return id;
    }

    // Patient management
    createPatient(patientData) {
        const patients = this.getAll('patients');
        // Check for uniqueness - assuming firstName + lastName + birthDate + phone is unique
        const existing = patients.find(p =>
            p.firstName === patientData.firstName &&
            p.lastName === patientData.lastName &&
            p.birthDate === patientData.birthDate &&
            p.phone === patientData.phone
        );
        if (existing) {
            this.showMessage('Ce patient existe déjà. Impossible de le recréer.', 'error');
            return null;
        }
        const id = this.create('patients', patientData);
        this.showMessage('Patient ajouté avec succès.', 'success');
        return id;
    }

    deletePatient(id) {
        const appointments = this.getAll('appointments').filter(a => a.patientId === id);
        if (appointments.length > 0) {
            this.showMessage('Impossible de supprimer un patient avec des rendez-vous actifs.', 'error');
            return false;
        }
        const result = this.delete('patients', id);
        if (result) {
            this.showMessage('Patient supprimé définitivement.', 'success');
        }
        return result;
    }

    // Appointment management
    createAppointment(appointmentData) {
        const patient = this.read('patients', appointmentData.patientId);
        if (!patient) {
            this.showMessage('Patient introuvable.', 'error');
            return null;
        }
        const id = this.create('appointments', appointmentData);
        this.showMessage('Rendez-vous créé avec succès.', 'success');
        return id;
    }

    // Message display
    showMessage(message, type = 'info') {
        // Create a temporary message element
        const msgEl = document.createElement('div');
        msgEl.className = `message ${type}`;
        msgEl.textContent = message;
        msgEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
        `;
        if (type === 'success') msgEl.style.backgroundColor = '#28a745';
        else if (type === 'error') msgEl.style.backgroundColor = '#dc3545';
        else msgEl.style.backgroundColor = '#007bff';

        document.body.appendChild(msgEl);
        setTimeout(() => {
            if (msgEl.parentNode) msgEl.parentNode.removeChild(msgEl);
        }, 3000);
    }

    // Permission check
    hasPermission(permission) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;
        const role = this.getAll('roles').find(r => r.name === currentUser.role);
        if (!role) return false;
        return role.permissions.includes('all') || role.permissions.includes(permission);
    }
}

// Create global instance
const dentalDataManager = new DentalDataManager();

// Backward compatibility
const dataManager = {
    authenticateUser: (email, password) => dentalDataManager.authenticateUser(email, password),
    loginUser: (user) => dentalDataManager.loginUser(user),
    logoutUser: () => dentalDataManager.logoutUser(),
    getCurrentUser: () => dentalDataManager.getCurrentUser()
};
