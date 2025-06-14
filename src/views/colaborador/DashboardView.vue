<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        ¡Bienvenido, {{ authStore.user?.nombre }}!
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Aquí tienes un resumen de tus actividades
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Sesiones Hoy"
        :value="stats.sesionesHoy"
        :icon="Calendar"
      />
      <StatsCard
        title="Calificación Promedio"
        :value="stats.calificacionPromedio"
        :icon="Star"
      />
      <StatsCard
        title="Clientes Activos"
        :value="stats.clientesActivos"
        :icon="Users"
      />
      <StatsCard
        title="Sesiones Completadas"
        :value="stats.sesionesCompletadas"
        :icon="TrendingUp"
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
            { key: 'titulo', header: 'Sesión' },
            {
              key: 'fecha',
              header: 'Fecha',
              render: (row) => formatDate(row.fecha_inicio)
            },
            {
              key: 'empresa',
              header: 'Empresa',
              render: (row) => row.empresas?.nombre || 'Privada'
            }
          ]"
          :data="proximasSesiones"
          :loading="loading"
          searchable={false}
          pagination={false}
        />
      </div>

      <!-- Últimas Calificaciones -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Últimas Calificaciones
        </h2>
        <DataTable
          :columns="[
            {
              key: 'sesion',
              header: 'Sesión',
              render: (row) => row.sesiones?.titulo
            },
            {
              key: 'calificacion',
              header: 'Calificación',
              render: (row) => (
                row.calificacion_general
              )
            },
            {
              key: 'fecha',
              header: 'Fecha',
              render: (row) => formatDate(row.fecha_feedback, 'short')
            }
          ]"
          :data="ultimasCalificaciones"
          :loading="loading"
          searchable={false}
          pagination={false}
        />
      </div>

      <!-- Sesiones Personalizadas -->
      <div class="lg:col-span-2">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Sesiones Personalizadas Pendientes
        </h2>
        <DataTable
          :columns="[
            { key: 'titulo', header: 'Título' },
            { key: 'tipo_sesion', header: 'Tipo' },
            {
              key: 'cliente',
              header: 'Cliente',
              render: (row) => `${row.usuarios.nombre} ${row.usuarios.apellido}`
            },
            {
              key: 'fecha',
              header: 'Fecha',
              render: (row) => row.fecha_sesion ? formatDate(row.fecha_sesion, 'short') : 'Por confirmar'
            }
          ]"
          :data="sesionesPersonalizadas"
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
import { Calendar, Star, Users, TrendingUp } from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth.store';
import { supabase } from '../../services/supabase';
import StatsCard from '../../components/common/StatsCard.vue';
import DataTable from '../../components/common/DataTable.vue';

const authStore = useAuthStore();
const loading = ref(true);

const stats = ref({
  sesionesHoy: 0,
  calificacionPromedio: 0,
  clientesActivos: 0,
  sesionesCompletadas: 0
});

const proximasSesiones = ref([]);
const ultimasCalificaciones = ref([]);
const sesionesPersonalizadas = ref([]);

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
      .from('sesiones')
      .select(`
        id,
        titulo,
        fecha_inicio,
        fecha_fin,
        modalidad,
        empresas (
          nombre
        )
      `)
      .eq('colaborador_id', authStore.user.id)
      .eq('estado_sesion', 'programada')
      .gte('fecha_inicio', new Date().toISOString())
      .order('fecha_inicio')
      .limit(5);

    // Cargar últimas calificaciones
    const { data: calificaciones } = await supabase
      .from('feedback_detallado')
      .select(`
        id,
        fecha_feedback,
        calificacion_general,
        calificacion_colaborador,
        comentario_general,
        sesiones (
          titulo
        )
      `)
      .eq('colaborador_id', authStore.user.id)
      .order('fecha_feedback', { ascending: false })
      .limit(5);

    // Calcular promedio de calificaciones
    const promedio = calificaciones?.length
      ? calificaciones.reduce((acc, curr) => acc + curr.calificacion_general, 0) / calificaciones.length
      : 0;

    // ✅ CONSULTA CORREGIDA - Cargar sesiones personalizadas pendientes
    const { data: personalizadasList, error: personalizadasError } = await supabase
      .from('sesiones_personalizadas')
      .select('*')
      .eq('colaborador_id', authStore.user.id)
      .in('estado', ['solicitada', 'confirmada'])
      .order('fecha_sesion')
      .limit(5);

    let personalizadas = [];

    if (!personalizadasError && personalizadasList && personalizadasList.length > 0) {
      // Obtener datos de usuarios por separado
      const usuarioIds = personalizadasList.map(p => p.usuario_id);
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido')
        .in('id', usuarioIds);

      // Combinar los datos
      personalizadas = personalizadasList.map(sesion => ({
        ...sesion,
        usuarios: usuariosData?.find(u => u.id === sesion.usuario_id) || {
          nombre: 'Sin datos',
          apellido: ''
        }
      }));
    }

    // Contar sesiones de hoy
    const sesionesHoy = sesiones?.filter(s => 
      new Date(s.fecha_inicio).toDateString() === new Date().toDateString()
    ).length || 0;

    // Contar clientes activos (usuarios únicos con reservas activas)
    const { data: reservas } = await supabase
      .from('reservas')
      .select('usuario_id')
      .eq('sesion.colaborador_id', authStore.user.id)
      .eq('estado', 'confirmada')
      .not('asistio', 'is', true);

    const clientesUnicos = new Set(reservas?.map(r => r.usuario_id));

    // Contar sesiones completadas
    const { count: completadas } = await supabase
      .from('sesiones')
      .select('id', { count: 'exact', head: true })
      .eq('colaborador_id', authStore.user.id)
      .eq('estado_sesion', 'completada');

    stats.value = {
      sesionesHoy,
      calificacionPromedio: Number(promedio.toFixed(1)),
      clientesActivos: clientesUnicos.size,
      sesionesCompletadas: completadas || 0
    };

    proximasSesiones.value = sesiones || [];
    ultimasCalificaciones.value = calificaciones || [];
    sesionesPersonalizadas.value = personalizadas;
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