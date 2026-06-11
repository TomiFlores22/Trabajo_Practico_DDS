import equiposService from "../services/equipos.service.js";

export const listarEquipos = async (req, res) => {
    try {

        const equipos =
            await equiposService.obtenerTodos();

        res.json(equipos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};