import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class AdoptionRequests extends Model {
    public id!: number;
    public user_id!: number;
    public animal_id!: number;
    public message?: string;
    public status_id!: number;
    public reviewed_by_user_id?: number;
    public admin_notes?: string;
    public created_at!: Date;
    public updated_at!: Date;
  }

  AdoptionRequests.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    animal_id: { type: DataTypes.BIGINT, allowNull: false },
    message: DataTypes.TEXT,
    status_id: { type: DataTypes.INTEGER, allowNull: false },
    reviewed_by_user_id: DataTypes.BIGINT,
    admin_notes: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'adoption_requests',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['animal_id'] },
    ],
  });

  return AdoptionRequests;
};