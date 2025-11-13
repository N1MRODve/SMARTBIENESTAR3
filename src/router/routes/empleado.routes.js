import EmpleadoLayout from '@/layouts/EmpleadoLayout.vue';

const empleadoRoutes = [
  {
    path: '/empleado',
    component: EmpleadoLayout,
    meta: { requiresAuth: true, roles: ['empleado'] }, // Asegura que solo empleados entren aquí
    children: [
      {
        path: 'dashboard',
        name: 'empleado-dashboard',
        component: () => import('@/views/empleado/DashboardView.vue'),
      },
      {
        path: 'actividades',
        name: 'empleado-actividades',
        component: () => import('@/views/empleado/ActividadesView.vue'),
      },
      {
        path: 'apoyo-personal',
        name: 'empleado-apoyo-personal',
        component: () => import('@/views/empleado/ApoyoPersonalView.vue'),
      },
      {
        path: 'apoyo-personal/:colaboradorId/reservar',
        name: 'empleado-reservar-sesion',
        component: () => import('@/views/empleado/ReservarSesionView.vue'),
      },
      {
        path: 'recompensas',
        name: 'empleado-recompensas',
        component: () => import('@/views/empleado/RecompensasView.vue'),
      },
      {
        path: 'reservas',
        name: 'empleado-reservas',
        component: () => import('@/views/empleado/ReservasView.vue'),
      },
      // Redirección por defecto al dashboard si solo se entra a /empleado
      {
        path: '',
        redirect: '/empleado/dashboard'
      }
    ]
  }
];

export default empleadoRoutes;