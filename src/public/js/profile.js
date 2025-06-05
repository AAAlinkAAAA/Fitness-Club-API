// src/public/js/profile.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('profile.js загружен');
  const profileInfo = document.getElementById('profileInfo');
  const errorMessage = document.getElementById('errorMessage');
  const logoutButton = document.getElementById('logout');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log('Пользователь не найден, перенаправление на login');
    window.location.href = '/login.html';
    return;
  }

  if (!logoutButton) {
    console.error('Кнопка logout не найдена в profile.html');
    return;
  }

  profileInfo.innerHTML = `
    <p><strong>Имя:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Роль:</strong> ${user.role}</p>
  `;

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Кнопка logout нажата');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});