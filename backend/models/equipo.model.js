import { Datatypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Equipo extends Model {}

Equipo.init(
    {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,
        },
        codigoInventario: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        nombre: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        estado: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        ubicacion: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        requiereAutorizacion: {
            type: Datatypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
    sequelize,
    modelName: 'Equipo',
    tableName: 'equipos',
    timestamps: false,
    }

    );

export default Equipo;    