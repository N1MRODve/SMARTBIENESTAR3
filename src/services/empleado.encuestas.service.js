/**
 * Servicio de Encuestas para Empleados
 *
 * Centraliza todas las consultas de encuestas desde la perspectiva del empleado.
 * Utiliza funciones RPC de Supabase para consultas optimizadas y seguras.
 * Filtrado automático por empresa del empleado.
 */

import { supabase } from '@/lib/supabase';

export const empleadoEncuestasService = {
  /**
   * Obtiene todos los datos de encuestas del empleado en una sola llamada.
   * Incluye: pendientes, historial, stats
   * Usa fn_get_encuestas_pendientes_empleado como FUENTE ÚNICA DE VERDAD.
   * @returns {Promise<Object>} Datos completos de encuestas
   */
  async getDatosCompletos() {
    try {
      // PRIMERO: Usar la RPC unificada para encuestas pendientes
      const { data: pendientesData, error: pendientesError } = await supabase.rpc('fn_get_encuestas_pendientes_empleado');

      if (pendientesError) {
        console.warn('RPC fn_get_encuestas_pendientes_empleado no disponible, usando fallback:', pendientesError.message);
        return await this.getDatosCompletosFallback();
      }

      if (!pendientesData?.success) {
        console.warn('RPC retornó error:', pendientesData?.error);
        return await this.getDatosCompletosFallback();
      }

      // Obtener historial separadamente
      const historial = await this.getHistorial();

      // Calcular stats
      const pendientes = pendientesData.encuestas || [];
      const puntosDisponibles = pendientes.reduce((sum, e) => sum + (e.puntos_base || e.puntos_recompensa || 50), 0);

      return {
        success: true,
        empleado: {
          id: pendientesData.empleado_id,
          empresa_id: pendientesData.empresa_id
        },
        pendientes,
        historial,
        stats: {
          total_pendientes: pendientesData.total || 0,
          total_completadas: historial.length,
          puntos_disponibles: puntosDisponibles
        }
      };
    } catch (error) {
      console.error('Error en getDatosCompletos:', error);
      return await this.getDatosCompletosFallback();
    }
  },

  /**
   * Obtener historial de encuestas completadas por el empleado
   */
  async getHistorial() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Obtener empleado.id
      const { data: empleado } = await supabase
        .from('empleados')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!empleado) return [];

      // Obtener respuestas con info de encuesta y puntos otorgados
      const { data: respuestas } = await supabase
        .from('respuestas_encuesta')
        .select(`
          encuesta_id,
          fecha_respuesta,
          puntos_otorgados,
          bonus_aplicado,
          encuesta:encuestas (
            id,
            titulo,
            descripcion,
            categoria,
            privacidad_nivel,
            puntos_base
          )
        `)
        .eq('empleado_id', empleado.id)
        .order('fecha_respuesta', { ascending: false });

      // Agrupar por encuesta (puede haber múltiples respuestas)
      const historialMap = new Map();
      (respuestas || []).forEach(resp => {
        if (resp.encuesta && !historialMap.has(resp.encuesta.id)) {
          historialMap.set(resp.encuesta.id, {
            id: resp.encuesta.id,
            titulo: resp.encuesta.titulo,
            descripcion: resp.encuesta.descripcion,
            categoria: resp.encuesta.categoria,
            privacidad_nivel: resp.encuesta.privacidad_nivel,
            fecha_completado: resp.fecha_respuesta,
            puntos_otorgados: resp.puntos_otorgados || resp.encuesta.puntos_base || 50,
            puntos_base: resp.encuesta.puntos_base || 50,
            bonus_aplicado: resp.bonus_aplicado || false
          });
        }
      });

      return Array.from(historialMap.values());
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  },

  /**
   * Fallback: Obtiene datos usando consultas directas si RPC no está disponible
   */
  async getDatosCompletosFallback() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      console.log('[getDatosCompletosFallback] Usuario autenticado:', user.id);

      // Obtener empleado y su empresa
      const { data: empleado, error: empError } = await supabase
        .from('empleados')
        .select('id, empresa_id, puntos, nombre')
        .eq('auth_user_id', user.id)
        .single();

      if (empError || !empleado) {
        console.error('[getDatosCompletosFallback] Error obteniendo empleado:', empError);
        throw new Error('Empleado no encontrado');
      }

      console.log('[getDatosCompletosFallback] Empleado encontrado:', {
        id: empleado.id,
        empresa_id: empleado.empresa_id,
        nombre: empleado.nombre
      });

      // Obtener encuestas respondidas usando empleado.id (NO user.id)
      // IMPORTANTE: Las respuestas se guardan con empleado.id (tabla empleados)
      // por lo que debemos buscar con el mismo ID para consistencia
      const { data: respondidas } = await supabase
        .from('respuestas_encuesta')
        .select('encuesta_id, fecha_respuesta')
        .eq('empleado_id', empleado.id);

      console.log('[getDatosCompletosFallback] Encuestas ya respondidas:', respondidas?.length || 0, respondidas);

      const idsRespondidas = new Set((respondidas || []).map(r => r.encuesta_id));

      // Map de fechas de respuesta
      const fechasRespuesta = {};
      (respondidas || []).forEach(r => {
        if (!fechasRespuesta[r.encuesta_id] || r.fecha_respuesta > fechasRespuesta[r.encuesta_id]) {
          fechasRespuesta[r.encuesta_id] = r.fecha_respuesta;
        }
      });

      // PRIMERO: Obtener TODAS las encuestas sin filtro de empresa para diagnóstico
      const { data: todasEncuestas, error: todasError } = await supabase
        .from('encuestas')
        .select('id, titulo, empresa_id, estado, fecha_inicio, fecha_fin')
        .order('fecha_creacion', { ascending: false });

      console.log('[getDatosCompletosFallback] TODAS las encuestas en BD:', todasEncuestas?.length || 0);
      if (todasEncuestas) {
        todasEncuestas.forEach(enc => {
          console.log(`  - "${enc.titulo}" | empresa_id: ${enc.empresa_id} | estado: ${enc.estado} | inicio: ${enc.fecha_inicio} | fin: ${enc.fecha_fin}`);
        });
      }

      // Obtener todas las encuestas de la empresa
      // Nota: La tabla encuestas NO tiene columnas 'tipo' ni 'puntos_recompensa'
      const { data: encuestas, error: encError } = await supabase
        .from('encuestas')
        .select(`
          id,
          titulo,
          descripcion,
          categoria,
          estado,
          privacidad_nivel,
          fecha_inicio,
          fecha_fin,
          preguntas:preguntas_encuesta(count)
        `)
        .eq('empresa_id', empleado.empresa_id)
        .order('fecha_creacion', { ascending: false });

      if (encError) {
        console.error('[getDatosCompletosFallback] Error obteniendo encuestas:', encError);
        throw encError;
      }

      console.log('[getDatosCompletosFallback] Encuestas de la empresa del empleado:', encuestas?.length || 0);

      const ahora = new Date();
      console.log('[getDatosCompletosFallback] Fecha actual:', ahora.toISOString());

      // Separar pendientes e historial
      const pendientes = [];
      const historial = [];

      (encuestas || []).forEach(enc => {
        const numPreguntas = enc.preguntas?.[0]?.count || 0;
        const fechaFin = enc.fecha_fin ? new Date(enc.fecha_fin) : null;
        const fechaInicio = enc.fecha_inicio ? new Date(enc.fecha_inicio) : null;

        console.log(`[getDatosCompletosFallback] Procesando encuesta "${enc.titulo}":`);
        console.log(`  - ID: ${enc.id}`);
        console.log(`  - Estado: ${enc.estado}`);
        console.log(`  - Fecha inicio: ${enc.fecha_inicio} (parsed: ${fechaInicio?.toISOString()})`);
        console.log(`  - Fecha fin: ${enc.fecha_fin} (parsed: ${fechaFin?.toISOString()})`);
        console.log(`  - Ya respondida: ${idsRespondidas.has(enc.id)}`);

        // Calcular urgencia
        let urgencia = 'normal';
        if (fechaFin) {
          const horasRestantes = (fechaFin - ahora) / (1000 * 60 * 60);
          if (horasRestantes <= 24) urgencia = 'urgente';
          else if (horasRestantes <= 72) urgencia = 'pronto';
        }

        // Puntos por defecto: 50 (la tabla no tiene columna puntos_recompensa)
        const puntosEncuesta = 50;

        const encuestaFormateada = {
          id: enc.id,
          titulo: enc.titulo,
          descripcion: enc.descripcion,
          categoria: enc.categoria,
          estado: enc.estado,
          privacidad_nivel: enc.privacidad_nivel,
          fecha_inicio: enc.fecha_inicio,
          fecha_fin: enc.fecha_fin,
          puntos_recompensa: puntosEncuesta,
          num_preguntas: numPreguntas,
          tiempo_estimado: Math.ceil(numPreguntas * 0.5),
          urgencia
        };

        if (idsRespondidas.has(enc.id)) {
          // Ya respondida - va al historial
          console.log(`  -> Clasificada como: HISTORIAL (ya respondida)`);
          historial.push({
            ...encuestaFormateada,
            fecha_completado: fechasRespuesta[enc.id],
            puntos_obtenidos: puntosEncuesta
          });
        } else if (
          enc.estado === 'activa' &&
          (!fechaInicio || fechaInicio <= ahora) &&
          (!fechaFin || fechaFin > ahora)
        ) {
          // Activa, vigente y no respondida - pendiente
          console.log(`  -> Clasificada como: PENDIENTE`);
          pendientes.push(encuestaFormateada);
        } else {
          // No cumple condiciones
          const razones = [];
          if (enc.estado !== 'activa') razones.push(`estado=${enc.estado} (no es 'activa')`);
          if (fechaInicio && fechaInicio > ahora) razones.push(`fecha_inicio ${fechaInicio.toISOString()} > ahora`);
          if (fechaFin && fechaFin <= ahora) razones.push(`fecha_fin ${fechaFin.toISOString()} <= ahora (expirada)`);
          console.log(`  -> EXCLUIDA. Razones: ${razones.join(', ')}`);
        }
      });

      // Ordenar pendientes por urgencia
      pendientes.sort((a, b) => {
        const urgenciaOrden = { urgente: 0, pronto: 1, normal: 2 };
        if (urgenciaOrden[a.urgencia] !== urgenciaOrden[b.urgencia]) {
          return urgenciaOrden[a.urgencia] - urgenciaOrden[b.urgencia];
        }
        // Luego por fecha_fin
        if (a.fecha_fin && b.fecha_fin) {
          return new Date(a.fecha_fin) - new Date(b.fecha_fin);
        }
        return a.fecha_fin ? -1 : 1;
      });

      // Ordenar historial por fecha_completado desc
      historial.sort((a, b) => new Date(b.fecha_completado) - new Date(a.fecha_completado));

      const puntosDisponibles = pendientes.reduce((sum, e) => sum + (e.puntos_base || e.puntos_recompensa || 50), 0);

      console.log('[getDatosCompletosFallback] === RESUMEN ===');
      console.log(`  Total pendientes: ${pendientes.length}`);
      console.log(`  Total historial: ${historial.length}`);
      console.log(`  Puntos disponibles: ${puntosDisponibles}`);

      return {
        success: true,
        empleado: {
          id: empleado.id,
          puntos: empleado.puntos || 0
        },
        pendientes,
        historial,
        stats: {
          total_pendientes: pendientes.length,
          total_completadas: historial.length,
          puntos_disponibles: puntosDisponibles
        }
      };
    } catch (error) {
      console.error('Error en getDatosCompletosFallback:', error);
      throw error;
    }
  },

  /**
   * Obtiene solo las encuestas pendientes del empleado
   * @returns {Promise<Array>} Lista de encuestas pendientes
   */
  async getPendientes() {
    try {
      const { data, error } = await supabase.rpc('get_empleado_encuestas_pendientes');

      if (error) {
        console.warn('RPC no disponible, usando fallback');
        const datos = await this.getDatosCompletosFallback();
        return datos.pendientes;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Error al obtener encuestas pendientes');
      }

      return data.encuestas || [];
    } catch (error) {
      console.error('Error en getPendientes:', error);
      const datos = await this.getDatosCompletosFallback();
      return datos.pendientes;
    }
  },

  /**
   * Obtiene el historial de encuestas completadas
   * @returns {Promise<Array>} Lista de encuestas completadas
   */
  async getHistorial() {
    try {
      const { data, error } = await supabase.rpc('get_empleado_encuestas_historial');

      if (error) {
        console.warn('RPC no disponible, usando fallback');
        const datos = await this.getDatosCompletosFallback();
        return datos.historial;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Error al obtener historial');
      }

      return data.historial || [];
    } catch (error) {
      console.error('Error en getHistorial:', error);
      const datos = await this.getDatosCompletosFallback();
      return datos.historial;
    }
  },

  /**
   * Obtiene una encuesta específica con sus preguntas para responder
   * @param {string} encuestaId - ID de la encuesta
   * @returns {Promise<Object>} Encuesta con preguntas
   */
  async getEncuestaParaResponder(encuestaId) {
    try {
      // Intentar RPC primero
      const { data, error } = await supabase.rpc('get_encuesta_para_responder', {
        p_encuesta_id: encuestaId
      });

      if (error) {
        console.warn('RPC no disponible, usando fallback');
        return await this.getEncuestaParaResponderFallback(encuestaId);
      }

      if (!data?.success) {
        // Si es error de ya respondida, propagarlo
        if (data?.ya_respondida) {
          const err = new Error(data.error);
          err.ya_respondida = true;
          throw err;
        }
        throw new Error(data?.error || 'Error al obtener encuesta');
      }

      return data.encuesta;
    } catch (error) {
      if (error.ya_respondida) throw error;
      console.error('Error en getEncuestaParaResponder:', error);
      return await this.getEncuestaParaResponderFallback(encuestaId);
    }
  },

  /**
   * Fallback para obtener encuesta con preguntas
   */
  async getEncuestaParaResponderFallback(encuestaId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener empleado con id y empresa_id (necesitamos ambos)
    const { data: empleado } = await supabase
      .from('empleados')
      .select('id, empresa_id')
      .eq('auth_user_id', user.id)
      .single();

    if (!empleado) throw new Error('Empleado no encontrado');

    // Verificar si ya respondió usando empleado.id (consistente con la RPC de lectura)
    const { data: respExistente } = await supabase
      .from('respuestas_encuesta')
      .select('id')
      .eq('encuesta_id', encuestaId)
      .eq('empleado_id', empleado.id)
      .limit(1);

    if (respExistente && respExistente.length > 0) {
      const err = new Error('Ya has respondido esta encuesta');
      err.ya_respondida = true;
      throw err;
    }

    // Obtener encuesta con columnas de puntos
    const { data: encuesta, error } = await supabase
      .from('encuestas')
      .select(`
        id,
        titulo,
        descripcion,
        categoria,
        estado,
        privacidad_nivel,
        fecha_fin,
        fecha_inicio,
        fecha_creacion,
        puntos_base,
        puntos_bonus_rapido,
        bonus_horas_limite,
        preguntas_encuesta (
          id,
          texto,
          tipo,
          opciones,
          orden,
          es_anonima
        )
      `)
      .eq('id', encuestaId)
      .eq('empresa_id', empleado.empresa_id)
      .single();

    if (error || !encuesta) {
      throw new Error('Encuesta no encontrada');
    }

    if (encuesta.estado !== 'activa') {
      throw new Error('Esta encuesta no está activa');
    }

    if (encuesta.fecha_fin && new Date(encuesta.fecha_fin) < new Date()) {
      throw new Error('Esta encuesta ha expirado');
    }

    // Obtener puntos de la BD (fuente única de verdad)
    const puntosBase = encuesta.puntos_base || 50;
    const puntosBonus = encuesta.puntos_bonus_rapido || 0;
    const bonusHoras = encuesta.bonus_horas_limite || 24;

    return {
      id: encuesta.id,
      titulo: encuesta.titulo,
      descripcion: encuesta.descripcion,
      categoria: encuesta.categoria,
      privacidad_nivel: encuesta.privacidad_nivel,
      // Sistema de puntos unificado
      puntos_base: puntosBase,
      puntos_bonus_rapido: puntosBonus,
      bonus_horas_limite: bonusHoras,
      puntos_recompensa: puntosBase, // Compatibilidad con código existente
      tiene_bonus: puntosBonus > 0,
      puntos_maximos: puntosBase + puntosBonus,
      fecha_fin: encuesta.fecha_fin,
      preguntas: (encuesta.preguntas_encuesta || []).sort((a, b) => a.orden - b.orden)
    };
  },

  /**
   * Genera un hash simple del navegador para control de duplicados en encuestas anónimas
   * @returns {Promise<string>} Hash del fingerprint del navegador
   */
  async generateBrowserHash() {
    try {
      // Recolectar información del navegador (no es IP real, pero sirve como identificador)
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset(),
        screen.colorDepth,
        screen.width + 'x' + screen.height
      ].join('|');

      // Crear hash simple usando SubtleCrypto si está disponible
      if (window.crypto && window.crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(fingerprint);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }

      // Fallback: hash simple
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    } catch (error) {
      console.warn('Error generando hash del navegador:', error);
      return null;
    }
  },

  /**
   * Envía las respuestas de una encuesta usando RPC atómica
   * @param {string} encuestaId - ID de la encuesta
   * @param {Array} respuestas - Array de respuestas {pregunta_id, respuesta}
   * @param {Object} encuestaInfo - Información de la encuesta (incluyendo privacidad_nivel)
   * @returns {Promise<Object>} Resultado del envío con puntos calculados
   */
  async enviarRespuestas(encuestaId, respuestas, encuestaInfo = null) {
    try {
      console.log('[enviarRespuestas] Iniciando envío...');
      console.log('[enviarRespuestas] encuestaId:', encuestaId);
      console.log('[enviarRespuestas] respuestas:', respuestas?.length);
      console.log('[enviarRespuestas] privacidad:', encuestaInfo?.privacidad_nivel);

      // Validar respuestas
      if (!respuestas || respuestas.length === 0) {
        throw new Error('No hay respuestas para enviar');
      }

      // Formatear respuestas para la RPC (pregunta_id, respuesta como string)
      const respuestasJson = respuestas.map(r => ({
        pregunta_id: r.pregunta_id,
        respuesta: typeof r.respuesta === 'object' ? JSON.stringify(r.respuesta) : String(r.respuesta)
      }));

      // RGPD: Generar hash del navegador para encuestas anónimas
      let hashNavegador = null;
      const esAnonima = encuestaInfo?.privacidad_nivel === 'anonimato_completo' ||
                        encuestaInfo?.privacidad_nivel === 'anonimato_parcial';

      if (esAnonima) {
        hashNavegador = await this.generateBrowserHash();
        console.log('[enviarRespuestas] Encuesta anónima, hash generado');
      }

      // Intentar usar la RPC atómica fn_submit_encuesta
      console.log('[enviarRespuestas] Intentando RPC fn_submit_encuesta...');
      const { data: rpcResult, error: rpcError } = await supabase.rpc('fn_submit_encuesta', {
        p_encuesta_id: encuestaId,
        p_respuestas: respuestasJson,
        p_hash_ip: hashNavegador
      });

      if (!rpcError && rpcResult?.success) {
        console.log('[enviarRespuestas] RPC exitosa:', rpcResult);
        const data = rpcResult.data || {};
        return {
          success: true,
          message: rpcResult.message || 'Respuestas enviadas correctamente',
          puntos_ganados: data.puntos_total || data.puntos_base || 50,
          puntos_base: data.puntos_base || 50,
          puntos_bonus: data.puntos_bonus || 0,
          bonus_aplicado: data.bonus_aplicado || false,
          puntos_totales: data.nuevo_balance || 0,
          es_anonima: data.anonima || false
        };
      }

      // Si RPC falló con error de duplicado
      if (rpcResult?.is_duplicate || rpcResult?.code === 'DUPLICATE_SUBMISSION' || rpcResult?.code === 'ALREADY_SUBMITTED') {
        const err = new Error(rpcResult?.error || 'Ya has respondido esta encuesta');
        err.isDuplicate = true;
        err.ya_respondida = true;
        throw err;
      }

      // Si RPC no disponible o falló, usar fallback manual
      if (rpcError || !rpcResult?.success) {
        console.warn('[enviarRespuestas] RPC no disponible, usando fallback:', rpcError?.message || rpcResult?.error);
        return await this.enviarRespuestasFallback(encuestaId, respuestas, encuestaInfo);
      }

      throw new Error(rpcResult?.error || 'Error desconocido al enviar respuestas');
    } catch (error) {
      console.error('[enviarRespuestas] Error:', error);
      throw error;
    }
  },

  /**
   * Fallback para enviar respuestas si la RPC no está disponible
   * IMPORTANTE: Respeta RGPD - NO envía empleado_id en encuestas anónimas
   */
  async enviarRespuestasFallback(encuestaId, respuestas, encuestaInfo = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener empleado con departamento
    const { data: empleado } = await supabase
      .from('empleados')
      .select('id, departamento_id, departamentos(nombre)')
      .eq('auth_user_id', user.id)
      .single();

    if (!empleado?.id) {
      throw new Error('No se pudo obtener el ID del empleado');
    }

    // Obtener información de la encuesta si no se proporcionó
    let privacidadNivel = encuestaInfo?.privacidad_nivel;
    let puntosBase = encuestaInfo?.puntos_base || 50;

    if (!encuestaInfo) {
      const { data: encuesta } = await supabase
        .from('encuestas')
        .select('titulo, privacidad_nivel, puntos_base, puntos_bonus_rapido, bonus_horas_limite, fecha_inicio, fecha_creacion')
        .eq('id', encuestaId)
        .single();

      privacidadNivel = encuesta?.privacidad_nivel || 'identificado';
      puntosBase = encuesta?.puntos_base || 50;
    }

    // RGPD: Determinar qué datos guardar según nivel de privacidad
    const esAnonimato = privacidadNivel === 'anonimato_completo' || privacidadNivel === 'anonimato_parcial';
    const guardarEmpleadoId = privacidadNivel === 'identificado' ? empleado.id : null;
    const guardarDepartamento = privacidadNivel !== 'anonimato_completo' ? (empleado.departamentos?.nombre || null) : null;

    console.log('[enviarRespuestasFallback] RGPD:', {
      privacidadNivel,
      guardarEmpleadoId: guardarEmpleadoId ? 'SÍ' : 'NO (anónimo)',
      guardarDepartamento: guardarDepartamento ? 'SÍ' : 'NO'
    });

    // Verificar si ya respondió (solo para identificadas)
    if (privacidadNivel === 'identificado') {
      const { data: yaRespondio } = await supabase
        .from('respuestas_encuesta')
        .select('id')
        .eq('encuesta_id', encuestaId)
        .eq('empleado_id', empleado.id)
        .limit(1);

      if (yaRespondio && yaRespondio.length > 0) {
        const err = new Error('Ya has respondido esta encuesta');
        err.isDuplicate = true;
        throw err;
      }
    }

    // Generar hash para anónimas
    let hashNavegador = null;
    if (esAnonimato) {
      hashNavegador = await this.generateBrowserHash();
    }

    // Insertar respuestas (SIN empleado_id en anónimas)
    const respuestasData = respuestas.map(r => ({
      encuesta_id: encuestaId,
      pregunta_id: r.pregunta_id,
      empleado_id: guardarEmpleadoId, // NULL para anónimas
      departamento: guardarDepartamento,
      hash_ip: hashNavegador,
      respuesta: typeof r.respuesta === 'object' ? JSON.stringify(r.respuesta) : String(r.respuesta),
      puntos_otorgados: privacidadNivel === 'identificado' ? puntosBase : null
    }));

    const { data: insertedData, error: insertError } = await supabase
      .from('respuestas_encuesta')
      .insert(respuestasData)
      .select();

    if (insertError) {
      if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
        const err = new Error('Ya has respondido esta encuesta');
        err.isDuplicate = true;
        throw err;
      }
      throw new Error(`Error al guardar respuestas: ${insertError.message}`);
    }

    // Otorgar puntos usando RPC existente o fallback
    // IMPORTANTE: Los puntos SÍ se otorgan incluso en anónimas (tracking separado)
    let puntosOtorgados = puntosBase;
    try {
      const { data: rpcResult } = await supabase.rpc('fn_otorgar_puntos_encuesta', {
        p_encuesta_id: encuestaId,
        p_puntos: puntosBase
      });
      if (rpcResult?.success) {
        puntosOtorgados = rpcResult.puntos_otorgados || puntosBase;
      }
    } catch (e) {
      console.warn('[enviarRespuestasFallback] Error otorgando puntos:', e);
    }

    return {
      success: true,
      message: 'Respuestas enviadas correctamente',
      puntos_ganados: puntosOtorgados,
      puntos_base: puntosBase,
      puntos_bonus: 0,
      bonus_aplicado: false,
      puntos_totales: 0,
      es_anonima: esAnonimato
    };
  },

  /**
   * Verifica si el empleado ya respondió una encuesta
   * @param {string} encuestaId - ID de la encuesta
   * @returns {Promise<boolean>}
   */
  async yaRespondio(encuestaId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Obtener empleado.id (consistente con la escritura y la RPC)
      const { data: empleado } = await supabase
        .from('empleados')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!empleado) return false;

      const { data, error } = await supabase
        .from('respuestas_encuesta')
        .select('id')
        .eq('encuesta_id', encuestaId)
        .eq('empleado_id', empleado.id) // ← CORREGIDO: usar empleados.id
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error verificando respuesta:', error);
      return false;
    }
  }
};
