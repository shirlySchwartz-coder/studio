module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      { name: 'admin', description: 'Full access' },
      { name: 'shelter', description: 'Post animals' },
      { name: 'user', description: 'Adopt and comment' },
      { name: 'guest', description: 'View only' },
    ]);
   /*  // Seed privileges (after roles)
    await queryInterface.bulkInsert('role_privileges', [
      { role_id: 1, can_post_animals: 1, can_submit_adoption_requests: 1, can_moderate_comments: 1, can_approve_animals: 1, can_view_reports: 1, can_comment: 1, can_share_animals: 1, can_view_public_listings: 1, createdAt: new Date(), updatedAt: new Date() },
      // Add for other roles...
    ]); */
    // Seed lookups
    await queryInterface.bulkInsert('species', [{ name: 'Dog' }, { name: 'Cat' }]);
    await queryInterface.bulkInsert('gender_types', [{ name: 'Male' }, { name: 'Female' }]);
    await queryInterface.bulkInsert('sizes', [{ name: 'Small' }, { name: 'Medium' }]);
    await queryInterface.bulkInsert('animal_statuses', [{ name: 'Available' }, { name: 'Adopted' }]);
    await queryInterface.bulkInsert('request_statuses', [{ name: 'Pending' }, { name: 'Approved' }]);
    await queryInterface.bulkInsert('comment_statuses', [{ name: 'Active' }, { name: 'Hidden' }]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
    // Delete others...
  },
};