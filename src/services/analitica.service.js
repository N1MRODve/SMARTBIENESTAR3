import { supabase } from '@/lib/supabase';

export const analiticaService = {
  async getAnalytics(empresaId) {
    try {
      // Obtener todas las encuestas completadas
      const { data: encuestas, error: encuestasError } = await supabase
        .from('encuestas')
        .select('id, titulo, estado')
        .eq('empresa_id', empresaId);

      if (encuestasError) throw encuestasError;

      // Obtener todas las respuestas
      const { data: respuestas, error: respuestasError } = await supabase
        .from('respuestas_encuesta')
        .select(`
          *,
          preguntas_encuesta (
            *
          ),
          empleados (
            departamento_id,
            departamentos (
              nombre
            )
          )
        `)
        .in('encuesta_id', encuestas.map(e => e.id));

      if (respuestasError) throw respuestasError;

      // Obtener departamentos
      const { data: departamentos, error: deptosError } = await supabase
        .from('departamentos')
        .select('id, nombre')
        .eq('empresa_id', empresaId);

      if (deptosError) throw deptosError;

      // Obtener empleados
      const { data: empleados, error: empleadosError } = await supabase
        .from('empleados')
        .select('id, departamento_id, estado')
        .eq('empresa_id', empresaId);

      if (empleadosError) throw empleadosError;

      // Calcular métricas
      const totalEmpleados = empleados.filter(e => e.estado === 'Activo').length;
      const totalRespuestas = respuestas.length;
      const encuestasActivas = encuestas.filter(e => e.estado === 'activa').length;
      const encuestasCompletadas = encuestas.filter(e => e.estado === 'cerrada').length;

      // Calcular bienestar global (promedio de todas las respuestas numéricas)
      const respuestasNumericas = respuestas.filter(r => {
        const valor = parseInt(r.respuesta);
        return !isNaN(valor) && valor >= 1 && valor <= 5;
      });

      const bienestarGlobal = respuestasNumericas.length > 0
        ? respuestasNumericas.reduce((sum, r) => sum + parseInt(r.respuesta), 0) / respuestasNumericas.length
        : 0;

      // Calcular participación global
      const participacionGlobal = totalEmpleados > 0
        ? Math.round((totalRespuestas / (totalEmpleados * encuestas.length)) * 100)
        : 0;

      // Calcular métricas por departamento
      const metricasPorDepartamento = departamentos.map(dept => {
        const empleadosDept = empleados.filter(e => e.departamento_id === dept.id);
        const respuestasDept = respuestas.filter(r =>
          r.empleados?.departamento_id === dept.id
        );

        const respuestasNumericasDept = respuestasDept.filter(r => {
          const valor = parseInt(r.respuesta);
          return !isNaN(valor) && valor >= 1 && valor <= 5;
        });

        const promedio = respuestasNumericasDept.length > 0
          ? respuestasNumericasDept.reduce((sum, r) => sum + parseInt(r.respuesta), 0) / respuestasNumericasDept.length
          : 0;

        return {
          nombre: dept.nombre,
          empleados: empleadosDept.length,
          promedio,
          tendencia: promedio >= 4.0 ? 'up' : 'stable'
        };
      });

      // Ordenar departamentos
      const departamentosFuertes = [...metricasPorDepartamento]
        .sort((a, b) => b.promedio - a.promedio)
        .slice(0, 3);

      const departamentosCriticos = [...metricasPorDepartamento]
        .filter(d => d.promedio < 3.5)
        .sort((a, b) => a.promedio - b.promedio)
        .slice(0, 3);

      return {
        bienestar_global: bienestarGlobal,
        variacion_trimestral: 0.2, // TODO: calcular basado en datos históricos
        participacion_global: participacionGlobal,
        alertas_activas: departamentosCriticos.length,
        encuestas_activas: encuestasActivas,
        encuestas_completadas: encuestasCompletadas,
        empleados_totales: totalEmpleados,
        departamentos_fuertes: departamentosFuertes,
        departamentos_criticos: departamentosCriticos
      };
    } catch (error) {
      console.error('Error obteniendo analítica:', error);
      throw error;
    }
  },

  async getEvolution(empresaId, meses = 6) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setMonth(fechaInicio.getMonth() - meses);

      const { data: respuestas, error } = await supabase
        .from('respuestas_encuesta')
        .select(`
          *,
          encuestas!inner (
            empresa_id,
            fecha_creacion
          )
        `)
        .eq('encuestas.empresa_id', empresaId)
        .gte('created_at', fechaInicio.toISOString());

      if (error) throw error;

      // Agrupar por mes
      const mesesData = {};
      const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      respuestas.forEach(r => {
        const fecha = new Date(r.created_at);
        const mesKey = `${mesesNombres[fecha.getMonth()]} ${fecha.getFullYear()}`;

        if (!mesesData[mesKey]) {
          mesesData[mesKey] = {
            mes: mesKey,
            suma: 0,
            cantidad: 0,
            totalParticipantes: new Set()
          };
        }

        const valor = parseInt(r.respuesta);
        if (!isNaN(valor) && valor >= 1 && valor <= 5) {
          mesesData[mesKey].suma += valor;
          mesesData[mesKey].cantidad++;
        }
        if (r.empleado_id) {
          mesesData[mesKey].totalParticipantes.add(r.empleado_id);
        }
      });

      const evolucion = Object.values(mesesData).map(m => ({
        mes: m.mes,
        valor: m.cantidad > 0 ? m.suma / m.cantidad : 0,
        participacion: m.totalParticipantes.size
      }));

      return evolucion;
    } catch (error) {
      console.error('Error obteniendo evolución:', error);
      throw error;
    }
  },

  async getCategorias(empresaId) {
    try {
      // Por ahora retornamos categorías mock
      // TODO: Implementar lógica de categorización basada en preguntas
      return [
        { categoria: 'Físico', valor: 4.2, variacion: 0.3 },
        { categoria: 'Mental', valor: 3.8, variacion: -0.1 },
        { categoria: 'Social', valor: 4.5, variacion: 0.2 },
        { categoria: 'Financiero', valor: 3.9, variacion: 0.0 },
        { categoria: 'Profesional', valor: 4.1, variacion: 0.1 }
      ];
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }
};
