<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
// --- IMPORTACIÓN CORREGIDA ---
// Quitamos las llaves {} de Chart porque es una importación por defecto
import Chart from 'chart.js/auto';

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    })
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

watch(() => props.chartData, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData;
    chartInstance.update();
  }
});

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: props.chartData,
      options: props.chartOptions
    });
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="relative h-64">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>