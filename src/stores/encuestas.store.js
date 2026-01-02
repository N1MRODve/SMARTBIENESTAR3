import { defineStore } from 'pinia';
import { ref } from 'vue';
import { encuestasService } from '@/services/encuestas.service';
import { supabase } from '@/lib/supabase';

export const useEncuestasStore = defineStore('encuestas', () => {
  const activeSurvey = ref(null);
  const encuestaActiva = ref(null);
  const encuestas = ref([]);
  const surveys = ref([]);
  const encuestasPendientes = ref([]);
  const totalPendientes = ref(0);
  const selectedSurvey = ref(null);
  const previousSurvey = ref(null);
  const isLoading = ref(false);
  const loading = ref(false);
  const error = ref(null);

  const fetchAllSurveys = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const allSurveys = await encuestasService.getAll();
      surveys.value = allSurveys;
      encuestas.value = allSurveys;
    } catch (err) {
      error.value = err.message || 'Error al cargar las encuestas';
      console.error('Error cargando encuestas:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * FUENTE ÚNICA DE VERDAD para encuestas pendientes del empleado.
   * Usa la RPC fn_get_encuestas_pendientes_empleado que aplica todos los filtros:
   * - Empresa del empleado
   * - Estado activa
   * - Fechas válidas
   * - No respondidas
   */
  const fetchEncuestasPendientesEmpleado = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Intentar usar la RPC unificada
      const { data, error: rpcError } = await supabase.rpc('fn_get_encuestas_pendientes_empleado');

      if (rpcError) {
        console.warn('[Store] RPC fn_get_encuestas_pendientes_empleado no disponible:', rpcError.message);
        // Fallback: usar el método antiguo pero con lógica corregida
        return await fetchActiveSurveyFallback();
      }

      if (!data?.success) {
        console.warn('[Store] RPC retornó error:', data?.error);
        return await fetchActiveSurveyFallback();
      }

      // Actualizar estado con datos de la RPC
      encuestasPendientes.value = data.encuestas || [];
      totalPendientes.value = data.total || 0;
      activeSurvey.value = data.encuesta_prioritaria || null;
      encuestaActiva.value = data.encuesta_prioritaria || null;

      console.log('[Store] Encuestas pendientes cargadas:', {
        total: totalPendientes.value,
        prioritaria: activeSurvey.value?.titulo
      });

      return data;
    } catch (err) {
      error.value = err.message || 'Error al cargar encuestas pendientes';
      console.error('[Store] Error en fetchEncuestasPendientesEmpleado:', err);
      return await fetchActiveSurveyFallback();
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fallback si la RPC no está disponible.
   * Usa lógica corregida para filtrar correctamente.
   */
  const fetchActiveSurveyFallback = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        activeSurvey.value = null;
        encuestaActiva.value = null;
        encuestasPendientes.value = [];
        totalPendientes.value = 0;
        return null;
      }

      // Obtener empleado
      const { data: empleado } = await supabase
        .from('empleados')
        .select('id, empresa_id')
        .eq('auth_user_id', user.id)
        .single();

      if (!empleado) {
        activeSurvey.value = null;
        encuestaActiva.value = null;
        encuestasPendientes.value = [];
        totalPendientes.value = 0;
        return null;
      }

      // Obtener encuestas ya respondidas (usando empleado.id, no user.id)
      const { data: respondidas } = await supabase
        .from('respuestas_encuesta')
        .select('encuesta_id')
        .eq('empleado_id', empleado.id);

      const idsRespondidas = new Set((respondidas || []).map(r => r.encuesta_id));

      // Obtener encuestas activas de la empresa
      const ahora = new Date().toISOString();
      const { data: encuestasData } = await supabase
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
          puntos_base,
          puntos_bonus_rapido,
          bonus_horas_limite,
          preguntas:preguntas_encuesta(count)
        `)
        .eq('empresa_id', empleado.empresa_id)
        .eq('estado', 'activa')
        .or(`fecha_inicio.is.null,fecha_inicio.lte.${ahora}`)
        .or(`fecha_fin.is.null,fecha_fin.gt.${ahora}`)
        .order('fecha_fin', { ascending: true, nullsFirst: false });

      // Filtrar las no respondidas
      const pendientes = (encuestasData || [])
        .filter(e => !idsRespondidas.has(e.id))
        .map(e => {
          const fechaFin = e.fecha_fin ? new Date(e.fecha_fin) : null;
          const horasRestantes = fechaFin
            ? Math.max(0, (fechaFin - new Date()) / (1000 * 60 * 60))
            : null;

          let urgencia = 'normal';
          if (horasRestantes !== null) {
            if (horasRestantes <= 24) urgencia = 'urgente';
            else if (horasRestantes <= 72) urgencia = 'pronto';
          }

          const puntosBase = e.puntos_base || 50;
          const puntosBonus = e.puntos_bonus_rapido || 0;
          const bonusHoras = e.bonus_horas_limite || 24;

          return {
            ...e,
            num_preguntas: e.preguntas?.[0]?.count || 0,
            urgencia,
            horas_restantes: horasRestantes ? Math.floor(horasRestantes) : null,
            // Campos unificados de puntos
            puntos_base: puntosBase,
            puntos_bonus_rapido: puntosBonus,
            bonus_horas_limite: bonusHoras,
            puntos_recompensa: puntosBase, // Compatibilidad
            tiene_bonus: puntosBonus > 0,
            puntos_maximos: puntosBase + puntosBonus
          };
        });

      encuestasPendientes.value = pendientes;
      totalPendientes.value = pendientes.length;
      activeSurvey.value = pendientes[0] || null;
      encuestaActiva.value = pendientes[0] || null;

      console.log('[Store Fallback] Encuestas pendientes:', {
        total: totalPendientes.value,
        prioritaria: activeSurvey.value?.titulo
      });

      return {
        success: true,
        encuestas: pendientes,
        total: pendientes.length,
        encuesta_prioritaria: pendientes[0] || null
      };
    } catch (err) {
      console.error('[Store Fallback] Error:', err);
      activeSurvey.value = null;
      encuestaActiva.value = null;
      encuestasPendientes.value = [];
      totalPendientes.value = 0;
      return null;
    }
  };

  // Alias para compatibilidad con código existente
  const fetchActiveSurvey = async () => {
    return await fetchEncuestasPendientesEmpleado();
  };

  const submitSurveyAnswers = async (encuestaId, respuestas) => {
    isLoading.value = true;

    try {
      const result = await encuestasService.submitRespuesta(encuestaId, respuestas);
      return { success: true, message: result.message || 'Respuestas enviadas correctamente' };
    } catch (err) {
      error.value = err.message || 'Error al enviar respuestas';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const cargarEncuestaActiva = async () => {
    await fetchActiveSurvey();
  };

  const cargarEncuestas = async () => {
    loading.value = true;
    error.value = null;

    try {
      await fetchAllSurveys();
    } catch (err) {
      error.value = err.message || 'Error al cargar las encuestas';
      console.error('Error cargando encuestas:', err);
    } finally {
      loading.value = false;
    }
  };

  const crearEncuesta = async (datosEncuesta) => {
    loading.value = true;
    error.value = null;

    try {
      const nuevaEncuesta = await encuestasService.create(datosEncuesta);

      encuestas.value.unshift(nuevaEncuesta);
      surveys.value.unshift(nuevaEncuesta);

      return { success: true, encuesta: nuevaEncuesta };
    } catch (err) {
      error.value = err.message || 'Error al crear la encuesta';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createNewSurvey = async (nuevaEncuestaData) => {
    return await crearEncuesta(nuevaEncuestaData);
  };

  const fetchSurveyById = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      const survey = await encuestasService.getById(id);
      selectedSurvey.value = survey;

      // Intentar cargar encuesta anterior para comparación
      const allSurveys = await encuestasService.getAll();
      const currentIndex = allSurveys.findIndex(s => s.id === id);
      if (currentIndex > 0) {
        previousSurvey.value = allSurveys[currentIndex - 1];
      } else {
        previousSurvey.value = null;
      }
    } catch (err) {
      error.value = err.message || 'Error al cargar la encuesta';
      console.error('Error cargando encuesta por ID:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // Estado
    activeSurvey,
    encuestaActiva,
    encuestasPendientes,
    totalPendientes,
    encuestas,
    surveys,
    selectedSurvey,
    previousSurvey,
    isLoading,
    loading,
    error,
    // Acciones para empleados
    fetchActiveSurvey,
    fetchEncuestasPendientesEmpleado,
    cargarEncuestaActiva,
    submitSurveyAnswers,
    // Acciones para admin
    fetchAllSurveys,
    fetchSurveyById,
    cargarEncuestas,
    crearEncuesta,
    createNewSurvey
  };
});
