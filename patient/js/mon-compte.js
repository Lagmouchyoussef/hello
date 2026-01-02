document.addEventListener('DOMContentLoaded', function() {
    const profilForm = document.getElementById('profil-form');
    const securityForm = document.getElementById('security-form');

    // Check authentication
    const currentUser = dentalDataManager.getCurrentUser();
    if (!currentUser) {
        window.location.href = '../../LOGING/html/loging.html';
        return;
    }

    // Load profile data
    const profile = dentalDataManager.getProfile() || {
        firstName: 'Youssef',
        lastName: 'Belkadi',
        email: 'youssef@example.com',
        phone: '+212 6 12 34 56 78'
    };

    // Populate form
    profilForm.querySelector('input[name="firstName"]').value = profile.firstName || '';
    profilForm.querySelector('input[name="lastName"]').value = profile.lastName || '';
    profilForm.querySelector('input[name="email"]').value = profile.email || '';
    profilForm.querySelector('input[name="phone"]').value = profile.phone || '';

    profilForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const updatedProfile = {
            firstName: profilForm.querySelector('input[name="firstName"]').value,
            lastName: profilForm.querySelector('input[name="lastName"]').value,
            email: profilForm.querySelector('input[name="email"]').value,
            phone: profilForm.querySelector('input[name="phone"]').value
        };
        dentalDataManager.saveProfile(updatedProfile);
    });

    securityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Placeholder for password change
        alert('Mot de passe changé ! (Fonction à implémenter)');
    });
});
