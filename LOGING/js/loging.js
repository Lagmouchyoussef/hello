// Include dataManager
// Assuming dataManager is available globally from data.js

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('error');

    console.log('Login attempt with:', email, password);
    console.log('dataManager available:', !!dataManager);
    const user = dataManager.authenticateUser(email, password);
    console.log('Authentication result:', user);
    if (user) {
        // Login the user
        dataManager.loginUser(user);

        // Set current patient if role is Patient
        if (user.role === 'Patient') {
            const mockPatient = {
                id: 1,
                nom: 'Dupont',
                prenom: 'Jean',
                email: user.email,
                telephone: '0123456789',
                naissance: '1990-01-01'
            };
            localStorage.setItem('current_patient', JSON.stringify(mockPatient));
        }

        // Redirect based on role
        const roleRoutes = {
            'Admin': 'http://127.0.0.1:5500/hello/admin/html/dashboard.html',
            'Dentist': 'http://127.0.0.1:5500/hello/admin/html/dashboard.html', // Redirect to admin for now
            'Assistant': 'http://127.0.0.1:5500/hello/assistante/html/dashboard.html',
            'Accountant': 'http://127.0.0.1:5500/admin/html/dashboard.html', // Redirect to admin for now
            'Patient': 'http://127.0.0.1:5500/patient/html/dashboard.html'
        };

        const redirectUrl = roleRoutes[user.role] || '../../patient/html/dashboard.html';
        window.location.href = redirectUrl;
    } else {
        errorDiv.textContent = 'Email ou mot de passe incorrect.';
    }
});
