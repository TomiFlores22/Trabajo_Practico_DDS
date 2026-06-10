import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/db.js';

class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,},
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correo: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,
    }

    );

export default Usuario;