```vue
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        ¡Bienvenido, {{ authStore.user?.nombre }}!
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Aquí tienes un resumen de tu bienestar
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Próximas Sesiones"
        :value="stats.proximasSesiones"
        :icon="Calendar"
      />
      <StatsCard
        title="Puntos Acumulados"
        :value="stats.puntosAcumulados"
        :icon="Activity"
      />
      <StatsCard
        title="Desafíos Activos"
        :value="stats.desafiosActivos"
        :icon="Target"
      />
      <StatsCard
        title="Logros Obtenidos"
        :value="stats.logrosObtenidos"
        :icon="Award"
      />
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Próximas Sesiones -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Próximas Sesiones
        </h2>
        <DataTable
          :columns="[
            {
              key: 'titulo',
              header: 'Sesión',
              render: (row) => row.sesion.titulo
            },
            {
              key: 'fecha',
              header: 'Fecha',
              render: (row) => formatDate(row.sesion.fecha_inicio)
            },
            {
              key: 'colaborador',
              header: 'Colaborador',
              render: (row) => `${row.sesion.usuarios.nombre} ${row.sesion.usuarios.apellido}`
            }
          ]"
          :data="proximasSesiones"
          :loading="loading"
          searchable={false}
          pagination={false}
        />
      </div>

      <!-- Desafíos Activos -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Desafíos Activos
        </h2>
        <DataTable
          :columns="[
            {
              key: 'titulo',
              header: 'Desafío',
              render: (row) => row.desafio.titulo
            },
            {
              key: 'fecha_fin',
              header: 'Finaliza',
              render: (row) => formatDate(row.desafio.fecha_fin, 'short')
            },
            {
              key: 'puntos',
              header: 'Puntos',
              render: (row) => row.desafio.puntos_completar
            }
          ]"
          :data="desafiosActivos"
          :loading="loading"
          searchable={false}
          pagination={false}
        />
      </div>

      <!-- Últimos Logros -->
      <div class="lg:col-span-2">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Últimos Logros
        </h2>
        <DataTable
          :columns="[
            {
              key: 'titulo',
              header: 'Logro',
              render: (row) => row.logro.titulo
            },
            {
              key: 'categoria',
              header: 'Categoría',
              render: (row) => row.logro.categoria
            },
            {
              key: 'fecha',
              header: 'Obtenido',
              render: (row) => formatDate(row.fecha_obtencion, 'short')
            },
            {
              key: 'puntos',
              header: 'Puntos',
              render: (row) => row.puntos_otorgados
            }
          ]"
          :data="ultimosLogros"
          :loading="loading"
          searchable={false}
          pagination={false}
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Calendar, Activity, Target, Award } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth.store';
import { supabase } from '../../services/supabase';
import StatsCard from '../../components/common/StatsCard.vue';
import DataTable from '../../components/common/DataTable.vue';

const authStore = useAuthStore();
const loading = ref(true);

const stats = ref({
  proximasSesiones: 0,
  puntosAcumulados: 0,
  desafiosActivos: 0,
  logrosObtenidos: 0
});

const proximasSesiones = ref([]);
const desafiosActivos = ref([]);
const ultimosLogros = ref([]);

const formatDate = (dateString, format = 'long') => {
  const date = new Date(dateString);
  const options = format === 'long' 
    ? {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    : {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
  
  return date.toLocaleDateString('es-ES', options);
};

const loadDashboardData = async () => {
  try {
    loading.value = true;

    // Cargar próximas sesiones
    const { data: sesiones } = await supabase
      .from('reservas')
      .select(`
        id,
        sesion:sesiones (
          id,
          titulo,
          fecha_inicio,
          fecha_fin,
          modalidad,
          usuarios:colaborador_id (
            nombre,
            apellido
          ),
          servicios (
            nombre,
            tipo
          )
        )
      `)
      .eq('usuario_id', authStore.user.id)
      .eq('estado', 'confirmada')
      .gte('sesion.fecha_inicio', new Date().toISOString())
      .order('sesion.fecha_inicio')
      .limit(5);

    // Cargar puntos acumulados
    const { data: perfil } = await supabase
      .from('perfil_empleados')
      .select('puntos_bienestar')
      .eq('usuario_id', authStore.user.id)
      .single();

    // Cargar desafíos activos
    const { data: desafios } = await supabase
      .from('participacion_desafios')
      .select(`
        id,
        desafio:desafios_bienestar (
          id,
          titulo,
          descripcion,
          fecha_fin,
          puntos_completar
        )
      `)
      .eq('usuario_id', authStore.user.id)
      .in('estado', ['inscrito', 'en_progreso'])
      .order('desafio.fecha_fin')
      .limit(5);

    // Cargar últimos logros
    const { data: logros } = await supabase
      .from('logros_usuario')
      .select(`
        id,
        fecha_obtencion,
        puntos_otorgados,
        logro:catalogo_logros (
          titulo,
          descripcion,
          categoria
        )
      `)
      .eq('usuario_id', authStore.user.id)
      .order('fecha_obtencion', { ascending: false })
      .limit(5);

    stats.value = {
      proximasSesiones: sesiones?.length || 0,
      puntosAcumulados: perfil?.puntos_bienestar || 0,
      desafiosActivos: desafios?.length || 0,
      logrosObtenidos: logros?.length || 0
    };

    proximasSesiones.value = sesiones || [];
    desafiosActivos.value = desafios || [];
    ultimosLogros.value = logros || [];
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>
```