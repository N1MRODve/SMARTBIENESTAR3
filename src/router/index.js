// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
// --- RUTA DE IMPORTACIÓN CORREGIDA Y FINAL ---
import { useAuthStore } from '@/stores/auth.store.js'; // Usamos el alias @
import LoginView from '../views/LoginView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import AccessDeniedView from '../views/AccessDeniedView.vue';

// Import route modules
import { superadminRoutes } from './routes/superadmin.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { empleadoRoutes } from './routes/empleado.routes.js';
import { colaboradorRoutes } from './routes/colaborador.routes.js';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView, meta: { requiresAuth: false } },
  { path: '/acceso-denegado', name: 'access-denied', component: AccessDeniedView, meta: { requiresAuth: false } },
  ...superadminRoutes,
  ...adminRoutes,
  ...empleadoRoutes,
  ...colaboradorRoutes,
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  // Esperamos a que la tienda se inicialice si no lo ha hecho
  if (!authStore.initializationDone) {
    await authStore.initialize();
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (to.name === 'login' && authStore.isAuthenticated) {
    const redirectMap = {
      superadmin: '/superadmin/dashboard',
      administrador: '/admin/dashboard',
      empleado: '/empleado/dashboard',
      colaborador: '/colaborador/dashboard'
    };
    return redirectMap[authStore.userRole] || '/login';
  }
  
  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }
  
  const allowedRoles = to.meta.roles;
  if (allowedRoles && !authStore.hasRole(allowedRoles)) {
    return { name: 'access-denied' };
  }
  
  return true;
});

export default router;