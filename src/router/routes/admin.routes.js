import AdminLayout from '@/layouts/AdminLayout.vue';

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'administrador' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'empleados',
        name: 'admin-empleados',
        component: () => import('@/views/admin/EmpleadosView.vue'),
      },
      {
        path: 'encuestas',
        name: 'admin-encuestas',
        // Asegúrate de que esta vista exista o crea un placeholder
        component: () => import('@/views/admin/GestionEncuestasView.vue'), 
      },
      {
        path: 'recompensas',
        name: 'admin-recompensas',
        component: () => import('@/views/admin/GestionRecompensasView.vue'),
      },
      {
        path: 'comunicados',
        name: 'admin-comunicados',
         // Asegúrate de que esta vista exista o crea un placeholder
        component: () => import('@/views/admin/GestionComunicadosView.vue'),
      },
      // Redirección por defecto al dashboard si solo se entra a /admin
      {
        path: '',
        redirect: '/admin/dashboard'
      }
    ]
  }
];

export default adminRoutes;