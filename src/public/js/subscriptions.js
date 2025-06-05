// src/public/js/subscriptions.js
document.addEventListener('DOMContentLoaded', async () => {
  console.log('subscriptions.js загружен');
  const subscriptionsList = document.getElementById('subscriptionsList');
  const newSubscriptionButton = document.getElementById('newSubscription');
  const errorMessage = document.getElementById('errorMessage');
  const logoutButton = document.getElementById('logout');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    console.log('Пользователь не найден, перенаправление на login');
    window.location.href = '/login.html';
    return;
  }

  if (!logoutButton) {
    console.error('Кнопка logout не найдена в subscriptions.html');
    return;
  }

  try {
    const response = await fetch(`/api/subscriptions?userId=${user.id}`);
    if (!response.ok) throw new Error('Не удалось загрузить подписки');
    const subscriptions = await response.json();
    if (subscriptions.length === 0) {
      subscriptionsList.innerHTML = '<p class="text-white">Нет подписок</p>';
    } else {
      subscriptionsList.innerHTML = subscriptions.map(s => `
        <div class="bg-white p-6 rounded-lg shadow-lg text-gray-700">
          <h3 class="text-xl font-bold">${s.type}</h3>
          <p>Цена: $${s.price}</p>
          <p>Начало: ${new Date(s.startDate).toLocaleDateString()}</p>
          <p>Конец: ${new Date(s.endDate).toLocaleDateString()}</p>
        </div>
      `).join('');
    }
  } catch (error) {
    errorMessage.textContent = `Ошибка: ${error.message}`;
    errorMessage.classList.remove('hidden');
  }

  newSubscriptionButton.addEventListener('click', () => {
    console.log('Кнопка новой подписки нажата');
    window.location.href = '/payment.html';
  });

  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Кнопка logout нажата');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  });
});