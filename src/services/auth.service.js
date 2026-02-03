import { supabase } from '@/lib/supabase';

export const authService = {
  async checkPlatformUser(userId) {
    const { data, error } = await supabase
      .from('usuarios_plataforma')
      .select('*')
      .eq('auth_user_id', userId)
      .eq('activo', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const platformUser = await this.checkPlatformUser(data.user.id);

    if (platformUser) {
      return {
        user: data.user,
        empleado: null,
        platformUser,
        session: data.session,
        userType: 'platform',
      };
    }

    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .select('*, departamentos(nombre)')
      .eq('auth_user_id', data.user.id)
      .maybeSingle();

    if (empleadoError) throw empleadoError;

    // Si el usuario no tiene ni registro de plataforma ni de empleado
    if (!empleado && !platformUser) {
      await this.signOut();
      throw new Error('Usuario sin registro válido en el sistema');
    }

    return {
      user: data.user,
      empleado,
      platformUser: null,
      session: data.session,
      userType: 'empresa',
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

    const platformUser = await this.checkPlatformUser(user.id);

    if (platformUser) {
      return {
        user,
        empleado: null,
        platformUser,
        userType: 'platform',
      };
    }

    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .select('*, departamentos(nombre)')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (empleadoError) throw empleadoError;

    // Si el usuario no tiene ni registro de plataforma ni de empleado, cerrar sesión
    if (!empleado && !platformUser) {
      console.warn('Usuario sin registro válido, cerrando sesión');
      await this.signOut();
      return null;
    }

    return {
      user,
      empleado,
      platformUser: null,
      userType: 'empresa',
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
