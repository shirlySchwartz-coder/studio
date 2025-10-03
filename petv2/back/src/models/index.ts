import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/database';
import Species from './Species';
import GenderTypes from './GenderTypes';
import Sizes from './Sizes';
import AnimalStatuses from './AnimalStatuses';
import RequestStatuses from './RequestStatuses';
import CommentStatuses from './CommentStatuses';
import Roles from './Roles';
import RolePrivileges from './RolePrivileges';
import Users from './Users';
import Shelters from './Shelters';
import Animals from './Animals';
import AnimalMedicalEvents from './AnimalMedicalEvents';
import AdoptionRequests from './AdoptionRequests';
import AnimalComments from './AnimalComments';
import AnimalShares from './AnimalShares';
import ModerationQueue from './ModerationQueue';

const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = (config as any)[env];
const sequelize = new Sequelize(
   sequelizeConfig
);

const db: any = {
  Species: Species(sequelize),
  GenderTypes: GenderTypes(sequelize),
  Sizes: Sizes(sequelize),
  AnimalStatuses: AnimalStatuses(sequelize),
  RequestStatuses: RequestStatuses(sequelize),
  CommentStatuses: CommentStatuses(sequelize),
  Roles: Roles(sequelize),
  RolePrivileges: RolePrivileges(sequelize),
  Users: Users(sequelize),
  Shelters: Shelters(sequelize),
  Animals: Animals(sequelize),
  AnimalMedicalEvents: AnimalMedicalEvents(sequelize),
  AdoptionRequests: AdoptionRequests(sequelize),
  AnimalComments: AnimalComments(sequelize),
  AnimalShares: AnimalShares(sequelize),
  ModerationQueue: ModerationQueue(sequelize),
};

// Associations
db.Roles.hasOne(db.RolePrivileges, { foreignKey: 'role_id', onDelete: 'CASCADE' });
db.RolePrivileges.belongsTo(db.Roles, { foreignKey: 'role_id' });

db.Users.belongsTo(db.Roles, { foreignKey: 'role_id', onDelete: 'RESTRICT' });
db.Roles.hasMany(db.Users, { foreignKey: 'role_id' });

db.Shelters.hasMany(db.Animals, { foreignKey: 'shelter_id', onDelete: 'CASCADE' });
db.Animals.belongsTo(db.Shelters, { foreignKey: 'shelter_id' });

db.Animals.hasMany(db.AnimalMedicalEvents, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
db.AnimalMedicalEvents.belongsTo(db.Animals, { foreignKey: 'animal_id' });

db.Users.hasMany(db.Animals, { foreignKey: 'approved_by_user_id', onDelete: 'SET NULL' });
db.Animals.belongsTo(db.Users, { foreignKey: 'approved_by_user_id' });

db.Animals.belongsTo(db.Species, { foreignKey: 'species_id', onDelete: 'RESTRICT' });
db.Species.hasMany(db.Animals, { foreignKey: 'species_id' });

db.Animals.belongsTo(db.GenderTypes, { foreignKey: 'gender_id', onDelete: 'RESTRICT' });
db.GenderTypes.hasMany(db.Animals, { foreignKey: 'gender_id' });

db.Animals.belongsTo(db.Sizes, { foreignKey: 'size_id', onDelete: 'SET NULL' });
db.Sizes.hasMany(db.Animals, { foreignKey: 'size_id' });

db.Animals.belongsTo(db.AnimalStatuses, { foreignKey: 'status_id', onDelete: 'RESTRICT' });
db.AnimalStatuses.hasMany(db.Animals, { foreignKey: 'status_id' });

db.Users.hasMany(db.AdoptionRequests, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.AdoptionRequests.belongsTo(db.Users, { foreignKey: 'user_id' });
db.Animals.hasMany(db.AdoptionRequests, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
db.AdoptionRequests.belongsTo(db.Animals, { foreignKey: 'animal_id' });
db.AdoptionRequests.belongsTo(db.RequestStatuses, { foreignKey: 'status_id', onDelete: 'RESTRICT' });
db.Users.hasMany(db.AdoptionRequests, { as: 'ReviewedRequests', foreignKey: 'reviewed_by_user_id', onDelete: 'SET NULL' });
db.AdoptionRequests.belongsTo(db.Users, { as: 'Reviewer', foreignKey: 'reviewed_by_user_id' });

db.Animals.hasMany(db.AnimalComments, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
db.AnimalComments.belongsTo(db.Animals, { foreignKey: 'animal_id' });
db.Users.hasMany(db.AnimalComments, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.AnimalComments.belongsTo(db.Users, { foreignKey: 'user_id' });
db.AnimalComments.belongsTo(db.CommentStatuses, { foreignKey: 'status_id', onDelete: 'RESTRICT' });
db.AnimalComments.hasMany(db.AnimalComments, { as: 'Replies', foreignKey: 'parent_comment_id', onDelete: 'SET NULL' });
db.AnimalComments.belongsTo(db.AnimalComments, { as: 'Parent', foreignKey: 'parent_comment_id' });
db.Users.hasMany(db.AnimalComments, { as: 'ModeratedComments', foreignKey: 'moderated_by_user_id', onDelete: 'SET NULL' });
db.AnimalComments.belongsTo(db.Users, { as: 'Moderator', foreignKey: 'moderated_by_user_id' });

db.Animals.hasMany(db.AnimalShares, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
db.AnimalShares.belongsTo(db.Animals, { foreignKey: 'animal_id' });
db.Users.hasMany(db.AnimalShares, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.AnimalShares.belongsTo(db.Users, { foreignKey: 'user_id' });

db.Users.hasMany(db.ModerationQueue, { foreignKey: 'submitted_by_id', onDelete: 'CASCADE' });
db.ModerationQueue.belongsTo(db.Users, { foreignKey: 'submitted_by_id' });
db.Users.hasMany(db.ModerationQueue, { as: 'AssignedQueues', foreignKey: 'assigned_user_id', onDelete: 'SET NULL' });
db.ModerationQueue.belongsTo(db.Users, { as: 'Assignee', foreignKey: 'assigned_user_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;