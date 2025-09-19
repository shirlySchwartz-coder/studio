'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('shelters', [
      {
        name: 'Happy Paws',
        email: 'shelter@adopt.com',
        password_hash: await bcrypt.hash('password123', 10),
        phone: '555-123-4567',
        city: 'Anytown',
        address: '123 Main St',
        is_verified: 1,
        is_active: 1,
      },
    ], { updateOnDuplicate: ['name', 'email', 'password_hash', 'phone', 'city', 'address', 'is_verified', 'is_active'] });
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('shelters', null, {});
  },
};