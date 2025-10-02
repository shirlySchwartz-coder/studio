import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class ModerationQueue extends Model {
    public id!: number;
    public item_type!: string;
    public item_id!: number;
    public submitted_by_id!: number;
    public status!: string;
    public assigned_user_id?: number;
    public reviewed_at?: Date;
    public action_taken?: string;
    public admin_notes?: string;
    public created_at!: Date;
  }

  ModerationQueue.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    item_type: { type: DataTypes.STRING(50), allowNull: false },
    item_id: { type: DataTypes.BIGINT, allowNull: false },
    submitted_by_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false },
    assigned_user_id: DataTypes.BIGINT,
    reviewed_at: DataTypes.DATE,
    action_taken: DataTypes.STRING(100),
    admin_notes: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'moderation_queue',
    timestamps: false,
    indexes: [
      { fields: ['item_type', 'item_id'] },
    ],
  });

  return ModerationQueue;
};