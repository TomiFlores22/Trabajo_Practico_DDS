import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../config/db.js';

class Solicitud extends Model {}

Solicitud.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,
        },
        equipoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        fechaRetiro: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        fechaDevolucion: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        motivo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        autorizadoPor: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Solicitud',
        tableName: 'solicitudes',
        timestamps: false,
    }
);

export default Solicitud;
