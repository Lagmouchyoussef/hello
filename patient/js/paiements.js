document.addEventListener('DOMContentLoaded', function() {
    const paymentsListDiv = document.getElementById('payments-list');

    // Load payments from localStorage
    const payments = JSON.parse(localStorage.getItem('patientPayments')) || [];

    // Display payments
    if (payments.length > 0) {
        paymentsListDiv.innerHTML = payments.map(payment => `
            <div class="message-item">
                <div class="message-header">${payment.service} - ${payment.amount} DH</div>
                <div class="message-content">Date: ${payment.date} | Statut: ${payment.status}</div>
                <div class="message-actions">
                    <button class="btn btn-primary" onclick="viewReceipt('${payment.id}')">Voir reçu</button>
                </div>
            </div>
        `).join('');
    }
});

// Placeholder function
function viewReceipt(id) {
    alert('Fonction de visualisation du reçu pour le paiement ' + id);
}
