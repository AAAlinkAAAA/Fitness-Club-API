// src/public/js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('dashboard.js загружен');
  const userName = document.getElementById('userName');
  const logoutButton = document.getElementById('logout');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log('Пользователь не найден, перенаправление на login');
    window.location.href = '/login.html';
    return;
  }

  userName.textContent = user.name;

  if (!logoutButton) {
    console.error('Кнопка logout не найдена в dashboard.html');
    return;
  }

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Кнопка logout нажата');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});