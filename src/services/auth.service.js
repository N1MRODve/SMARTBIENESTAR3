import { supabase } from '@/lib/supabase';

export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Obtener información del empleado
    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .select('*, departamentos(nombre)')
      .eq('auth_user_id', data.user.id)
      .maybeSingle();

    if (empleadoError) throw empleadoError;

    return {
      user: data.user,
      empleado,
      session: data.session,
    };
  },

  async signUp(email, password, empleadoData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Crear empleado asociado
    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .insert([
        {
          auth_user_id: data.user.id,
          email,
          nombre: empleadoData.nombre,
          departamento_id: empleadoData.departamento_id,
          cargo: empleadoData.cargo || '',
          estado: 'Activo',
        },
      ])
      .select()
      .single();

    if (empleadoError) throw empleadoError;

    return {
      user: data.user,
      empleado,
      session: data.session,
    };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (!user) return null;

    // Obtener información del empleado
    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .select('*, departamentos(nombre)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (empleadoError) throw empleadoError;

    return {
      user,
      empleado,
    };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
