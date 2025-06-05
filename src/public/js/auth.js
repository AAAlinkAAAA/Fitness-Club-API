// src/public/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('auth.js загружен');
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('errorMessage');

      errorMessage.classList.add('hidden');
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
          const data = await response.json();
          errorMessage.textContent = data.message || 'Ошибка входа';
          errorMessage.classList.remove('hidden');
          return;
        }
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard.html';
      } catch (error) {
        errorMessage.textContent = 'Ошибка сервера';
        errorMessage.classList.remove('hidden');
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('errorMessage');

      errorMessage.classList.add('hidden');
      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) {
          const data = await response.json();
          errorMessage.textContent = data.message || 'Ошибка регистрации';
          errorMessage.classList.remove('hidden');
          return;
        }
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard.html';
      } catch (error) {
        errorMessage.textContent = 'Ошибка сервера';
        errorMessage.classList.remove('hidden');
      }
    });
  }
});