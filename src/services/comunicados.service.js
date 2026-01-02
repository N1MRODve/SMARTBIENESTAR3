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

    // Obtener el empleado actual con su empresa_id y departamento
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id, empresa_id, departamento_id, departamentos(nombre)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;
    const empresaId = empleadoData?.empresa_id;
    const departamentoNombre = empleadoData?.departamentos?.nombre;

    if (!empresaId) {
      console.warn('[Comunicados] Empleado sin empresa asignada');
      return [];
    }

    // Obtener comunicados enviados de la empresa del empleado
    let query = supabase
      .from('comunicados')
      .select('*')
      .eq('empresa_id', empresaId) // IMPORTANTE: filtrar por empresa
      .or('estado.eq.enviado,estado.eq.Enviado,estado.eq.publicado')
      .order('fecha_publicacion', { ascending: false });

    const { data: comunicados, error: comError } = await query;

    if (comError) throw comError;

    // Filtrar por departamento si el comunicado tiene destinatarios específicos
    const comunicadosFiltrados = (comunicados || []).filter(com => {
      // Si no tiene destinatarios definidos o está vacío, es para todos
      if (!com.destinatarios || com.destinatarios.length === 0) {
        return true;
      }
      // Si el departamento del empleado está en la lista de destinatarios
      if (departamentoNombre && com.destinatarios.includes(departamentoNombre)) {
        return true;
      }
      return false;
    });

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
    return comunicadosFiltrados.map(com => ({
      ...com,
      leido: idsLeidos.has(com.id)
    }));
  },

  // Obtener un comunicado específico con estado de lectura
  async getMiComunicadoById(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener el empleado actual con empresa_id
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id, empresa_id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;
    const empresaId = empleadoData?.empresa_id;

    const { data: comunicado, error: comError } = await supabase
      .from('comunicados')
      .select('*')
      .eq('id', id)
      .eq('empresa_id', empresaId) // Filtrar por empresa
      .or('estado.eq.enviado,estado.eq.Enviado,estado.eq.publicado')
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

    // Obtener el empleado actual con empresa_id
    const { data: empleadoData } = await supabase
      .from('empleados')
      .select('id, empresa_id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    const empleadoId = empleadoData?.id;
    const empresaId = empleadoData?.empresa_id;

    if (!empresaId) return 0;

    // Total de comunicados enviados de la empresa
    const { count: totalCom, error: countError } = await supabase
      .from('comunicados')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', empresaId) // Filtrar por empresa
      .or('estado.eq.enviado,estado.eq.Enviado,estado.eq.publicado');

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
