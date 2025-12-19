/**
 * Servicio de Recomendaciones SMART
 *
 * Gestiona la generación, carga y actualización de recomendaciones SMART
 * basadas en los resultados de las encuestas de bienestar.
 *
 * Utiliza umbrales académicos IWBS (11,702 empleados):
 * - < 53: Crítico
 * - 53-66: Alto
 * - 66-75: Moderado
 * - 75-88: Saludable
 * - >= 88: Óptimo
 */

import { supabase } from '@/lib/supabase';

// Mapeo de nombres de categoría a dimension_id
const DIMENSION_MAP = {
  'Salud Mental': 'salud_mental',
  'Clima Laboral': 'clima_laboral',
  'Carga de Trabajo': 'carga_trabajo',
  'Comunicación': 'comunicacion',
  'Liderazgo': 'liderazgo',
  'Desarrollo Profesional': 'desarrollo',
  'Reconocimiento': 'reconocimiento',
  'Bienestar Físico': 'bienestar_fisico',
  'Propósito': 'proposito',
  // Variantes con acentos y formatos alternativos
  'Comunicacion': 'comunicacion',
  'Desarrollo': 'desarrollo',
  'Proposito': 'proposito'
};

// Mapeo de dimensión a servicio SMART (consistente con serviciosSmart.js)
const SERVICIO_MAP = {
  'salud_mental': 'salud-mental',
  'clima_laboral': 'clima-laboral',
  'carga_trabajo': 'balance-vida',
  'comunicacion': 'comunicacion-interna',
  'liderazgo': 'liderazgo-efectivo',
  'desarrollo': 'desarrollo-profesional',
  'reconocimiento': 'reconocimiento',
  'bienestar_fisico': 'recursos-condiciones',
  'proposito': 'cultura-innovacion'
};

// Acciones sugeridas por dimensión y nivel de riesgo
const ACCIONES_POR_DIMENSION = {
  salud_mental: {
    critico: [
      { orden: 1, accion: 'Programar talleres de mindfulness y gestión del estrés', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Ofrecer sesiones 1:1 de apoyo psicológico', responsable: 'bienestar', urgencia: 'alta' },
      { orden: 3, accion: 'Implementar días de salud mental', responsable: 'direccion', urgencia: 'media' },
      { orden: 4, accion: 'Revisar cargas de trabajo del equipo', responsable: 'lideres', urgencia: 'alta' }
    ],
    moderado: [
      { orden: 1, accion: 'Encuestas de pulso más frecuentes', responsable: 'rrhh', urgencia: 'media' },
      { orden: 2, accion: 'Pausas activas durante la jornada', responsable: 'bienestar', urgencia: 'baja' },
      { orden: 3, accion: 'Recursos de gestión del estrés', responsable: 'comunicacion', urgencia: 'baja' }
    ]
  },
  comunicacion: {
    critico: [
      { orden: 1, accion: 'Implementar reuniones de equipo semanales', responsable: 'lideres', urgencia: 'alta' },
      { orden: 2, accion: 'Crear canales de comunicación transparentes', responsable: 'direccion', urgencia: 'alta' },
      { orden: 3, accion: 'Capacitación en comunicación efectiva', responsable: 'rrhh', urgencia: 'media' },
      { orden: 4, accion: 'Establecer protocolos de comunicación claros', responsable: 'operaciones', urgencia: 'alta' }
    ],
    moderado: [
      { orden: 1, accion: 'Town halls mensuales', responsable: 'direccion', urgencia: 'media' },
      { orden: 2, accion: 'Reforzar feedback bidireccional', responsable: 'lideres', urgencia: 'media' }
    ]
  },
  carga_trabajo: {
    critico: [
      { orden: 1, accion: 'Revisar políticas de horarios y flexibilidad', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Implementar horarios flexibles o trabajo remoto', responsable: 'direccion', urgencia: 'alta' },
      { orden: 3, accion: 'Establecer límites claros de disponibilidad', responsable: 'lideres', urgencia: 'alta' },
      { orden: 4, accion: 'Promover desconexión fuera del horario', responsable: 'comunicacion', urgencia: 'media' }
    ],
    moderado: [
      { orden: 1, accion: 'Mantener políticas de flexibilidad', responsable: 'rrhh', urgencia: 'baja' },
      { orden: 2, accion: 'Promover vacaciones y descanso', responsable: 'lideres', urgencia: 'media' }
    ]
  },
  clima_laboral: {
    critico: [
      { orden: 1, accion: 'Diagnóstico de clima con focus groups', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Plan de mejora de ambiente laboral', responsable: 'direccion', urgencia: 'alta' },
      { orden: 3, accion: 'Actividades de team building', responsable: 'bienestar', urgencia: 'media' },
      { orden: 4, accion: 'Reconocimiento público de logros', responsable: 'lideres', urgencia: 'alta' }
    ],
    moderado: [
      { orden: 1, accion: 'Mantener actividades de integración', responsable: 'bienestar', urgencia: 'media' },
      { orden: 2, accion: 'Celebrar éxitos del equipo', responsable: 'lideres', urgencia: 'baja' }
    ]
  },
  liderazgo: {
    critico: [
      { orden: 1, accion: 'Programa de desarrollo de liderazgo', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Coaching ejecutivo para líderes', responsable: 'direccion', urgencia: 'alta' },
      { orden: 3, accion: 'Feedback 360 para managers', responsable: 'rrhh', urgencia: 'media' },
      { orden: 4, accion: 'Capacitación en liderazgo empático', responsable: 'desarrollo', urgencia: 'alta' }
    ],
    moderado: [
      { orden: 1, accion: 'Sesiones de mentoring continuo', responsable: 'direccion', urgencia: 'media' },
      { orden: 2, accion: 'Reforzar prácticas de liderazgo positivo', responsable: 'rrhh', urgencia: 'baja' }
    ]
  },
  reconocimiento: {
    critico: [
      { orden: 1, accion: 'Implementar programa de reconocimiento formal', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Sistema de bonos o incentivos', responsable: 'direccion', urgencia: 'alta' },
      { orden: 3, accion: 'Reconocimiento público en comunicados', responsable: 'comunicacion', urgencia: 'media' },
      { orden: 4, accion: 'Programa de empleado del mes', responsable: 'bienestar', urgencia: 'media' }
    ],
    moderado: [
      { orden: 1, accion: 'Mantener reconocimientos periódicos', responsable: 'lideres', urgencia: 'media' },
      { orden: 2, accion: 'Celebrar aniversarios y logros', responsable: 'rrhh', urgencia: 'baja' }
    ]
  },
  desarrollo: {
    critico: [
      { orden: 1, accion: 'Crear planes de carrera individuales', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Programa de capacitación continua', responsable: 'desarrollo', urgencia: 'alta' },
      { orden: 3, accion: 'Oportunidades de promoción interna', responsable: 'direccion', urgencia: 'media' },
      { orden: 4, accion: 'Mentoring con líderes senior', responsable: 'lideres', urgencia: 'alta' }
    ],
    moderado: [
      { orden: 1, accion: 'Cursos de actualización periódicos', responsable: 'desarrollo', urgencia: 'media' },
      { orden: 2, accion: 'Participación en proyectos especiales', responsable: 'lideres', urgencia: 'baja' }
    ]
  },
  // Default para dimensiones no mapeadas
  default: {
    critico: [
      { orden: 1, accion: 'Diagnóstico detallado del área', responsable: 'rrhh', urgencia: 'alta' },
      { orden: 2, accion: 'Plan de intervención inmediata', responsable: 'direccion', urgencia: 'alta' },
      { orden: 3, accion: 'Asignar responsables y recursos', responsable: 'operaciones', urgencia: 'alta' },
      { orden: 4, accion: 'Monitoreo semanal de progreso', responsable: 'rrhh', urgencia: 'alta' }
    ],
    moderado: [
      { orden: 1, accion: 'Encuestas de seguimiento', responsable: 'rrhh', urgencia: 'media' },
      { orden: 2, accion: 'Mejoras incrementales', responsable: 'lideres', urgencia: 'baja' }
    ]
  }
};

export const recomendacionesService = {
  /**
   * Calcula el nivel de riesgo basado en umbrales IWBS
   * @param {number} score - Score de 0-100
   * @returns {string} Nivel de riesgo
   */
  calcularNivelRiesgo(score) {
    if (score < 53) return 'critico';
    if (score < 66) return 'alto';
    if (score < 75) return 'moderado';
    if (score < 88) return 'saludable';
    return 'optimo';
  },

  /**
   * Obtiene la prioridad basada en nivel de riesgo (1 = más urgente)
   */
  obtenerPrioridad(nivelRiesgo) {
    const prioridades = { critico: 1, alto: 3, moderado: 5, saludable: 7, optimo: 9 };
    return prioridades[nivelRiesgo] || 5;
  },

  /**
   * Obtiene el plazo en días basado en nivel de riesgo
   */
  obtenerPlazoDias(nivelRiesgo) {
    const plazos = { critico: 15, alto: 30, moderado: 45, saludable: 60, optimo: 90 };
    return plazos[nivelRiesgo] || 30;
  },

  /**
   * Obtiene la descripción del nivel de riesgo
   */
  obtenerDescripcionNivel(nivelRiesgo) {
    const descripciones = {
      critico: 'Se requiere atención URGENTE e inmediata. Alto riesgo de rotación y bajo rendimiento.',
      alto: 'Requiere acción prioritaria. Situación preocupante que puede empeorar.',
      moderado: 'Oportunidad de mejora proactiva. Potencial de optimización identificado.',
      saludable: 'Mantener monitoreo continuo. Situación estable con áreas de refuerzo.',
      optimo: 'Excelente. Mantener prácticas actuales y documentar buenas prácticas.'
    };
    return descripciones[nivelRiesgo] || '';
  },

  /**
   * Mapea el nombre de categoría a dimension_id
   */
  mapearDimension(nombreCategoria) {
    return DIMENSION_MAP[nombreCategoria] ||
      nombreCategoria.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  /**
   * Obtiene el servicio SMART correspondiente a una dimensión
   */
  obtenerServicioSmart(dimensionId) {
    return SERVICIO_MAP[dimensionId] || 'clima-laboral';
  },

  /**
   * Obtiene las acciones sugeridas para una dimensión y nivel de riesgo
   */
  obtenerAccionesSugeridas(dimensionId, nivelRiesgo) {
    const dimensionAcciones = ACCIONES_POR_DIMENSION[dimensionId] || ACCIONES_POR_DIMENSION.default;
    const nivel = ['critico', 'alto'].includes(nivelRiesgo) ? 'critico' : 'moderado';
    return dimensionAcciones[nivel] || dimensionAcciones.moderado || [];
  },

  /**
   * Genera recomendaciones automáticas para una encuesta
   * Intenta usar RPC primero, con fallback a generación en frontend
   *
   * @param {string} encuestaId - ID de la encuesta
   * @param {Object} resultados - Resultados procesados de la encuesta
   * @returns {Promise<Object>} Resultado de la generación
   */
  async generarRecomendacionesAutomaticas(encuestaId, resultados) {
    try {
      console.log('[recomendaciones.service] Generando recomendaciones para encuesta:', encuestaId);
      console.log('[recomendaciones.service] Resultados recibidos:', resultados);

      // Preparar datos para RPC
      const categorias = (resultados.categoriasInterpretadas || []).map(cat => ({
        nombre: cat.nombre,
        dimension_id: cat.dimension_id || this.mapearDimension(cat.nombre),
        valor: cat.valor
      }));

      const rpcParams = {
        p_encuesta_id: encuestaId,
        p_empresa_id: resultados.empresa_id,
        p_resultados: {
          indice_global: resultados.indiceBienestarGlobal,
          categorias
        }
      };

      console.log('[recomendaciones.service] Llamando RPC con params:', rpcParams);

      // Intentar RPC primero
      const { data, error } = await supabase.rpc('fn_generar_recomendaciones_smart', rpcParams);

      if (error) {
        console.warn('[recomendaciones.service] RPC no disponible, usando fallback:', error.message);
        return await this.generarRecomendacionesFallback(encuestaId, resultados);
      }

      console.log('[recomendaciones.service] RPC resultado:', data);
      return data;

    } catch (error) {
      console.error('[recomendaciones.service] Error generando recomendaciones:', error);
      return await this.generarRecomendacionesFallback(encuestaId, resultados);
    }
  },

  /**
   * Fallback: Genera recomendaciones en frontend si RPC no está disponible
   */
  async generarRecomendacionesFallback(encuestaId, resultados) {
    console.log('[recomendaciones.service] Ejecutando fallback de generación');

    const recomendaciones = [];
    const categoriasInterpretadas = resultados.categoriasInterpretadas || [];

    for (const categoria of categoriasInterpretadas) {
      const nivelRiesgo = this.calcularNivelRiesgo(categoria.valor);

      // Solo generar para categorías con riesgo moderado o superior
      if (!['critico', 'alto', 'moderado'].includes(nivelRiesgo)) {
        continue;
      }

      const dimensionId = this.mapearDimension(categoria.nombre);
      const prioridad = this.obtenerPrioridad(nivelRiesgo);
      const plazoDias = this.obtenerPlazoDias(nivelRiesgo);
      const incrementoEsperado = { critico: 15, alto: 12, moderado: 8 }[nivelRiesgo] || 8;
      const objetivoScore = Math.min(categoria.valor + incrementoEsperado, 85);

      const recomendacion = {
        empresa_id: resultados.empresa_id,
        encuesta_id: encuestaId,
        indice_bienestar_global: resultados.indiceBienestarGlobal,
        dimension_afectada: dimensionId,
        score_dimension: categoria.valor,
        nivel_riesgo: nivelRiesgo,
        titulo: `Plan de mejora: ${categoria.nombre}`,
        descripcion: `Score actual: ${Math.round(categoria.valor)}%. ${this.obtenerDescripcionNivel(nivelRiesgo)}`,
        objetivo_especifico: `Incrementar el índice de ${categoria.nombre} del ${Math.round(categoria.valor)}% actual a ${Math.round(objetivoScore)}% en ${plazoDias} días`,
        metrica_exito: `Score >= ${Math.round(Math.min(categoria.valor + 10, 80))}% en próxima encuesta de seguimiento`,
        es_alcanzable_justificacion: 'Basado en mejoras incrementales de 10-15% observadas en programas de bienestar similares.',
        relevancia: `Impacta directamente en el índice de bienestar global (${Math.round(resultados.indiceBienestarGlobal)}%) y afecta la productividad del equipo.`,
        plazo_dias: plazoDias,
        fecha_limite: new Date(Date.now() + plazoDias * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        prioridad,
        acciones_sugeridas: this.obtenerAccionesSugeridas(dimensionId, nivelRiesgo),
        servicio_smart_id: this.obtenerServicioSmart(dimensionId)
      };

      console.log('[recomendaciones.service] Insertando recomendación:', recomendacion.titulo);

      const { data, error } = await supabase
        .from('recomendaciones_smart')
        .insert(recomendacion)
        .select()
        .single();

      if (error) {
        console.error('[recomendaciones.service] Error insertando recomendación:', error);
        continue;
      }

      if (data) {
        recomendaciones.push(data);
      }
    }

    return {
      success: true,
      message: `Se generaron ${recomendaciones.length} recomendaciones SMART`,
      recomendaciones_generadas: recomendaciones.length,
      recomendaciones
    };
  },

  /**
   * Obtiene las recomendaciones existentes para una encuesta
   */
  async getRecomendaciones(encuestaId) {
    try {
      console.log('[recomendaciones.service] Cargando recomendaciones para encuesta:', encuestaId);

      const { data, error } = await supabase
        .from('recomendaciones_smart')
        .select('*')
        .eq('encuesta_id', encuestaId)
        .order('prioridad', { ascending: true });

      if (error) {
        console.error('[recomendaciones.service] Error cargando recomendaciones:', error);
        throw error;
      }

      console.log('[recomendaciones.service] Recomendaciones cargadas:', data?.length || 0);
      return data || [];

    } catch (error) {
      console.error('[recomendaciones.service] Error en getRecomendaciones:', error);
      return [];
    }
  },

  /**
   * Verifica si ya existen recomendaciones para una encuesta
   */
  async existenRecomendaciones(encuestaId) {
    try {
      const { count, error } = await supabase
        .from('recomendaciones_smart')
        .select('id', { count: 'exact', head: true })
        .eq('encuesta_id', encuestaId);

      if (error) throw error;
      return (count || 0) > 0;

    } catch (error) {
      console.error('[recomendaciones.service] Error verificando existencia:', error);
      return false;
    }
  },

  /**
   * Actualiza el estado de una recomendación
   */
  async actualizarEstado(recomendacionId, nuevoEstado, notas = null) {
    try {
      const updates = {
        estado: nuevoEstado,
        updated_at: new Date().toISOString()
      };

      if (nuevoEstado === 'completada') {
        updates.fecha_completado = new Date().toISOString();
      }

      if (nuevoEstado === 'en_progreso' && !updates.fecha_inicio_seguimiento) {
        updates.fecha_inicio_seguimiento = new Date().toISOString().split('T')[0];
      }

      if (notas) {
        updates.notas_seguimiento = notas;
      }

      const { data, error } = await supabase
        .from('recomendaciones_smart')
        .update(updates)
        .eq('id', recomendacionId)
        .select()
        .single();

      if (error) throw error;

      console.log('[recomendaciones.service] Estado actualizado:', recomendacionId, '->', nuevoEstado);
      return data;

    } catch (error) {
      console.error('[recomendaciones.service] Error actualizando estado:', error);
      throw error;
    }
  },

  /**
   * Marca una recomendación como gestionada (en_progreso)
   */
  async marcarComoGestionada(recomendacionId, notas = null) {
    return this.actualizarEstado(recomendacionId, 'en_progreso', notas);
  },

  /**
   * Marca una recomendación como completada
   */
  async marcarComoCompletada(recomendacionId, resultadoFinal = null) {
    try {
      const updates = {
        estado: 'completada',
        fecha_completado: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (resultadoFinal) {
        updates.resultado_final = resultadoFinal;
      }

      const { data, error } = await supabase
        .from('recomendaciones_smart')
        .update(updates)
        .eq('id', recomendacionId)
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('[recomendaciones.service] Error marcando como completada:', error);
      throw error;
    }
  },

  /**
   * Descarta una recomendación
   */
  async descartar(recomendacionId, motivo = null) {
    return this.actualizarEstado(recomendacionId, 'descartada', motivo);
  },

  /**
   * Obtiene estadísticas de recomendaciones por empresa
   */
  async getEstadisticas(empresaId) {
    try {
      const { data, error } = await supabase
        .from('recomendaciones_smart')
        .select('estado, nivel_riesgo, dimension_afectada')
        .eq('empresa_id', empresaId);

      if (error) throw error;

      const stats = {
        total: data.length,
        por_estado: {},
        por_nivel: {},
        por_dimension: {}
      };

      data.forEach(rec => {
        stats.por_estado[rec.estado] = (stats.por_estado[rec.estado] || 0) + 1;
        stats.por_nivel[rec.nivel_riesgo] = (stats.por_nivel[rec.nivel_riesgo] || 0) + 1;
        stats.por_dimension[rec.dimension_afectada] = (stats.por_dimension[rec.dimension_afectada] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('[recomendaciones.service] Error obteniendo estadísticas:', error);
      return { total: 0, por_estado: {}, por_nivel: {}, por_dimension: {} };
    }
  }
};
