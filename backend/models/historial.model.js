import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Historial extends Model {}

Historial.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,
        },
        solicitudId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        accion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fechaHora: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        valorAnterior: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        valorNuevo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Historial',
        tableName: 'historial_solicitudes',
        timestamps: false,
    }
);

export default Historial;