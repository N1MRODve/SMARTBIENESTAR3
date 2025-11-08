import { supabase } from '@/lib/supabase';

export const solicitudesService = {
  async getAll(empresaId) {
    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .select(`
        *,
        empleado:empleados!inner (
          nombre,
          email,
          departamentos (
            nombre
          )
        ),
        servicio:servicios (
          nombre,
          categoria,
          tipo,
          descripcion
        )
      `)
      .eq('empleado.empresa_id', empresaId)
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .select(`
        *,
        empleado:empleados (
          nombre,
          email,
          departamentos (
            nombre
          )
        ),
        servicio:servicios (
          nombre,
          categoria,
          tipo,
          descripcion
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(solicitud) {
    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .insert([solicitud])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEstado(id, estado, notasAdmin = null) {
    const updates = {
      estado,
      fecha_respuesta: new Date().toISOString()
    };

    if (notasAdmin) {
      updates.notas_admin = notasAdmin;
    }

    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('solicitudes_servicios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getEstadisticas(empresaId) {
    const solicitudes = await this.getAll(empresaId);

    const estadisticas = {
      pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
      aprobadas: solicitudes.filter(s => s.estado === 'aprobada').length,
      rechazadas: solicitudes.filter(s => s.estado === 'rechazada').length,
      completadas: solicitudes.filter(s => s.estado === 'completada').length,
      total: solicitudes.length
    };

    return estadisticas;
  }
};
