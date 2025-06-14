// src/router/routes/colaborador.routes.js
import ColaboradorLayout from '../../layouts/ColaboradorLayout.vue';

export const colaboradorRoutes = [
  {
    path: '/colaborador',
    component: ColaboradorLayout,
    meta: { 
      requiresAuth: true,
      roles: ['colaborador']
    },
    children: [
      {
        path: 'dashboard',
        name: 'colaborador-dashboard',
        component: () => import('../../views/colaborador/DashboardView.vue')
      },
      {
        path: 'sesiones',
        name: 'colaborador-sesiones',
        component: () => import('../../views/colaborador/SesionesView.vue')
      }
    ]
  }
];
