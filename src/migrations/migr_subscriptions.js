'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('subscriptions', {
            subscription_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            type: {
                type: Sequelize.ENUM('basic', 'premium', 'unlimited'),
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('active', 'expired', 'cancelled'),
                allowNull: false,
                defaultValue: 'active'
            },
            features: {
                type: Sequelize.JSON,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // Добавляем индексы
        await queryInterface.addIndex('subscriptions', ['user_id']);
        await queryInterface.addIndex('subscriptions', ['status']);
        await queryInterface.addIndex('subscriptions', ['end_date']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('subscriptions');
    }
};