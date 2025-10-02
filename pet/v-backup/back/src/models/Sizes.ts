import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Sizes extends Model {
    public id!: number;
    public name!: string;
  }

  Sizes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    tableName: 'sizes',
    timestamps: false,
  });

  return Sizes;
};