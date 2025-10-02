import { DataTypes, Model, Sequelize } from "sequelize";
export default (sequelize: Sequelize) => { 
 class GenderTypes extends Model {
    public id!: number;
    public name!: string
 }
    GenderTypes.init({
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
        tableName:'gender_types',
        timestamps: false,
    
    });
    return GenderTypes;
}