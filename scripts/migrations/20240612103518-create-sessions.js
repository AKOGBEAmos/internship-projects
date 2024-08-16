'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      access_token: {
        type: Sequelize.STRING(1024)
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      exp_token_date: {
        type: Sequelize.DATE
      },
      ip_addr: {
        type: Sequelize.STRING
      },
      user_agent: {
        type: Sequelize.STRING
      },
      last_connexion_hour: {
        type: Sequelize.STRING
      },
      session_timeout: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};