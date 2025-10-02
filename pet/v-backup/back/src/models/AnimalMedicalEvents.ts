import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class AnimalMedicalEvents extends Model {
    public id!: number;
    public animal_id!: number;
    public event_type!: string;
    public event_date?: Date;
    public description?: string;
    public needs?: string;
    public limitations?: string;
    public created_at!: Date;
    public updated_at!: Date;
  }

  AnimalMedicalEvents.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    animal_id: { type: DataTypes.BIGINT, allowNull: false },
    event_type: { type: DataTypes.STRING(100), allowNull: false },
    event_date: DataTypes.DATE,
    description: DataTypes.TEXT,
    needs: DataTypes.TEXT,
    limitations: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'animal_medical_events',
    timestamps: false,
    indexes: [
      { fields: ['animal_id'] },
    ],
  });

  return AnimalMedicalEvents;
};