// src/stores/auth.store.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Mock data para el MVP
const mockUsers = [
  {
    id: '1',
    email: 'admin@empresa.com',
    nombre: 'Admin',
    apellido: 'Usuario',
    tipo_usuario: 'administrador',
    empresa_id: '1'
  },
  {
    id: '2',
    email: 'empleado@empresa.com',
    nombre: 'Empleado',
    apellido: 'Prueba',
    tipo_usuario: 'empleado',
    empresa_id: '1'
  }
];

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(true);
  const initializationDone = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.tipo_usuario);

  const initialize = async () => {
    if (initializationDone.value) return;
    try {
      // Simular verificación de sesión con localStorage
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        user.value = JSON.parse(savedUser);
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
    
    try {
      // Simular autenticación con mock data
      const mockUser = mockUsers.find(u => u.email === email);
      
      if (!mockUser || password !== 'password123') {
        throw new Error('Credenciales incorrectas');
      }
      
      user.value = mockUser;
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      loading.value = false;
      return mockUser.tipo_usuario;
    } catch (error) {
      loading.value = false;
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('mockUser');
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