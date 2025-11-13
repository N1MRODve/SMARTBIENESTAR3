import { supabase } from '@/lib/supabase';
import { wrapServiceWithDemo } from './demo.wrapper';

const baseService = {
  async getAll() {
    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(empleado) {
    const { data, error } = await supabase
      .from('empleados')
      .insert([empleado])
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('empleados')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('empleados')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getByAuthUserId(authUserId) {
    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

export const empleadosService = wrapServiceWithDemo(baseService, 'empleados');
