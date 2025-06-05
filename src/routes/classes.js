// src/public/js/classes.js
document.addEventListener('DOMContentLoaded', async () => {
  const schedulesList = document.getElementById('schedulesList');
  const errorMessage = document.getElementById('errorMessage');
  const logoutButton = document.getElementById('logout');
  const calendar = document.getElementById('calendar');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  let schedules = [];
  try {
    const response = await fetch('/api/schedules');
    if (!response.ok) throw new Error('Failed to fetch schedules');
    schedules = await response.json();
  } catch (error) {
    errorMessage.textContent = `Error: ${error.message}`;
    errorMessage.classList.remove('hidden');
    return;
  }

  // Get unique dates with classes for calendar
  const classDates = [...new Set(schedules.map(s => new Date(s.date).toISOString().split('T')[0]))];

  // Initialize Flatpickr calendar
  flatpickr(calendar, {
    dateFormat: 'Y-m-d',
    minDate: '2025-06-01',
    maxDate: '2025-06-30',
    enable: classDates,
    onChange: async (selectedDates) => {
      if (selectedDates.length === 0) return;
      const selectedDate = selectedDates[0].toISOString().split('T')[0];
      await loadSchedules(selectedDate);
    }
  });

  // Load schedules for the earliest available date by default
  if (classDates.length > 0) {
    await loadSchedules(classDates[0]);
  } else {
    schedulesList.innerHTML = '<p class="text-white">No classes available.</p>';
  }

  async function loadSchedules(date) {
    try {
      const filteredSchedules = schedules.filter(s => 
        new Date(s.date).toISOString().split('T')[0] === date
      );
      if (filteredSchedules.length === 0) {
        schedulesList.innerHTML = '<p class="text-white">No classes available for this date.</p>';
        return;
      }
      schedulesList.innerHTML = filteredSchedules.map(s => `
        <div class="bg-white p-6 rounded-lg shadow-lg text-gray-700">
          <h3 class="text-xl font-bold">${s.class.name}</h3>
          <p>Date: ${new Date(s.date).toLocaleString()}</p>
          <p>Trainer: ${s.trainer.name}</p>
          <button onclick="bookSchedule('${s.id}', '${user.id}')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Book</button>
        </div>
      `).join('');
    } catch (error) {
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.classList.remove('hidden');
    }
  }

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});

async function bookSchedule(scheduleId, userId) {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, scheduleId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to book');
    }
    window.location.href = '/bookings.html';
  } catch (error) {
    document.getElementById('errorMessage').textContent = `Error: ${error.message}`;
    document.getElementById('errorMessage').classList.remove('hidden');
  }
}