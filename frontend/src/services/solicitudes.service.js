import api from './api.js';

export const solicitudesService = {
  obtenerTodas: async () => {
    const response = await api.get('/solicitudes');
    return response.data;
  },
  crear: async (datosSolicitud) => {
    const response = await api.post('/solicitudes', datosSolicitud);
    return response.data;
  },
  actualizarEstado: async (id, nuevoEstado) => {
    const response = await api.put(`/solicitudes/${id}`, nuevoEstado);
    return response.data;
  }
};