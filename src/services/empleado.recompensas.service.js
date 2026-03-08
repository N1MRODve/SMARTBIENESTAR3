/**
 * Servicio de Recompensas para Empleados
 *
 * Proporciona acceso a datos de recompensas filtrados automáticamente
 * por empresa del empleado autenticado.
 *
 * Seguridad:
 * - Filtrado por empresa_id vía RLS
 * - Empleado solo ve sus propios puntos y canjes
 * - Recompensas globales (empresa_id = null) + de su empresa
 */

import { supabase } from '@/lib/supabase';

// Iconos por categoría para el frontend
const ICONOS_CATEGORIA = {
  'Bienestar': '💆',
  'Desarrollo': '📚',
  'Experiencias': '🎫',
  'Productos': '🎁',
  'bienestar': '💆',
  'desarrollo': '📚',
  'experiencias': '🎫',
  'productos': '🎁',
  'tecnologia': '⌚',
  'nutricion': '🥗',
  'entrenamiento': '🏋️',
  'salud': '❤️'
};

export const empleadoRecompensasService = {
  /**
   * Obtiene todos los datos de recompensas usando la función RPC
   * Retorna: puntos, actividades, catálogo, historial de canjes e historial de puntos
   */
  async getDatosCompletos() {
    const { data, error } = await supabase.rpc('get_empleado_recompensas_data');

    if (error) {
      console.error('Error en RPC get_empleado_recompensas_data:', error);
      throw new Error('No se pudieron cargar los datos de recompensas');
    }

    if (!data.success) {
      throw new Error(data.error || 'Error al cargar datos');
    }

    // Procesar recompensas para añadir iconos
    const recompensas = (data.recompensas || []).map(r => ({
      ...r,
      icono: ICONOS_CATEGORIA[r.categoria] || '🎁'
    }));

    return {
      puntos: data.empleado?.puntos || 0,
      actividades: data.actividades_puntos || [],
      recompensas,
      historialCanjes: data.historial_canjes || [],
      historialPuntos: data.historial_puntos || []
    };
  },

  /**
   * Obtiene solo los puntos actuales del empleado
   */
  async getPuntos() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('empleados')
      .select('puntos')
      .eq('auth_user_id', user.id)
      .single();

    if (error) throw error;
    return data?.puntos || 0;
  },

  /**
   * Obtiene las formas de ganar puntos configuradas para la empresa
   */
  async getActividadesPuntos() {
    const { data, error } = await supabase
      .from('actividades_puntos')
      .select('*')
      .eq('activa', true)
      .order('orden');

    if (error) {
      // Si la tabla no existe, retornar actividades por defecto
      console.warn('Tabla actividades_puntos no disponible, usando defaults');
      return this.getActividadesPuntosDefault();
    }

    return data || this.getActividadesPuntosDefault();
  },

  /**
   * Actividades de puntos por defecto (fallback)
   */
  getActividadesPuntosDefault() {
    return [
      { codigo: 'ENCUESTA_COMPLETADA', nombre: 'Encuesta completada', descripcion: 'Responde una encuesta', puntos: 50, icono: '📋' },
      { codigo: 'RESPUESTA_RAPIDA', nombre: 'Respuesta rápida', descripcion: 'Responde en 24h', puntos: 25, icono: '⚡' },
      { codigo: 'RESERVAR_SESION', nombre: 'Reservar sesión', descripcion: 'Reserva una sesión', puntos: 30, icono: '📅' },
      { codigo: 'ASISTIR_SESION', nombre: 'Asistencia a sesión', descripcion: 'Asiste a una sesión', puntos: 100, icono: '✅' },
      { codigo: 'PARTICIPACION_MENSUAL', nombre: 'Participación mensual', descripcion: 'Participa activamente', puntos: 200, icono: '🏆' },
      { codigo: 'SUGERENCIA_IMPLEMENTADA', nombre: 'Sugerencia implementada', descripcion: 'Tu idea fue implementada', puntos: 300, icono: '💡' }
    ];
  },

  /**
   * Obtiene el catálogo de recompensas disponibles para la empresa del empleado
   * Incluye recompensas de su empresa + globales (empresa_id = null)
   */
  async getCatalogoRecompensas() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener puntos y empresa_id del empleado
    const { data: empleado, error: empError } = await supabase
      .from('empleados')
      .select('puntos, empresa_id')
      .eq('auth_user_id', user.id)
      .single();

    if (empError || !empleado) throw new Error('Empleado no encontrado');

    const puntos = empleado.puntos || 0;

    // Filtrar por empresa_id del empleado O recompensas globales (empresa_id = null)
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('activa', true)
      .or(`empresa_id.eq.${empleado.empresa_id},empresa_id.is.null`)
      .order('costo_puntos');

    if (error) throw error;

    // Procesar cada recompensa
    return (data || []).map(r => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      categoria: r.categoria,
      costo_puntos: r.costo_puntos,
      stock: r.stock,
      imagen_url: r.imagen_url,
      icono: ICONOS_CATEGORIA[r.categoria] || '🎁',
      disponible: r.stock === -1 || r.stock > 0,
      puede_canjear: (r.stock === -1 || r.stock > 0) && puntos >= r.costo_puntos,
      progreso: Math.min(Math.round((puntos / r.costo_puntos) * 100), 100),
      puntos_faltantes: Math.max(0, r.costo_puntos - puntos)
    }));
  },

  /**
   * Canjear una recompensa usando la función RPC atómica
   * IMPORTANTE: Solo usar RPC, no hay fallback para evitar race conditions
   */
  async canjearRecompensa(recompensaId) {
    const { data, error } = await supabase.rpc('canjear_recompensa', {
      p_recompensa_id: recompensaId
    });

    if (error) {
      console.error('Error en RPC canjear_recompensa:', error);
      // Mensaje claro sin fallback inseguro
      throw new Error('Error al procesar el canje. Por favor, intenta de nuevo en unos segundos.');
    }

    if (!data.success) {
      throw new Error(data.error || 'No se pudo completar el canje');
    }

    return {
      success: true,
      canjeId: data.canje_id,
      recompensa: data.recompensa,
      puntosGastados: data.puntos_gastados,
      puntosRestantes: data.puntos_restantes
    };
  },

  /**
   * Obtiene el historial de canjes del empleado
   */
  async getHistorialCanjes(limite = 20) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleado } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!empleado) return [];

    const { data, error } = await supabase
      .from('canjes_recompensas')
      .select(`
        id,
        puntos_gastados,
        estado,
        fecha_canje,
        notas,
        recompensa:recompensas (
          id,
          nombre,
          categoria,
          imagen_url
        )
      `)
      .eq('empleado_id', empleado.id)
      .order('fecha_canje', { ascending: false })
      .limit(limite);

    if (error) throw error;

    return (data || []).map(c => ({
      id: c.id,
      recompensa: c.recompensa?.nombre || 'Recompensa',
      categoria: c.recompensa?.categoria || 'General',
      icono: ICONOS_CATEGORIA[c.recompensa?.categoria] || '🎁',
      puntosGastados: c.puntos_gastados,
      estado: c.estado,
      fecha: c.fecha_canje,
      notas: c.notas
    }));
  },

  /**
   * Obtiene el historial de transacciones de puntos
   */
  async getHistorialPuntos(limite = 30) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleado } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!empleado) return [];

    const { data, error } = await supabase
      .from('transacciones_puntos')
      .select('*')
      .eq('empleado_id', empleado.id)
      .order('created_at', { ascending: false })
      .limit(limite);

    if (error) throw error;

    return (data || []).map(t => ({
      id: t.id,
      cantidad: t.cantidad,
      tipo: t.tipo,
      motivo: t.motivo,
      fecha: t.created_at,
      esGanado: t.cantidad > 0
    }));
  },

  /**
   * Calcula estadísticas del empleado
   */
  async getEstadisticas() {
    const [puntos, historialPuntos, historialCanjes] = await Promise.all([
      this.getPuntos(),
      this.getHistorialPuntos(100),
      this.getHistorialCanjes(50)
    ]);

    const puntosGanados = historialPuntos
      .filter(t => t.cantidad > 0)
      .reduce((sum, t) => sum + t.cantidad, 0);

    const puntosGastados = historialPuntos
      .filter(t => t.cantidad < 0)
      .reduce((sum, t) => sum + Math.abs(t.cantidad), 0);

    const totalCanjes = historialCanjes.length;
    const canjesPendientes = historialCanjes.filter(c => c.estado === 'pendiente').length;

    return {
      puntosActuales: puntos,
      puntosGanados,
      puntosGastados,
      totalCanjes,
      canjesPendientes
    };
  }
};

export default empleadoRecompensasService;
