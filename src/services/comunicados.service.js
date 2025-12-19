import { supabase } from '@/lib/supabase';

export const comunicadosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('comunicados')
      .select('*')
      .order('fecha_publicacion', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('comunicados')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(comunicado) {
    const { destinatarios, ...comunicadoData } = comunicado;

    const { data: nuevoComunicado, error: comunicadoError } = await supabase
      .from('comunicados')
      .insert([comunicadoData])
      .select()
      .single();

    if (comunicadoError) throw comunicadoError;

    // Crear destinatarios si existen
    if (destinatarios && destinatarios.length > 0) {
      const destinatariosData = destinatarios.map(dest => ({
        comunicado_id: nuevoComunicado.id,
        departamento_id: dest.departamento_id || null,
        empleado_id: dest.empleado_id || null,
      }));

      const { error: destError } = await supabase
        .from('comunicados_destinatarios')
        .insert(destinatariosData);

      if (destError) throw destError;
    }

    return nuevoComunicado;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('comunicados')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('comunicados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async marcarComoLeido(comunicadoId, empleadoId) {
    const { error } = await supabase
      .from('comunicados_lecturas')
      .insert([{
        comunicado_id: comunicadoId,
        empleado_id: empleadoId,
      }]);

    if (error && error.code !== '23505') {
      throw error;
    }
  },

  async getLecturas(comunicadoId) {
    const { data, error } = await supabase
      .from('comunicados_lecturas')
      .select('*')
      .eq('comunicado_id', comunicadoId);

    if (error) throw error;
    return data;
  },

  // ==========================================
  // MÉTODOS PARA EMPLEADOS
  // ==========================================

  // Obtener comunicados para el empleado actual con estado de lectura
  async getMisComunicados() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener el empleado actual para conocer su ID
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;

    // Obtener comunicados publicados o enviados
    const { data: comunicados, error: comError } = await supabase
      .from('comunicados')
      .select('*')
      .in('estado', ['publicado', 'enviado'])
      .order('fecha_publicacion', { ascending: false });

    if (comError) throw comError;

    // Si tenemos empleadoId, obtener IDs de comunicados leídos
    let idsLeidos = new Set();
    if (empleadoId) {
      const { data: lecturas } = await supabase
        .from('comunicados_lecturas')
        .select('comunicado_id')
        .eq('empleado_id', empleadoId);

      idsLeidos = new Set(lecturas?.map(l => l.comunicado_id) || []);
    }

    // Agregar estado de lectura a cada comunicado
    return (comunicados || []).map(com => ({
      ...com,
      leido: idsLeidos.has(com.id)
    }));
  },

  // Obtener un comunicado específico con estado de lectura
  async getMiComunicadoById(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener el empleado actual
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;

    const { data: comunicado, error: comError } = await supabase
      .from('comunicados')
      .select('*')
      .eq('id', id)
      .in('estado', ['publicado', 'enviado'])
      .single();

    if (comError) throw comError;

    // Verificar si está leído
    let leido = false;
    if (empleadoId) {
      const { data: lectura } = await supabase
        .from('comunicados_lecturas')
        .select('id')
        .eq('comunicado_id', id)
        .eq('empleado_id', empleadoId)
        .maybeSingle();

      leido = !!lectura;
    }

    return {
      ...comunicado,
      leido
    };
  },

  // Marcar comunicado como leído para el empleado actual
  async marcarComoLeidoEmpleado(comunicadoId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener el empleado actual
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (!empleadoData?.id) {
      throw new Error('Empleado no encontrado');
    }

    const { error } = await supabase
      .from('comunicados_lecturas')
      .upsert([{
        comunicado_id: comunicadoId,
        empleado_id: empleadoData.id
      }], {
        onConflict: 'comunicado_id,empleado_id'
      });

    if (error && error.code !== '23505') {
      throw error;
    }
  },

  // Obtener conteo de comunicados no leídos
  async getConteoNoLeidos() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener el empleado actual
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;

    // Total de comunicados publicados o enviados
    const { count: totalCom, error: countError } = await supabase
      .from('comunicados')
      .select('*', { count: 'exact', head: true })
      .in('estado', ['publicado', 'enviado']);

    if (countError) throw countError;

    // Comunicados leídos por el usuario
    let leidos = 0;
    if (empleadoId) {
      const { count, error: lecError } = await supabase
        .from('comunicados_lecturas')
        .select('*', { count: 'exact', head: true })
        .eq('empleado_id', empleadoId);

      if (lecError) throw lecError;
      leidos = count || 0;
    }

    return Math.max(0, (totalCom || 0) - leidos);
  }
};
