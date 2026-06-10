import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/db.js';

class Equipo extends Model {}

Equipo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,
        },
        codigoInventario: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        requiereAutorizacion: {
            type: DataTypes.BOOLEAN,
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