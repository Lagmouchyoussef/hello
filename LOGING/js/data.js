// Data Manager for user authentication and data handling
class DataManager {
    constructor() {
        this.currentUser = null;
        this.users = [
            {
                id: 1,
                email: 'admin@cabinet.ma',
                password: 'admin123',
                role: 'Admin',
                name: 'Admin',
                avatar: 'A'
            },
            {
                id: 2,
                email: 'assistante@cabinet.ma',
                password: 'assistante123',
                role: 'Assistant',
                name: 'Assistante',
                avatar: 'As'
            }
        ];
    }

    authenticateUser(email, password) {
        return this.users.find(user => user.email === email && user.password === password);
    }

    loginUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }
}

// Create global instance
const dataManager = new DataManager();
