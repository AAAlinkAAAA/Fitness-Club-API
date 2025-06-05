// src/migrations/migr_users.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('users', {
        user_id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('client', 'trainer', 'admin'),
          allowNull: false,
          defaultValue: 'client'
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
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
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('users');
    }
  };