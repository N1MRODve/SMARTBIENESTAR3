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
    if (!empresaId) {
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
        return this._getEmptyAnalytics('Sin datos disponibles');
      }

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

      return resultado;

    } catch (error) {
      console.error('[Analítica] Error general:', error);
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
        return this._getEvolutionFallback(empresaId, meses);
      }

      if (!data || !Array.isArray(data)) {
        return [];
      }

      // Transformar al formato esperado
      const evolucion = data.map(d => ({
        mes: d.period,
        valor: d.wellbeing_avg || 0,
        participacion: d.participants || 0
      }));

      return evolucion;

    } catch (error) {
      console.error('[Analítica] Error en getEvolution, usando fallback:', error);
      return this._getEvolutionFallback(empresaId, meses);
    }
  },

  /**
   * Obtener métricas por categoría de bienestar
   */
  async getCategorias(empresaId) {
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
        return this._getCategoriasFallback(empresaId);
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        return this._getCategoriasFallback(empresaId);
      }

      // Transformar al formato esperado
      const categorias = data.map(d => ({
        categoria: d.category,
        valor: d.current_value || 0,
        variacion: d.variation || 0
      }));

      return categorias;

    } catch (error) {
      console.error('[Analítica] Error en getCategorias, usando fallback:', error);
      return this._getCategoriasFallback(empresaId);
    }
  },

  /**
   * Verificar consistencia de datos (para debugging)
   * Compara RPC con counts directos
   */
  async verificarConsistencia() {
    try {
      const { data, error } = await supabase.rpc('analytics_debug');

      if (error) {
        console.error('[Analítica] Error en verificación:', error);
        return { error: error.message };
      }

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
   * Fallback: Evolución temporal con queries directas
   */
  async _getEvolutionFallback(empresaId, meses = 6) {
    try {
      // Obtener encuestas de la empresa
      const { data: encuestas } = await supabase
        .from('encuestas')
        .select('id')
        .eq('empresa_id', empresaId);

      if (!encuestas || encuestas.length === 0) return [];

      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - meses);

      // Obtener respuestas en el rango
      const { data: respuestas } = await supabase
        .from('respuestas_encuesta')
        .select('respuesta, empleado_id, created_at')
        .in('encuesta_id', encuestas.map(e => e.id))
        .gte('created_at', dateFrom.toISOString());

      if (!respuestas || respuestas.length === 0) return [];

      // Agrupar por mes
      const porMes = {};
      respuestas.forEach(r => {
        const valor = parseInt(r.respuesta);
        if (isNaN(valor) || valor < 1 || valor > 5) return;

        const fecha = new Date(r.created_at);
        const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        const mesNombre = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });

        if (!porMes[clave]) {
          porMes[clave] = { mes: mesNombre, suma: 0, count: 0, empleados: new Set() };
        }
        porMes[clave].suma += valor;
        porMes[clave].count++;
        porMes[clave].empleados.add(r.empleado_id);
      });

      // Convertir a array ordenado
      return Object.keys(porMes)
        .sort()
        .map(clave => ({
          mes: porMes[clave].mes,
          valor: porMes[clave].count > 0 ? porMes[clave].suma / porMes[clave].count : 0,
          participacion: porMes[clave].empleados.size
        }));

    } catch (error) {
      console.error('[Analítica] Error en fallback evolución:', error);
      return [];
    }
  },

  /**
   * Fallback: Categorías con queries directas
   */
  async _getCategoriasFallback(empresaId) {
    try {
      // Obtener encuestas de la empresa
      const { data: encuestas } = await supabase
        .from('encuestas')
        .select('id')
        .eq('empresa_id', empresaId);

      if (!encuestas || encuestas.length === 0) return [];

      // Obtener preguntas con su categoría
      const { data: preguntas } = await supabase
        .from('preguntas_encuesta')
        .select('id, categoria')
        .in('encuesta_id', encuestas.map(e => e.id));

      if (!preguntas || preguntas.length === 0) return [];

      // Obtener respuestas
      const { data: respuestas } = await supabase
        .from('respuestas_encuesta')
        .select('pregunta_id, respuesta')
        .in('encuesta_id', encuestas.map(e => e.id));

      if (!respuestas || respuestas.length === 0) return [];

      // Crear mapa pregunta -> categoría
      const preguntaCat = {};
      preguntas.forEach(p => {
        preguntaCat[p.id] = p.categoria || 'General';
      });

      // Agrupar respuestas por categoría
      const porCategoria = {};
      respuestas.forEach(r => {
        const valor = parseInt(r.respuesta);
        if (isNaN(valor) || valor < 1 || valor > 5) return;

        const categoria = preguntaCat[r.pregunta_id] || 'General';
        if (!porCategoria[categoria]) {
          porCategoria[categoria] = { suma: 0, count: 0 };
        }
        porCategoria[categoria].suma += valor;
        porCategoria[categoria].count++;
      });

      // Convertir a array
      return Object.entries(porCategoria).map(([categoria, datos]) => ({
        categoria,
        valor: datos.count > 0 ? datos.suma / datos.count : 0,
        variacion: 0 // Sin variación en fallback
      }));

    } catch (error) {
      console.error('[Analítica] Error en fallback categorías:', error);
      return [];
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
