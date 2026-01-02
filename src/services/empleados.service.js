import { supabase } from '@/lib/supabase';

export const empleadosService = {
  /**
   * Obtiene todos los empleados de una empresa específica
   * @param {string} empresaId - ID de la empresa (requerido para multitenancy)
   */
  async getAll(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para listar empleados');
    }

    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('empresa_id', empresaId)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene un empleado por ID, validando que pertenece a la empresa
   * @param {string} id - ID del empleado
   * @param {string} empresaId - ID de la empresa (opcional pero recomendado)
   */
  async getById(id, empresaId = null) {
    let query = supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('id', id);

    // Si se proporciona empresaId, validar que el empleado pertenece a esa empresa
    if (empresaId) {
      query = query.eq('empresa_id', empresaId);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  },

  /**
   * Crea un nuevo empleado
   * @param {object} empleado - Datos del empleado (debe incluir empresa_id)
   */
  async create(empleado) {
    if (!empleado.empresa_id) {
      throw new Error('empresa_id es requerido para crear un empleado');
    }

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

  /**
   * Actualiza un empleado, validando que pertenece a la empresa
   * @param {string} id - ID del empleado
   * @param {object} updates - Campos a actualizar
   * @param {string} empresaId - ID de la empresa (requerido para seguridad)
   */
  async update(id, updates, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para actualizar un empleado');
    }

    const { data, error } = await supabase
      .from('empleados')
      .update(updates)
      .eq('id', id)
      .eq('empresa_id', empresaId)
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

  /**
   * Elimina un empleado, validando que pertenece a la empresa
   * @param {string} id - ID del empleado
   * @param {string} empresaId - ID de la empresa (requerido para seguridad)
   */
  async delete(id, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para eliminar un empleado');
    }

    const { error } = await supabase
      .from('empleados')
      .delete()
      .eq('id', id)
      .eq('empresa_id', empresaId);

    if (error) throw error;
  },

  /**
   * Obtiene un empleado por su auth_user_id (para login)
   * Este método es seguro sin empresaId porque filtra por auth_user_id único
   */
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

  /**
   * Busca empleados por término de búsqueda dentro de una empresa
   * @param {string} empresaId - ID de la empresa
   * @param {string} searchTerm - Término de búsqueda
   */
  async search(empresaId, searchTerm) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para buscar empleados');
    }

    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('empresa_id', empresaId)
      .or(`nombre.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene empleados por departamento dentro de una empresa
   * @param {string} empresaId - ID de la empresa
   * @param {string} departamentoId - ID del departamento
   */
  async getByDepartamento(empresaId, departamentoId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const { data, error } = await supabase
      .from('empleados')
      .select(`
        *,
        departamentos (
          id,
          nombre
        )
      `)
      .eq('empresa_id', empresaId)
      .eq('departamento_id', departamentoId)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  /**
   * Cuenta empleados por estado dentro de una empresa
   * @param {string} empresaId - ID de la empresa
   */
  async getStats(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const { data, error } = await supabase
      .from('empleados')
      .select('estado')
      .eq('empresa_id', empresaId);

    if (error) throw error;

    const stats = {
      total: data.length,
      activos: data.filter(e => e.estado === 'Activo').length,
      invitados: data.filter(e => e.estado === 'Invitado').length,
      inactivos: data.filter(e => e.estado === 'Inactivo').length,
    };

    return stats;
  },
};
