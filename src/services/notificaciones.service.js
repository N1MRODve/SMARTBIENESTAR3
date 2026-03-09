import { supabase } from '@/lib/supabase';

/**
 * Servicio de notificaciones por email
 * Utiliza la Edge Function send-notification-email
 */
export const notificacionesService = {
  /**
   * Enviar notificación de nueva encuesta a todos los colaboradores
   */
  async notificarNuevaEncuesta(empresaId, encuesta) {
    const appUrl = window.location.origin;

    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        type: 'nueva_encuesta',
        empresa_id: empresaId,
        data: {
          encuesta_id: encuesta.id,
          titulo: encuesta.titulo,
          descripcion: encuesta.descripcion,
          fecha_cierre: encuesta.fecha_fin || encuesta.fecha_cierre,
          url: `${appUrl}/empleado/encuestas`
        }
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Enviar recordatorio de encuesta a colaboradores que no han respondido
   */
  async enviarRecordatorioEncuesta(empresaId, encuesta, colaboradoresIds = []) {
    const appUrl = window.location.origin;

    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        type: 'recordatorio_encuesta',
        empresa_id: empresaId,
        data: {
          encuesta_id: encuesta.id,
          titulo: encuesta.titulo,
          fecha_cierre: encuesta.fecha_fin || encuesta.fecha_cierre,
          url: `${appUrl}/empleado/encuestas`
        },
        destinatarios: colaboradoresIds.length > 0 ? colaboradoresIds : undefined
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Notificar nuevo comunicado a los destinatarios
   */
  async notificarNuevoComunicado(empresaId, comunicado, destinatariosIds = []) {
    const appUrl = window.location.origin;

    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        type: 'nuevo_comunicado',
        empresa_id: empresaId,
        data: {
          comunicado_id: comunicado.id,
          titulo: comunicado.titulo,
          descripcion: comunicado.contenido?.substring(0, 200),
          url: `${appUrl}/empleado/comunicados`
        },
        destinatarios: destinatariosIds.length > 0 ? destinatariosIds : undefined
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Notificar que una encuesta ha cerrado
   */
  async notificarEncuestaCerrada(empresaId, encuesta) {
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        type: 'encuesta_cerrada',
        empresa_id: empresaId,
        data: {
          encuesta_id: encuesta.id,
          titulo: encuesta.titulo
        }
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Enviar invitación a empleado para unirse a la plataforma
   * @param {string} empresaId - ID de la empresa
   * @param {Object} empleado - Datos del empleado invitado
   * @param {string} empleado.email - Email del empleado
   * @param {string} empleado.nombre - Nombre del empleado
   * @param {string} empleado.token_invitacion - Token único de invitación
   * @param {string} empleado.departamento_nombre - Nombre del departamento (opcional)
   */
  async notificarInvitacionEmpleado(empresaId, empleado) {
    const appUrl = window.location.origin;

    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        type: 'invitacion_empleado',
        empresa_id: empresaId,
        data: {
          email: empleado.email,
          nombre: empleado.nombre || '',
          token: empleado.token_invitacion,
          departamento: empleado.departamento_nombre || '',
          url: `${appUrl}/unirse?token=${empleado.token_invitacion}`
        },
        // Enviar solo a este email específico
        destinatarios_emails: [empleado.email]
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Obtener colaboradores que no han respondido una encuesta
   */
  async getColaboradoresSinResponder(empresaId, encuestaId) {
    // Obtener todos los colaboradores activos
    const { data: colaboradores, error: colabError } = await supabase
      .from('empleados')
      .select('id')
      .eq('empresa_id', empresaId)
      .eq('estado', 'Activo');

    if (colabError) throw colabError;

    // Obtener los que ya respondieron
    const { data: respuestas, error: respError } = await supabase
      .from('respuestas_encuesta')
      .select('empleado_id')
      .eq('encuesta_id', encuestaId)
      .not('empleado_id', 'is', null);

    if (respError) throw respError;

    const idsRespondieron = new Set(respuestas?.map(r => r.empleado_id) || []);
    const sinResponder = colaboradores?.filter(c => !idsRespondieron.has(c.id)) || [];

    return sinResponder.map(c => c.id);
  }
};

export default notificacionesService;
