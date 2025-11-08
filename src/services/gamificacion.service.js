import { supabase } from '@/lib/supabase';

export const PUNTOS_ACTIVIDADES = {
  RESPONDER_ENCUESTA: 50,
  RESERVAR_SESION: 30,
  ASISTIR_SESION: 100,
  COMPLETAR_PERFIL: 25,
  REFERIR_COLEGA: 75,
};

export const gamificacionService = {
  async getPuntos(empleadoId) {
    const { data, error } = await supabase
      .from('empleados')
      .select('puntos')
      .eq('id', empleadoId)
      .single();

    if (error) throw error;
    return data.puntos || 0;
  },

  async addPuntos(empleadoId, cantidad, motivo, referenciaId = null, referenciaTipo = 'manual') {
    const tipo = cantidad > 0 ? 'ganados' : 'gastados';

    const { data, error } = await supabase
      .from('transacciones_puntos')
      .insert([{
        empleado_id: empleadoId,
        cantidad,
        tipo,
        motivo,
        referencia_id: referenciaId,
        referencia_tipo: referenciaTipo,
      }])
      .select()
      .single();

    if (error) throw error;

    // Obtener puntos actualizados
    const puntosTotal = await this.getPuntos(empleadoId);

    return {
      success: true,
      transaccion: data,
      puntosTotal,
    };
  },

  async getHistorial(empleadoId) {
    const { data, error } = await supabase
      .from('transacciones_puntos')
      .select('*')
      .eq('empleado_id', empleadoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getRanking(limit = 10) {
    const { data, error } = await supabase
      .from('empleados')
      .select(`
        id,
        nombre,
        puntos,
        departamentos (
          nombre
        )
      `)
      .eq('estado', 'Activo')
      .order('puntos', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async otorgarPuntosEncuesta(empleadoId, encuestaId) {
    return await this.addPuntos(
      empleadoId,
      PUNTOS_ACTIVIDADES.RESPONDER_ENCUESTA,
      'Encuesta completada',
      encuestaId,
      'encuesta'
    );
  },

  async otorgarPuntosReserva(empleadoId, sesionId, nombreSesion) {
    return await this.addPuntos(
      empleadoId,
      PUNTOS_ACTIVIDADES.RESERVAR_SESION,
      `Reserva en: ${nombreSesion}`,
      sesionId,
      'sesion'
    );
  },

  async otorgarPuntosAsistencia(empleadoId, sesionId, nombreSesion) {
    return await this.addPuntos(
      empleadoId,
      PUNTOS_ACTIVIDADES.ASISTIR_SESION,
      `Asistencia a: ${nombreSesion}`,
      sesionId,
      'sesion'
    );
  },
};
