let patientCredentials = JSON.parse(localStorage.getItem('patientCredentials')) || {
    email: 'patient@cabinet.ma',
    password: 'patient123'
};

// Save to localStorage if not present
if (!localStorage.getItem('patientCredentials')) {
    localStorage.setItem('patientCredentials', JSON.stringify(patientCredentials));
}

document.getElementById('patientLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('patientEmail').value;
    const password = document.getElementById('patientPassword').value;
    const errorDiv = document.getElementById('patientError');

    if (email === patientCredentials.email && password === patientCredentials.password) {
        // Set current patient
        const mockPatient = {
            id: 1,
            nom: 'Dupont',
            prenom: 'Jean',
            email: email,
            telephone: '0123456789',
            naissance: '1990-01-01'
        };
        localStorage.setItem('current_patient', JSON.stringify(mockPatient));
        // Redirect to patient dashboard
        window.location.href = '../../patient/html/dashboard.html';
    } else {
        errorDiv.textContent = 'Email ou mot de passe incorrect.';
    }
});

function goBack() {
    // Go back to previous page or home
    window.history.back();
}
