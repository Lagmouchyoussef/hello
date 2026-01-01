document.addEventListener('DOMContentLoaded', function() {
    const prothesesListDiv = document.getElementById('protheses-list');

    // Load protheses from localStorage
    const protheses = JSON.parse(localStorage.getItem('patientProtheses')) || [];

    // Display protheses
    if (protheses.length > 0) {
        prothesesListDiv.innerHTML = protheses.map(prothese => `
            <div class="message-item">
                <div class="message-header">${prothese.name} - ${prothese.type}</div>
                <div class="message-content">Date d'installation: ${prothese.installDate} | Statut: ${prothese.status}</div>
                <div class="message-actions">
                    <button class="btn btn-primary" onclick="viewProthese('${prothese.id}')">Voir détails</button>
                </div>
            </div>
        `).join('');
    }
});

// Placeholder function
function viewProthese(id) {
    alert('Fonction de visualisation pour la prothèse ' + id);
}
