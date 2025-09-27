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
      {
        path: 'crear-encuesta',
        name: 'admin-crear-encuesta',
        component: () => import('@/views/admin/CrearEncuestaView.vue'),
      },
      {
        path: 'encuesta/:id/resultados',
        name: 'admin-resultados-encuesta',
        component: () => import('@/views/admin/ResultadosEncuestaView.vue'),
      },
      {
        path: 'crear-comunicado',
        name: 'admin-crear-comunicado',
        component: () => import('@/views/admin/CrearComunicadoView.vue'),
      },
      {
        path: 'servicios',
        name: 'admin-servicios',
        component: () => import('@/views/admin/GestionServiciosView.vue'),
      },
      {
        path: 'servicio/:id',
        name: 'admin-servicio-detalle',
        component: () => import('@/views/admin/ServicioDetalleView.vue'),
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