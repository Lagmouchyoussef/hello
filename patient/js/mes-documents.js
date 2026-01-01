document.addEventListener('DOMContentLoaded', function() {
    const documentsListDiv = document.getElementById('documents-list');

    // Load documents from localStorage
    const documents = JSON.parse(localStorage.getItem('patientDocuments')) || [];

    // Display documents
    if (documents.length > 0) {
        documentsListDiv.innerHTML = documents.map(doc => `
            <div class="message-item">
                <div class="message-header">${doc.name}</div>
                <div class="message-content">Type: ${doc.type} | Date: ${doc.date}</div>
                <div class="message-actions">
                    <button class="btn btn-primary" onclick="viewDocument('${doc.id}')">Voir</button>
                    <button class="btn btn-success" onclick="downloadDocument('${doc.id}')">Télécharger</button>
                </div>
            </div>
        `).join('');
    }
});

// Placeholder functions
function viewDocument(id) {
    alert('Fonction de visualisation à implémenter pour le document ' + id);
}

function downloadDocument(id) {
    alert('Fonction de téléchargement à implémenter pour le document ' + id);
}
