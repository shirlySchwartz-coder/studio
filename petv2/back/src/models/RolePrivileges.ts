import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class RolePrivileges extends Model {
    public id!: number;
    public role_id!: number;
    public can_post_animals!: number;
    public can_submit_adoption_requests!: number;
    public can_moderate_comments!: number;
    public can_approve_animals!: number;
    public can_view_reports!: number;
    public can_comment!: number;
    public can_share_animals!: number;
    public can_view_public_listings!: number;
  }

  RolePrivileges.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    can_post_animals: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_submit_adoption_requests: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_moderate_comments: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_approve_animals: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_view_reports: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_comment: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_share_animals: { type: DataTypes.TINYINT, defaultValue: 0 },
    can_view_public_listings: { type: DataTypes.TINYINT, defaultValue: 0 },
  }, {
    sequelize,
    tableName: 'role_privileges',
    timestamps: false,
  });

  return RolePrivileges;
};