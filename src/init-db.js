const { User } = require('./models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
    try {
        console.log('Начинаем инициализацию базы данных...');

        // Тестовые пользователи
        const testUsers = [
            {
                email: 'client@fitnesscenter.com',
                password: 'password123',
                first_name: 'Jane',
                last_name: 'Smith',
                role: 'client'
            },
            {
                email: 'trainer@fitnesscenter.com',
                password: 'password123',
                first_name: 'John',
                last_name: 'Doe',
                role: 'trainer'
            },
            {
                email: 'admin@fitnesscenter.com',
                password: 'password123',
                first_name: 'Admin',
                last_name: 'User',
                role: 'admin'
            }
        ];

        // Создаем пользователей
        for (const userData of testUsers) {
            try {
                // Проверяем, существует ли пользователь
                const existingUser = await User.findOne({ where: { email: userData.email } });
                if (existingUser) {
                    console.log('Пользователь уже существует:', userData.email);
                    continue;
                }

                // Хешируем пароль и сохраняем
                const password_hash = await bcrypt.hash(userData.password, 10);
                const { password, ...userFields } = userData;
                await User.create({ ...userFields, password_hash });
                console.log('Создан пользователь:', userData.email);
            } catch (error) {
                console.error('Ошибка при создании пользователя:', error);
            }
        }

        console.log('Инициализация базы данных завершена');
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
    }
}

// Запускаем инициализацию
initDatabase(); 