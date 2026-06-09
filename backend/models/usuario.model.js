import { Datatypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,},
        nombre: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        email: {
            type: Datatypes.STRING,
            allowNull: false
        },
        passwordHash: {
            type: Datatypes.STRING,
            allowNull: false
        },
        rol: {
            type: Datatypes.STRING,
            allowNull: false
        },
        activo: {
            type: Datatypes.BOOLEAN,
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