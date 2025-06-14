<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard Superadmin</h1>
      <p class="mt-1 text-sm text-gray-500">
        Vista general del sistema
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Empresas"
        :value="stats.totalEmpresas"
        icon="Building2"
        trend="neutral"
      />
      <StatsCard
        title="Total Usuarios"
        :value="stats.totalUsuarios"
        icon="Users"
        trend="up"
      />
      <StatsCard
        title="Colaboradores Pendientes"
        :value="stats.colaboradoresPendientes"
        icon="UserCheck"
        trend="neutral"
      />
      <StatsCard
        title="Sesiones Hoy"
        :value="stats.sesionesHoy"
        icon="Calendar"
        trend="neutral"
      />
    </div>

    <!-- Tables Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Empresas Recientes -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Empresas Recientes
        </h2>
        <DataTable
          :columns="[
            { key: 'nombre', header: 'Nombre' },
            { key: 'dominio_email', header: 'Dominio' },
            {
              key: 'activo',
              header: 'Estado',
              render: (row) => ({
                text: row.activo ? 'Activa' : 'Inactiva',
                class: row.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              })
            }
          ]"
          :data="empresasRecientes"
          searchable={false}
          pagination={false}
        />
      </div>

      <!-- Colaboradores Pendientes -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Colaboradores Pendientes
        </h2>
        <DataTable
          :columns="[
            {
              key: 'nombre',
              header: 'Nombre',
              render: (row) => `${row.usuarios.nombre} ${row.usuarios.apellido}`
            },
            {
              key: 'email',
              header: 'Email',
              render: (row) => row.usuarios.email
            },
            { key: 'especialidad', header: 'Especialidad' }
          ]"
          :data="colaboradoresPendientes"
          searchable={false}
          pagination={false}
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Building2, Users, UserCheck, Calendar } from 'lucide-vue-next';
import { supabase } from '../../services/supabase';
import StatsCard from '../../components/common/StatsCard.vue';
import DataTable from '../../components/common/DataTable.vue';

const stats = ref({
  totalEmpresas: 0,
  totalUsuarios: 0,
  colaboradoresPendientes: 0,
  sesionesHoy: 0
});

const empresasRecientes = ref([]);
const colaboradoresPendientes = ref([]);

const loadDashboardData = async () => {
  try {
    // Cargar estadísticas
    const [
      { count: empresasCount },
      { count: usuariosCount },
      { count: colaboradoresCount },
      { count: sesionesCount }
    ] = await Promise.all([
      supabase.from('empresas').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }),
      supabase
        .from('perfil_colaboradores')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente'),
      supabase
        .from('sesiones')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_inicio', new Date().toISOString().split('T')[0])
        .lte('fecha_inicio', new Date().toISOString().split('T')[0] + 'T23:59:59')
    ]);

    stats.value = {
      totalEmpresas: empresasCount || 0,
      totalUsuarios: usuariosCount || 0,
      colaboradoresPendientes: colaboradoresCount || 0,
      sesionesHoy: sesionesCount || 0
    };

    // Cargar empresas recientes
    const { data: empresas } = await supabase
      .from('empresas')
      .select('*')
      .order('fecha_registro', { ascending: false })
      .limit(5);

    empresasRecientes.value = empresas || [];

    // ✅ CONSULTA CORREGIDA - Cargar colaboradores pendientes
    const { data: colaboradoresList, error: colaboradoresError } = await supabase
      .from('perfil_colaboradores')
      .select('*')
      .eq('estado', 'pendiente')
      .limit(5);

    let colaboradores = [];

    if (!colaboradoresError && colaboradoresList && colaboradoresList.length > 0) {
      // Obtener datos de usuarios por separado
      const usuarioIds = colaboradoresList.map(c => c.usuario_id);
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('id, nombre, apellido, email')
        .in('id', usuarioIds);

      // Combinar los datos
      colaboradores = colaboradoresList.map(colab => ({
        ...colab,
        usuarios: usuariosData?.find(u => u.id === colab.usuario_id) || {
          nombre: 'Sin datos',
          apellido: '',
          email: 'No disponible'
        }
      }));
    }

    colaboradoresPendientes.value = colaboradores;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>