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
   * @returns {Promise<Object>} Datos completos de encuestas
   */
  async getDatosCompletos() {
    try {
      // Intentar usar la función RPC optimizada
      const { data, error } = await supabase.rpc('get_empleado_encuestas_data');

      if (error) {
        console.warn('RPC get_empleado_encuestas_data no disponible, usando fallback:', error.message);
        return await this.getDatosCompletosFallback();
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Error al obtener datos de encuestas');
      }

      return {
        success: true,
        empleado: data.empleado,
        pendientes: data.pendientes || [],
        historial: data.historial || [],
        stats: data.stats || {
          total_pendientes: 0,
          total_completadas: 0,
          puntos_disponibles: 0
        }
      };
    } catch (error) {
      console.error('Error en getDatosCompletos:', error);
      return await this.getDatosCompletosFallback();
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

      // Obtener encuestas respondidas
      const { data: respondidas } = await supabase
        .from('respuestas_encuesta')
        .select('encuesta_id, fecha_respuesta')
        .eq('empleado_id', user.id);

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

      const puntosDisponibles = pendientes.reduce((sum, e) => sum + (e.puntos_recompensa || 50), 0);

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

    // Obtener empresa del empleado
    const { data: empleado } = await supabase
      .from('empleados')
      .select('empresa_id')
      .eq('auth_user_id', user.id)
      .single();

    if (!empleado) throw new Error('Empleado no encontrado');

    // Verificar si ya respondió
    const { data: respExistente } = await supabase
      .from('respuestas_encuesta')
      .select('id')
      .eq('encuesta_id', encuestaId)
      .eq('empleado_id', user.id)
      .limit(1);

    if (respExistente && respExistente.length > 0) {
      const err = new Error('Ya has respondido esta encuesta');
      err.ya_respondida = true;
      throw err;
    }

    // Obtener encuesta (sin columnas tipo ni puntos_recompensa que no existen)
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

    // Formatear respuesta (puntos por defecto: 50)
    return {
      id: encuesta.id,
      titulo: encuesta.titulo,
      descripcion: encuesta.descripcion,
      categoria: encuesta.categoria,
      privacidad_nivel: encuesta.privacidad_nivel,
      puntos_recompensa: 50,
      fecha_fin: encuesta.fecha_fin,
      preguntas: (encuesta.preguntas_encuesta || []).sort((a, b) => a.orden - b.orden)
    };
  },

  /**
   * Envía las respuestas de una encuesta
   * @param {string} encuestaId - ID de la encuesta
   * @param {Array} respuestas - Array de respuestas {pregunta_id, respuesta}
   * @returns {Promise<Object>} Resultado del envío
   */
  async enviarRespuestas(encuestaId, respuestas) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      console.log('[enviarRespuestas] Usuario autenticado:', user.id);
      console.log('[enviarRespuestas] encuestaId:', encuestaId);
      console.log('[enviarRespuestas] respuestas recibidas:', respuestas);

      // Obtener datos del empleado con nombre del departamento
      const { data: empleado, error: empleadoError } = await supabase
        .from('empleados')
        .select('id, departamento_id, departamentos(nombre)')
        .eq('auth_user_id', user.id)
        .single();

      if (empleadoError) {
        console.error('[enviarRespuestas] Error obteniendo empleado:', empleadoError);
      }
      console.log('[enviarRespuestas] Empleado encontrado:', empleado);

      // Extraer nombre del departamento
      const nombreDepartamento = empleado?.departamentos?.nombre || null;

      // Validar que hay respuestas
      if (!respuestas || respuestas.length === 0) {
        throw new Error('No hay respuestas para enviar');
      }

      // Formatear respuestas para inserción
      const respuestasData = respuestas.map(r => ({
        encuesta_id: encuestaId,
        pregunta_id: r.pregunta_id,
        empleado_id: user.id,
        departamento: nombreDepartamento,
        respuesta: typeof r.respuesta === 'object' ? JSON.stringify(r.respuesta) : String(r.respuesta)
      }));

      console.log('[enviarRespuestas] Datos a insertar:', JSON.stringify(respuestasData, null, 2));

      // Insertar respuestas CON select para verificar que se insertaron
      const { data: insertedData, error: insertError } = await supabase
        .from('respuestas_encuesta')
        .insert(respuestasData)
        .select();

      console.log('[enviarRespuestas] Resultado insert - data:', insertedData);
      console.log('[enviarRespuestas] Resultado insert - error:', insertError);

      if (insertError) {
        console.error('[enviarRespuestas] Error de inserción:', insertError);
        // Verificar si es error de duplicado
        if (insertError.code === '23505' || insertError.message?.includes('duplicate')) {
          const err = new Error('Ya has respondido esta encuesta');
          err.isDuplicate = true;
          throw err;
        }
        throw new Error(`Error al guardar respuestas: ${insertError.message || insertError.code}`);
      }

      // Verificar que realmente se insertaron datos
      if (!insertedData || insertedData.length === 0) {
        console.error('[enviarRespuestas] No se insertaron datos (posible problema de RLS)');
        throw new Error('No se pudieron guardar las respuestas. Verifica los permisos.');
      }

      console.log('[enviarRespuestas] Respuestas guardadas exitosamente:', insertedData.length);

      // Obtener título de la encuesta para el motivo
      const { data: encuesta } = await supabase
        .from('encuestas')
        .select('titulo')
        .eq('id', encuestaId)
        .single();

      // Puntos por defecto (la tabla encuestas no tiene columna puntos_recompensa)
      const puntosGanados = 50;

      // Otorgar puntos al empleado
      if (empleado?.id) {
        console.log('[enviarRespuestas] Intentando otorgar puntos al empleado:', empleado.id);

        const { data: puntosData, error: puntosError } = await supabase
          .from('transacciones_puntos')
          .insert({
            empleado_id: empleado.id,
            cantidad: puntosGanados,
            tipo: 'ganados',
            motivo: `Encuesta completada: ${encuesta?.titulo || 'Encuesta'}`,
            referencia_id: encuestaId,
            referencia_tipo: 'encuesta'
          })
          .select();

        console.log('[enviarRespuestas] Resultado inserción puntos - data:', puntosData);
        console.log('[enviarRespuestas] Resultado inserción puntos - error:', puntosError);

        if (puntosError) {
          console.error('[enviarRespuestas] Error otorgando puntos:', puntosError);
          // No lanzamos error aquí para que la encuesta se considere completada
          // aunque los puntos no se hayan otorgado
        }
      } else {
        console.warn('[enviarRespuestas] No se pudieron otorgar puntos: empleado.id no disponible');
      }

      return {
        success: true,
        message: 'Respuestas enviadas correctamente',
        puntos_ganados: puntosGanados
      };
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      throw error;
    }
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

      const { data, error } = await supabase
        .from('respuestas_encuesta')
        .select('id')
        .eq('encuesta_id', encuestaId)
        .eq('empleado_id', user.id)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error verificando respuesta:', error);
      return false;
    }
  }
};
