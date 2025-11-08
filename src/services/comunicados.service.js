import { supabase } from '@/lib/supabase';

export const comunicadosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('comunicados')
      .select(`
        *,
        autor:empleados!comunicados_autor_id_fkey (
          id,
          nombre
        )
      `)
      .order('fecha_publicacion', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('comunicados')
      .select(`
        *,
        autor:empleados!comunicados_autor_id_fkey (
          id,
          nombre
        )
      `)
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
      .select(`
        *,
        empleado:empleados (
          id,
          nombre
        )
      `)
      .eq('comunicado_id', comunicadoId);

    if (error) throw error;
    return data;
  },
};
