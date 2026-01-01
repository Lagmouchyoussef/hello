document.addEventListener('DOMContentLoaded', function() {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const now = new Date();

  // History
  const history = appointments.filter(a => new Date(a.date + ' ' + a.time) < now || a.status === 'Annulé').sort((a,b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
  function displayHistory(filtered = history) {
    const historyList = document.getElementById('history-list');
    if (filtered.length > 0) {
      historyList.innerHTML = filtered.map(a => `
        <div class="appointment-item">
          <div class="appointment-header">
            <strong>${a.type}</strong> - ${a.date} ${a.time}
          </div>
          <div>Docteur: ${a.doctor}</div>
          <div>Statut: ${a.status}</div>
        </div>
      `).join('');
    } else {
      historyList.innerHTML = '<p>Aucun historique.</p>';
    }
  }
  displayHistory();

  // Filters
  document.getElementById('filter-date').addEventListener('change', function() {
    const date = this.value;
    const filtered = history.filter(a => !date || a.date === date);
    displayHistory(filtered);
  });
  document.getElementById('filter-type').addEventListener('change', function() {
    const type = this.value;
    const filtered = history.filter(a => !type || a.type === type);
    displayHistory(filtered);
  });
});
