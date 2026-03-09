import { supabase } from '@/lib/supabase';

export const solicitudesService = {
  /**
   * Obtener departamentos de una empresa
   */
  async getDepartamentos(empresaId) {
    const { data, error } = await supabase
      .from('departamentos')
      .select('id, nombre')
      .eq('empresa_id', empresaId)
      .order('nombre');

    if (error) throw error;
    return data || [];
  },

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

  /**
   * Crear solicitud con soporte multi-departamento
   * @param {Object} datos - Datos de la solicitud
   * @param {string} datos.empleado_id - ID del empleado que solicita
   * @param {string} datos.empresa_id - ID de la empresa
   * @param {string} datos.servicio_nombre - Nombre del servicio
   * @param {string} datos.servicio_categoria - Categoria del servicio
   * @param {string} datos.objetivos - Objetivos de la solicitud
   * @param {string} datos.comentarios - Comentarios adicionales
   * @param {string} datos.fecha_implementacion - Fecha estimada
   * @param {boolean} datos.todaEmpresa - Si aplica a toda la empresa
   * @param {string[]} datos.departamentos - IDs de departamentos seleccionados
   */
  async crearConDestinatarios(datos) {
    // 1. Insertar solicitud principal
    const { data: solicitud, error: solError } = await supabase
      .from('solicitudes_servicios')
      .insert({
        empleado_id: datos.empleado_id,
        empresa_id: datos.empresa_id,
        servicio_nombre: datos.servicio_nombre,
        servicio_categoria: datos.servicio_categoria,
        objetivos: datos.objetivos,
        comentarios: datos.comentarios,
        fecha_implementacion: datos.fecha_implementacion,
        estado: 'pendiente',
        departamento: datos.todaEmpresa ? 'Toda la empresa' : null
      })
      .select()
      .single();

    if (solError) throw solError;

    // 2. Insertar destinatarios
    if (datos.todaEmpresa) {
      const { error: destError } = await supabase
        .from('solicitudes_servicios_destinatarios')
        .insert({
          solicitud_id: solicitud.id,
          es_toda_empresa: true
        });

      if (destError) throw destError;
    } else if (datos.departamentos && datos.departamentos.length > 0) {
      const destinatarios = datos.departamentos.map(depId => ({
        solicitud_id: solicitud.id,
        departamento_id: depId,
        es_toda_empresa: false
      }));

      const { error: destError } = await supabase
        .from('solicitudes_servicios_destinatarios')
        .insert(destinatarios);

      if (destError) throw destError;
    }

    return solicitud;
  },

  /**
   * Obtener destinatarios de una solicitud
   */
  async getDestinatarios(solicitudId) {
    const { data, error } = await supabase
      .from('solicitudes_servicios_destinatarios')
      .select(`
        id,
        es_toda_empresa,
        departamento:departamentos (
          id,
          nombre
        )
      `)
      .eq('solicitud_id', solicitudId);

    if (error) throw error;
    return data || [];
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
