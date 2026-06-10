import historialService from "../services/historial.service.js";

class HistorialController {
  async obtenerPorSolicitud(req, res) {
    try {
      const { id } = req.params;

      const historial = await historialService.obtenerPorSolicitud(id);

      res.status(200).json(historial);
    } catch (error) {
      res.status(500).json({
        mensaje: error.message,
      });
    }
  }
}

export default new HistorialController();