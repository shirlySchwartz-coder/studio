import { DataTypes, Model, Sequelize } from "sequelize";
export default (sequelize: Sequelize) => { 
 class AnimalStatuses extends Model {
    public id!: number;
    public name!: string
 }
    AnimalStatuses.init({
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
        tableName:'animal_statuses',
        timestamps: false,
    
    });
    return AnimalStatuses;
}