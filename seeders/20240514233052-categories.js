'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Food',
        icon: '🍔',
        color: '#FFA500',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Transport',
        icon: '🚕',
        color: '#FF4500',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Entertainment',
        icon: '🎮',
        color: '#FFD700',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Health',
        icon: '💊',
        color: '#FF6347',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Education',
        icon: '📚',
        color: '#FF69B4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shopping',
        icon: '🛍️',
        color: '#FF1493',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bills',
        icon: '💸',
        color: '#FF0000',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Others',
        icon: '🎁',
        color: '#FF69B4',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
