import Historial from "../models/historial.model.js";

class HistorialService {
  async registrarCambio({
    solicitudId,
    usuarioId,
    accion,
    valorAnterior = null,
    valorNuevo = null,
  }) {
    return await Historial.create({
      solicitudId,
      usuarioId,
      accion,
      fechaHora: new Date(),
      valorAnterior: valorAnterior
        ? JSON.stringify(valorAnterior)
        : null,
      valorNuevo: valorNuevo
        ? JSON.stringify(valorNuevo)
        : null,
    });
  }

  async obtenerPorSolicitud(solicitudId) {
    return await Historial.findAll({
      where: { solicitudId },
      order: [["fechaHora", "DESC"]],
    });
  }
}

export default new HistorialService();