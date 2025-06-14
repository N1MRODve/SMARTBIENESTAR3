<script setup>
import { computed } from 'vue';
import { format, differenceInDays, isPast, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Hemos eliminado la importación de 'lucide-vue-next' por completo

const props = defineProps({
  servicio: {
    type: Object,
    required: true,
  }
});

// Ya no necesitamos 'iconMap' ni 'serviceIcon'

const statusInfo = computed(() => {
  const fin = new Date(props.servicio.fecha_fin);
  if (!props.servicio.activo || isPast(fin)) {
    return { text: 'Expirado', classes: 'bg-gray-100 text-gray-800' };
  }
  if (differenceInDays(fin, new Date()) <= 30) {
    return { text: 'Próximo a Vencer', classes: 'bg-yellow-100 text-yellow-800 animate-pulse' };
  }
  return { text: 'Activo', classes: 'bg-green-100 text-green-800' };
});

const vigencia = computed(() => {
    const inicio = format(new Date(props.servicio.fecha_inicio), 'd MMM yy', { locale: es });
    const fin = format(new Date(props.servicio.fecha_fin), 'd MMM yy', { locale: es });
    return `${inicio} - ${fin}`;
});

const tiempoRestante = computed(() => {
    const fin = new Date(props.servicio.fecha_fin);
    if (isPast(fin)) return 'Finalizado';
    return `Vence ${formatDistanceToNow(fin, { locale: es, addSuffix: true })}`;
});

</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-bold text-gray-900">
          {{ servicio.tipo_servicio.charAt(0).toUpperCase() + servicio.tipo_servicio.slice(1) }}
        </h3>
        <span :class="['px-2 py-0.5 text-xs font-medium rounded-full mt-1 inline-block', statusInfo.classes]">
          {{ statusInfo.text }}
        </span>
      </div>
    </div>

    <div class="my-4 flex-grow">
      <p class="text-sm text-gray-500">Vigencia del Contrato</p>
      <p class="text-base font-medium text-gray-800">{{ vigencia }}</p>
      
      <p v-if="servicio.activo && !isPast(new Date(servicio.fecha_fin))" class="text-sm text-primary font-semibold mt-2">
        {{ tiempoRestante }}
      </p>

      <p v-if="servicio.notas" class="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mt-3">
        <strong>Notas:</strong> {{ servicio.notas }}
      </p>
    </div>
  </div>
</template>