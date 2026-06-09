import { Datatypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Solicitud extends Model {}

Solicitud.init(
    {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,
        },
        equipoId: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        usuarioId: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        fechaRetiro: {
            type: Datatypes.DATE,
            allowNull: false,
        },
        fechaDevolucion: {
            type: Datatypes.DATE,
            allowNull: false,
        },
        motivo: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        estado: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        autorizadoPor: {
            type: Datatypes.STRING,
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
