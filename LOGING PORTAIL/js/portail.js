document.getElementById('patientLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('patientEmail').value;
    const password = document.getElementById('patientPassword').value;
    const errorDiv = document.getElementById('patientError');

    const user = dataManager.authenticateUser(email, password);
    if (user && user.role === 'Patient') {
        // Login the user
        dataManager.loginUser(user);

        // Find the patient data from the unified patients storage
        const patients = dataManager.getAllPatients();
        const patient = patients.find(p => p.email === user.email && p.status === 'active');

        if (patient) {
            localStorage.setItem('current_patient', JSON.stringify(patient));
            // Redirect to patient dashboard
            window.location.href = '../../patient/html/dashboard.html';
        } else {
            errorDiv.textContent = 'Erreur: Données patient introuvables.';
        }
    } else {
        errorDiv.textContent = 'Email ou mot de passe incorrect.';
    }
});

document.getElementById('patientRegisterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const birthDate = document.getElementById('regBirthDate').value;
    const phone = document.getElementById('regPhone').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const address = document.getElementById('regAddress').value.trim();
    const errorDiv = document.getElementById('registerError');

    // Create patient data
    const patientData = {
        firstName,
        lastName,
        birthDate,
        phone,
        email,
        address
    };

    // Create patient in patients storage
    const patientId = dataManager.createPatient(patientData);
    if (patientId) {
        // Create user account
        const userId = dataManager.createUser(email, password, 'Patient', `${firstName} ${lastName}`, phone);
        if (userId) {
            errorDiv.style.color = 'green';
            errorDiv.textContent = 'Compte créé avec succès. Vous pouvez maintenant vous connecter.';
            // Switch to login form
            showLogin();
        } else {
            errorDiv.textContent = 'Erreur lors de la création du compte utilisateur.';
        }
    } else {
        errorDiv.textContent = 'Erreur lors de la création du patient. Vérifiez que les informations sont uniques.';
    }
});

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerTab').classList.add('active');
}

function goBack() {
    // Go back to previous page or home
    window.history.back();
}
