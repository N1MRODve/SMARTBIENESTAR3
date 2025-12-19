import { supabase } from '@/lib/supabase';

/**
 * Servicio centralizado para el Dashboard del Empleado
 * Todos los datos están filtrados por empresa usando el dominio del email
 * y respetan las políticas RLS de Supabase
 */
export const empleadoDashboardService = {
  /**
   * Obtener el perfil completo del empleado actual con su empresa
   */
  async getMiPerfil() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        empresa:empresas (
          id,
          nombre,
          dominio,
          logo_url
        ),
        departamento:departamentos (
          id,
          nombre
        )
      `)
      .eq('auth_user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Obtener encuestas pendientes del empleado (filtradas por empresa via RLS)
   */
  async getEncuestasPendientes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener IDs de encuestas ya respondidas
    const { data: respondidas } = await supabase
      .from('respuestas_encuesta')
      .select('encuesta_id')
      .eq('empleado_id', user.id);

    const idsRespondidas = respondidas?.map(r => r.encuesta_id) || [];

    // Obtener encuestas activas (RLS filtra por empresa automáticamente)
    let query = supabase
      .from('encuestas')
      .select(`
        id,
        titulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        privacidad_nivel,
        categoria,
        preguntas:preguntas_encuesta(count)
      `)
      .eq('estado', 'activa')
      .gte('fecha_fin', new Date().toISOString())
      .order('fecha_fin', { ascending: true });

    if (idsRespondidas.length > 0) {
      query = query.not('id', 'in', `(${idsRespondidas.join(',')})`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Calcular puntos por encuesta y urgencia
    return (data || []).map(encuesta => {
      const horasRestantes = (new Date(encuesta.fecha_fin) - new Date()) / (1000 * 60 * 60);
      let urgencia = 'normal';
      let puntos = 100; // Base

      if (horasRestantes <= 24) {
        urgencia = 'urgente';
        puntos = 150; // Bonus por última hora
      } else if (horasRestantes <= 72) {
        urgencia = 'pronto';
        puntos = 125; // Bonus por respuesta rápida
      }

      return {
        ...encuesta,
        urgencia,
        puntos_estimados: puntos,
        horas_restantes: Math.max(0, Math.floor(horasRestantes))
      };
    });
  },

  /**
   * Obtener historial de encuestas completadas
   */
  async getHistorialEncuestas() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('respuestas_encuesta')
      .select(`
        id,
        created_at,
        encuesta:encuestas (
          id,
          titulo,
          descripcion,
          categoria
        )
      `)
      .eq('empleado_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Agrupar por encuesta
    const historialMap = new Map();
    (data || []).forEach(resp => {
      if (resp.encuesta && !historialMap.has(resp.encuesta.id)) {
        historialMap.set(resp.encuesta.id, {
          ...resp.encuesta,
          fecha_completado: resp.created_at
        });
      }
    });

    return Array.from(historialMap.values());
  },

  /**
   * Obtener comunicados para el empleado (filtrados por empresa via RLS)
   */
  async getComunicados(limite = 10) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener empleado_id
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;

    // Obtener comunicados publicados (RLS filtra por empresa)
    const { data: comunicados, error: comError } = await supabase
      .from('comunicados')
      .select('*')
      .in('estado', ['publicado', 'enviado'])
      .order('fecha_publicacion', { ascending: false })
      .limit(limite);

    if (comError) throw comError;

    // Obtener lecturas del empleado
    let idsLeidos = new Set();
    if (empleadoId) {
      const { data: lecturas } = await supabase
        .from('comunicados_lecturas')
        .select('comunicado_id')
        .eq('empleado_id', empleadoId);

      idsLeidos = new Set(lecturas?.map(l => l.comunicado_id) || []);
    }

    return (comunicados || []).map(com => ({
      ...com,
      leido: idsLeidos.has(com.id)
    }));
  },

  /**
   * Obtener conteo de comunicados no leídos
   */
  async getConteoNoLeidos() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;

    const { count: totalCom } = await supabase
      .from('comunicados')
      .select('*', { count: 'exact', head: true })
      .in('estado', ['publicado', 'enviado']);

    let leidos = 0;
    if (empleadoId) {
      const { count } = await supabase
        .from('comunicados_lecturas')
        .select('*', { count: 'exact', head: true })
        .eq('empleado_id', empleadoId);

      leidos = count || 0;
    }

    return Math.max(0, (totalCom || 0) - leidos);
  },

  /**
   * Marcar comunicado como leído
   */
  async marcarComunicadoLeido(comunicadoId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!empleadoData?.id) throw new Error('Empleado no encontrado');

    const { error } = await supabase
      .from('comunicados_lecturas')
      .upsert([{
        comunicado_id: comunicadoId,
        empleado_id: empleadoData.id
      }], {
        onConflict: 'comunicado_id,empleado_id'
      });

    if (error && error.code !== '23505') throw error;
  },

  /**
   * Obtener actividades/sesiones próximas (filtradas por empresa via RLS)
   */
  async getActividadesProximas(limite = 10) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('sesiones')
      .select(`
        id,
        titulo,
        descripcion,
        fecha_inicio,
        fecha_fin,
        modalidad,
        ubicacion,
        cupo_maximo,
        cupo_disponible,
        estado,
        instructor,
        servicio:servicios (
          id,
          nombre,
          categoria,
          tipo,
          duracion_minutos
        )
      `)
      .eq('estado', 'programada')
      .gte('fecha_inicio', new Date().toISOString())
      .order('fecha_inicio')
      .limit(limite);

    if (error) throw error;

    return (data || []).map(sesion => {
      const cupo = sesion.cupo_disponible || 0;
      let urgencia = null;

      if (cupo === 0) {
        urgencia = { tipo: 'agotado', texto: 'Completo' };
      } else if (cupo <= 3) {
        urgencia = { tipo: 'urgente', texto: `¡Solo ${cupo} plaza${cupo > 1 ? 's' : ''}!` };
      } else if (cupo <= 5) {
        urgencia = { tipo: 'limitado', texto: 'Plazas limitadas' };
      }

      return { ...sesion, urgencia };
    });
  },

  /**
   * Obtener mis reservas activas
   */
  async getMisReservas() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!empleadoData?.id) return [];

    const { data, error } = await supabase
      .from('reservas_sesiones')
      .select(`
        id,
        estado,
        fecha_reserva,
        sesion:sesiones (
          id,
          titulo,
          fecha_inicio,
          fecha_fin,
          modalidad,
          ubicacion,
          servicio:servicios (
            nombre,
            categoria
          )
        )
      `)
      .eq('empleado_id', empleadoData.id)
      .in('estado', ['confirmada', 'asistio'])
      .order('fecha_reserva', { ascending: false });

    if (error) throw error;

    // Filtrar solo reservas futuras
    return (data || []).filter(r =>
      r.sesion && new Date(r.sesion.fecha_inicio) > new Date()
    );
  },

  /**
   * Obtener puntos y progreso de gamificación
   */
  async getMisPuntos() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData, error } = await supabase
      .from('empleados')
      .select('id, puntos')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return empleadoData?.puntos || 0;
  },

  /**
   * Obtener historial de transacciones de puntos
   */
  async getHistorialPuntos(limite = 20) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!empleadoData?.id) return [];

    const { data, error } = await supabase
      .from('transacciones_puntos')
      .select('*')
      .eq('empleado_id', empleadoData.id)
      .order('created_at', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtener catálogo de recompensas (filtrado por empresa via RLS)
   */
  async getRecompensasDisponibles() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener puntos actuales
    const puntos = await this.getMisPuntos();

    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('activa', true)
      .order('costo_puntos');

    if (error) throw error;

    return (data || []).map(recompensa => ({
      ...recompensa,
      canjeable: puntos >= recompensa.costo_puntos && (recompensa.stock === -1 || recompensa.stock > 0),
      puntos_faltantes: Math.max(0, recompensa.costo_puntos - puntos)
    }));
  },

  /**
   * Obtener mis canjes de recompensas
   */
  async getMisCanjes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!empleadoData?.id) return [];

    const { data, error } = await supabase
      .from('canjes_recompensas')
      .select(`
        *,
        recompensa:recompensas (
          id,
          nombre,
          categoria,
          imagen_url
        )
      `)
      .eq('empleado_id', empleadoData.id)
      .order('fecha_canje', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Canjear una recompensa
   */
  async canjearRecompensa(recompensaId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id, puntos')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!empleadoData?.id) throw new Error('Empleado no encontrado');

    // Verificar recompensa
    const { data: recompensa, error: recompensaError } = await supabase
      .from('recompensas')
      .select('*')
      .eq('id', recompensaId)
      .single();

    if (recompensaError) throw recompensaError;

    if (empleadoData.puntos < recompensa.costo_puntos) {
      throw new Error('No tienes suficientes puntos para esta recompensa');
    }

    if (recompensa.stock === 0) {
      throw new Error('Esta recompensa no tiene stock disponible');
    }

    // Crear canje
    const { data: canje, error: canjeError } = await supabase
      .from('canjes_recompensas')
      .insert([{
        empleado_id: empleadoData.id,
        recompensa_id: recompensaId,
        puntos_gastados: recompensa.costo_puntos,
        estado: 'pendiente',
      }])
      .select()
      .single();

    if (canjeError) throw canjeError;

    // Crear transacción de puntos (negativa)
    await supabase
      .from('transacciones_puntos')
      .insert([{
        empleado_id: empleadoData.id,
        cantidad: -recompensa.costo_puntos,
        tipo: 'gastados',
        motivo: `Canje: ${recompensa.nombre}`,
        referencia_id: canje.id,
        referencia_tipo: 'canje',
      }]);

    // Actualizar stock si no es ilimitado
    if (recompensa.stock > 0) {
      await supabase
        .from('recompensas')
        .update({ stock: recompensa.stock - 1 })
        .eq('id', recompensaId);
    }

    return {
      success: true,
      canje,
      nuevos_puntos: empleadoData.puntos - recompensa.costo_puntos
    };
  },

  /**
   * Obtener todos los datos del dashboard en una sola llamada
   */
  async getDashboardCompleto() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Ejecutar todas las consultas en paralelo
    const [
      perfil,
      encuestasPendientes,
      comunicados,
      comunicadosNoLeidos,
      actividades,
      reservas,
      puntos,
      recompensas
    ] = await Promise.all([
      this.getMiPerfil(),
      this.getEncuestasPendientes(),
      this.getComunicados(5),
      this.getConteoNoLeidos(),
      this.getActividadesProximas(5),
      this.getMisReservas(),
      this.getMisPuntos(),
      this.getRecompensasDisponibles()
    ]);

    // Calcular siguiente recompensa
    const siguienteRecompensa = recompensas.find(r => r.costo_puntos > puntos) || recompensas[recompensas.length - 1];
    const recompensasCanjeables = recompensas.filter(r => r.canjeable);

    // Calcular progreso hacia siguiente recompensa
    let progreso = 0;
    if (siguienteRecompensa) {
      const anterior = recompensas.find((r, i) =>
        recompensas[i + 1]?.id === siguienteRecompensa.id
      );
      const base = anterior?.costo_puntos || 0;
      progreso = Math.min(100, Math.round(((puntos - base) / (siguienteRecompensa.costo_puntos - base)) * 100));
    }

    return {
      perfil,
      encuestas: {
        pendientes: encuestasPendientes,
        encuestaPrioritaria: encuestasPendientes[0] || null,
        totalPendientes: encuestasPendientes.length
      },
      comunicados: {
        recientes: comunicados,
        noLeidos: comunicadosNoLeidos
      },
      actividades: {
        proximas: actividades,
        misReservas: reservas,
        totalReservas: reservas.length
      },
      gamificacion: {
        puntos,
        siguienteRecompensa,
        progreso,
        puntosParaMeta: siguienteRecompensa ? Math.max(0, siguienteRecompensa.costo_puntos - puntos) : 0,
        recompensasCanjeables: recompensasCanjeables.length,
        catalogoRecompensas: recompensas
      }
    };
  }
};

/**
 * Servicio de Tips de Bienestar
 * Puede obtener tips desde la BD o usar tips estáticos como fallback
 */
export const tipsService = {
  // Tips estáticos de fallback
  tipsEstaticos: [
    {
      id: 'tip-1',
      categoria: 'Movimiento',
      icono: '🧘',
      color: 'purple',
      titulo: 'Pausa activa',
      texto: 'Levántate y estira durante 2 minutos. Tu cuerpo te lo agradecerá.',
    },
    {
      id: 'tip-2',
      categoria: 'Mente',
      icono: '🌬️',
      color: 'blue',
      titulo: 'Respira profundo',
      texto: '3 respiraciones lentas pueden cambiar tu día. Inhala 4 segundos, sostén 4, exhala 4.',
    },
    {
      id: 'tip-3',
      categoria: 'Conexión',
      icono: '💬',
      color: 'pink',
      titulo: 'Conecta con alguien',
      texto: 'Un mensaje amable a un compañero puede alegrar dos días.',
    },
    {
      id: 'tip-4',
      categoria: 'Hidratación',
      icono: '💧',
      color: 'cyan',
      titulo: 'Hidratación',
      texto: 'Beber agua mejora tu concentración y energía. ¡Toma un vaso ahora!',
    },
    {
      id: 'tip-5',
      categoria: 'Descanso',
      icono: '👀',
      color: 'green',
      titulo: 'Descanso visual',
      texto: 'Regla 20-20-20: Cada 20 min, mira algo a 20 pies (6m) por 20 segundos.',
    },
    {
      id: 'tip-6',
      categoria: 'Gratitud',
      icono: '🙏',
      color: 'amber',
      titulo: 'Momento de gratitud',
      texto: 'Piensa en 3 cosas buenas que te han pasado hoy. La gratitud reduce el estrés.',
    },
    {
      id: 'tip-7',
      categoria: 'Productividad',
      icono: '🎯',
      color: 'indigo',
      titulo: 'Una cosa a la vez',
      texto: 'El multitasking reduce la productividad un 40%. Enfócate en una tarea.',
    },
    {
      id: 'tip-8',
      categoria: 'Sueño',
      icono: '🌙',
      color: 'slate',
      titulo: 'Prepara tu descanso',
      texto: 'Evita pantallas 1 hora antes de dormir para un sueño más reparador.',
    }
  ],

  /**
   * Obtener tips (primero intenta BD, luego fallback)
   */
  async getTips() {
    try {
      // Intentar obtener de la BD si existe la tabla
      const { data, error } = await supabase
        .from('tips_bienestar')
        .select('*')
        .eq('activo', true)
        .order('orden');

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      // Si la tabla no existe, usar tips estáticos
      console.log('Usando tips estáticos');
    }

    return this.tipsEstaticos;
  },

  /**
   * Obtener un tip aleatorio
   */
  async getTipAleatorio() {
    const tips = await this.getTips();
    return tips[Math.floor(Math.random() * tips.length)];
  },

  /**
   * Obtener tip del día (consistente durante el día)
   */
  async getTipDelDia() {
    const tips = await this.getTips();
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return tips[dayOfYear % tips.length];
  }
};
