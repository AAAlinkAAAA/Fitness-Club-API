// src/public/js/payment.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('payment.js загружен');
  const paymentForm = document.getElementById('paymentForm');
  const errorMessage = document.getElementById('errorMessage');
  const logoutButton = document.getElementById('logout');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log('Пользователь не найден, перенаправление на login');
    window.location.href = '/login.html';
    return;
  }

  if (!paymentForm) {
    console.error('paymentForm не найден в DOM');
    errorMessage.textContent = 'Форма не найдена. Обновите страницу.';
    errorMessage.classList.remove('hidden');
    return;
  }

  if (!logoutButton) {
    console.error('Кнопка logout не найдена в payment.html');
    return;
  }

  console.log('Пользователь:', user.id);

  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Форма оплаты отправлена');
    const type = document.getElementById('type').value;
    const price = type === 'basic' ? 29.99 : 49.99;
    errorMessage.classList.add('hidden');

    try {
      console.log('Отправка запроса на подписку:', { userId: user.id, type, price });
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type, price })
      });
      const responseData = await response.json();
      console.log('Ответ по подписке:', responseData);
      if (!response.ok) {
        throw new Error(responseData.message || 'Не удалось создать подписку');
      }
      alert('Подписка успешно создана!');
      window.location.href = '/subscriptions.html';
    } catch (error) {
      console.error('Ошибка оплаты:', error);
      errorMessage.textContent = `Ошибка: ${error.message}`;
      errorMessage.classList.remove('hidden');
    }
  });

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Кнопка logout нажата');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});