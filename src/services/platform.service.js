import { supabase } from '@/lib/supabase';

export const platformService = {
  async getEstadisticasPlataforma() {
    const [empresasResult, empleadosResult, encuestasResult, solicitudesResult] = await Promise.all([
      supabase.from('empresas').select('*', { count: 'exact', head: true }),
      supabase.from('empleados').select('*', { count: 'exact', head: true }),
      supabase.from('encuestas').select('*', { count: 'exact', head: true }).eq('estado', 'Activa'),
      supabase.from('solicitudes_servicios').select('*', { count: 'exact', head: true }).eq('estado', 'Pendiente')
    ]);

    return {
      totalEmpresas: empresasResult.count || 0,
      totalEmpleados: empleadosResult.count || 0,
      encuestasActivas: encuestasResult.count || 0,
      solicitudesPendientes: solicitudesResult.count || 0
    };
  },

  async getEmpresas(filters = {}) {
    let query = supabase
      .from('empresas')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (filters.estado) {
      query = query.eq('activa', filters.estado === 'activa');
    }

    if (filters.search) {
      query = query.ilike('nombre', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getEmpresaById(empresaId) {
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', empresaId)
      .maybeSingle();

    if (empresaError) throw empresaError;
    if (!empresa) return null;

    const [empleadosResult, encuestasResult, solicitudesResult] = await Promise.all([
      supabase
        .from('empleados')
        .select('*', { count: 'exact' })
        .eq('empresa_id', empresaId),
      supabase
        .from('encuestas')
        .select('*', { count: 'exact' })
        .eq('empresa_id', empresaId),
      supabase
        .from('solicitudes_servicios')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('fecha_solicitud', { ascending: false })
    ]);

    return {
      ...empresa,
      stats: {
        totalEmpleados: empleadosResult.count || 0,
        empleados: empleadosResult.data || [],
        totalEncuestas: encuestasResult.count || 0,
        encuestas: encuestasResult.data || [],
        solicitudes: solicitudesResult.data || []
      }
    };
  },

  async getEmpresasConEstadisticas() {
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    const empresasConStats = await Promise.all(
      empresas.map(async (empresa) => {
        const { count: empleadosCount } = await supabase
          .from('empleados')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id);

        const { count: solicitudesCount } = await supabase
          .from('solicitudes_servicios')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', empresa.id);

        return {
          ...empresa,
          empleados_count: empleadosCount || 0,
          solicitudes_count: solicitudesCount || 0
        };
      })
    );

    return empresasConStats;
  },

  async getSolicitudesGlobal(filters = {}) {
    let query = supabase
      .from('solicitudes_servicios')
      .select(`
        *,
        servicios (id, nombre, categoria)
      `)
      .order('fecha_solicitud', { ascending: false });

    if (filters.estado) {
      query = query.eq('estado', filters.estado);
    }

    if (filters.empresaId) {
      query = query.eq('empresa_id', filters.empresaId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateSolicitudEstado(solicitudId, nuevoEstado, notas = null) {
    const updateData = {
      estado: nuevoEstado,
      fecha_actualizacion: new Date().toISOString()
    };

    if (notas) {
      updateData.notas_internas = notas;
    }

    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .update(updateData)
      .eq('id', solicitudId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getActividadReciente(limit = 10) {
    const [empresasRecientes, solicitudesRecientes] = await Promise.all([
      supabase
        .from('empresas')
        .select('id, nombre, fecha_creacion')
        .order('fecha_creacion', { ascending: false })
        .limit(5),
      supabase
        .from('solicitudes_servicios')
        .select(`
          id, estado, fecha_solicitud,
          servicios (nombre)
        `)
        .order('fecha_solicitud', { ascending: false })
        .limit(5)
    ]);

    const actividades = [];

    if (empresasRecientes.data) {
      empresasRecientes.data.forEach(empresa => {
        actividades.push({
          tipo: 'nueva_empresa',
          descripcion: `Nueva empresa registrada: ${empresa.nombre}`,
          fecha: empresa.fecha_creacion,
          id: empresa.id
        });
      });
    }

    if (solicitudesRecientes.data) {
      solicitudesRecientes.data.forEach(sol => {
        actividades.push({
          tipo: 'solicitud',
          descripcion: `Solicitud de ${sol.servicios?.nombre || 'servicio'}`,
          estado: sol.estado,
          fecha: sol.fecha_solicitud,
          id: sol.id
        });
      });
    }

    return actividades
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, limit);
  },

  async getCrecimientoEmpresas(meses = 6) {
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - meses);

    const { data, error } = await supabase
      .from('empresas')
      .select('fecha_creacion')
      .gte('fecha_creacion', fechaInicio.toISOString())
      .order('fecha_creacion', { ascending: true });

    if (error) throw error;

    const porMes = {};
    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 0; i < meses; i++) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - (meses - 1 - i));
      const key = `${mesesNombres[fecha.getMonth()]} ${fecha.getFullYear()}`;
      porMes[key] = 0;
    }

    data?.forEach(empresa => {
      const fecha = new Date(empresa.fecha_creacion);
      const key = `${mesesNombres[fecha.getMonth()]} ${fecha.getFullYear()}`;
      if (porMes[key] !== undefined) {
        porMes[key]++;
      }
    });

    return Object.entries(porMes).map(([mes, total]) => ({ mes, total }));
  },

  async getUsuariosPlataforma() {
    const { data, error } = await supabase
      .from('usuarios_plataforma')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createUsuarioPlataforma(userData) {
    const { data, error } = await supabase
      .from('usuarios_plataforma')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUsuarioPlataforma(userId, updates) {
    const { data, error } = await supabase
      .from('usuarios_plataforma')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
