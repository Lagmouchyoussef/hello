document.addEventListener('DOMContentLoaded', function() {
    const profilForm = document.getElementById('profil-form');
    const securityForm = document.getElementById('security-form');

    // Load profile data
    const profile = JSON.parse(localStorage.getItem('patientProfile')) || {
        name: 'Youssef Belkadi',
        email: 'youssef@example.com',
        phone: '+212 6 12 34 56 78'
    };

    // Populate form
    profilForm.querySelector('input[type="text"]').value = profile.name;
    profilForm.querySelector('input[type="email"]').value = profile.email;
    profilForm.querySelector('input[type="tel"]').value = profile.phone;

    profilForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const updatedProfile = {
            name: profilForm.querySelector('input[type="text"]').value,
            email: profilForm.querySelector('input[type="email"]').value,
            phone: profilForm.querySelector('input[type="tel"]').value
        };
        localStorage.setItem('patientProfile', JSON.stringify(updatedProfile));
        alert('Profil sauvegardé !');
    });

    securityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Placeholder for password change
        alert('Mot de passe changé ! (Fonction à implémenter)');
    });
});
