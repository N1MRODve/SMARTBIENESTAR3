import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    // Información de la empresa del administrador
    empresa: null,
    
    // Estadísticas del dashboard
    dashboardStats: {
      total_empleados: 0,
      empleados_activos: 0,
      sesiones_proximas: 0,
      participacion_promedio: 0,
      encuestas_activas: 0,
      puntos_promedio: 0
    },
    
    // Empleados de la empresa
    empleados: [],
    empleadosLoading: false,
    
    // Sesiones de la empresa
    sesiones: [],
    sesionesLoading: false,
    
    // Encuestas de la empresa
    encuestas: [],
    encuestasLoading: false,

    // Servicios Contratados
    serviciosContratados: [],
    serviciosContratadosLoading: false,
    
    // Resultados de una encuesta específica
    resultadosEncuesta: null,
    
    // Actividad reciente
    actividadReciente: [],
    
    // Estados de carga
    loading: false,
    error: null
  }),

  getters: {
    empleadosActivos: (state) => {
      return state.empleados.filter(emp => emp.activo && emp.ultima_participacion)
    },
    
    proximasSesiones: (state) => {
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      return state.sesiones.filter(sesion => {
        const fechaSesion = new Date(sesion.fecha_inicio)
        return fechaSesion >= now && fechaSesion <= nextWeek && sesion.activo
      }).sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))
    },
    
    encuestasActivas: (state) => {
      const now = new Date()
      return state.encuestas.filter(encuesta => 
        encuesta.estado === 'activa' && 
        new Date(encuesta.fecha_fin) >= now
      )
    },
    
    estatisticasPorDepartamento: (state) => {
      const departamentos = {}
      
      state.empleados.forEach(empleado => {
        const depto = empleado.departamento || 'Sin departamento'
        if (!departamentos[depto]) {
          departamentos[depto] = {
            nombre: depto,
            total: 0,
            activos: 0,
            puntos_promedio: 0
          }
        }
        
        departamentos[depto].total++
        if (empleado.activo && empleado.ultima_participacion) {
          departamentos[depto].activos++
        }
        departamentos[depto].puntos_promedio += empleado.puntos_bienestar || 0
      })
      
      Object.values(departamentos).forEach(depto => {
        depto.puntos_promedio = depto.total > 0 ? depto.puntos_promedio / depto.total : 0
        depto.porcentaje_activos = depto.total > 0 ? (depto.activos / depto.total) * 100 : 0
      })
      
      return Object.values(departamentos)
    }
  },

  actions: {
    setEmpresa(empresa) {
      this.empresa = empresa
    },

    async loadDashboardStats(empresaId) {
      try {
        this.loading = true
        this.error = null
        const { data, error } = await supabase
          .rpc('get_admin_dashboard_stats', {
            empresa_id_param: empresaId
          })
        if (error) throw error
        if (data && data.length > 0) {
          this.dashboardStats = data[0]
        }
      } catch (error) {
        console.error('Error cargando estadísticas del dashboard:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async loadEmpresa(empresaId) {
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('*')
          .eq('id', empresaId)
          .single()
        if (error) throw error
        this.empresa = data
        return data
      } catch (error) {
        console.error('Error cargando empresa:', error)
        this.error = error.message
        throw error
      }
    },

    async loadEmpleados(empresaId) {
      try {
        this.empleadosLoading = true
        this.error = null
        const { data, error } = await supabase
          .from('usuarios')
          .select('*, perfil_empleados(*)')
          .eq('empresa_id', empresaId)
          .eq('tipo_usuario', 'empleado')
          .order('nombre')
        if (error) throw error
        this.empleados = (data || []).map(emp => ({
          ...emp,
          ...emp.perfil_empleados?.[0]
        }))
        await this.loadUltimaParticipacion(empresaId)
      } catch (error) {
        console.error('Error cargando empleados:', error)
        this.error = error.message
      } finally {
        this.empleadosLoading = false
      }
    },

    async loadUltimaParticipacion(empresaId) {
      // Tu lógica existente para esto...
    },

    async loadSesiones(empresaId) {
      // Tu lógica existente para esto...
    },

    async loadEncuestas(empresaId) {
        this.encuestasLoading = true;
        this.error = null;
        try {
            const { data, error } = await supabase
                .from('encuestas')
                .select(`*`)
                .eq('empresa_id', empresaId)
                .order('fecha_creacion', { ascending: false });

            if (error) throw error;
            this.encuestas = await Promise.all(
                (data || []).map(async (encuesta) => {
                    const { count: participantes } = await supabase.from('participantes_encuesta').select('*', { count: 'exact', head: true }).eq('encuesta_id', encuesta.id);
                    const { count: respuestas } = await supabase.from('participantes_encuesta').select('*', { count: 'exact', head: true }).eq('encuesta_id', encuesta.id).eq('estado', 'completada');
                    return { ...encuesta, participantes_count: participantes || 0, respuestas_count: respuestas || 0 };
                })
            );
        } catch (error) {
            console.error('Error cargando encuestas:', error);
            this.error = error.message;
        } finally {
            this.encuestasLoading = false;
        }
    },
    
    async loadResultadosEncuesta(encuestaId) {
      this.loading = true;
      this.error = null;
      this.resultadosEncuesta = null;
      try {
        const { data, error } = await supabase
          .rpc('get_resultados_encuestas', {
            encuesta_id_param: encuestaId
          });
        if (error) throw error;
        this.resultadosEncuesta = data[0];
      } catch (err) {
        console.error('Error cargando resultados de encuesta:', err);
        this.error = 'No se pudieron cargar los resultados de la encuesta.';
      } finally {
        this.loading = false;
      }
    },

    async loadServiciosContratados(empresaId) {
      this.serviciosContratadosLoading = true;
      this.error = null;
      try {
        const { data, error } = await supabase
          .from('servicios_contratados')
          .select('*')
          .eq('empresa_id', empresaId)
          .order('fecha_fin', { ascending: true });

        if (error) throw error;
        this.serviciosContratados = data;
      } catch (err) {
        console.error('Error cargando servicios contratados:', err);
        this.error = 'No se pudieron cargar los servicios contratados.';
      } finally {
        this.serviciosContratadosLoading = false;
      }
    },

    async loadActividadReciente(empresaId, limit = 10) {
      // Tu lógica existente para esto...
    },

    async crearSesion(empresaId, sesionData) {
      // Tu lógica existente para esto...
    },

    async crearEncuesta(empresaId, encuestaData) {
      // Tu lógica existente para esto...
    },

    async actualizarEmpleado(empleadoId, datosEmpleado) {
      // Tu lógica existente para esto...
    },



    async invitarEmpleados(empresaId, emails) {
      // Tu lógica existente para esto...
    },

    clearState() {
      // Tu lógica existente para esto...
    }
  }
})