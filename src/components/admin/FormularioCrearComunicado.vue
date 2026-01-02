<template>
  <div class="space-y-6">

    <!-- Progress Indicator -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">
          {{ comunicadoInicial ? 'Editar comunicado' : 'Nuevo comunicado' }}
        </h2>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <Clock class="h-4 w-4" />
          <span>Tiempo estimado: 2-3 min</span>
        </div>
      </div>

      <!-- Steps Progress Bar -->
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              :class="getStepClass(index)"
            >
              <CheckCircle v-if="index < currentStep" class="h-5 w-5" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              class="ml-3 text-sm font-medium hidden sm:block"
              :class="index <= currentStep ? 'text-gray-900' : 'text-gray-400'"
            >
              {{ step.name }}
            </span>
          </div>
          <div
            v-if="index < steps.length - 1"
            class="flex-1 h-1 mx-4 rounded"
            :class="index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'"
          ></div>
        </div>
      </div>
    </div>

    <!-- STEP 1: Tipo y Plantilla -->
    <div v-show="currentStep === 0" class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          ¿Qué tipo de comunicado quieres enviar?
        </h3>
        <p class="text-sm text-gray-600">
          Selecciona una plantilla para empezar más rápido o comienza desde cero
        </p>
      </div>

      <!-- Plantillas Mejoradas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button
          v-for="plantilla in plantillas"
          :key="plantilla.id"
          type="button"
          @click="aplicarPlantilla(plantilla)"
          class="group relative p-5 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md"
          :class="plantillaSeleccionada?.id === plantilla.id
            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
            : 'border-gray-200 bg-white hover:border-indigo-300'"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              :class="plantillaSeleccionada?.id === plantilla.id ? 'bg-indigo-100' : 'bg-gray-100 group-hover:bg-indigo-50'"
            >
              {{ plantilla.icono }}
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 mb-1">{{ plantilla.nombre }}</h4>
              <p class="text-xs text-gray-500 leading-relaxed">{{ plantilla.descripcion }}</p>
            </div>
          </div>
          <div
            v-if="plantillaSeleccionada?.id === plantilla.id"
            class="absolute top-3 right-3"
          >
            <CheckCircle class="h-5 w-5 text-indigo-600" />
          </div>
        </button>

        <!-- Opción: Desde cero -->
        <button
          type="button"
          @click="plantillaSeleccionada = null; formData.tipo = ''"
          class="group p-5 rounded-xl border-2 border-dashed transition-all duration-200 text-left hover:shadow-md"
          :class="plantillaSeleccionada === null && formData.tipo === ''
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-300'"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-gray-200 group-hover:bg-indigo-100 flex items-center justify-center">
              <Plus class="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900 mb-1">Desde cero</h4>
              <p class="text-xs text-gray-500">Crea un comunicado personalizado sin plantilla</p>
            </div>
          </div>
        </button>
      </div>

      <!-- Tipo de Comunicado (si no usa plantilla) -->
      <div v-if="!plantillaSeleccionada" class="border-t border-gray-200 pt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tipo de comunicado <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.tipo"
          class="w-full max-w-md rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900"
        >
          <option value="">Selecciona un tipo...</option>
          <option value="Plan de mejora">Plan de mejora</option>
          <option value="Felicitación">Felicitación</option>
          <option value="Comunicación General">Comunicación general</option>
          <option value="Resultados">Compartir resultados</option>
          <option value="Acción">Llamada a la acción</option>
          <option value="Recordatorio">Recordatorio</option>
          <option value="Evento">Evento o actividad</option>
        </select>
      </div>

      <!-- Navigation -->
      <div class="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          @click="nextStep"
          :disabled="!canProceedStep1"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente: Contenido
          <ArrowRight class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- STEP 2: Contenido -->
    <div v-show="currentStep === 1" class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          Escribe tu mensaje
        </h3>
        <p class="text-sm text-gray-600">
          Un buen comunicado es claro, breve y tiene un objetivo definido
        </p>
      </div>

      <!-- Título -->
      <div class="mb-6">
        <label for="titulo" class="block text-sm font-medium text-gray-700 mb-2">
          Asunto del comunicado <span class="text-red-500">*</span>
        </label>
        <input
          id="titulo"
          v-model="formData.titulo"
          type="text"
          maxlength="100"
          :placeholder="getTituloPlaceholder()"
          class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900"
        />
        <div class="flex justify-between mt-2">
          <p class="text-xs text-gray-500">
            💡 Sé específico: "Resultados encuesta Marzo" es mejor que "Resultados"
          </p>
          <span class="text-xs" :class="formData.titulo.length > 80 ? 'text-orange-600' : 'text-gray-400'">
            {{ formData.titulo.length }}/100
          </span>
        </div>
      </div>

      <!-- Contenido -->
      <div class="mb-6">
        <label for="contenido" class="block text-sm font-medium text-gray-700 mb-2">
          Mensaje <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <textarea
            id="contenido"
            v-model="formData.contenido"
            rows="10"
            :placeholder="getContenidoPlaceholder()"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 text-gray-900 resize-none"
          ></textarea>

          <!-- Sugerencias según tipo -->
          <div v-if="sugerenciasActivas" class="absolute right-3 top-3">
            <button
              @click="mostrarSugerencias = !mostrarSugerencias"
              class="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
              title="Ver sugerencias"
            >
              <Lightbulb class="h-4 w-4 text-amber-600" />
            </button>
          </div>
        </div>

        <!-- Panel de Sugerencias -->
        <div
          v-if="mostrarSugerencias && sugerenciasActivas"
          class="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <div class="flex items-start gap-3">
            <Lightbulb class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-amber-900 mb-2">Sugerencias para "{{ formData.tipo }}"</p>
              <ul class="text-xs text-amber-800 space-y-1">
                <li v-for="sugerencia in getSugerencias()" :key="sugerencia">• {{ sugerencia }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="flex justify-between mt-2">
          <p class="text-xs text-gray-500">
            📝 Lectura estimada: {{ tiempoLectura }} min
          </p>
          <span class="text-xs" :class="formData.contenido.length > 2000 ? 'text-orange-600' : 'text-gray-400'">
            {{ formData.contenido.length }} caracteres
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          @click="prevStep"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
        >
          <ArrowLeft class="h-5 w-5" />
          Anterior
        </button>
        <button
          @click="nextStep"
          :disabled="!canProceedStep2"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente: Destinatarios
          <ArrowRight class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- STEP 3: Destinatarios -->
    <div v-show="currentStep === 2" class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          ¿A quién va dirigido?
        </h3>
        <p class="text-sm text-gray-600">
          Segmenta tu audiencia para que el mensaje llegue a las personas correctas
        </p>
      </div>

      <!-- Selector rápido: Todos -->
      <div class="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="enviarATodos"
            @change="toggleEnviarATodos"
            class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <span class="text-sm font-semibold text-indigo-900">Enviar a toda la empresa</span>
            <p class="text-xs text-indigo-700">Selecciona todos los departamentos y roles automáticamente</p>
          </div>
        </label>
      </div>

      <!-- Departamentos -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-gray-700">
            Departamentos <span class="text-red-500">*</span>
          </label>
          <span class="text-xs text-gray-500">
            {{ formData.destinatarios.length }} de {{ departamentos.length }} seleccionados
          </span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <label
            v-for="dept in departamentos"
            :key="dept.id"
            class="flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-indigo-300"
            :class="formData.destinatarios.includes(dept.nombre)
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-200 bg-white'"
          >
            <input
              type="checkbox"
              :value="dept.nombre"
              v-model="formData.destinatarios"
              class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div class="flex-1 min-w-0">
              <span class="text-sm font-medium text-gray-900 block truncate">{{ dept.nombre }}</span>
              <span class="text-xs text-gray-500">{{ dept.empleados }} personas</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Roles -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-gray-700">
            Roles <span class="text-red-500">*</span>
          </label>
          <span class="text-xs text-gray-500">
            {{ formData.roles.length }} seleccionado{{ formData.roles.length !== 1 ? 's' : '' }}
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label
            v-for="rol in roles"
            :key="rol.id"
            class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-purple-300"
            :class="formData.roles.includes(rol.nombre)
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 bg-white'"
          >
            <input
              type="checkbox"
              :value="rol.nombre"
              v-model="formData.roles"
              class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <div>
              <span class="text-sm font-medium text-gray-900">{{ rol.nombre }}</span>
              <p class="text-xs text-gray-500">{{ rol.descripcion }}</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Indicador de Alcance: verde si hay destinatarios, ámbar si no -->
      <div
        class="p-4 rounded-xl border"
        :class="alcanceEstimado > 0
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            :class="alcanceEstimado > 0 ? 'bg-green-100' : 'bg-amber-100'"
          >
            <Users v-if="alcanceEstimado > 0" class="h-7 w-7 text-green-600" />
            <AlertCircle v-else class="h-7 w-7 text-amber-600" />
          </div>
          <div>
            <p
              class="text-2xl font-bold"
              :class="alcanceEstimado > 0 ? 'text-green-800' : 'text-amber-800'"
            >
              {{ alcanceEstimado }} personas
            </p>
            <p
              class="text-sm"
              :class="alcanceEstimado > 0 ? 'text-green-700' : 'text-amber-700'"
            >
              {{ alcanceEstimado > 0 ? 'recibirán este comunicado' : 'No hay empleados en los departamentos seleccionados' }}
            </p>
          </div>
          <div v-if="alcanceEstimado > 0" class="ml-auto text-right">
            <p class="text-xs text-green-600 font-medium">Alcance estimado</p>
            <p class="text-xs text-green-600">{{ porcentajeAlcance }}% de la empresa</p>
          </div>
          <div v-else class="ml-auto">
            <p class="text-xs text-amber-600 font-medium">Asigna empleados a departamentos</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          @click="prevStep"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
        >
          <ArrowLeft class="h-5 w-5" />
          Anterior
        </button>
        <button
          @click="nextStep"
          :disabled="!canProceedStep3"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente: Programar
          <ArrowRight class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- STEP 4: Programación y Envío -->
    <div v-show="currentStep === 3" class="space-y-6">

      <!-- Opciones de Envío -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">
            ¿Cuándo quieres enviarlo?
          </h3>
          <p class="text-sm text-gray-600">
            Elige el mejor momento para maximizar la lectura
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Enviar ahora -->
          <label
            class="relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
            :class="tipoEnvio === 'inmediato'
              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
              : 'border-gray-200 hover:border-indigo-300'"
          >
            <input
              type="radio"
              v-model="tipoEnvio"
              value="inmediato"
              class="sr-only"
            />
            <div class="flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <Send class="h-7 w-7 text-indigo-600" />
              </div>
              <h4 class="font-semibold text-gray-900 mb-1">Enviar ahora</h4>
              <p class="text-xs text-gray-500">Se enviará inmediatamente</p>
            </div>
            <div v-if="tipoEnvio === 'inmediato'" class="absolute top-3 right-3">
              <CheckCircle class="h-5 w-5 text-indigo-600" />
            </div>
          </label>

          <!-- Programar -->
          <label
            class="relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
            :class="tipoEnvio === 'programado'
              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
              : 'border-gray-200 hover:border-indigo-300'"
          >
            <input
              type="radio"
              v-model="tipoEnvio"
              value="programado"
              class="sr-only"
            />
            <div class="flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <Calendar class="h-7 w-7 text-amber-600" />
              </div>
              <h4 class="font-semibold text-gray-900 mb-1">Programar envío</h4>
              <p class="text-xs text-gray-500">Elige fecha y hora</p>
            </div>
            <div v-if="tipoEnvio === 'programado'" class="absolute top-3 right-3">
              <CheckCircle class="h-5 w-5 text-indigo-600" />
            </div>
          </label>

          <!-- Borrador -->
          <label
            class="relative p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
            :class="tipoEnvio === 'borrador'
              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
              : 'border-gray-200 hover:border-indigo-300'"
          >
            <input
              type="radio"
              v-model="tipoEnvio"
              value="borrador"
              class="sr-only"
            />
            <div class="flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <FileText class="h-7 w-7 text-gray-600" />
              </div>
              <h4 class="font-semibold text-gray-900 mb-1">Guardar borrador</h4>
              <p class="text-xs text-gray-500">Terminar más tarde</p>
            </div>
            <div v-if="tipoEnvio === 'borrador'" class="absolute top-3 right-3">
              <CheckCircle class="h-5 w-5 text-indigo-600" />
            </div>
          </label>
        </div>

        <!-- Selector de fecha/hora (si programado) -->
        <div v-if="tipoEnvio === 'programado'" class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de envío <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                v-model="formData.fecha_envio"
                :min="fechaMinima"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hora de envío
              </label>
              <select
                v-model="formData.hora_envio"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3"
              >
                <option value="09:00">09:00 - Inicio de jornada</option>
                <option value="11:00">11:00 - Media mañana</option>
                <option value="14:00">14:00 - Después del almuerzo</option>
                <option value="16:00">16:00 - Media tarde</option>
              </select>
              <p class="text-xs text-amber-700 mt-2">
                💡 Los martes y miércoles a las 10:00 tienen mejor tasa de apertura
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista Previa Compacta -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900 flex items-center gap-2">
            <Eye class="h-5 w-5 text-gray-600" />
            Vista previa del comunicado
          </h3>
          <button
            @click="abrirVistaPreviaCompleta"
            class="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            Ver completa
            <ExternalLink class="h-4 w-4" />
          </button>
        </div>

        <div class="p-6">
          <!-- Preview Card -->
          <div class="border border-gray-200 rounded-lg overflow-hidden max-w-2xl mx-auto">
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  {{ formData.tipo || 'Comunicado' }}
                </span>
              </div>
              <h4 class="text-lg font-bold">{{ formData.titulo || 'Sin título' }}</h4>
            </div>
            <div class="p-4 bg-white">
              <p class="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
                {{ formData.contenido || 'Sin contenido...' }}
              </p>
            </div>
            <div class="p-3 bg-gray-50 border-t border-gray-200">
              <div class="flex items-center justify-between text-xs text-gray-600">
                <span class="flex items-center gap-1">
                  <Users class="h-3 w-3" />
                  {{ alcanceEstimado }} destinatarios
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="h-3 w-3" />
                  {{ tiempoLectura }} min lectura
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Final -->
      <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardCheck class="h-5 w-5 text-indigo-600" />
          Resumen antes de enviar
        </h3>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg p-3 text-center">
            <p class="text-2xl font-bold text-indigo-600">{{ alcanceEstimado }}</p>
            <p class="text-xs text-gray-600">Destinatarios</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center">
            <p class="text-2xl font-bold text-purple-600">{{ formData.destinatarios.length }}</p>
            <p class="text-xs text-gray-600">Departamentos</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center">
            <p class="text-2xl font-bold text-amber-600">{{ formData.roles.length }}</p>
            <p class="text-xs text-gray-600">Roles</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center">
            <p class="text-2xl font-bold text-green-600">{{ tiempoLectura }}</p>
            <p class="text-xs text-gray-600">Min. lectura</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="dept in formData.destinatarios"
            :key="dept"
            class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
          >
            {{ dept }}
          </span>
          <span
            v-for="rol in formData.roles"
            :key="rol"
            class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
          >
            {{ rol }}
          </span>
        </div>

        <p class="text-sm text-gray-600">
          <strong>Envío:</strong>
          <span v-if="tipoEnvio === 'inmediato'">Inmediato (ahora)</span>
          <span v-else-if="tipoEnvio === 'programado'">
            Programado para {{ formatearFechaCompleta(formData.fecha_envio) }} a las {{ formData.hora_envio || '09:00' }}
          </span>
          <span v-else>Se guardará como borrador</span>
        </p>
      </div>

      <!-- Navigation Final -->
      <div class="flex justify-between pt-4">
        <button
          @click="prevStep"
          class="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
        >
          <ArrowLeft class="h-5 w-5" />
          Anterior
        </button>
        <div class="flex items-center gap-3">
          <button
            type="button"
            v-if="tipoEnvio !== 'borrador'"
            @click="guardarBorrador"
            class="px-5 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
          >
            Guardar borrador
          </button>
          <div class="relative group">
            <button
              @click="enviarComunicado"
              :disabled="!formularioValido || enviando"
              class="flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="tipoEnvio === 'borrador'
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'"
            >
              <!-- Icono: spinner si está enviando, sino icono normal -->
              <Loader2 v-if="enviando" class="h-5 w-5 animate-spin" />
              <Send v-else-if="tipoEnvio === 'inmediato'" class="h-5 w-5" />
              <Calendar v-else-if="tipoEnvio === 'programado'" class="h-5 w-5" />
              <Save v-else class="h-5 w-5" />
              {{ enviando ? 'Enviando...' : getBotonTexto() }}
            </button>
            <!-- Tooltip con mensaje de error si está deshabilitado -->
            <div
              v-if="!formularioValido && mensajeBotonDeshabilitado && !enviando"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10"
            >
              <AlertCircle class="inline h-3 w-3 mr-1" />
              {{ mensajeBotonDeshabilitado }}
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Vista Previa Completa -->
    <Dialog
      v-model:visible="modalPreviaAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Eye class="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              Vista previa del comunicado
            </h3>
            <p class="text-sm text-gray-600">
              Así lo verán los {{ alcanceEstimado }} destinatarios
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Encabezado simulado -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-lg">
          <div class="flex items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {{ formData.tipo }}
            </span>
            <span class="text-indigo-200 text-sm">•</span>
            <span class="text-indigo-200 text-sm">{{ tiempoLectura }} min de lectura</span>
          </div>
          <h2 class="text-2xl font-bold">{{ formData.titulo }}</h2>
        </div>

        <!-- Contenido -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <p class="text-gray-900 whitespace-pre-wrap leading-relaxed">{{ formData.contenido }}</p>
        </div>

        <!-- Footer simulado -->
        <div class="bg-gray-100 p-4 rounded-lg">
          <p class="text-sm font-semibold text-gray-700 mb-3">Enviado a:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dept in formData.destinatarios"
              :key="dept"
              class="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200"
            >
              {{ dept }}
            </span>
            <span
              v-for="rol in formData.roles"
              :key="rol"
              class="px-3 py-1 bg-purple-50 rounded-full text-xs font-medium text-purple-700 border border-purple-200"
            >
              {{ rol }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button
            @click="modalPreviaAbierto = false"
            class="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import {
  Eye, Send, ArrowRight, ArrowLeft, CheckCircle, Clock, Plus,
  Users, Calendar, FileText, Lightbulb, Save, ExternalLink, ClipboardCheck,
  Loader2, AlertCircle
} from 'lucide-vue-next';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';

const props = defineProps({
  comunicadoInicial: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['comunicado-creado', 'cancelar']);

const authStore = useAuthStore();
const toast = useToast();

// Steps
const steps = [
  { id: 'tipo', name: 'Tipo' },
  { id: 'contenido', name: 'Contenido' },
  { id: 'destinatarios', name: 'Destinatarios' },
  { id: 'envio', name: 'Enviar' }
];
const currentStep = ref(0);

// Plantillas mejoradas con descripciones
const plantillas = ref([
  {
    id: 1,
    nombre: 'Plan de mejora',
    icono: '📋',
    descripcion: 'Comparte acciones concretas tras una encuesta o feedback',
    cuerpo: 'Queremos compartir contigo las acciones que estamos implementando basándonos en vuestro feedback:\n\n1. [Acción 1]\n2. [Acción 2]\n3. [Acción 3]\n\nAgradecemos vuestra participación y compromiso.'
  },
  {
    id: 2,
    nombre: 'Felicitación',
    icono: '🎉',
    descripcion: 'Celebra logros del equipo o hitos importantes',
    cuerpo: '¡Felicitaciones al equipo!\n\nQueremos reconocer el excelente trabajo realizado en [logro/proyecto].\n\nGracias por vuestro compromiso y dedicación.'
  },
  {
    id: 3,
    nombre: 'Resultados',
    icono: '📊',
    descripcion: 'Comparte métricas o resultados de encuestas',
    cuerpo: 'Compartimos los resultados de [encuesta/medición]:\n\n📈 Participación: [X]%\n⭐ Puntuación general: [X]/10\n\nPuntos destacados:\n• [Punto 1]\n• [Punto 2]\n\nPróximos pasos:\n• [Acción 1]'
  },
  {
    id: 4,
    nombre: 'Evento',
    icono: '📅',
    descripcion: 'Anuncia actividades, talleres o eventos',
    cuerpo: '¡Te invitamos a [nombre del evento]!\n\n📅 Fecha: [fecha]\n🕐 Hora: [hora]\n📍 Lugar: [ubicación]\n\n[Descripción breve del evento]\n\n¿Te apuntas?'
  },
  {
    id: 5,
    nombre: 'Recordatorio',
    icono: '🔔',
    descripcion: 'Recuerda plazos o acciones pendientes',
    cuerpo: '⏰ Recordatorio importante\n\nTe recordamos que [acción pendiente] tiene fecha límite el [fecha].\n\nSi ya lo has completado, ¡gracias!\nSi no, aún estás a tiempo.'
  }
]);

// Datos de departamentos (se cargarán desde Supabase)
const departamentos = ref([
  { id: 1, nombre: 'Recursos Humanos', empleados: 12 },
  { id: 2, nombre: 'Tecnología', empleados: 28 },
  { id: 3, nombre: 'Ventas', empleados: 35 },
  { id: 4, nombre: 'Marketing', empleados: 15 },
  { id: 5, nombre: 'Operaciones', empleados: 42 },
  { id: 6, nombre: 'Finanzas', empleados: 8 }
]);

const roles = ref([
  { id: 1, nombre: 'Todos', descripcion: 'Todos los empleados' },
  { id: 2, nombre: 'Líderes', descripcion: 'Managers y supervisores' },
  { id: 3, nombre: 'Colaboradores', descripcion: 'Empleados sin equipo a cargo' }
]);

const plantillaSeleccionada = ref(null);
const tipoEnvio = ref('inmediato');
const modalPreviaAbierto = ref(false);
const enviarATodos = ref(false);
const mostrarSugerencias = ref(false);
const enviando = ref(false); // Estado de carga para el botón

const formData = ref({
  titulo: '',
  tipo: '',
  contenido: '',
  destinatarios: [],
  roles: [],
  fecha_envio: null,
  hora_envio: '09:00',
  estado: 'Enviado'
});

// Computed
const fechaMinima = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
});

const totalEmpleados = computed(() => {
  return departamentos.value.reduce((sum, d) => sum + d.empleados, 0);
});

const alcanceEstimado = computed(() => {
  if (formData.value.destinatarios.length === 0) return 0;

  let total = 0;
  formData.value.destinatarios.forEach(deptNombre => {
    const dept = departamentos.value.find(d => d.nombre === deptNombre);
    if (dept) total += dept.empleados;
  });

  // Ajustar por roles (simplificado)
  if (formData.value.roles.includes('Líderes') && !formData.value.roles.includes('Todos')) {
    total = Math.round(total * 0.15); // ~15% son líderes
  } else if (formData.value.roles.includes('Colaboradores') && !formData.value.roles.includes('Todos')) {
    total = Math.round(total * 0.85); // ~85% son colaboradores
  }

  return total;
});

const porcentajeAlcance = computed(() => {
  if (totalEmpleados.value === 0) return 0;
  return Math.round((alcanceEstimado.value / totalEmpleados.value) * 100);
});

const tiempoLectura = computed(() => {
  const palabras = formData.value.contenido.split(/\s+/).length;
  const minutos = Math.ceil(palabras / 200); // 200 palabras por minuto
  return Math.max(1, minutos);
});

const formularioValido = computed(() => {
  const baseValid =
    formData.value.titulo.trim() !== '' &&
    formData.value.tipo !== '' &&
    formData.value.contenido.trim() !== '' &&
    formData.value.destinatarios.length > 0 &&
    formData.value.roles.length > 0 &&
    alcanceEstimado.value > 0; // IMPORTANTE: verificar que hay destinatarios reales

  if (tipoEnvio.value === 'programado') {
    return baseValid && formData.value.fecha_envio;
  }

  return baseValid;
});

// Mensaje de error para el botón deshabilitado
const mensajeBotonDeshabilitado = computed(() => {
  if (!formData.value.titulo.trim()) return 'Falta el asunto del comunicado';
  if (!formData.value.tipo) return 'Selecciona un tipo de comunicado';
  if (!formData.value.contenido.trim()) return 'Escribe el contenido del mensaje';
  if (formData.value.destinatarios.length === 0) return 'Selecciona al menos un departamento';
  if (formData.value.roles.length === 0) return 'Selecciona al menos un rol';
  if (alcanceEstimado.value === 0) return 'No hay empleados en los departamentos seleccionados';
  if (tipoEnvio.value === 'programado' && !formData.value.fecha_envio) return 'Selecciona una fecha de envío';
  return '';
});

const canProceedStep1 = computed(() => {
  return formData.value.tipo !== '' || plantillaSeleccionada.value !== null;
});

const canProceedStep2 = computed(() => {
  return formData.value.titulo.trim() !== '' && formData.value.contenido.trim() !== '';
});

const canProceedStep3 = computed(() => {
  return formData.value.destinatarios.length > 0 && formData.value.roles.length > 0;
});

const sugerenciasActivas = computed(() => {
  return formData.value.tipo !== '';
});

// Methods
const getStepClass = (index) => {
  if (index < currentStep.value) {
    return 'bg-indigo-600 text-white';
  } else if (index === currentStep.value) {
    return 'bg-indigo-600 text-white ring-4 ring-indigo-200';
  }
  return 'bg-gray-200 text-gray-500';
};

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const aplicarPlantilla = (plantilla) => {
  plantillaSeleccionada.value = plantilla;
  formData.value.tipo = plantilla.nombre;
  formData.value.contenido = plantilla.cuerpo;
};

const toggleEnviarATodos = () => {
  if (enviarATodos.value) {
    formData.value.destinatarios = departamentos.value.map(d => d.nombre);
    formData.value.roles = ['Todos'];
  } else {
    formData.value.destinatarios = [];
    formData.value.roles = [];
  }
};

const getTituloPlaceholder = () => {
  const placeholders = {
    'Plan de mejora': 'Ej: Plan de acción tras encuesta de clima Q1',
    'Felicitación': 'Ej: ¡Felicitaciones al equipo de Ventas!',
    'Resultados': 'Ej: Resultados encuesta de bienestar - Marzo 2024',
    'Evento': 'Ej: Te invitamos al taller de mindfulness',
    'Recordatorio': 'Ej: Recordatorio: Encuesta cierra el viernes'
  };
  return placeholders[formData.value.tipo] || 'Escribe un título claro y descriptivo';
};

const getContenidoPlaceholder = () => {
  return 'Escribe tu mensaje aquí...\n\nRecuerda:\n• Ser claro y directo\n• Incluir la información más importante primero\n• Terminar con una llamada a la acción si corresponde';
};

const getSugerencias = () => {
  const sugerencias = {
    'Plan de mejora': [
      'Menciona las acciones concretas que se van a tomar',
      'Indica plazos estimados de implementación',
      'Agradece la participación en la encuesta'
    ],
    'Felicitación': [
      'Sé específico sobre el logro que celebras',
      'Menciona nombres o equipos si es apropiado',
      'Conecta el logro con los valores de la empresa'
    ],
    'Resultados': [
      'Comparte los datos más relevantes primero',
      'Compara con períodos anteriores si es posible',
      'Indica los próximos pasos'
    ],
    'Evento': [
      'Incluye fecha, hora y lugar claramente',
      'Explica por qué es relevante asistir',
      'Añade instrucciones de registro si aplica'
    ],
    'Recordatorio': [
      'Destaca la fecha límite claramente',
      'Incluye un enlace directo a la acción',
      'Sé breve y directo'
    ]
  };
  return sugerencias[formData.value.tipo] || [];
};

const getBotonTexto = () => {
  if (tipoEnvio.value === 'inmediato') return `Enviar a ${alcanceEstimado.value} personas`;
  if (tipoEnvio.value === 'programado') return 'Programar envío';
  return 'Guardar borrador';
};

const abrirVistaPreviaCompleta = () => {
  modalPreviaAbierto.value = true;
};

const formatearFechaCompleta = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const guardarBorrador = () => {
  tipoEnvio.value = 'borrador';
  enviarComunicado();
};

const enviarComunicado = async () => {
  // Validación previa
  if (!formularioValido.value) {
    if (mensajeBotonDeshabilitado.value) {
      toast.warning(mensajeBotonDeshabilitado.value);
    }
    return;
  }

  // Prevenir doble envío
  if (enviando.value) return;

  enviando.value = true;

  // Estados en minúscula para consistencia con RLS y servicio
  let estado = 'enviado';
  let fechaEnvio = new Date().toISOString().split('T')[0];
  let fechaPublicacion = new Date().toISOString(); // Fecha completa con hora

  if (tipoEnvio.value === 'borrador') {
    estado = 'borrador';
    fechaEnvio = null;
    fechaPublicacion = null;
  } else if (tipoEnvio.value === 'programado') {
    estado = 'programado';
    fechaEnvio = formData.value.fecha_envio;
    // Para programados, la fecha de publicación es la fecha de envío
    fechaPublicacion = formData.value.fecha_envio
      ? new Date(formData.value.fecha_envio + 'T' + (formData.value.hora_envio || '09:00') + ':00').toISOString()
      : null;
  }

  const comunicado = {
    empresa_id: authStore.empresaId,
    titulo: formData.value.titulo,
    tipo: formData.value.tipo,
    contenido: formData.value.contenido,
    destinatarios: formData.value.destinatarios,
    roles: formData.value.roles,
    estado,
    fecha_envio: fechaEnvio,
    fecha_publicacion: fechaPublicacion, // IMPORTANTE: necesario para ordenar y mostrar
    hora_envio: formData.value.hora_envio,
    interacciones: 0,
    alcance_estimado: alcanceEstimado.value // Guardar el conteo para auditoría
  };

  try {
    const { data, error } = await supabase
      .from('comunicados')
      .insert([comunicado])
      .select()
      .single();

    if (error) throw error;

    console.log('[Comunicados] Comunicado creado:', data);

    if (estado === 'Enviado') {
      toast.success(`📨 Comunicado enviado a ${alcanceEstimado.value} personas`, {
        timeout: 5000
      });
    } else if (estado === 'Programado') {
      toast.success(`📅 Comunicado programado para ${formatearFechaCompleta(fechaEnvio)}`, {
        timeout: 5000
      });
    } else {
      toast.success('📝 Borrador guardado correctamente', {
        timeout: 3000
      });
    }

    resetFormulario();
    emit('comunicado-creado');
  } catch (error) {
    console.error('Error guardando comunicado:', error);

    // Mensaje de error más específico
    let mensajeError = 'Error al guardar el comunicado.';
    if (error.message?.includes('permission') || error.code === '42501') {
      mensajeError = 'No tienes permisos para crear comunicados.';
    } else if (error.message?.includes('network') || error.code === 'NETWORK_ERROR') {
      mensajeError = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
    } else if (error.message) {
      mensajeError = `Error: ${error.message}`;
    }

    toast.error(`❌ ${mensajeError}`, { timeout: 6000 });
  } finally {
    enviando.value = false;
  }
};

const resetFormulario = () => {
  formData.value = {
    titulo: '',
    tipo: '',
    contenido: '',
    destinatarios: [],
    roles: [],
    fecha_envio: null,
    hora_envio: '09:00',
    estado: 'Enviado'
  };
  plantillaSeleccionada.value = null;
  tipoEnvio.value = 'inmediato';
  currentStep.value = 0;
  enviarATodos.value = false;
};

const cargarDepartamentos = async () => {
  try {
    // Cargar departamentos de la empresa
    const { data, error } = await supabase
      .from('departamentos')
      .select('id, nombre')
      .eq('empresa_id', authStore.empresaId);

    if (error) throw error;

    if (data && data.length > 0) {
      // Cargar conteo de empleados por departamento_id (columna real de la tabla)
      const { data: empleadosData, error: empError } = await supabase
        .from('empleados')
        .select('departamento_id')
        .eq('empresa_id', authStore.empresaId)
        .eq('estado', 'Activo');

      if (empError) {
        console.error('Error cargando empleados:', empError);
      }

      // Contar empleados por departamento_id
      const conteo = {};
      (empleadosData || []).forEach(e => {
        if (e.departamento_id) {
          conteo[e.departamento_id] = (conteo[e.departamento_id] || 0) + 1;
        }
      });

      // Mapear departamentos con su conteo de empleados
      departamentos.value = data.map(d => ({
        ...d,
        empleados: conteo[d.id] || 0
      }));

      console.log('[Comunicados] Departamentos cargados:', departamentos.value);
    } else {
      console.warn('[Comunicados] No se encontraron departamentos para la empresa');
      departamentos.value = [];
    }
  } catch (error) {
    console.error('Error cargando departamentos:', error);
  }
};

onMounted(() => {
  cargarDepartamentos();
});

watch(() => props.comunicadoInicial, (nuevo) => {
  if (nuevo) {
    formData.value = {
      titulo: nuevo.titulo,
      tipo: nuevo.tipo,
      contenido: nuevo.contenido,
      destinatarios: [...nuevo.destinatarios],
      roles: [...nuevo.roles],
      fecha_envio: nuevo.fecha_envio,
      hora_envio: nuevo.hora_envio || '09:00',
      estado: nuevo.estado
    };

    if (nuevo.estado === 'Borrador') {
      tipoEnvio.value = 'borrador';
    } else if (nuevo.estado === 'Programado') {
      tipoEnvio.value = 'programado';
    } else {
      tipoEnvio.value = 'inmediato';
    }

    // Ir al último paso si es edición
    currentStep.value = 3;
  } else {
    resetFormulario();
  }
}, { immediate: true });
</script>
