import { supabase } from '@/lib/supabase';
import { wrapServiceWithDemo } from './demo.wrapper';

const baseService = {
  async getAll() {
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('activa', true)
      .order('costo_puntos');

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByCategoria(categoria) {
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('categoria', categoria)
      .eq('activa', true)
      .order('costo_puntos');

    if (error) throw error;
    return data;
  },

  async create(recompensa) {
    const { data, error } = await supabase
      .from('recompensas')
      .insert([recompensa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('recompensas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('recompensas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async canjear(empleadoId, recompensaId) {
    // Verificar puntos del empleado
    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .select('puntos')
      .eq('id', empleadoId)
      .single();

    if (empleadoError) throw empleadoError;

    // Verificar recompensa
    const { data: recompensa, error: recompensaError } = await supabase
      .from('recompensas')
      .select('*')
      .eq('id', recompensaId)
      .single();

    if (recompensaError) throw recompensaError;

    if (empleado.puntos < recompensa.costo_puntos) {
      throw new Error('No tienes suficientes puntos para esta recompensa');
    }

    if (recompensa.stock === 0) {
      throw new Error('Esta recompensa no tiene stock disponible');
    }

    // Crear canje
    const { data: canje, error: canjeError } = await supabase
      .from('canjes_recompensas')
      .insert([{
        empleado_id: empleadoId,
        recompensa_id: recompensaId,
        puntos_gastados: recompensa.costo_puntos,
        estado: 'pendiente',
      }])
      .select()
      .single();

    if (canjeError) throw canjeError;

    // Crear transacción de puntos (negativa)
    const { error: transaccionError } = await supabase
      .from('transacciones_puntos')
      .insert([{
        empleado_id: empleadoId,
        cantidad: -recompensa.costo_puntos,
        tipo: 'gastados',
        motivo: `Canje de recompensa: ${recompensa.nombre}`,
        referencia_id: canje.id,
        referencia_tipo: 'canje',
      }]);

    if (transaccionError) throw transaccionError;

    // Actualizar stock si no es ilimitado
    if (recompensa.stock > 0) {
      const { error: stockError } = await supabase
        .from('recompensas')
        .update({ stock: recompensa.stock - 1 })
        .eq('id', recompensaId);

      if (stockError) throw stockError;
    }

    return canje;
  },

  async getHistorialCanjes(empleadoId = null) {
    let query = supabase
      .from('canjes_recompensas')
      .select(`
        *,
        empleado:empleados (
          id,
          nombre
        ),
        recompensa:recompensas (
          id,
          nombre,
          categoria
        )
      `)
      .order('fecha_canje', { ascending: false });

    if (empleadoId) {
      query = query.eq('empleado_id', empleadoId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async updateEstadoCanje(canjeId, estado, notas = null) {
    const updates = {
      estado,
      fecha_procesado: new Date().toISOString(),
    };

    if (notas) {
      updates.notas = notas;
    }

    const { data, error } = await supabase
      .from('canjes_recompensas')
      .update(updates)
      .eq('id', canjeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const recompensasService = wrapServiceWithDemo(baseService, 'recompensas');
