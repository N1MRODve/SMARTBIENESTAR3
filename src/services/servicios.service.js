import { supabase } from '@/lib/supabase';

export const serviciosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByCategoria(categoria) {
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('categoria', categoria)
      .eq('activo', true)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async create(servicio) {
    const { data, error } = await supabase
      .from('servicios')
      .insert([servicio])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('servicios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('servicios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const sesionesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('sesiones')
      .select(`
        *,
        servicio:servicios (
          id,
          nombre,
          categoria
        )
      `)
      .order('fecha_inicio');

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('sesiones')
      .select(`
        *,
        servicio:servicios (
          *
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByServicio(servicioId) {
    const { data, error } = await supabase
      .from('sesiones')
      .select('*')
      .eq('servicio_id', servicioId)
      .order('fecha_inicio');

    if (error) throw error;
    return data;
  },

  async getProximas() {
    const { data, error } = await supabase
      .from('sesiones')
      .select(`
        *,
        servicio:servicios (
          id,
          nombre,
          categoria
        )
      `)
      .eq('estado', 'programada')
      .gte('fecha_inicio', new Date().toISOString())
      .order('fecha_inicio')
      .limit(10);

    if (error) throw error;
    return data;
  },

  async create(sesion) {
    const { data, error } = await supabase
      .from('sesiones')
      .insert([sesion])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('sesiones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('sesiones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const reservasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('reservas_sesiones')
      .select(`
        *,
        sesion:sesiones (
          *,
          servicio:servicios (
            nombre,
            categoria
          )
        ),
        empleado:empleados (
          id,
          nombre
        )
      `)
      .order('fecha_reserva', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByEmpleado(empleadoId) {
    const { data, error } = await supabase
      .from('reservas_sesiones')
      .select(`
        *,
        sesion:sesiones (
          *,
          servicio:servicios (
            nombre,
            categoria
          )
        )
      `)
      .eq('empleado_id', empleadoId)
      .order('fecha_reserva', { ascending: false });

    if (error) throw error;
    return data;
  },

  async crear(empleadoId, sesionId) {
    // Verificar que la sesión tenga cupo disponible
    const { data: sesion, error: sesionError } = await supabase
      .from('sesiones')
      .select('cupo_disponible')
      .eq('id', sesionId)
      .single();

    if (sesionError) throw sesionError;

    if (sesion.cupo_disponible <= 0) {
      throw new Error('No hay cupo disponible para esta sesión');
    }

    // Crear reserva
    const { data, error } = await supabase
      .from('reservas_sesiones')
      .insert([{
        sesion_id: sesionId,
        empleado_id: empleadoId,
        estado: 'confirmada',
      }])
      .select(`
        *,
        sesion:sesiones (
          *,
          servicio:servicios (
            nombre,
            categoria
          )
        )
      `)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Ya tienes una reserva para esta sesión');
      }
      throw error;
    }

    return data;
  },

  async cancelar(reservaId) {
    const { data, error } = await supabase
      .from('reservas_sesiones')
      .update({
        estado: 'cancelada',
        fecha_cancelacion: new Date().toISOString(),
      })
      .eq('id', reservaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async marcarAsistencia(reservaId, asistio) {
    const estado = asistio ? 'asistio' : 'no_asistio';

    const { data, error } = await supabase
      .from('reservas_sesiones')
      .update({ estado })
      .eq('id', reservaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const solicitudesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .select(`
        *,
        empleado:empleados (
          id,
          nombre
        ),
        servicio:servicios (
          id,
          nombre
        )
      `)
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByEmpleado(empleadoId) {
    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .select(`
        *,
        servicio:servicios (
          id,
          nombre
        )
      `)
      .eq('empleado_id', empleadoId)
      .order('fecha_solicitud', { ascending: false });

    if (error) throw error;
    return data;
  },

  async crear(solicitud) {
    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .insert([solicitud])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEstado(solicitudId, estado, notasAdmin = null) {
    const updates = {
      estado,
      fecha_respuesta: new Date().toISOString(),
    };

    if (notasAdmin) {
      updates.notas_admin = notasAdmin;
    }

    const { data, error } = await supabase
      .from('solicitudes_servicios')
      .update(updates)
      .eq('id', solicitudId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
