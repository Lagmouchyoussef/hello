let users = [
    { email: 'patient@cabinet.ma', password: 'patient123', role: 'Patient', interface: '/patient/html/dashboard.html' },
];

localStorage.setItem('users', JSON.stringify(users));

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        if (user.role === 'Patient') {
            // Set current patient
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
        // Redirect to the interface
        window.location.href = user.interface;
    } else {
        errorDiv.textContent = 'Email ou mot de passe incorrect.';
    }
});
