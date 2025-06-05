const sequelize = require('./config/database');

async function resetDatabase() {
    try {
        console.log('Начинаем полный сброс базы данных...');
        
        // Удаляем все таблицы
        await sequelize.query('DROP SCHEMA public CASCADE;');
        await sequelize.query('CREATE SCHEMA public;');
        
        console.log('База данных полностью очищена');
    } catch (error) {
        console.error('Ошибка при сбросе базы данных:', error);
    }
}

resetDatabase(); 