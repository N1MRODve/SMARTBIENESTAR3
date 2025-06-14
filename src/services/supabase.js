import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const loginWithRedirect = async (email, password) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No se encontró información del usuario');

    // Get user role and additional info
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('tipo_usuario, empresa_id, nombre, apellido')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (userError) throw userError;
    
    if (!userData) {
      await supabase.auth.signOut();
      throw new Error('Usuario no encontrado en la base de datos');
    }

    // Determine redirect path based on user type
    let redirectPath = '/';
    switch (userData.tipo_usuario) {
      case 'superadmin':
        redirectPath = '/superadmin/dashboard';
        break;
      case 'administrador':
        redirectPath = '/admin/dashboard';
        break;
      case 'empleado':
        redirectPath = '/empleado/dashboard';
        break;
      case 'colaborador':
        redirectPath = '/colaborador/dashboard';
        break;
      default:
        await supabase.auth.signOut();
        throw new Error('Tipo de usuario no válido');
    }

    return {
      user: {
        ...authData.user,
        ...userData
      },
      redirectPath
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const getCurrentSessionWithRedirect = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return { user: null, redirectPath: '/login' };

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('tipo_usuario, empresa_id, nombre, apellido')
      .eq('id', session.user.id)
      .maybeSingle();

    if (userError || !userData) {
      await supabase.auth.signOut();
      return { user: null, redirectPath: '/login' };
    }

    let redirectPath = '/';
    switch (userData.tipo_usuario) {
      case 'superadmin':
        redirectPath = '/superadmin/dashboard';
        break;
      case 'administrador':
        redirectPath = '/admin/dashboard';
        break;
      case 'empleado':
        redirectPath = '/empleado/dashboard';
        break;
      case 'colaborador':
        redirectPath = '/colaborador/dashboard';
        break;
      default:
        await supabase.auth.signOut();
        return { user: null, redirectPath: '/login' };
    }

    return {
      user: {
        ...session.user,
        ...userData
      },
      redirectPath
    };
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return { user: null, redirectPath: '/login' };
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};