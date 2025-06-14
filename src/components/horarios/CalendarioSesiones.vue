<template>
  <div class="calendario-container">
    <!-- Header del calendario -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <button 
          @click="navegarMes(-1)"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft class="h-5 w-5 text-gray-600" />
        </button>
        <h2 class="text-xl font-semibold text-gray-900">
          {{ nombreMes }} {{ añoActual }}
        </h2>
        <button 
          @click="navegarMes(1)"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight class="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Vista de calendario o lista -->
        <div class="bg-gray-100 p-1 rounded-lg">
          <button
            v-for="vista in vistas"
            :key="vista.id"
            @click="vistaActual = vista.id"
            :class="[
              'px-3 py-1 text-sm font-medium rounded-md transition-colors',
              vistaActual === vista.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            ]"
          >
            {{ vista.nombre }}
          </button>
        </div>
        
        <button @click="irAHoy" class="btn btn-outline text-sm">
          Hoy
        </button>
      </div>
    </div>

    <!-- Vista Mensual -->
    <div v-if="vistaActual === 'mes'" class="bg-white border rounded-lg overflow-hidden">
      <!-- Días de la semana -->
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div 
          v-for="dia in diasSemana" 
          :key="dia"
          class="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50"
        >
          {{ dia }}
        </div>
      </div>
      
      <!-- Días del mes -->
      <div class="grid grid-cols-7">
        <div
          v-for="(dia, index) in diasDelMes"
          :key="index"
          :class="[
            'min-h-[120px] p-2 border-r border-b border-gray-100',
            dia.esOtroMes ? 'bg-gray-50' : 'bg-white',
            dia.esHoy ? 'bg-blue-50' : ''
          ]"
        >
          <!-- Número del día -->
          <div class="flex items-center justify-between mb-2">
            <span 
              :class="[
                'text-sm font-medium',
                dia.esOtroMes ? 'text-gray-400' : 'text-gray-900',
                dia.esHoy ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''
              ]"
            >
              {{ dia.numero }}
            </span>
          </div>
          
          <!-- Sesiones del día -->
          <div class="space-y-1">
            <div
              v-for="sesion in obtenerSesionesDia(dia.fecha)"
              :key="sesion.id"
              @click="$emit('ver-reservas', sesion.id)"
              :class="[
                'p-1 rounded text-xs cursor-pointer transition-all hover:shadow-sm',
                getColorServicio(sesion.servicios?.tipo)
              ]"
              :title="`${sesion.titulo} - ${formatHora(sesion.fecha_inicio)}`"
            >
              <div class="font-medium truncate">{{ sesion.titulo }}</div>
              <div class="text-xs opacity-75">
                {{ formatHora(sesion.fecha_inicio) }} | {{ getOcupacion(sesion) }}
              </div>
            </div>
          </div>
          
          <!-- Indicador de más sesiones -->
          <div 
            v-if="obtenerSesionesDia(dia.fecha).length > 3"
            class="text-xs text-gray-500 mt-1"
          >
            +{{ obtenerSesionesDia(dia.fecha).length - 3 }} más
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Semanal -->
    <div v-if="vistaActual === 'semana'" class="bg-white border rounded-lg overflow-hidden">
      <!-- Encabezado de la semana -->
      <div class="grid grid-cols-8 border-b border-gray-200">
        <div class="p-3 border-r border-gray-200"></div>
        <div 
          v-for="dia in diasSemanaActual" 
          :key="dia.fecha"
          class="p-3 text-center border-r border-gray-200"
        >
          <div class="text-sm font-medium text-gray-700">{{ dia.diaNombre }}</div>
          <div 
            :class="[
              'text-lg font-semibold mt-1',
              dia.esHoy ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-gray-900'
            ]"
          >
            {{ dia.numero }}
          </div>
        </div>
      </div>
      
      <!-- Horas y sesiones -->
      <div class="max-h-96 overflow-y-auto">
        <div 
          v-for="hora in horasDelDia" 
          :key="hora"
          class="grid grid-cols-8 border-b border-gray-100"
        >
          <!-- Columna de hora -->
          <div class="p-3 border-r border-gray-200 text-sm text-gray-600 font-medium">
            {{ formatearHora(hora) }}
          </div>
          
          <!-- Columnas de días -->
          <div 
            v-for="dia in diasSemanaActual" 
            :key="`${dia.fecha}-${hora}`"
            class="p-2 border-r border-gray-200 min-h-[60px]"
          >
            <div
              v-for="sesion in obtenerSesionesHora(dia.fecha, hora)"
              :key="sesion.id"
              @click="$emit('editar-sesion', sesion)"
              :class="[
                'p-2 rounded cursor-pointer mb-1 transition-all hover:shadow-sm',
                getColorServicio(sesion.servicios?.tipo)
              ]"
            >
              <div class="text-xs font-medium truncate">{{ sesion.titulo }}</div>
              <div class="text-xs opacity-75">{{ getOcupacion(sesion) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Lista -->
    <div v-if="vistaActual === 'lista'" class="space-y-4">
      <div 
        v-for="fecha in fechasConSesiones" 
        :key="fecha"
        class="bg-white border rounded-lg overflow-hidden"
      >
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900">
            {{ formatearFechaCompleta(fecha) }}
          </h3>
        </div>
        
        <div class="divide-y divide-gray-100">
          <div
            v-for="sesion in sesionsPorFecha[fecha]"
            :key="sesion.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div 
                  :class="[
                    'w-3 h-3 rounded-full',
                    getColorDotServicio(sesion.servicios?.tipo)
                  ]"
                ></div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900">{{ sesion.titulo }}</h4>
                  <p class="text-xs text-gray-600">
                    {{ formatHora(sesion.fecha_inicio) }} - {{ formatHora(sesion.fecha_fin) }}
                    | {{ sesion.colaborador_nombre }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <span class="text-xs text-gray-500">{{ getOcupacion(sesion) }}</span>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="$emit('editar-sesion', sesion)"
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button 
                    @click="$emit('ver-reservas', sesion.id)"
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Users class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ChevronLeft, ChevronRight, Edit, Users } from 'lucide-vue-next';

const props = defineProps({
  sesiones: {
    type: Array,
    default: () => []
  },
  filtros: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['editar-sesion', 'ver-reservas']);

// Estado reactivo
const fechaActual = ref(new Date());
const vistaActual = ref('mes');

const vistas = [
  { id: 'mes', nombre: 'Mes' },
  { id: 'semana', nombre: 'Semana' },
  { id: 'lista', nombre: 'Lista' }
];

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const horasDelDia = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
];

// Computed properties
const nombreMes = computed(() => {
  return meses[fechaActual.value.getMonth()];
});

const añoActual = computed(() => {
  return fechaActual.value.getFullYear();
});

const diasDelMes = computed(() => {
  const año = fechaActual.value.getFullYear();
  const mes = fechaActual.value.getMonth();
  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);
  const diasPrevios = primerDia.getDay();
  
  const dias = [];
  
  // Días del mes anterior
  for (let i = diasPrevios - 1; i >= 0; i--) {
    const fecha = new Date(año, mes, -i);
    dias.push({
      numero: fecha.getDate(),
      fecha: fecha.toDateString(),
      esOtroMes: true,
      esHoy: false
    });
  }
  
  // Días del mes actual
  for (let i = 1; i <= ultimoDia.getDate(); i++) {
    const fecha = new Date(año, mes, i);
    const hoy = new Date();
    dias.push({
      numero: i,
      fecha: fecha.toDateString(),
      esOtroMes: false,
      esHoy: fecha.toDateString() === hoy.toDateString()
    });
  }
  
  // Días del mes siguiente para completar la grilla
  const diasRestantes = 42 - dias.length;
  for (let i = 1; i <= diasRestantes; i++) {
    const fecha = new Date(año, mes + 1, i);
    dias.push({
      numero: i,
      fecha: fecha.toDateString(),
      esOtroMes: true,
      esHoy: false
    });
  }
  
  return dias;
});

const diasSemanaActual = computed(() => {
  const hoy = new Date(fechaActual.value);
  const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
  
  const dias = [];
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(inicioSemana);
    fecha.setDate(fecha.getDate() + i);
    
    días.push({
      fecha: fecha.toDateString(),
      numero: fecha.getDate(),
      diaNombre: diasSemana[i],
      esHoy: fecha.toDateString() === new Date().toDateString()
    });
  }
  
  return dias;
});

const sesionesFiltradas = computed(() => {
  return props.sesiones.filter(sesion => {
    if (props.filtros.tipoServicio && sesion.servicios?.tipo !== props.filtros.tipoServicio) {
      return false;
    }
    if (props.filtros.colaborador && sesion.colaborador_id !== props.filtros.colaborador) {
      return false;
    }
    if (props.filtros.empresa && sesion.empresa_id !== props.filtros.empresa) {
      return false;
    }
    return true;
  });
});

const sesionsPorFecha = computed(() => {
  const grupos = {};
  sesionesFiltradas.value.forEach(sesion => {
    const fecha = new Date(sesion.fecha_inicio).toDateString();
    if (!grupos[fecha]) {
      grupos[fecha] = [];
    }
    grupos[fecha].push(sesion);
  });
  
  // Ordenar sesiones por hora dentro de cada fecha
  Object.keys(grupos).forEach(fecha => {
    grupos[fecha].sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
  });
  
  return grupos;
});

const fechasConSesiones = computed(() => {
  return Object.keys(sesionsPorFecha.value).sort((a, b) => new Date(a) - new Date(b));
});

// Métodos
const navegarMes = (direccion) => {
  const nuevaFecha = new Date(fechaActual.value);
  nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
  fechaActual.value = nuevaFecha;
};

const irAHoy = () => {
  fechaActual.value = new Date();
};

const obtenerSesionesDia = (fecha) => {
  return sesionsPorFecha.value[fecha] || [];
};

const obtenerSesionesHora = (fecha, hora) => {
  const sesionesDia = obtenerSesionesDia(fecha);
  return sesionesDia.filter(sesion => {
    const horaInicio = new Date(sesion.fecha_inicio).getHours();
    return horaInicio === hora;
  });
};

const formatHora = (fecha) => {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatearHora = (hora) => {
  return `${hora.toString().padStart(2, '0')}:00`;
};

const formatearFechaCompleta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getColorServicio = (tipo) => {
  const colores = {
    yoga: 'bg-green-100 text-green-800 border border-green-200',
    meditacion: 'bg-purple-100 text-purple-800 border border-purple-200',
    nutricion: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    coaching: 'bg-blue-100 text-blue-800 border border-blue-200',
    psicoterapia: 'bg-pink-100 text-pink-800 border border-pink-200',
    entrenamiento: 'bg-red-100 text-red-800 border border-red-200'
  };
  return colores[tipo] || 'bg-gray-100 text-gray-800 border border-gray-200';
};

const getColorDotServicio = (tipo) => {
  const colores = {
    yoga: 'bg-green-500',
    meditacion: 'bg-purple-500',
    nutricion: 'bg-yellow-500',
    coaching: 'bg-blue-500',
    psicoterapia: 'bg-pink-500',
    entrenamiento: 'bg-red-500'
  };
  return colores[tipo] || 'bg-gray-500';
};

const getOcupacion = (sesion) => {
  // Esta función debería calcular la ocupación real basada en las reservas
  // Por ahora, usamos datos simulados
  const reservas = Math.floor(Math.random() * sesion.capacidad_maxima);
  const ocupacion = Math.round((reservas / sesion.capacidad_maxima) * 100);
  return `${reservas}/${sesion.capacidad_maxima} (${ocupacion}%)`;
};
</script>

<style scoped>
.calendario-container {
  @apply w-full;
}

.calendar-cell {
  transition: all 0.2s ease;
}

.calendar-cell:hover {
  @apply bg-gray-50;
}

.sesion-item {
  transition: all 0.2s ease;
}

.sesion-item:hover {
  transform: translateY(-1px);
  @apply shadow-sm;
}
</style>