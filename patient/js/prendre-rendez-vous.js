document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('booking-form');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const submitBtn = document.getElementById('submit-btn');
  const careTypeSelect = document.getElementById('care-type');
  const customCareTypeInput = document.getElementById('custom-care-type');
  const doctorSelect = document.getElementById('doctor');

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  // Load doctors
  loadDoctors();

  // Available times
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  function loadDoctors() {
    const doctors = dentalDataManager.getAll('users').filter(u => u.role !== 'Patient');
    doctorSelect.innerHTML = '<option value="">Sélectionner</option>';
    doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.id;
      option.textContent = `${doctor.firstName} ${doctor.lastName}`;
      doctorSelect.appendChild(option);
    });
  }

  function updateTimes() {
    const selectedDate = dateInput.value;
    const appointments = JSON.parse(localStorage.getItem('dental_appointments') || '[]');
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

  careTypeSelect.addEventListener('change', function() {
    if (careTypeSelect.value === 'Autre') {
      customCareTypeInput.style.display = 'block';
      customCareTypeInput.required = true;
    } else {
      customCareTypeInput.style.display = 'none';
      customCareTypeInput.required = false;
      customCareTypeInput.value = '';
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    let careType = formData.get('care-type');
    if (careType === 'Autre') {
      careType = customCareTypeInput.value.trim();
      if (!careType) {
        alert('Veuillez spécifier le type de soin.');
        return;
      }
    }
    const doctorId = formData.get('doctor');
    const doctor = dentalDataManager.read('users', doctorId);
    const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Médecin inconnu';
    const appointment = {
      id: Date.now(),
      treatment: careType,
      doctor: doctorName,
      date: formData.get('date'),
      time: formData.get('time'),
      status: 'En attente',
      mode: 'Via espace patient'
    };
    const appointments = JSON.parse(localStorage.getItem('dental_appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('dental_appointments', JSON.stringify(appointments));
    alert('Rendez-vous réservé avec succès. Statut: En attente.');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Réservé';
  });
});
