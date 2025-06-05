// src/public/js/classes.js
document.addEventListener('DOMContentLoaded', async () => {
  console.log('classes.js загружен');
  const schedulesList = document.getElementById('schedulesList');
  const errorMessage = document.getElementById('errorMessage');
  const logoutButton = document.getElementById('logout');
  const calendar = document.getElementById('calendar');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log('Пользователь не найден, перенаправление на login');
    window.location.href = '/login.html';
    return;
  }

  if (!logoutButton) {
    console.error('Кнопка logout не найдена в classes.html');
    return;
  }

  let schedules = [];
  try {
    const response = await fetch('/api/schedules');
    if (!response.ok) throw new Error('Не удалось загрузить расписание');
    schedules = await response.json();
  } catch (error) {
    errorMessage.textContent = `Ошибка: ${error.message}`;
    errorMessage.classList.remove('hidden');
    return;
  }

  const classDates = [...new Set(schedules.map(s => new Date(s.date).toISOString().split('T')[0]))];

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

  if (classDates.length > 0) {
    await loadSchedules(classDates[0]);
  } else {
    schedulesList.innerHTML = '<p class="text-white">Нет доступных занятий.</p>';
  }

  async function loadSchedules(date) {
    try {
      const filteredSchedules = schedules.filter(s => 
        new Date(s.date).toISOString().split('T')[0] === date
      );
      if (filteredSchedules.length === 0) {
        schedulesList.innerHTML = '<p class="text-white">Нет занятий на эту дату.</p>';
        return;
      }
      schedulesList.innerHTML = filteredSchedules.map(s => `
        <div class="bg-white p-6 rounded-lg shadow-lg text-gray-700">
          <h3 class="text-xl font-bold">${s.class.name}</h3>
          <p>Дата: ${new Date(s.date).toLocaleString()}</p>
          <p>Тренер: ${s.trainer.name}</p>
          <button onclick="bookSchedule('${s.id}', '${user.id}')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Забронировать</button>
        </div>
      `).join('');
    } catch (error) {
      errorMessage.textContent = `Ошибка: ${error.message}`;
      errorMessage.classList.remove('hidden');
    }
  }

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Кнопка logout нажата');
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
      throw new Error(errorData.message || 'Не удалось забронировать');
    }
    window.location.href = '/bookings.html';
  } catch (error) {
    document.getElementById('errorMessage').textContent = `Ошибка: ${error.message}`;
    document.getElementById('errorMessage').classList.remove('hidden');
  }
}