'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // species
    await queryInterface.changeColumn('species', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });

    // gender_types
    await queryInterface.changeColumn('gender_types', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });

    // sizes
    await queryInterface.changeColumn('sizes', 'name', {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    });

    // animal_statuses
    await queryInterface.changeColumn('animal_statuses', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });

    // request_statuses
    await queryInterface.changeColumn('request_statuses', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });

    // comment_statuses
    await queryInterface.changeColumn('comment_statuses', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });

    // roles
    await queryInterface.changeColumn('roles', 'name', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('roles', 'description', {
      type: Sequelize.TEXT,
    });

    // role_privileges
    await queryInterface.removeConstraint('role_privileges', 'role_privileges_ibfk_1');
    await queryInterface.addConstraint('role_privileges', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'role_privileges_ibfk_1',
      references: { table: 'roles', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('role_privileges', 'can_post_animals', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_submit_adoption_requests', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_moderate_comments', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_approve_animals', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_view_reports', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_comment', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_share_animals', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('role_privileges', 'can_view_public_listings', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });

    // users
    await queryInterface.changeColumn('users', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(20),
    });
    await queryInterface.changeColumn('users', 'city', {
      type: Sequelize.STRING(100),
    });
    await queryInterface.removeConstraint('users', 'users_ibfk_1');
    await queryInterface.addConstraint('users', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'users_ibfk_1',
      references: { table: 'roles', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('users', 'is_active', {
      type: Sequelize.TINYINT,
      defaultValue: 1,
    });
    await queryInterface.changeColumn('users', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('users', 'updated_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addIndex('users', ['role_id'], { name: 'users_role_id' });

    // shelters
    await queryInterface.changeColumn('shelters', 'name', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn('shelters', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn('shelters', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('shelters', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: false,
    });
    await queryInterface.changeColumn('shelters', 'city', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn('shelters', 'address', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('shelters', 'is_verified', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('shelters', 'is_active', {
      type: Sequelize.TINYINT,
      defaultValue: 1,
    });
    await queryInterface.changeColumn('shelters', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('shelters', 'updated_at', {
      type: Sequelize.DATE,
    });

    // animals
    await queryInterface.changeColumn('animals', 'name', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_1');
    await queryInterface.addConstraint('animals', {
      fields: ['species_id'],
      type: 'foreign key',
      name: 'animals_ibfk_1',
      references: { table: 'species', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animals', 'breed', {
      type: Sequelize.STRING(100),
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_2');
    await queryInterface.addConstraint('animals', {
      fields: ['gender_id'],
      type: 'foreign key',
      name: 'animals_ibfk_2',
      references: { table: 'gender_types', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animals', 'age_months', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_3');
    await queryInterface.addConstraint('animals', {
      fields: ['size_id'],
      type: 'foreign key',
      name: 'animals_ibfk_3',
      references: { table: 'sizes', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animals', 'description', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('animals', 'image_url', {
      type: Sequelize.STRING(255),
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_4');
    await queryInterface.addConstraint('animals', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'animals_ibfk_4',
      references: { table: 'animal_statuses', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_5');
    await queryInterface.addConstraint('animals', {
      fields: ['shelter_id'],
      type: 'foreign key',
      name: 'animals_ibfk_5',
      references: { table: 'shelters', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_6');
    await queryInterface.addConstraint('animals', {
      fields: ['approved_by_user_id'],
      type: 'foreign key',
      name: 'animals_ibfk_6',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animals', 'approved_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('animals', 'rejection_reason', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('animals', 'view_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('animals', 'share_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('animals', 'is_neutered', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('animals', 'is_house_trained', {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('animals', 'vaccination_status', {
      type: Sequelize.STRING(50),
      defaultValue: 'Unknown',
    });
    await queryInterface.changeColumn('animals', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('animals', 'updated_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addIndex('animals', ['species_id'], { name: 'animals_species_id' });
    await queryInterface.addIndex('animals', ['gender_id'], { name: 'animals_gender_id' });
    await queryInterface.addIndex('animals', ['size_id'], { name: 'animals_size_id' });
    await queryInterface.addIndex('animals', ['status_id'], { name: 'animals_status_id' });
    await queryInterface.addIndex('animals', ['shelter_id'], { name: 'animals_shelter_id' });
    await queryInterface.addIndex('animals', ['approved_by_user_id'], { name: 'animals_approved_by_user_id' });
    await queryInterface.addIndex('animals', ['is_neutered'], { name: 'animals_is_neutered' });

    // animal_medical_events
    await queryInterface.removeConstraint('animal_medical_events', 'animal_medical_events_ibfk_1');
    await queryInterface.addConstraint('animal_medical_events', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'animal_medical_events_ibfk_1',
      references: { table: 'animals', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animal_medical_events', 'event_type', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.changeColumn('animal_medical_events', 'event_date', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('animal_medical_events', 'description', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('animal_medical_events', 'needs', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('animal_medical_events', 'limitations', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('animal_medical_events', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('animal_medical_events', 'updated_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addIndex('animal_medical_events', ['animal_id'], { name: 'animal_medical_events_animal_id' });

    // adoption_requests
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_1');
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_4');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_1',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_2');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_2',
      references: { table: 'animals', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_3');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_3',
      references: { table: 'request_statuses', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['reviewed_by_user_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_4',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('adoption_requests', 'message', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('adoption_requests', 'admin_notes', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('adoption_requests', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('adoption_requests', 'updated_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addIndex('adoption_requests', ['user_id'], { name: 'adoption_requests_user_id' });
    await queryInterface.addIndex('adoption_requests', ['animal_id'], { name: 'adoption_requests_animal_id' });

    // animal_comments
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_1');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_1',
      references: { table: 'animals', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_2');
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_5');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_2',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_3');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_3',
      references: { table: 'comment_statuses', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_4');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['parent_comment_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_4',
      references: { table: 'animal_comments', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('animal_comments', {
      fields: ['moderated_by_user_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_5',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animal_comments', 'comment_text', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn('animal_comments', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('animal_comments', 'updated_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addIndex('animal_comments', ['animal_id'], { name: 'animal_comments_animal_id' });

    // animal_shares
    await queryInterface.removeConstraint('animal_shares', 'animal_shares_ibfk_1');
    await queryInterface.addConstraint('animal_shares', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'animal_shares_ibfk_1',
      references: { table: 'animals', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.removeConstraint('animal_shares', 'animal_shares_ibfk_2');
    await queryInterface.addConstraint('animal_shares', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'animal_shares_ibfk_2',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('animal_shares', 'share_platform', {
      type: Sequelize.STRING(50),
    });
    await queryInterface.changeColumn('animal_shares', 'shared_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('animal_shares', 'ip_address', {
      type: Sequelize.STRING(45),
    });
    await queryInterface.addIndex('animal_shares', ['animal_id'], { name: 'animal_shares_animal_id' });

    // moderation_queue
    await queryInterface.changeColumn('moderation_queue', 'item_type', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.changeColumn('moderation_queue', 'item_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });
    await queryInterface.removeConstraint('moderation_queue', 'moderation_queue_ibfk_1');
    await queryInterface.addConstraint('moderation_queue', {
      fields: ['submitted_by_id'],
      type: 'foreign key',
      name: 'moderation_queue_ibfk_1',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('moderation_queue', 'status', {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
    await queryInterface.removeConstraint('moderation_queue', 'moderation_queue_ibfk_2');
    await queryInterface.addConstraint('moderation_queue', {
      fields: ['assigned_user_id'],
      type: 'foreign key',
      name: 'moderation_queue_ibfk_2',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.changeColumn('moderation_queue', 'reviewed_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn('moderation_queue', 'action_taken', {
      type: Sequelize.STRING(100),
    });
    await queryInterface.changeColumn('moderation_queue', 'admin_notes', {
      type: Sequelize.TEXT,
    });
    await queryInterface.changeColumn('moderation_queue', 'created_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addIndex('moderation_queue', ['item_type', 'item_id'], { name: 'moderation_queue_item_type_item_id' });
  },

  async down(queryInterface, Sequelize) {
    // moderation_queue
    await queryInterface.removeIndex('moderation_queue', 'moderation_queue_item_type_item_id');
    await queryInterface.changeColumn('moderation_queue', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('moderation_queue', 'admin_notes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('moderation_queue', 'action_taken', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.changeColumn('moderation_queue', 'reviewed_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.removeConstraint('moderation_queue', 'moderation_queue_ibfk_2');
    await queryInterface.addConstraint('moderation_queue', {
      fields: ['assigned_user_id'],
      type: 'foreign key',
      name: 'moderation_queue_ibfk_2',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.changeColumn('moderation_queue', 'status', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.removeConstraint('moderation_queue', 'moderation_queue_ibfk_1');
    await queryInterface.addConstraint('moderation_queue', {
      fields: ['submitted_by_id'],
      type: 'foreign key',
      name: 'moderation_queue_ibfk_1',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.changeColumn('moderation_queue', 'item_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('moderation_queue', 'item_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // animal_shares
    await queryInterface.removeIndex('animal_shares', 'animal_shares_animal_id');
    await queryInterface.changeColumn('animal_shares', 'ip_address', {
      type: Sequelize.STRING(45),
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_shares', 'shared_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_shares', 'share_platform', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.removeConstraint('animal_shares', 'animal_shares_ibfk_2');
    await queryInterface.addConstraint('animal_shares', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'animal_shares_ibfk_2',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.removeConstraint('animal_shares', 'animal_shares_ibfk_1');
    await queryInterface.addConstraint('animal_shares', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'animal_shares_ibfk_1',
      references: { table: 'animals', field: 'id' },
    });

    // animal_comments
    await queryInterface.removeIndex('animal_comments', 'animal_comments_animal_id');
    await queryInterface.changeColumn('animal_comments', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_comments', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_comments', 'comment_text', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_5');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['moderated_by_user_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_5',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_4');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['parent_comment_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_4',
      references: { table: 'animal_comments', field: 'id' },
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_3');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_3',
      references: { table: 'comment_statuses', field: 'id' },
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_2');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_2',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.removeConstraint('animal_comments', 'animal_comments_ibfk_1');
    await queryInterface.addConstraint('animal_comments', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'animal_comments_ibfk_1',
      references: { table: 'animals', field: 'id' },
    });

    // adoption_requests
    await queryInterface.removeIndex('adoption_requests', 'adoption_requests_animal_id');
    await queryInterface.removeIndex('adoption_requests', 'adoption_requests_user_id');
    await queryInterface.changeColumn('adoption_requests', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('adoption_requests', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('adoption_requests', 'admin_notes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('adoption_requests', 'message', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_4');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['reviewed_by_user_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_4',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_3');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_3',
      references: { table: 'request_statuses', field: 'id' },
    });
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_2');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_2',
      references: { table: 'animals', field: 'id' },
    });
    await queryInterface.removeConstraint('adoption_requests', 'adoption_requests_ibfk_1');
    await queryInterface.addConstraint('adoption_requests', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'adoption_requests_ibfk_1',
      references: { table: 'users', field: 'id' },
    });

    // animal_medical_events
    await queryInterface.removeIndex('animal_medical_events', 'animal_medical_events_animal_id');
    await queryInterface.changeColumn('animal_medical_events', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_medical_events', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_medical_events', 'limitations', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_medical_events', 'needs', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_medical_events', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_medical_events', 'event_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animal_medical_events', 'event_type', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.removeConstraint('animal_medical_events', 'animal_medical_events_ibfk_1');
    await queryInterface.addConstraint('animal_medical_events', {
      fields: ['animal_id'],
      type: 'foreign key',
      name: 'animal_medical_events_ibfk_1',
      references: { table: 'animals', field: 'id' },
    });

    // animals
    await queryInterface.removeIndex('animals', 'animals_is_neutered');
    await queryInterface.removeIndex('animals', 'animals_approved_by_user_id');
    await queryInterface.removeIndex('animals', 'animals_shelter_id');
    await queryInterface.removeIndex('animals', 'animals_status_id');
    await queryInterface.removeIndex('animals', 'animals_size_id');
    await queryInterface.removeIndex('animals', 'animals_gender_id');
    await queryInterface.removeIndex('animals', 'animals_species_id');
    await queryInterface.changeColumn('animals', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'vaccination_status', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'is_house_trained', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'is_neutered', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'share_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'view_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'rejection_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_6');
    await queryInterface.addConstraint('animals', {
      fields: ['approved_by_user_id'],
      type: 'foreign key',
      name: 'animals_ibfk_6',
      references: { table: 'users', field: 'id' },
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_5');
    await queryInterface.addConstraint('animals', {
      fields: ['shelter_id'],
      type: 'foreign key',
      name: 'animals_ibfk_5',
      references: { table: 'shelters', field: 'id' },
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_4');
    await queryInterface.addConstraint('animals', {
      fields: ['status_id'],
      type: 'foreign key',
      name: 'animals_ibfk_4',
      references: { table: 'animal_statuses', field: 'id' },
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_3');
    await queryInterface.addConstraint('animals', {
      fields: ['size_id'],
      type: 'foreign key',
      name: 'animals_ibfk_3',
      references: { table: 'sizes', field: 'id' },
    });
    await queryInterface.changeColumn('animals', 'image_url', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('animals', 'age_months', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_2');
    await queryInterface.addConstraint('animals', {
      fields: ['gender_id'],
      type: 'foreign key',
      name: 'animals_ibfk_2',
      references: { table: 'gender_types', field: 'id' },
    });
    await queryInterface.changeColumn('animals', 'breed', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.removeConstraint('animals', 'animals_ibfk_1');
    await queryInterface.addConstraint('animals', {
      fields: ['species_id'],
      type: 'foreign key',
      name: 'animals_ibfk_1',
      references: { table: 'species', field: 'id' },
    });
    await queryInterface.changeColumn('animals', 'name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // shelters
    await queryInterface.changeColumn('shelters', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'is_active', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'is_verified', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'address', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'city', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('shelters', 'name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // users
    await queryInterface.removeIndex('users', 'users_role_id');
    await queryInterface.changeColumn('users', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'created_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'is_active', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.removeConstraint('users', 'users_ibfk_1');
    await queryInterface.addConstraint('users', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'users_ibfk_1',
      references: { table: 'roles', field: 'id' },
    });
    await queryInterface.changeColumn('users', 'city', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    // role_privileges
    await queryInterface.changeColumn('role_privileges', 'can_view_public_listings', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_share_animals', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_comment', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_view_reports', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_approve_animals', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_moderate_comments', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_submit_adoption_requests', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.changeColumn('role_privileges', 'can_post_animals', {
      type: Sequelize.TINYINT,
      allowNull: true,
    });
    await queryInterface.removeConstraint('role_privileges', 'role_privileges_ibfk_1');
    await queryInterface.addConstraint('role_privileges', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'role_privileges_ibfk_1',
      references: { table: 'roles', field: 'id' },
    });

    // roles
    await queryInterface.changeColumn('roles', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('roles', 'name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // comment_statuses
    await queryInterface.changeColumn('comment_statuses', 'name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // request_statuses
    await queryInterface.changeColumn('request_statuses', 'name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // animal_statuses
    await queryInterface.changeColumn('animal_statuses', 'name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // sizes
    await queryInterface.changeColumn('sizes', 'name', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    // gender_types
    await queryInterface.changeColumn('gender_types', 'name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // species
    await queryInterface.changeColumn('species', 'name', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  }
};