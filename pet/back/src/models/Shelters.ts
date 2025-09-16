import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Shelters extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password_hash!: string;
    public phone!: string;
    public city!: string;
    public address!: string;
    public is_verified!: number;
    public is_active!: number;
    public created_at!: Date;
    public updated_at!: Date;
  }
    Shelters.init({         
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    is_verified: { type: DataTypes.TINYINT, defaultValue: 0 },
    is_active: { type: DataTypes.TINYINT, defaultValue: 1 },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'shelters',
    timestamps: false,
  });
    return Shelters;
}