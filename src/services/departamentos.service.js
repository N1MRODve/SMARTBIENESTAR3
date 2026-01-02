import { supabase } from '@/lib/supabase';

export const departamentosService = {
  /**
   * Obtiene todos los departamentos de una empresa específica
   * También incluye departamentos globales (empresa_id = null) disponibles para todas las empresas
   * @param {string} empresaId - ID de la empresa (requerido para multitenancy)
   */
  async getAll(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para listar departamentos');
    }

    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .or(`empresa_id.eq.${empresaId},empresa_id.is.null`)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene solo los departamentos propios de una empresa (no globales)
   * @param {string} empresaId - ID de la empresa
   */
  async getByEmpresa(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  /**
   * Obtiene un departamento por ID, validando acceso de la empresa
   * @param {string} id - ID del departamento
   * @param {string} empresaId - ID de la empresa (para validación)
   */
  async getById(id, empresaId = null) {
    const { data, error } = await supabase
      .from('departamentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Validar que el departamento pertenece a la empresa o es global
    if (empresaId && data.empresa_id && data.empresa_id !== empresaId) {
      throw new Error('No tienes acceso a este departamento');
    }

    return data;
  },

  /**
   * Crea un nuevo departamento para una empresa
   * @param {object} departamento - Datos del departamento (debe incluir empresa_id)
   */
  async create(departamento) {
    if (!departamento.empresa_id) {
      throw new Error('empresa_id es requerido para crear un departamento');
    }

    const { data, error } = await supabase
      .from('departamentos')
      .insert([departamento])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Actualiza un departamento, validando que pertenece a la empresa
   * @param {string} id - ID del departamento
   * @param {object} updates - Campos a actualizar
   * @param {string} empresaId - ID de la empresa (requerido para seguridad)
   */
  async update(id, updates, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para actualizar un departamento');
    }

    // Primero verificar que el departamento pertenece a la empresa
    const existing = await this.getById(id, empresaId);
    if (existing.empresa_id !== empresaId) {
      throw new Error('No puedes modificar un departamento global');
    }

    const { data, error } = await supabase
      .from('departamentos')
      .update(updates)
      .eq('id', id)
      .eq('empresa_id', empresaId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Elimina un departamento, validando que pertenece a la empresa
   * @param {string} id - ID del departamento
   * @param {string} empresaId - ID de la empresa (requerido para seguridad)
   */
  async delete(id, empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido para eliminar un departamento');
    }

    // Verificar que no es un departamento global
    const existing = await this.getById(id, empresaId);
    if (existing.empresa_id !== empresaId) {
      throw new Error('No puedes eliminar un departamento global');
    }

    const { error } = await supabase
      .from('departamentos')
      .delete()
      .eq('id', id)
      .eq('empresa_id', empresaId);

    if (error) throw error;
  },

  /**
   * Obtiene departamentos con conteo de empleados
   * @param {string} empresaId - ID de la empresa
   */
  async getWithEmployeeCount(empresaId) {
    if (!empresaId) {
      throw new Error('empresaId es requerido');
    }

    const { data, error } = await supabase
      .from('departamentos')
      .select(`
        *,
        empleados:empleados(count)
      `)
      .or(`empresa_id.eq.${empresaId},empresa_id.is.null`)
      .order('nombre');

    if (error) throw error;

    // Transformar el conteo
    return data.map(dept => ({
      ...dept,
      empleadosCount: dept.empleados?.[0]?.count || 0
    }));
  },
};
