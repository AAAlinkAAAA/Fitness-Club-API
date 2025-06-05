// src/migrations/YYYYMMDDHHMMSS-add-fields-to-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('client', 'trainer', 'admin'),
      allowNull: false,
      defaultValue: 'client'
    });
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'first_name');
    await queryInterface.removeColumn('users', 'last_name');
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'phone');
  }
};