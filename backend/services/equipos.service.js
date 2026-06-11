import Equipo from "../models/equipo.model.js";

class EquiposService {

    async obtenerTodos() {
        return await Equipo.findAll();
    }

}

export default new EquiposService();