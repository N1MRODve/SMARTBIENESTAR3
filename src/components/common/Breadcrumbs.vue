<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ChevronRight, Home, LayoutDashboard } from 'lucide-vue-next';

const props = defineProps({
  // Tipo de layout: 'admin' o 'empleado'
  layout: {
    type: String,
    default: 'admin'
  },
  // Override manual de breadcrumbs
  customCrumbs: {
    type: Array,
    default: null
  }
});

const router = useRouter();
const route = useRoute();

// Mapeo de rutas a nombres legibles - compartido
const routeNames = {
  // Admin
  'admin': 'Administración',
  'empleados': 'Empleados',
  'encuestas': 'Encuestas',
  'crear': 'Crear',
  'editar': 'Editar',
  'resultados': 'Resultados',
  'participacion': 'Participación',
  'servicios': 'Servicios',
  'solicitudes': 'Solicitudes',
  'recompensas': 'Recompensas',
  'comunicacion': 'Comunicación',
  'comunicados': 'Comunicados',
  'configuracion': 'Configuración',
  'analitica': 'Analítica',
  'presentacion': 'Modo Presentación',
  // Empleado
  'empleado': 'Empleado',
  'dashboard': 'Inicio',
  'encuesta': 'Encuestas',
  'responder': 'Responder',
  'actividades': 'Actividades',
  'apoyo-personal': 'Apoyo Personal',
  'historial-canjes': 'Historial de Canjes'
};

const breadcrumbs = computed(() => {
  // Si hay breadcrumbs personalizados, usarlos
  if (props.customCrumbs) {
    return props.customCrumbs;
  }

  const pathArray = route.path.split('/').filter(p => p);
  const crumbs = [];
  const isEmpleado = props.layout === 'empleado' || pathArray[0] === 'empleado';
  const basePrefix = isEmpleado ? 'empleado' : 'admin';
  const homePath = isEmpleado ? '/empleado/dashboard' : '/admin/dashboard';

  // Siempre agregar Home
  crumbs.push({
    name: 'Inicio',
    path: homePath,
    icon: isEmpleado ? Home : LayoutDashboard
  });

  let currentPath = '';
  pathArray.forEach((segment, index) => {
    // Skip el prefijo base (admin/empleado)
    if ((segment === 'admin' || segment === 'empleado') && index === 0) return;
    // Skip 'dashboard' ya que es Home
    if (segment === 'dashboard') return;

    currentPath += `/${segment}`;

    // Si es un ID numérico o UUID, skip o mostrar contexto
    if (/^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment)) {
      // Si hay un nombre en la ruta meta, usarlo
      if (route.meta?.breadcrumbName) {
        crumbs.push({
          name: route.meta.breadcrumbName,
          path: `/${basePrefix}${currentPath}`,
          active: index === pathArray.length - 1
        });
      }
      return;
    }

    crumbs.push({
      name: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: `/${basePrefix}${currentPath}`,
      active: index === pathArray.length - 1
    });
  });

  return crumbs;
});

const navigateTo = (path) => {
  if (path !== route.path) {
    router.push(path);
  }
};
</script>

<template>
  <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
        class="flex items-center"
      >
        <ChevronRight v-if="index > 0" class="h-4 w-4 text-gray-400 mx-2" />

        <button
          v-if="!crumb.active"
          @click="navigateTo(crumb.path)"
          class="flex items-center hover:text-gray-900 transition-colors font-medium"
        >
          <component v-if="crumb.icon" :is="crumb.icon" class="h-4 w-4 mr-1.5" />
          {{ crumb.name }}
        </button>

        <span
          v-else
          class="flex items-center text-gray-900 font-semibold"
        >
          <component v-if="crumb.icon" :is="crumb.icon" class="h-4 w-4 mr-1.5" />
          {{ crumb.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>
