import { DataTypes, Model, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  class AnimalComments extends Model {
    public id!: number;
    public animal_id!: number;
    public user_id!: number;
    public comment_text!: string;
    public status_id!: number;
    public parent_comment_id?: number;
    public moderated_by_user_id?: number;
    public created_at!: Date;
    public updated_at!: Date;
  }

  AnimalComments.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    animal_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    comment_text: { type: DataTypes.TEXT, allowNull: false },
    status_id: { type: DataTypes.INTEGER, allowNull: false },
    parent_comment_id: DataTypes.BIGINT,
    moderated_by_user_id: DataTypes.BIGINT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'animal_comments',
    timestamps: false,
    indexes: [
      { fields: ['animal_id'] },
    ],
  });

  return AnimalComments;
};