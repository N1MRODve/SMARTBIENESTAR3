import { supabase } from '@/lib/supabase';
import { wrapServiceWithDemo } from './demo.wrapper';

const baseService = {
  async getAll() {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(departamento) {
    const { data, error } = await supabase
      .from('departamentos')
      .insert([departamento])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('departamentos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('departamentos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const departamentosService = wrapServiceWithDemo(baseService, 'departamentos');
