<template>
  <div class="min-h-screen bg-gray-50">

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Configuración Global</h1>
          <p class="text-gray-600 mt-2">Define los parámetros generales de tu organización y del sistema de encuestas</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Columna Principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Datos de la Empresa -->
            <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div class="flex items-center border-b pb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Building2 class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-800">Datos de la Empresa</h2>
                  <p class="text-sm text-gray-600">Información básica de tu organización</p>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Nombre de la Empresa -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la empresa
                  </label>
                  <input
                    v-model="config.empresa.nombre"
                    type="text"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nombre de tu empresa"
                  />
                </div>

                <!-- Logo (Mock Upload) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Logo de la empresa
                  </label>
                  <div class="flex items-center gap-4">
                    <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <ImagePlus class="h-8 w-8 text-gray-400" />
                    </div>
                    <button
                      @click="handleLogoUpload"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Subir logo
                    </button>
                    <p class="text-xs text-gray-500">PNG o JPG, máx. 2MB</p>
                  </div>
                </div>

                <!-- País -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <select
                    v-model="config.empresa.pais"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option v-for="pais in opciones.paises" :key="pais" :value="pais">
                      {{ pais }}
                    </option>
                  </select>
                </div>

                <!-- Idioma Predeterminado -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Idioma predeterminado
                  </label>
                  <select
                    v-model="config.empresa.idioma"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option v-for="idioma in opciones.idiomas" :key="idioma" :value="idioma">
                      {{ idioma }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Parámetros de Encuestas -->
            <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div class="flex items-center border-b pb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <ClipboardList class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-800">Parámetros de Encuestas</h2>
                  <p class="text-sm text-gray-600">Configuración predeterminada para nuevas encuestas</p>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Escala por Defecto -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Escala por defecto
                  </label>
                  <select
                    v-model="config.encuestas.escala"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option v-for="escala in opciones.escalas" :key="escala" :value="escala">
                      {{ escala }}
                    </option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">Escala de valoración para preguntas numéricas</p>
                </div>

                <!-- Nivel de Anonimato Predeterminado -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Nivel de anonimato predeterminado
                  </label>
                  <div class="space-y-3">
                    <label
                      v-for="nivel in opciones.nivelesAnonimato"
                      :key="nivel.id"
                      class="flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all"
                      :class="config.encuestas.anonimato_predeterminado === nivel.label ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'"
                    >
                      <input
                        type="radio"
                        :value="nivel.label"
                        v-model="config.encuestas.anonimato_predeterminado"
                        class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div class="ml-3">
                        <p class="font-medium text-sm text-gray-900">{{ nivel.label }}</p>
                        <p class="text-xs text-gray-600">{{ nivel.descripcion }}</p>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Umbral Mínimo de Respuestas -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Umbral mínimo de respuestas
                  </label>
                  <input
                    v-model.number="config.encuestas.umbral_resultados"
                    type="number"
                    min="1"
                    max="100"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Número mínimo de respuestas para mostrar resultados</p>
                </div>

                <!-- Frecuencia de Encuestas Pulso -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia de encuestas pulso
                  </label>
                  <select
                    v-model="config.encuestas.frecuencia_pulso"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option v-for="freq in opciones.frecuenciasPulso" :key="freq" :value="freq">
                      {{ freq }}
                    </option>
                  </select>
                </div>

                <!-- Recordatorios Automáticos -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-sm text-gray-900">Recordatorios automáticos</p>
                    <p class="text-xs text-gray-600 mt-1">Enviar recordatorios a quienes no han respondido</p>
                  </div>
                  <button
                    @click="config.encuestas.recordatorio_automatico = !config.encuestas.recordatorio_automatico"
                    class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    :class="config.encuestas.recordatorio_automatico ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="config.encuestas.recordatorio_automatico ? 'translate-x-6' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>

                <!-- Días para Recordatorio -->
                <div v-if="config.encuestas.recordatorio_automatico">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Días antes de enviar recordatorio
                  </label>
                  <input
                    v-model.number="config.encuestas.dias_recordatorio"
                    type="number"
                    min="1"
                    max="14"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Preferencias de Interfaz -->
            <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div class="flex items-center border-b pb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <Palette class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-800">Preferencias de Interfaz</h2>
                  <p class="text-sm text-gray-600">Personaliza la apariencia del sistema</p>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Tema -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tema
                  </label>
                  <div class="grid grid-cols-3 gap-3">
                    <button
                      v-for="tema in opciones.temas"
                      :key="tema"
                      @click="config.interfaz.tema = tema"
                      class="p-3 border-2 rounded-lg text-sm font-medium transition-all"
                      :class="config.interfaz.tema === tema ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-700 hover:border-gray-400'"
                    >
                      {{ tema }}
                    </button>
                  </div>
                </div>

                <!-- Idioma de Interfaz -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Idioma de interfaz
                  </label>
                  <select
                    v-model="config.interfaz.idioma_ui"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option v-for="idioma in opciones.idiomas" :key="idioma" :value="idioma">
                      {{ idioma }}
                    </option>
                  </select>
                </div>

                <!-- Notificaciones Email -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-sm text-gray-900">Notificaciones por email</p>
                    <p class="text-xs text-gray-600 mt-1">Recibir alertas y resúmenes por correo</p>
                  </div>
                  <button
                    @click="config.interfaz.notificaciones_email = !config.interfaz.notificaciones_email"
                    class="relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    :class="config.interfaz.notificaciones_email ? 'bg-indigo-600' : 'bg-gray-200'"
                  >
                    <span
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="config.interfaz.notificaciones_email ? 'translate-x-6' : 'translate-x-0'"
                    ></span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Privacidad y Cumplimiento -->
            <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div class="flex items-center border-b pb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-800">Privacidad y Cumplimiento</h2>
                  <p class="text-sm text-gray-600">Gestión de datos y normativas</p>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Retención de Datos -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Retención de datos (meses)
                  </label>
                  <input
                    v-model.number="config.privacidad.retencion_datos_meses"
                    type="number"
                    min="6"
                    max="60"
                    class="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">Tiempo que se conservan los datos históricos</p>
                </div>

                <!-- Cumplimiento GDPR -->
                <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p class="font-medium text-sm text-blue-900 flex items-center">
                      <CheckCircle class="h-4 w-4 mr-2" />
                      Cumplimiento GDPR
                    </p>
                    <p class="text-xs text-blue-800 mt-1">Sistema conforme con normativa europea de protección de datos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Lateral - Vista Previa -->
          <div class="lg:col-span-1">
            <div class="sticky top-8 space-y-6">
              <!-- Vista Previa -->
              <div class="bg-white rounded-xl p-6 shadow-sm">
                <div class="flex items-center mb-4">
                  <Eye class="h-5 w-5 text-gray-600 mr-2" />
                  <h3 class="text-lg font-semibold text-gray-900">Vista Previa</h3>
                </div>

                <div class="space-y-4">
                  <!-- Logo y Nombre -->
                  <div class="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Building2 class="h-8 w-8 text-indigo-600" />
                    </div>
                    <h4 class="font-bold text-gray-900">{{ config.empresa.nombre }}</h4>
                    <p class="text-xs text-gray-600 mt-1">{{ config.empresa.pais }}</p>
                  </div>

                  <!-- Configuración Actual -->
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between py-2 border-b border-gray-200">
                      <span class="text-gray-600">Escala:</span>
                      <span class="font-medium text-gray-900">{{ config.encuestas.escala }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-200">
                      <span class="text-gray-600">Anonimato:</span>
                      <span class="font-medium text-gray-900 text-xs">{{ config.encuestas.anonimato_predeterminado }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-200">
                      <span class="text-gray-600">Umbral:</span>
                      <span class="font-medium text-gray-900">{{ config.encuestas.umbral_resultados }} respuestas</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-200">
                      <span class="text-gray-600">Tema:</span>
                      <span class="font-medium text-gray-900">{{ config.interfaz.tema }}</span>
                    </div>
                    <div class="flex justify-between py-2">
                      <span class="text-gray-600">Idioma:</span>
                      <span class="font-medium text-gray-900">{{ config.interfaz.idioma_ui }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="space-y-3">
                <button
                  @click="guardarConfiguracion"
                  :disabled="guardando"
                  class="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Save v-if="!guardando" class="h-5 w-5" />
                  <Loader2 v-else class="h-5 w-5 animate-spin" />
                  {{ guardando ? 'Guardando...' : 'Guardar configuración' }}
                </button>

                <button
                  @click="resetearConfiguracion"
                  class="w-full flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw class="h-5 w-5" />
                  Restaurar valores por defecto
                </button>
              </div>

              <!-- Info GDPR -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start">
                  <Info class="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p class="text-xs font-semibold text-blue-900 mb-1">Protección de Datos</p>
                    <p class="text-xs text-blue-800">
                      Todos los cambios cumplen con GDPR y se almacenan de forma segura.
                    </p>
                  </div>
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
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import {
  Building2,
  ClipboardList,
  Palette,
  Shield,
  Eye,
  Save,
  RotateCcw,
  Info,
  CheckCircle,
  ImagePlus,
  Loader2
} from 'lucide-vue-next';
import {
  configuracionMock,
  opcionesConfiguracion,
  guardarConfiguracion as guardarConfig,
  cargarConfiguracion,
  resetearConfiguracion as resetearConfig
} from '@/utils/configuracionMock.js';

const toast = useToast();

// TODO: conectar con tabla "configuracion_empresa" y "parametros_encuestas" en futuras iteraciones.

// Estado
const config = reactive({ ...configuracionMock });
const opciones = opcionesConfiguracion;
const guardando = ref(false);

// Métodos
const guardarConfiguracion = async () => {
  guardando.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    guardarConfig(config);

    toast.add({
      severity: 'success',
      summary: 'Configuración actualizada correctamente',
      detail: 'Los cambios se han guardado exitosamente',
      life: 4000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: 'No se pudo guardar la configuración. Intenta de nuevo.',
      life: 4000
    });
  } finally {
    guardando.value = false;
  }
};

const resetearConfiguracion = () => {
  const configReset = resetearConfig();
  Object.assign(config, configReset);

  toast.add({
    severity: 'info',
    summary: 'Configuración restaurada',
    detail: 'Se han restaurado los valores por defecto',
    life: 3000
  });
};

const handleLogoUpload = () => {
  toast.add({
    severity: 'info',
    summary: 'Función de subida de logo',
    detail: 'Mock: En producción se abrirá el selector de archivos',
    life: 3000
  });
};

onMounted(() => {
  cargarConfiguracion();
  console.log('Configuración Global cargada');
});
</script>
