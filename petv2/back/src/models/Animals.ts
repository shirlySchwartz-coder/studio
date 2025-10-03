import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class Animals extends Model {
    public id!: number;
    public name!: string;
    public species_id!: number;
    public breed?: string;
    public gender_id!: number;
    public age_months?: number;
    public size_id?: number;
    public description?: string;
    public image_url?: string;
    public status_id!: number;
    public shelter_id!: number;
    public approved_by_user_id?: number;
    public approved_at?: Date;
    public rejection_reason?: string;
    public view_count!: number;
    public share_count!: number;
    public is_neutered!: number;
    public is_house_trained!: number;
    public vaccination_status!: string;
    public created_at!: Date;
    public updated_at!: Date;
  }

  Animals.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    species_id: { type: DataTypes.INTEGER, allowNull: false },
    breed: DataTypes.STRING(100),
    gender_id: { type: DataTypes.INTEGER, allowNull: false },
    age_months: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING(255),
    status_id: { type: DataTypes.INTEGER, allowNull: false },
    shelter_id: { type: DataTypes.BIGINT, allowNull: false },
    approved_by_user_id: DataTypes.BIGINT,
    approved_at: DataTypes.DATE,
    rejection_reason: DataTypes.TEXT,
    view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    share_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_neutered: { type: DataTypes.TINYINT, defaultValue: 0 },
    is_house_trained: { type: DataTypes.TINYINT, defaultValue: 0 },
    vaccination_status: { type: DataTypes.STRING(50), defaultValue: 'Unknown' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW},
  }, {
    sequelize,
    tableName: 'animals',
    timestamps: false,
    indexes: [
      { fields: ['species_id'] },
      { fields: ['gender_id'] },
      { fields: ['size_id'] },
      { fields: ['status_id'] },
      { fields: ['shelter_id'] },
      { fields: ['approved_by_user_id'] },
      { fields: ['is_neutered'] },
    ],
  });

  return Animals;
};