import { DataTypes, Model, Sequelize } from "sequelize";
export default (sequelize: Sequelize) => { 
 class CommentStatuses extends Model {
    public id!: number;
    public name!: string
 }
    CommentStatuses.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        tableName:'comment_statuses',
        timestamps: false,
    
    });
    return CommentStatuses;
}