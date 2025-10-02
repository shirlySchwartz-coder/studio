import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Roles extends Model {
    public id!: number;
    public name!: string;
    public description?: string;
  }

  Roles.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: DataTypes.TEXT,
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  });

  return Roles;
};