import { supabase } from '@/lib/supabase';

export const recompensasService = {
  /**
   * Obtiene todas las recompensas activas de una empresa
   * Incluye recompensas globales (empresa_id = null) disponibles para todas las empresas
   * @param {string} empresaId - ID de la empresa (requerido para multitenancy)
   */
  async getAll(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para listar recompensas');
    }

    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('activa', true)
      .or(`empresa_id.eq.${empresaId},empresa_id.is.null`)
      .order('costo_puntos');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene solo las recompensas propias de una empresa (para gestión admin)
   * @param {string} empresaId - ID de la empresa
   */
  async getByEmpresa(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('costo_puntos');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene una recompensa por ID, validando acceso de la empresa
   * @param {string} id - ID de la recompensa
   * @param {string} empresaId - ID de la empresa (para validación)
   */
  async getById(id, empresaId = null) {
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Validar que la recompensa pertenece a la empresa o es global
    if (empresaId && data.empresa_id && data.empresa_id !== empresaId) {
      throw new Error('No tienes acceso a esta recompensa');
    }

    return data;
  },

  /**
   * Obtiene recompensas por categoría de una empresa
   * @param {string} empresaId - ID de la empresa
   * @param {string} categoria - Categoría de recompensas
   */
  async getByCategoria(empresaId, categoria) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('categoria', categoria)
      .eq('activa', true)
      .or(`empresa_id.eq.${empresaId},empresa_id.is.null`)
      .order('costo_puntos');

    if (error) throw error;
    return data;
  },

  /**
   * Crea una nueva recompensa para una empresa
   * @param {object} recompensa - Datos de la recompensa (debe incluir empresa_id)
   */
  async create(recompensa) {
    if (!recompensa.empresa_id) {
      throw new Error('empresa_id es requerido para crear una recompensa');
    }

    const { data, error } = await supabase
      .from('recompensas')
      .insert([recompensa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza una recompensa, validando que pertenece a la empresa
   * @param {string} id - ID de la recompensa
   * @param {object} updates - Campos a actualizar
   * @param {string} empresaId - ID de la empresa (requerido para seguridad)
   */
  async update(id, updates, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para actualizar una recompensa');
    }

    // Verificar que la recompensa pertenece a la empresa
    const existing = await this.getById(id, empresaId);
    if (existing.empresa_id !== empresaId) {
      throw new Error('No puedes modificar una recompensa global');
    }

    const { data, error } = await supabase
      .from('recompensas')
      .update(updates)
      .eq('id', id)
      .eq('empresa_id', empresaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Elimina una recompensa, validando que pertenece a la empresa
   * @param {string} id - ID de la recompensa
   * @param {string} empresaId - ID de la empresa (requerido para seguridad)
   */
  async delete(id, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para eliminar una recompensa');
    }

    // Verificar que no es una recompensa global
    const existing = await this.getById(id, empresaId);
    if (existing.empresa_id !== empresaId) {
      throw new Error('No puedes eliminar una recompensa global');
    }

    const { error } = await supabase
      .from('recompensas')
      .delete()
      .eq('id', id)
      .eq('empresa_id', empresaId);

    if (error) throw error;
  },

  /**
   * Canjea una recompensa para un empleado
   * @param {string} empleadoId - ID del empleado
   * @param {string} recompensaId - ID de la recompensa
   * @param {string} empresaId - ID de la empresa (para validación)
   */
  async canjear(empleadoId, recompensaId, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para canjear');
    }

    // Verificar puntos del empleado y que pertenece a la empresa
    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .select('puntos, empresa_id')
      .eq('id', empleadoId)
      .eq('empresa_id', empresaId)
      .single();

    if (empleadoError) throw empleadoError;
    if (!empleado) throw new Error('Empleado no encontrado o no pertenece a tu empresa');

    // Verificar recompensa (debe ser de la empresa o global)
    const recompensa = await this.getById(recompensaId, empresaId);

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

  /**
   * Obtiene historial de canjes de una empresa
   * @param {string} empresaId - ID de la empresa (requerido)
   * @param {string} empleadoId - ID del empleado (opcional, para filtrar)
   */
  async getHistorialCanjes(empresaId, empleadoId = null) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para ver historial de canjes');
    }

    let query = supabase
      .from('canjes_recompensas')
      .select(`
        *,
        empleado:empleados!inner (
          id,
          nombre,
          empresa_id
        ),
        recompensa:recompensas (
          id,
          nombre,
          categoria
        )
      `)
      .eq('empleado.empresa_id', empresaId)
      .order('fecha_canje', { ascending: false });

    if (empleadoId) {
      query = query.eq('empleado_id', empleadoId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza estado de un canje, validando que pertenece a la empresa
   * @param {string} canjeId - ID del canje
   * @param {string} estado - Nuevo estado
   * @param {string} empresaId - ID de la empresa
   * @param {string} notas - Notas opcionales
   */
  async updateEstadoCanje(canjeId, estado, empresaId, notas = null) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    // Verificar que el canje pertenece a un empleado de la empresa
    const { data: canje, error: canjeError } = await supabase
      .from('canjes_recompensas')
      .select(`
        id,
        empleado:empleados!inner (empresa_id)
      `)
      .eq('id', canjeId)
      .single();

    if (canjeError) throw canjeError;
    if (canje.empleado.empresa_id !== empresaId) {
      throw new Error('No tienes acceso a este canje');
    }

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

  /**
   * Obtiene estadísticas de recompensas de una empresa
   * @param {string} empresaId - ID de la empresa
   */
  async getStats(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const [recompensas, canjes] = await Promise.all([
      this.getByEmpresa(empresaId),
      this.getHistorialCanjes(empresaId)
    ]);

    return {
      totalRecompensas: recompensas.length,
      activas: recompensas.filter(r => r.activa).length,
      totalCanjes: canjes.length,
      canjesPendientes: canjes.filter(c => c.estado === 'pendiente').length,
      canjesCompletados: canjes.filter(c => c.estado === 'entregado').length,
    };
  },
};
