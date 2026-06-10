import Equipo from "./equipo.model.js";
import Solicitud from "./solicitud.model.js";
import Usuario from "./usuario.model.js";

Solicitud.belongsTo(Equipo, {
    foreignKey: "equipoId"
});

Equipo.hasMany(Solicitud, {
    foreignKey: "equipoId"
});

Solicitud.belongsTo(Usuario, {
    foreignKey: "usuarioId"
});

Usuario.hasMany(Solicitud, {
    foreignKey: "usuarioId"
});