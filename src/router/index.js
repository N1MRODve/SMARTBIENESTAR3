// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';

// Importar vistas del MVP
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';

// Vistas Admin
import AdminDashboardView from '../views/admin/DashboardView.vue';
import CrearEncuestaView from '../views/admin/CrearEncuestaView.vue';

// Vistas Empleado
import ResponderEncuestaView from '../views/empleado/ResponderEncuestaView.vue';

const routes = [
  // Ruta raíz - redirige según autenticación
  { 
    path: '/', 
    name: 'home',
    redirect: '/login'
  },
  
  // Login - accesible sin autenticación
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView, 
    meta: { requiresAuth: false } 
  },

  // === RUTAS ADMIN ===
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { 
      requiresAuth: true, 
      roles: ['administrador'] 
    }
  },
  {
    path: '/admin/crear-encuesta',
    name: 'admin-crear-encuesta',
    component: CrearEncuestaView,
    meta: { 
      requiresAuth: true, 
      roles: ['administrador'] 
    }
  },

  // === RUTAS EMPLEADO ===
  {
    path: '/empleado/encuesta',
    name: 'empleado-encuesta',
    component: ResponderEncuestaView,
    meta: { 
      requiresAuth: true, 
      roles: ['empleado'] 
    }
  },

  // === RUTAS DE ERROR ===
  { 
    path: '/acceso-denegado', 
    name: 'access-denied', 
    component: AccessDeniedView 
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: NotFoundView 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación global
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Esperamos a que la tienda se inicialice si no lo ha hecho
  if (!authStore.initializationDone) {
    await authStore.initialize();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles;
  
  // Si la ruta es login y el usuario ya está autenticado, redirigir al dashboard correspondiente
  if (to.name === 'login' && authStore.isAuthenticated) {
    const redirectPath = authStore.userRole === 'administrador' ? '/admin/dashboard' : '/empleado/encuesta';
    return redirectPath;
  }
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }
  
  // Si la ruta requiere roles específicos y el usuario no tiene el rol adecuado
  if (requiredRoles && authStore.isAuthenticated && !authStore.hasRole(requiredRoles)) {
    return { name: 'access-denied' };
  }
  
  return true;
});

export default router;