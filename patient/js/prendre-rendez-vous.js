document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('booking-form');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const submitBtn = document.getElementById('submit-btn');

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  // Available times
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  function updateTimes() {
    const selectedDate = dateInput.value;
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const booked = appointments.filter(a => a.date === selectedDate).map(a => a.time);
    timeSelect.innerHTML = '<option value="">Sélectionner</option>';
    availableTimes.forEach(time => {
      if (!booked.includes(time)) {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
      }
    });
  }

  dateInput.addEventListener('change', updateTimes);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const appointment = {
      id: Date.now(),
      type: formData.get('care-type'),
      doctor: formData.get('doctor'),
      date: formData.get('date'),
      time: formData.get('time'),
      status: 'En attente'
    };
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    alert('Rendez-vous réservé avec succès. Statut: En attente.');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Réservé';
  });
});
