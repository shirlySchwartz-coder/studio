import { DataTypes, Model, Sequelize } from "sequelize";
export default (sequelize: Sequelize) => { 
 class RequestStatuses extends Model {
    public id!: number;
    public name!: string
 }
    RequestStatuses.init({
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
        tableName:'request_statuses',
        timestamps: false,
    
    });
    return RequestStatuses;
}