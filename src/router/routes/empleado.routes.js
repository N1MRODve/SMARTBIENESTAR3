// src/router/routes/empleado.routes.js
import EmpleadoLayout from '../../layouts/EmpleadoLayout.vue';

export const empleadoRoutes = [
  {
    path: '/empleado',
    component: EmpleadoLayout,
    meta: { 
      requiresAuth: true,
      roles: ['empleado']
    },
    children: [
      {
        path: 'dashboard',
        name: 'empleado-dashboard',
        component: () => import('../../views/empleado/DashboardView.vue')
      },
      {
        path: 'reservas',
        name: 'empleado-reservas',
        component: () => import('../../views/empleado/ReservasView.vue')
      }
    ]
  }
];