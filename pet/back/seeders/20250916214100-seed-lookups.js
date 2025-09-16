'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'admin', description: 'Full access' },
      { id: 2, name: 'shelter', description: 'Post animals' },
      { id: 3, name: 'user', description: 'Adopt and comment' },
      { id: 4, name: 'guest', description: 'View only' },
    ], { updateOnDuplicate: ['name', 'description'] });

    await queryInterface.bulkInsert('role_privileges', [
      { role_id: 1, can_post_animals: 1, can_submit_adoption_requests: 1, can_moderate_comments: 1, can_approve_animals: 1, can_view_reports: 1, can_comment: 1, can_share_animals: 1, can_view_public_listings: 1 },
      { role_id: 2, can_post_animals: 1, can_submit_adoption_requests: 0, can_moderate_comments: 0, can_approve_animals: 0, can_view_reports: 0, can_comment: 1, can_share_animals: 1, can_view_public_listings: 1 },
      { role_id: 3, can_post_animals: 0, can_submit_adoption_requests: 1, can_moderate_comments: 0, can_approve_animals: 0, can_view_reports: 0, can_comment: 1, can_share_animals: 1, can_view_public_listings: 1 },
      { role_id: 4, can_post_animals: 0, can_submit_adoption_requests: 0, can_moderate_comments: 0, can_approve_animals: 0, can_view_reports: 0, can_comment: 0, can_share_animals: 0, can_view_public_listings: 1 },
    ], { updateOnDuplicate: ['can_post_animals', 'can_submit_adoption_requests', 'can_moderate_comments', 'can_approve_animals', 'can_view_reports', 'can_comment', 'can_share_animals', 'can_view_public_listings'] });

    await queryInterface.bulkInsert('species', [
      { id: 1, name: 'Dog' },
      { id: 2, name: 'Cat' },
    ], { updateOnDuplicate: ['name'] });

    await queryInterface.bulkInsert('gender_types', [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
    ], { updateOnDuplicate: ['name'] });

    await queryInterface.bulkInsert('sizes', [
      { id: 1, name: 'Small' },
      { id: 2, name: 'Medium' },
      { id: 3, name: 'Large' },
    ], { updateOnDuplicate: ['name'] });

    await queryInterface.bulkInsert('animal_statuses', [
      { id: 1, name: 'Available' },
      { id: 2, name: 'Adopted' },
      { id: 3, name: 'Pending' },
    ], { updateOnDuplicate: ['name'] });

    await queryInterface.bulkInsert('request_statuses', [
      { id: 1, name: 'Pending' },
      { id: 2, name: 'Approved' },
      { id: 3, name: 'Rejected' },
    ], { updateOnDuplicate: ['name'] });

    await queryInterface.bulkInsert('comment_statuses', [
      { id: 1, name: 'Active' },
      { id: 2, name: 'Hidden' },
      { id: 3, name: 'Pending' },
    ], { updateOnDuplicate: ['name'] });
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('comment_statuses', null, {});
    await queryInterface.bulkDelete('request_statuses', null, {});
    await queryInterface.bulkDelete('animal_statuses', null, {});
    await queryInterface.bulkDelete('sizes', null, {});
    await queryInterface.bulkDelete('gender_types', null, {});
    await queryInterface.bulkDelete('species', null, {});
    await queryInterface.bulkDelete('role_privileges', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  },
};