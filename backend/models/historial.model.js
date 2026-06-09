import { Datatypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Usuario extends Model {}

Usuario.init(
    {
        id: {
            type: Datatypes.INTEGER,
            primaryKey: true,   
            autoIncrement: true,
        },
        solicitudId: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        usuarioId: {
            type: Datatypes.INTEGER,
            allowNull: false,
        },
        accion: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        fechaHora: {
            type: Datatypes.DATETIME,
            allowNull: false,
        },
        valorAnterior: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        valorNuevo: {
            type: Datatypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: false,
    }
);

export default Usuario;