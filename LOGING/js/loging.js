let users = [
    { email: 'admin@cabinet.ma', password: 'admin123', role: 'Admin', interface: '/admin/html/dashboard.html' },
    { email: 'assistante@cabinet.ma', password: 'assistante123', role: 'Assistante', interface: '/assistante/html/planning.html' },
    { email: 'dentiste@cabinet.ma', password: 'dentiste123', role: 'Dentiste', interface: '/admin/html/dashboard.html' },
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
        // Redirect to the interface
        window.location.href = user.interface;
    } else {
        errorDiv.textContent = 'Email ou mot de passe incorrect.';
    }
});
