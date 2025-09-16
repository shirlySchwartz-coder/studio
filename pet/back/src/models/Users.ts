import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Users extends Model {
    public id!: number;
    public full_name!: string;
    public email!: string;
    public password_hash!: string;
    public phone?: string;
    public city?: string;
    public role_id!: number;
    public is_active!: number;
    public created_at!: Date;
    public updated_at!: Date;
  }

  Users.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    phone: DataTypes.STRING(20),
    city: DataTypes.STRING(100),
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {fields: ['role_id']},
      
    ]
  });

  return Users;
};