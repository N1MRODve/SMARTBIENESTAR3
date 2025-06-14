// src/stores/auth.store.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/services/supabase.js'; // <-- RUTA CORREGIDA

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(true);
  const initializationDone = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.tipo_usuario);

  const initialize = async () => {
    if (initializationDone.value) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        user.value = userData ? { ...session.user, ...userData } : null;
      }
    } catch (e) {
      console.error('Error initializing auth:', e);
      user.value = null;
    } finally {
      loading.value = false;
      initializationDone.value = true;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      loading.value = false;
      throw error;
    }
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (userError) {
      loading.value = false;
      throw userError;
    }
    
    user.value = { ...data.user, ...userData };
    loading.value = false;
    return userData.tipo_usuario;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  const hasRole = (roles) => {
    if (!userRole.value) return false;
    return Array.isArray(roles) ? roles.includes(userRole.value) : userRole.value === roles;
  };

  return {
    user,
    loading,
    initializationDone,
    isAuthenticated,
    userRole,
    initialize,
    login,
    logout,
    hasRole
  };
});