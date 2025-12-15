<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ChevronRight, Home } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p);
  const crumbs = [];

  // Siempre agregar Home
  crumbs.push({
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: Home
  });

  // Mapeo de rutas a nombres legibles
  const routeNames = {
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
    'presentacion': 'Modo Presentación'
  };

  let currentPath = '';
  pathArray.forEach((segment, index) => {
    // Skip 'admin' en la raíz
    if (segment === 'admin' && index === 0) return;

    currentPath += `/${segment}`;

    // Si es un ID numérico o UUID, skip
    if (/^[0-9a-f-]{36}$/i.test(segment) || /^\d+$/.test(segment)) {
      return;
    }

    crumbs.push({
      name: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      path: `/admin${currentPath}`,
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
