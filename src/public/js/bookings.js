// src/public/js/bookings.js
document.addEventListener('DOMContentLoaded', async () => {
  console.log('bookings.js загружен');
  const bookingsList = document.getElementById('bookingsList');
  const errorMessage = document.getElementById('errorMessage');
  const logoutButton = document.getElementById('logout');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log('Пользователь не найден, перенаправление на login');
    window.location.href = '/login.html';
    return;
  }

  if (!logoutButton) {
    console.error('Кнопка logout не найдена в bookings.html');
    return;
  }

  try {
    const response = await fetch(`/api/bookings?userId=${user.id}`);
    if (!response.ok) throw new Error('Не удалось загрузить брони');
    const bookings = await response.json();
    if (bookings.length === 0) {
      bookingsList.innerHTML = '<p class="text-white">Нет бронирований</p>';
      return;
    }
    bookingsList.innerHTML = bookings.map(b => `
      <div class="bg-white p-6 rounded-lg shadow-lg text-gray-700">
        <h3 class="text-xl font-bold">${b.class.name}</h3>
        <p>Дата: ${new Date(b.schedule.date).toLocaleString()}</p>
        <p>Статус: ${b.status}</p>
      </div>
    `).join('');
  } catch (error) {
    errorMessage.textContent = `Ошибка: ${error.message}`;
    errorMessage.classList.remove('hidden');
  }

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Кнопка logout нажата');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});