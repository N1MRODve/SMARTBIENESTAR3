import { supabase } from '@/lib/supabase';

/**
 * =====================================================
 * Servicio de Analítica Ejecutiva
 * =====================================================
 * Proporciona métricas consolidadas REALES desde Supabase RPCs
 *
 * IMPORTANTE: Este servicio NO usa valores hardcodeados.
 * Todos los datos provienen de funciones RPC en la base de datos.
 *
 * RPCs utilizadas:
 * - analytics_overview: Resumen general de KPIs
 * - analytics_departments_ranking: Ranking de departamentos
 * - analytics_wellbeing_timeseries: Evolución temporal
 * - analytics_categories: Métricas por categoría de bienestar
 * - analytics_debug: Verificación de consistencia
 * =====================================================
 */

const analiticaService = {
  /**
   * Obtener resumen general de analítica
   * Llama a la RPC analytics_overview
   */
  async getAnalytics(empresaId, dateFrom = null, dateTo = null, departmentIds = null) {
    console.log('[Analítica] Cargando datos via RPC para empresa:', empresaId);

    if (!empresaId) {
      console.warn('[Analítica] empresaId es null o undefined');
      return this._getEmptyAnalytics('No se especificó empresa');
    }

    try {
      // Llamar a la RPC
      const { data, error } = await supabase.rpc('analytics_overview', {
        p_date_from: dateFrom,
        p_date_to: dateTo,
        p_department_ids: departmentIds
      });

      if (error) {
        console.error('[Analítica] Error en RPC analytics_overview:', error);
        throw error;
      }

      if (!data) {
        console.warn('[Analítica] RPC retornó null');
        return this._getEmptyAnalytics('Sin datos disponibles');
      }

      console.log('[Analítica] Datos RPC recibidos:', data);

      // Obtener ranking de departamentos
      const deptRanking = await this._getDepartmentsRanking(dateFrom, dateTo);

      // Transformar respuesta de RPC al formato esperado por el frontend
      const resultado = {
        // Métricas de bienestar
        bienestar_global: data.wellbeing?.index || 0,
        variacion_trimestral: data.wellbeing?.variation || 0,

        // Participación
        participacion_global: data.employees?.participation_rate || 0,

        // Empleados
        empleados_totales: data.employees?.total || 0,
        empleados_activos: data.employees?.active || 0,

        // Encuestas
        encuestas_activas: data.surveys?.active || 0,
        encuestas_completadas: data.surveys?.closed || 0,
        total_respuestas_encuestas: data.surveys?.responses_in_period || 0,

        // Comunicados
        comunicados_enviados: data.communications?.sent || 0,
        tasa_lectura_comunicados: data.communications?.read_rate || 0,

        // Alertas (departamentos con bienestar < 3.0)
        alertas_activas: deptRanking.filter(d => d.promedio > 0 && d.promedio < 3.0).length,

        // Departamentos
        departamentos_fuertes: deptRanking
          .filter(d => d.promedio >= 3.5)
          .slice(0, 3),
        departamentos_criticos: deptRanking
          .filter(d => d.promedio > 0 && d.promedio < 3.5)
          .slice(0, 3),

        // Metadata
        _source: 'rpc',
        _generated_at: data.generated_at,
        _date_range: data.date_range
      };

      console.log('[Analítica] Datos transformados:', resultado);
      return resultado;

    } catch (error) {
      console.error('[Analítica] Error general:', error);
      // En caso de error, intentar fallback con queries directas
      console.log('[Analítica] Intentando fallback con queries directas...');
      return this._getAnalyticsFallback(empresaId);
    }
  },

  /**
   * Obtener ranking de departamentos
   */
  async _getDepartmentsRanking(dateFrom = null, dateTo = null) {
    try {
      const { data, error } = await supabase.rpc('analytics_departments_ranking', {
        p_date_from: dateFrom,
        p_date_to: dateTo,
        p_limit: 10
      });

      if (error) {
        console.error('[Analítica] Error en RPC departments_ranking:', error);
        return [];
      }

      if (!data || !Array.isArray(data)) {
        return [];
      }

      // Transformar al formato esperado
      return data.map(d => ({
        nombre: d.nombre,
        empleados: d.employees_total || 0,
        promedio: d.wellbeing_score || 0,
        tendencia: d.trend || 'stable',
        participacion: d.participation_rate || 0
      }));

    } catch (error) {
      console.error('[Analítica] Error obteniendo ranking:', error);
      return [];
    }
  },

  /**
   * Obtener evolución temporal del bienestar
   */
  async getEvolution(empresaId, meses = 6) {
    console.log('[Analítica] Cargando evolución via RPC');

    if (!empresaId) {
      return [];
    }

    try {
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - meses);

      const { data, error } = await supabase.rpc('analytics_wellbeing_timeseries', {
        p_date_from: dateFrom.toISOString(),
        p_date_to: new Date().toISOString(),
        p_granularity: 'month'
      });

      if (error) {
        console.error('[Analítica] Error en RPC timeseries:', error);
        return [];
      }

      if (!data || !Array.isArray(data)) {
        console.log('[Analítica] Sin datos de evolución');
        return [];
      }

      // Transformar al formato esperado
      const evolucion = data.map(d => ({
        mes: d.period,
        valor: d.wellbeing_avg || 0,
        participacion: d.participants || 0
      }));

      console.log('[Analítica] Evolución calculada:', evolucion.length, 'períodos');
      return evolucion;

    } catch (error) {
      console.error('[Analítica] Error en getEvolution:', error);
      return [];
    }
  },

  /**
   * Obtener métricas por categoría de bienestar
   */
  async getCategorias(empresaId) {
    console.log('[Analítica] Cargando categorías via RPC');

    if (!empresaId) {
      return [];
    }

    try {
      const { data, error } = await supabase.rpc('analytics_categories', {
        p_date_from: null,
        p_date_to: null
      });

      if (error) {
        console.error('[Analítica] Error en RPC categories:', error);
        return [];
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('[Analítica] Sin datos de categorías');
        return [];
      }

      // Transformar al formato esperado
      const categorias = data.map(d => ({
        categoria: d.category,
        valor: d.current_value || 0,
        variacion: d.variation || 0
      }));

      console.log('[Analítica] Categorías calculadas:', categorias.length);
      return categorias;

    } catch (error) {
      console.error('[Analítica] Error en getCategorias:', error);
      return [];
    }
  },

  /**
   * Verificar consistencia de datos (para debugging)
   * Compara RPC con counts directos
   */
  async verificarConsistencia() {
    console.log('[Analítica] Verificando consistencia de datos...');

    try {
      const { data, error } = await supabase.rpc('analytics_debug');

      if (error) {
        console.error('[Analítica] Error en verificación:', error);
        return { error: error.message };
      }

      console.log('[Analítica] Datos de debug:', data);
      return data;

    } catch (error) {
      console.error('[Analítica] Error en verificación:', error);
      return { error: error.message };
    }
  },

  /**
   * Fallback: Obtener analítica con queries directas
   * Se usa si las RPCs fallan o no están disponibles
   */
  async _getAnalyticsFallback(empresaId) {
    console.log('[Analítica] Usando fallback con queries directas');

    try {
      // 1. Empleados
      const { data: empleados, error: empError } = await supabase
        .from('empleados')
        .select('id, departamento_id, estado')
        .eq('empresa_id', empresaId);

      if (empError) throw empError;

      const empleadosActivos = (empleados || []).filter(e =>
        e.estado?.toLowerCase() === 'activo'
      );

      // 2. Departamentos
      const { data: departamentos } = await supabase
        .from('departamentos')
        .select('id, nombre')
        .eq('empresa_id', empresaId);

      // 3. Encuestas
      const { data: encuestas } = await supabase
        .from('encuestas')
        .select('id, estado')
        .eq('empresa_id', empresaId);

      const encuestasData = encuestas || [];

      // 4. Respuestas (solo si hay encuestas)
      let respuestas = [];
      if (encuestasData.length > 0) {
        const { data: respData } = await supabase
          .from('respuestas_encuesta')
          .select('id, empleado_id, respuesta')
          .in('encuesta_id', encuestasData.map(e => e.id));
        respuestas = respData || [];
      }

      // 5. Comunicados
      const { data: comunicados } = await supabase
        .from('comunicados')
        .select('id, estado, alcance_estimado')
        .eq('empresa_id', empresaId);

      const comunicadosEnviados = (comunicados || []).filter(c =>
        ['enviado', 'publicado'].includes(c.estado?.toLowerCase())
      );

      // Calcular métricas
      const totalEmpleados = empleadosActivos.length;

      // Bienestar global
      const respuestasNumericas = respuestas.filter(r => {
        const v = parseInt(r.respuesta);
        return !isNaN(v) && v >= 1 && v <= 5;
      });
      const bienestarGlobal = respuestasNumericas.length > 0
        ? respuestasNumericas.reduce((s, r) => s + parseInt(r.respuesta), 0) / respuestasNumericas.length
        : 0;

      // Participación
      const empleadosQueRespondieron = new Set(respuestas.map(r => r.empleado_id)).size;
      const participacion = totalEmpleados > 0
        ? Math.round((empleadosQueRespondieron / totalEmpleados) * 100)
        : 0;

      // Departamentos con métricas
      const metricasDept = (departamentos || []).map(dept => {
        const empDept = empleadosActivos.filter(e => e.departamento_id === dept.id);
        const respDept = respuestas.filter(r =>
          empDept.some(e => e.id === r.empleado_id)
        );
        const respNumDept = respDept.filter(r => {
          const v = parseInt(r.respuesta);
          return !isNaN(v) && v >= 1 && v <= 5;
        });
        const promedio = respNumDept.length > 0
          ? respNumDept.reduce((s, r) => s + parseInt(r.respuesta), 0) / respNumDept.length
          : 0;

        return {
          nombre: dept.nombre,
          empleados: empDept.length,
          promedio,
          tendencia: promedio >= 4.0 ? 'up' : promedio < 3.0 ? 'down' : 'stable'
        };
      });

      const deptosConDatos = metricasDept.filter(d => d.promedio > 0);

      return {
        bienestar_global: bienestarGlobal,
        variacion_trimestral: 0,
        participacion_global: participacion,
        empleados_totales: totalEmpleados,
        empleados_activos: empleadosQueRespondieron,
        encuestas_activas: encuestasData.filter(e => e.estado?.toLowerCase() === 'activa').length,
        encuestas_completadas: encuestasData.filter(e => e.estado?.toLowerCase() === 'cerrada').length,
        total_respuestas_encuestas: respuestas.length,
        comunicados_enviados: comunicadosEnviados.length,
        tasa_lectura_comunicados: 0,
        alertas_activas: deptosConDatos.filter(d => d.promedio < 3.0).length,
        departamentos_fuertes: [...deptosConDatos]
          .sort((a, b) => b.promedio - a.promedio)
          .slice(0, 3),
        departamentos_criticos: deptosConDatos
          .filter(d => d.promedio < 3.5)
          .sort((a, b) => a.promedio - b.promedio)
          .slice(0, 3),
        _source: 'fallback',
        _warning: 'Datos obtenidos via fallback, RPCs no disponibles'
      };

    } catch (error) {
      console.error('[Analítica] Error en fallback:', error);
      return this._getEmptyAnalytics('Error al cargar datos');
    }
  },

  /**
   * Devuelve objeto de analítica vacío
   */
  _getEmptyAnalytics(reason = null) {
    return {
      bienestar_global: null,
      variacion_trimestral: null,
      participacion_global: null,
      alertas_activas: 0,
      encuestas_activas: 0,
      encuestas_completadas: 0,
      empleados_totales: 0,
      empleados_activos: 0,
      departamentos_fuertes: [],
      departamentos_criticos: [],
      comunicados_enviados: 0,
      tasa_lectura_comunicados: null,
      total_respuestas_encuestas: 0,
      _source: 'empty',
      _reason: reason
    };
  }
};

export { analiticaService };
