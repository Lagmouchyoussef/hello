document.addEventListener('DOMContentLoaded', function() {
    const personalInfoDiv = document.getElementById('personal-info');
    const medicalHistoryDiv = document.getElementById('medical-history');
    const allergiesMedicationsDiv = document.getElementById('allergies-medications');

    // Load data from localStorage
    const personalInfo = JSON.parse(localStorage.getItem('patientPersonalInfo')) || {};
    const medicalHistory = JSON.parse(localStorage.getItem('patientMedicalHistory')) || [];
    const allergiesMedications = JSON.parse(localStorage.getItem('patientAllergiesMedications')) || [];

    // Display personal info
    if (Object.keys(personalInfo).length > 0) {
        personalInfoDiv.innerHTML = `
            <p><strong>Nom:</strong> ${personalInfo.name || 'N/A'}</p>
            <p><strong>Date de naissance:</strong> ${personalInfo.dob || 'N/A'}</p>
            <p><strong>Téléphone:</strong> ${personalInfo.phone || 'N/A'}</p>
            <p><strong>Adresse:</strong> ${personalInfo.address || 'N/A'}</p>
        `;
    }

    // Display medical history
    if (medicalHistory.length > 0) {
        medicalHistoryDiv.innerHTML = medicalHistory.map(entry => `
            <div class="message-item">
                <div class="message-header">${entry.date} - ${entry.procedure}</div>
                <div class="message-content">${entry.notes}</div>
            </div>
        `).join('');
    }

    // Display allergies and medications
    if (allergiesMedications.length > 0) {
        allergiesMedicationsDiv.innerHTML = allergiesMedications.map(item => `
            <div class="message-item">
                <div class="message-header">${item.type}: ${item.name}</div>
                <div class="message-content">${item.details}</div>
            </div>
        `).join('');
    }
});
