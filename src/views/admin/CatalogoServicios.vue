<template>
  <div class="min-h-screen bg-gray-50">

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Catálogo de Servicios SMART Bienestar
              </h1>
              <p class="text-gray-600 mt-2">
                Explora los programas y recursos que puedes implementar para mejorar el bienestar organizacional.
              </p>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
              <Briefcase class="h-5 w-5 text-indigo-600" />
              <span class="text-sm font-semibold text-indigo-700">
                {{ serviciosFiltrados.length }} servicio{{ serviciosFiltrados.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Filtros por categoría -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cat in categorias"
              :key="cat"
              @click="categoriaSeleccionada = cat"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="categoriaSeleccionada === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Grid de Servicios -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="(servicio, index) in serviciosFiltrados"
            :key="servicio.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group animate-fade-in"
            @click="abrirDetalleServicio(servicio)"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- Imagen / Gradiente -->
            <div class="relative h-40 overflow-hidden" :class="obtenerColorCategoria(servicio.categoria).gradient">
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div class="absolute top-3 left-3 flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm"
                  :class="obtenerColorCategoria(servicio.categoria).bg + ' ' + obtenerColorCategoria(servicio.categoria).text"
                >
                  {{ servicio.categoria }}
                </span>
                <span
                  v-if="servicio.incluidoEnPrecio"
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 shadow-sm backdrop-blur-sm"
                >
                  Incluido
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 shadow-sm backdrop-blur-sm"
                >
                  Adicional
                </span>
              </div>
              <div class="absolute bottom-3 left-3 text-4xl drop-shadow-lg">
                {{ servicio.icono }}
              </div>
            </div>

            <!-- Contenido -->
            <div class="p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {{ servicio.nombre }}
              </h3>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                {{ servicio.descripcion }}
              </p>

              <!-- Info -->
              <div class="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <Clock class="h-4 w-4" />
                  <span>{{ servicio.duracion }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Monitor class="h-4 w-4" />
                  <span>{{ servicio.formato }}</span>
                </div>
              </div>

              <!-- Impacto -->
              <div class="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
                <p class="text-xs font-medium text-green-800">
                  <span class="font-semibold">Impacto:</span> {{ servicio.impacto }}
                </p>
              </div>

              <!-- Botón -->
              <button
                @click.stop="abrirDetalleServicio(servicio)"
                class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Eye class="h-4 w-4" />
                Ver más detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vacío: Sin servicios en categoría filtrada -->
        <div v-if="serviciosFiltrados.length === 0 && servicios.length > 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            No hay servicios en esta categoría
          </h3>
          <p class="text-gray-600 mb-4">
            Intenta con otra categoría o explora todos los servicios disponibles.
          </p>
          <button
            @click="categoriaSeleccionada = 'Todos'"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Briefcase class="h-4 w-4" />
            Ver todos los servicios
          </button>
        </div>

        <!-- Estado vacío: Sin servicios en el catálogo -->
        <div v-else-if="servicios.length === 0" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <!-- Ilustración -->
            <div class="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <div class="relative">
                <Briefcase class="h-16 w-16 text-indigo-400" />
                <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sparkles class="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-3">
              Tu catálogo de bienestar te espera
            </h3>
            <p class="text-gray-600 mb-6 leading-relaxed">
              Pronto tendrás acceso a programas de salud mental, clima laboral, comunicación y desarrollo profesional
              diseñados para mejorar el bienestar de tu equipo.
            </p>

            <!-- Beneficios -->
            <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 text-left">
              <h4 class="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <Target class="h-4 w-4" />
                ¿Qué encontrarás aquí?
              </h4>
              <ul class="space-y-2 text-sm text-indigo-800">
                <li class="flex items-start gap-2">
                  <CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Programas de salud mental y asistencia psicológica</span>
                </li>
                <li class="flex items-start gap-2">
                  <CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Coaching para líderes y mejora del clima laboral</span>
                </li>
                <li class="flex items-start gap-2">
                  <CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Talleres de gestión del tiempo, comunicación y habilidades blandas</span>
                </li>
                <li class="flex items-start gap-2">
                  <CheckCircle class="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Consultoría estratégica y bienestar integral</span>
                </li>
              </ul>
            </div>

            <p class="text-sm text-gray-500">
              ¿Necesitas un servicio específico? Contacta a tu asesor SMART Bienestar.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle -->
    <Dialog
      v-model:visible="modalDetalleAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="text-4xl">{{ servicioSeleccionado?.icono }}</div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ servicioSeleccionado?.nombre }}
            </h3>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mt-1"
              :class="obtenerColorCategoria(servicioSeleccionado?.categoria).bg + ' ' + obtenerColorCategoria(servicioSeleccionado?.categoria).text"
            >
              {{ servicioSeleccionado?.categoria }}
            </span>
          </div>
        </div>
      </template>

      <div v-if="servicioSeleccionado" class="space-y-6">
        <!-- Header visual -->
        <div class="relative h-48 rounded-xl overflow-hidden" :class="obtenerColorCategoria(servicioSeleccionado.categoria).gradient">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4">
            <div class="text-5xl mb-2 drop-shadow-lg">{{ servicioSeleccionado.icono }}</div>
            <span
              v-if="servicioSeleccionado.incluidoEnPrecio"
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800"
            >
              <CheckCircle class="h-3 w-3 mr-1" />
              Incluido en el precio
            </span>
            <span
              v-else
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800"
            >
              Servicio adicional
            </span>
          </div>
        </div>

        <!-- Información General -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <Clock class="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p class="text-sm font-semibold text-gray-900">{{ servicioSeleccionado.duracion }}</p>
            <p class="text-xs text-gray-600">Duración</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <Monitor class="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p class="text-sm font-semibold text-gray-900">{{ servicioSeleccionado.formato }}</p>
            <p class="text-xs text-gray-600">Formato</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 text-center">
            <Users class="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p class="text-sm font-semibold text-gray-900">{{ servicioSeleccionado.participantes }}</p>
            <p class="text-xs text-gray-600">Participantes</p>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText class="h-5 w-5 text-indigo-600" />
            Descripción
          </h4>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ servicioSeleccionado.descripcion }}
          </p>
        </div>

        <!-- Objetivos -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target class="h-5 w-5 text-indigo-600" />
            Objetivos
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(objetivo, index) in servicioSeleccionado.objetivos"
              :key="index"
              class="flex items-start gap-2 text-sm text-gray-700"
            >
              <CheckCircle class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{{ objetivo }}</span>
            </li>
          </ul>
        </div>

        <!-- Impacto Detallado -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp class="h-5 w-5 text-indigo-600" />
            Impacto Esperado
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(impacto, index) in servicioSeleccionado.impactoDetallado"
              :key="index"
              class="bg-green-50 border-l-4 border-green-500 p-3 rounded"
            >
              <p class="text-sm text-green-800 font-medium">{{ impacto }}</p>
            </div>
          </div>
        </div>

        <!-- Modalidad -->
        <div>
          <h4 class="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Layers class="h-5 w-5 text-indigo-600" />
            Modalidad
          </h4>
          <p class="text-sm text-gray-700 bg-indigo-50 p-3 rounded-lg">
            {{ servicioSeleccionado.modalidad }}
          </p>
        </div>

        <!-- Botón de Solicitud -->
        <div class="pt-4 border-t border-gray-200">
          <button
            @click="solicitarImplementacion"
            class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold shadow-lg hover:shadow-xl"
          >
            <Send class="h-5 w-5" />
            Solicitar implementación
          </button>
          <p class="text-xs text-gray-500 text-center mt-2">
            Un asesor se pondrá en contacto contigo para coordinar la implementación
          </p>
        </div>
      </div>
    </Dialog>

    <!-- Modal de Solicitud de Servicio -->
    <SolicitudServicio
      v-model:visible="modalSolicitudAbierto"
      :servicio="servicioSeleccionado"
      @solicitud-guardada="handleSolicitudGuardada"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import SolicitudServicio from '@/components/admin/SolicitudServicio.vue';
import {
  Briefcase,
  Clock,
  Monitor,
  Eye,
  Search,
  FileText,
  Target,
  CheckCircle,
  TrendingUp,
  Layers,
  Send,
  Users,
  Sparkles
} from 'lucide-vue-next';

const route = useRoute();
const toast = useToast();

const categoriaSeleccionada = ref('Todos');
const servicioSeleccionado = ref(null);
const modalDetalleAbierto = ref(false);
const modalSolicitudAbierto = ref(false);

const servicios = ref([
  // ── SALUD MENTAL ──
  {
    id: 'liderazgo-consciente',
    nombre: 'Liderazgo Consciente',
    descripcion: 'Un programa de formación diseñado para dotar a los líderes de herramientas prácticas que les permitan gestionarse emocionalmente, detectar señales tempranas de estrés, ansiedad, depresión o agotamiento en sus equipos y buscar soluciones sin necesidad de asumir funciones terapéuticas. Evitando así bajas o rotación de talento.',
    categoria: 'Salud Mental',
    icono: '🧠',
    duracion: '180 min (2 sesiones de 90 min)',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Prevención del burnout y mejora de la retención del talento',
    participantes: 'Líderes y mandos medios',
    objetivos: [
      'Dotar a los líderes de herramientas para gestionar su bienestar emocional',
      'Detectar señales tempranas de estrés, ansiedad o agotamiento en los equipos',
      'Buscar soluciones sin asumir funciones terapéuticas'
    ],
    impactoDetallado: [
      'Prevención del Burnout: Reduce la incidencia de agotamiento crónico en mandos medios y superiores',
      'Cultura de Empatía: Mejora la retención del talento al crear un entorno donde los equipos se sienten comprendidos',
      'Toma de Decisiones: Un líder con bienestar emocional mantiene mayor claridad mental y eficacia bajo presión'
    ],
    modalidad: 'Presencial o virtual — Cuidado mental y emocional para líderes'
  },
  {
    id: 'smart-care',
    nombre: 'SMART Care',
    descripcion: 'Servicio de orientación y apoyo psicológico externo que ofrece a todos los colaboradores un espacio seguro y profesional para abordar retos emocionales o personales que impactan en su vida laboral.',
    categoria: 'Salud Mental',
    icono: '💜',
    duracion: '2 sesiones/mes por empresa',
    formato: 'Sesiones individuales',
    incluidoEnPrecio: true,
    impacto: 'Reducción del absentismo e incremento del bienestar percibido',
    participantes: 'Todos los colaboradores',
    objetivos: [
      'Ofrecer un espacio seguro y confidencial de apoyo psicológico',
      'Intervenir de manera temprana en problemas de ansiedad o depresión',
      'Mejorar el bienestar general percibido por los colaboradores'
    ],
    impactoDetallado: [
      'Seguridad y confidencialidad: Canal de ayuda totalmente anónimo y externo a la empresa',
      'Reducción del absentismo: Intervención temprana que disminuye las bajas laborales',
      'Incremento del bienestar percibido: El colaborador siente que la empresa invierte en su salud integral'
    ],
    modalidad: 'Virtual — Asistencia Psicológica Profesional Confidencial'
  },

  // ── CLIMA LABORAL ──
  {
    id: 'coaching-lideres',
    nombre: 'Coaching Personalizado para Líderes',
    descripcion: 'Un acompañamiento individualizado para los mandos medios y gerentes de la organización, enfocado en potenciar sus habilidades de gestión de personas y resolución de conflictos dentro de sus equipos.',
    categoria: 'Clima Laboral',
    icono: '🎯',
    duracion: '4 sesiones/mes por empresa',
    formato: 'Sesiones individuales',
    incluidoEnPrecio: true,
    impacto: 'Fortalecimiento del vínculo líder-equipo y gestión de crisis',
    participantes: 'Mandos medios y gerentes',
    objetivos: [
      'Potenciar las habilidades de gestión de personas',
      'Mejorar la resolución de conflictos dentro de los equipos',
      'Desarrollar el autoconocimiento del líder'
    ],
    impactoDetallado: [
      'Fortalecimiento del vínculo: Mejora la relación directa entre el líder y cada colaborador',
      'Gestión de crisis: Herramientas para manejar situaciones difíciles de forma asertiva',
      'Desarrollo de autoconocimiento: Identificar sesgos o comportamientos que afectan la moral del equipo'
    ],
    modalidad: 'Presencial o virtual — Acompañamiento individualizado para líderes'
  },
  {
    id: 'transformacion-cultural',
    nombre: 'Transformación Cultura Organizacional',
    descripcion: 'Servicio de consultoría estratégica y facilitación grupal orientado a redefinir los valores y comportamientos de la empresa, eliminando silos y promoviendo una cultura de colaboración real.',
    categoria: 'Clima Laboral',
    icono: '🏛️',
    duracion: 'Según necesidad',
    formato: 'Consultoría estratégica',
    incluidoEnPrecio: false,
    impacto: 'Sentido de pertenencia y alineación organizacional',
    participantes: 'Toda la organización',
    objetivos: [
      'Redefinir los valores y comportamientos de la empresa',
      'Eliminar silos entre departamentos',
      'Promover una cultura de colaboración real'
    ],
    impactoDetallado: [
      'Sentido de pertenencia: Cada miembro se siente identificado con los valores de la empresa',
      'Alineación organizacional: Unifica la visión de todos los departamentos',
      'Optimización del ambiente: Reducción de dinámicas tóxicas y fomento del talento'
    ],
    modalidad: 'Presencial — Consultoría estratégica según necesidades de la organización'
  },

  // ── CARGA DE TRABAJO ──
  {
    id: 'gestion-prioridades',
    nombre: 'Multiplica el Tiempo Gestionando Prioridades',
    descripcion: 'En este taller práctico los participantes aprenderán a diferenciar lo urgente de lo importante, utilizando herramientas de planificación que permiten organizar la carga laboral de manera inteligente y realista para reducir la sensación de caos.',
    categoria: 'Carga de Trabajo',
    icono: '⏰',
    duracion: '90 minutos',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Reducción del estrés y aumento de la eficiencia',
    participantes: 'Todos los colaboradores',
    objetivos: [
      'Diferenciar lo urgente de lo importante',
      'Utilizar herramientas de planificación inteligente',
      'Reducir la sensación de caos en la carga laboral'
    ],
    impactoDetallado: [
      'Reducción del estrés: Disminuye la sensación de agobio con un orden claro de responsabilidades',
      'Aumento de la eficiencia: Energía dedicada a tareas que generan valor real',
      'Cumplimiento de Objetivos: Mejora la capacidad de entrega en plazos establecidos'
    ],
    modalidad: 'Presencial o virtual — Taller práctico de gestión de prioridades'
  },
  {
    id: 'cliente-dificil',
    nombre: 'Identificando y Gestionando al Cliente Difícil',
    descripcion: 'En este taller práctico los equipos aprenderán a identificar los diferentes perfiles de clientes difíciles, entender las razones detrás de sus comportamientos y aplicar herramientas efectivas para manejarlos.',
    categoria: 'Carga de Trabajo',
    icono: '🤝',
    duracion: '90 minutos',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Protección del bienestar y mejora de la comunicación con clientes',
    participantes: 'Equipos de servicio y atención al cliente',
    objetivos: [
      'Identificar diferentes perfiles de clientes difíciles',
      'Entender las razones detrás de sus comportamientos',
      'Aplicar herramientas efectivas de gestión de conflictos'
    ],
    impactoDetallado: [
      'Protección del Bienestar: Evita que el desgaste emocional por agentes externos afecte la salud mental',
      'Mejora de la Comunicación: Capacita para transformar conflictos en conversaciones productivas',
      'Retención del Talento: Reduce la rotación en áreas de servicio al hacer el entorno más sostenible'
    ],
    modalidad: 'Presencial o virtual — Taller práctico de gestión de clientes'
  },

  // ── COMUNICACIÓN ──
  {
    id: 'comunicacion-360',
    nombre: 'Comunicación 360°',
    descripcion: 'Este programa está diseñado para transformar la forma en que los líderes transmiten la estrategia a sus equipos. Se enfoca en eliminar el ruido informativo y asegurar que cada mensaje inspire acción, seguridad y confianza.',
    categoria: 'Comunicación',
    icono: '💬',
    duracion: '6 horas (4 sesiones de 90 min)',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Claridad de ejecución y seguridad psicológica en los equipos',
    participantes: 'Líderes y mandos medios',
    objetivos: [
      'Transformar la forma en que los líderes transmiten la estrategia',
      'Eliminar el ruido informativo en la organización',
      'Asegurar que cada mensaje inspire acción, seguridad y confianza'
    ],
    impactoDetallado: [
      'Claridad de Ejecución: Cada colaborador sabe exactamente qué se espera de él',
      'Seguridad Psicológica: Confianza para preguntar y proponer sin miedo',
      'Agilidad Organizacional: Canales de comunicación directos, honestos y sin filtros innecesarios'
    ],
    modalidad: 'Presencial o virtual — De la confusión continua a la claridad permanente'
  },

  // ── DESARROLLO PROFESIONAL ──
  {
    id: 'smart-skills',
    nombre: 'SMART Skills',
    descripcion: 'Programas de capacitación especializada en habilidades de alta demanda diseñados de forma personalizada para mantener a los colaboradores a la vanguardia de su sector.',
    categoria: 'Desarrollo Profesional',
    icono: '🚀',
    duracion: 'Según programa',
    formato: 'Capacitación especializada',
    incluidoEnPrecio: false,
    impacto: 'Actualización de competencias y competitividad del talento',
    participantes: 'Colaboradores según necesidad',
    objetivos: [
      'Capacitar en habilidades de alta demanda del sector',
      'Mantener a los colaboradores a la vanguardia',
      'Diseñar programas personalizados por equipo'
    ],
    impactoDetallado: [
      'Actualización de competencias: Herramientas modernas para trabajar con excelencia',
      'Competitividad del talento: Aumenta el valor profesional del colaborador',
      'Motivación por aprendizaje: Reduce el sentimiento de estancamiento profesional'
    ],
    modalidad: 'Presencial o virtual — Impulsando el Potencial Técnico del Equipo (contratación a través de colaboradores con condiciones preferentes)'
  },
  {
    id: 'habilidades-blandas',
    nombre: 'El Poder de las Habilidades Blandas',
    descripcion: 'Talleres enfocados en la inteligencia emocional, gestión del cambio, liderazgo, gestión del estrés y otros programas enfocados a desarrollar habilidades que permitan a los miembros del equipo fortalecer su liderazgo personal.',
    categoria: 'Desarrollo Profesional',
    icono: '💡',
    duracion: 'Según programa',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Liderazgo colaborativo y adaptabilidad al cambio',
    participantes: 'Todos los colaboradores',
    objetivos: [
      'Desarrollar inteligencia emocional y gestión del cambio',
      'Fortalecer el liderazgo personal de cada colaborador',
      'Mejorar la gestión del estrés y la resiliencia'
    ],
    impactoDetallado: [
      'Liderazgo Colaborativo: Mejor capacidad para trabajar en equipo y resolver conflictos',
      'Adaptabilidad al Cambio: Preparación para enfrentar nuevos retos con resiliencia y creatividad',
      'Relaciones Profesionales Sólidas: Fortalece la cohesión interna y la marca personal'
    ],
    modalidad: 'Presencial o virtual — Talleres de desarrollo de habilidades blandas'
  },

  // ── BIENESTAR GENERAL ──
  {
    id: 'gestion-energia',
    nombre: 'De Gestión del Tiempo a la Gestión de Energía',
    descripcion: 'Un programa práctico que enseña a los colaboradores a optimizar su jornada laboral basándose en sus picos de energía biológica, permitiéndoles trabajar de forma más fluida y sin agotamiento.',
    categoria: 'Bienestar General',
    icono: '⚡',
    duracion: '2 sesiones mensuales',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Recuperación del control y equilibrio vida-trabajo',
    participantes: 'Todos los colaboradores',
    objetivos: [
      'Optimizar la jornada laboral según picos de energía biológica',
      'Integrar pausas de calidad para mantener la claridad mental',
      'Mejorar la eficiencia para disfrutar de la vida personal'
    ],
    impactoDetallado: [
      'Recuperación del Control: Técnicas para evitar que la agenda domine, reduciendo la fatiga mental',
      'Sostenibilidad Personal: Pausas de calidad que mantienen la claridad mental durante toda la jornada',
      'Equilibrio Vida-Trabajo: Mayor eficiencia permite disfrutar de la vida personal sin carga mental'
    ],
    modalidad: 'Presencial o virtual — Programa práctico de gestión energética'
  },
  {
    id: 'pausa-consciente',
    nombre: 'Pausa Consciente para tu Calma Laboral',
    descripcion: 'Actividades como sesiones guiadas de estiramientos ergonómicos, respiración y relajación diseñadas para realizarse fuera y/o dentro del entorno laboral, ayudando a liberar la tensión física y mental.',
    categoria: 'Bienestar General',
    icono: '🧘',
    duracion: 'Sesiones periódicas',
    formato: 'Programa grupal',
    incluidoEnPrecio: true,
    impacto: 'Salud física inmediata y reducción del cortisol',
    participantes: 'Todos los colaboradores',
    objetivos: [
      'Liberar tensión física causada por el sedentarismo y malas posturas',
      'Reducir niveles de estrés en momentos de alta demanda',
      'Generar bienestar inmediato que mejore la actitud y disposición'
    ],
    impactoDetallado: [
      'Salud física inmediata: Reduce molestias por sedentarismo y posturas frente al ordenador',
      'Reducción del cortisol: Baja los niveles de estrés en momentos de alta demanda',
      'Mejora del Humor: Bienestar inmediato que mejora la actitud hacia tareas y compañeros'
    ],
    modalidad: 'Presencial o virtual — Sesiones guiadas de estiramientos, respiración y relajación'
  },

  // ── CONSULTORÍA ──
  {
    id: 'smart-advisory',
    nombre: 'SMART Advisory',
    descripcion: 'Un servicio de acompañamiento experto diseñado para ayudar a las empresas a interpretar los datos de la plataforma, obtener una visión externa y objetiva de su situación actual y diseñar planes de acción a medida que mejoren la experiencia de cada colaborador.',
    categoria: 'Consultoría',
    icono: '📊',
    duracion: '2 sesiones de 30 min/mes',
    formato: 'Consultoría estratégica',
    incluidoEnPrecio: true,
    impacto: 'Visión externa objetiva y estrategia basada en datos',
    participantes: 'Dirección y RRHH',
    objetivos: [
      'Interpretar los datos de la plataforma SMART Bienestar',
      'Obtener una visión externa y objetiva de la situación actual',
      'Diseñar planes de acción a medida para mejorar la experiencia del colaborador'
    ],
    impactoDetallado: [
      'Visión Externa y Objetiva: Perspectiva experta que identifica puntos ciegos de la empresa',
      'Optimización de la Plataforma: Máximo aprovechamiento de SMART Bienestar con alta participación',
      'Estrategia Basada en Datos: Métricas transformadas en decisiones de negocio inteligentes'
    ],
    modalidad: 'Virtual — Consultoría de Estrategia y Experiencia de Bienestar'
  }
]);

const categorias = computed(() => {
  const ordenCategorias = ['Salud Mental', 'Clima Laboral', 'Carga de Trabajo', 'Comunicación', 'Desarrollo Profesional', 'Bienestar General', 'Consultoría'];
  const cats = new Set(servicios.value.map(s => s.categoria));
  const catsOrdenadas = ordenCategorias.filter(c => cats.has(c));
  return ['Todos', ...catsOrdenadas];
});

const serviciosFiltrados = computed(() => {
  if (categoriaSeleccionada.value === 'Todos') {
    return servicios.value;
  }
  return servicios.value.filter(s => s.categoria === categoriaSeleccionada.value);
});

const obtenerColorCategoria = (categoria) => {
  const colores = {
    'Salud Mental': { bg: 'bg-purple-100', text: 'text-purple-800', gradient: 'bg-gradient-to-br from-purple-400 to-purple-700' },
    'Clima Laboral': { bg: 'bg-sky-100', text: 'text-sky-800', gradient: 'bg-gradient-to-br from-sky-400 to-sky-700' },
    'Carga de Trabajo': { bg: 'bg-amber-100', text: 'text-amber-800', gradient: 'bg-gradient-to-br from-amber-400 to-amber-700' },
    'Comunicación': { bg: 'bg-blue-100', text: 'text-blue-800', gradient: 'bg-gradient-to-br from-blue-400 to-blue-700' },
    'Desarrollo Profesional': { bg: 'bg-emerald-100', text: 'text-emerald-800', gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-700' },
    'Bienestar General': { bg: 'bg-teal-100', text: 'text-teal-800', gradient: 'bg-gradient-to-br from-teal-400 to-teal-700' },
    'Consultoría': { bg: 'bg-indigo-100', text: 'text-indigo-800', gradient: 'bg-gradient-to-br from-indigo-400 to-indigo-700' }
  };
  return colores[categoria] || { bg: 'bg-gray-100', text: 'text-gray-800', gradient: 'bg-gradient-to-br from-gray-400 to-gray-700' };
};

const abrirDetalleServicio = (servicio) => {
  servicioSeleccionado.value = servicio;
  modalDetalleAbierto.value = true;
};

const solicitarImplementacion = () => {
  modalDetalleAbierto.value = false;
  modalSolicitudAbierto.value = true;
};

const handleSolicitudGuardada = () => {
  servicioSeleccionado.value = null;
};

onMounted(() => {
  // TODO: Load services from Supabase
  const servicioId = route.query.servicio;
  if (servicioId) {
    const servicio = servicios.value.find(s => s.id === servicioId);
    if (servicio) {
      abrirDetalleServicio(servicio);
    }
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
