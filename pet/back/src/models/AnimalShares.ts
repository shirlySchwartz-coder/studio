import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class AnimalShares extends Model {
    public id!: number;
    public animal_id!: number;
    public user_id!: number;
    public share_platform?: string;
    public shared_at!: Date;
    public ip_address?: string;
  }

  AnimalShares.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    animal_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    share_platform: DataTypes.STRING(50),
    shared_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    ip_address: DataTypes.STRING(45),
  }, {
    sequelize,
    tableName: 'animal_shares',
    timestamps: false,
    indexes: [
      { fields: ['animal_id'] },
    ],
  });

  return AnimalShares;
};