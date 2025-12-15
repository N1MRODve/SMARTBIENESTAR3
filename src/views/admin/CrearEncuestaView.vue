<template>
  <div class="min-h-screen bg-gray-50">
    <div class="py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header con progreso -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Crear Encuesta de Medición</h1>
              <p class="mt-2 text-gray-600">
                Diseña una herramienta de medición que genere datos accionables para mejorar el bienestar
              </p>
            </div>
            <Button
              @click="volverAlDashboard"
              variant="outline"
            >
              <ArrowLeft class="h-5 w-5 mr-2" />
              Cancelar
            </Button>
          </div>

          <!-- Stepper visual -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div
                v-for="(step, index) in steps"
                :key="step.id"
                class="flex items-center"
                :class="{ 'flex-1': index < steps.length - 1 }"
              >
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                    :class="{
                      'bg-indigo-600 text-white': currentStep === index,
                      'bg-green-500 text-white': currentStep > index,
                      'bg-gray-200 text-gray-500': currentStep < index
                    }"
                  >
                    <Check v-if="currentStep > index" class="h-5 w-5" />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="ml-3 hidden md:block">
                    <p
                      class="text-sm font-medium"
                      :class="{
                        'text-indigo-600': currentStep === index,
                        'text-green-600': currentStep > index,
                        'text-gray-500': currentStep < index
                      }"
                    >
                      {{ step.name }}
                    </p>
                    <p class="text-xs text-gray-400">{{ step.description }}</p>
                  </div>
                </div>
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-1 mx-4 rounded-full transition-all duration-300"
                  :class="{
                    'bg-green-500': currentStep > index,
                    'bg-gray-200': currentStep <= index
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido del paso actual -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">

          <!-- PASO 1: Objetivo y Dimensión -->
          <div v-if="currentStep === 0" class="p-6 space-y-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target class="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">¿Qué quieres medir?</h2>
                <p class="text-gray-600">Define el objetivo de negocio y la dimensión del bienestar que evaluarás</p>
              </div>
            </div>

            <!-- Título de la encuesta -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                Nombre de la encuesta <span class="text-red-500">*</span>
              </label>
              <input
                v-model="encuesta.titulo"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Pulso de Bienestar Q4 2024"
              />
              <p class="text-xs text-gray-500">
                Usa un nombre descriptivo que los empleados reconozcan fácilmente
              </p>
            </div>

            <!-- Descripción -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">
                Descripción para empleados
              </label>
              <textarea
                v-model="encuesta.descripcion"
                rows="2"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Explica brevemente para qué servirá esta encuesta..."
              ></textarea>
            </div>

            <!-- Dimensión de bienestar -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-semibold text-gray-700">
                  Dimensión a medir <span class="text-red-500">*</span>
                </label>
                <button
                  @click="showDimensionHelp = !showDimensionHelp"
                  class="text-indigo-600 text-sm hover:underline flex items-center gap-1"
                >
                  <HelpCircle class="h-4 w-4" />
                  ¿Por qué importa esto?
                </button>
              </div>

              <!-- Tooltip educativo -->
              <div v-if="showDimensionHelp" class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div class="flex items-start gap-3">
                  <Lightbulb class="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div class="text-sm text-indigo-800">
                    <p class="font-medium mb-1">La dimensión define qué métricas alimentará esta encuesta</p>
                    <p class="text-indigo-700">
                      Al elegir una dimensión, los resultados se integrarán automáticamente en tu dashboard de analítica,
                      permitiendo comparaciones históricas y benchmarks con otras empresas del sector.
                    </p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  v-for="dim in dimensiones"
                  :key="dim.id"
                  class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md"
                  :class="{
                    'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200': encuesta.categoria === dim.id,
                    'border-gray-200 bg-white hover:border-gray-300': encuesta.categoria !== dim.id
                  }"
                >
                  <input
                    type="radio"
                    v-model="encuesta.categoria"
                    :value="dim.id"
                    class="sr-only"
                  />
                  <div class="flex-shrink-0 mr-4">
                    <div
                      class="w-12 h-12 rounded-lg flex items-center justify-center"
                      :class="dim.bgColor"
                    >
                      <component :is="dim.icon" class="h-6 w-6" :class="dim.iconColor" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ dim.nombre }}</h4>
                    <p class="text-sm text-gray-600 mt-1">{{ dim.descripcion }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {{ dim.indicador }}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Preview de impacto -->
            <div v-if="encuesta.categoria" class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp class="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-green-900">Esta encuesta alimentará:</h4>
                  <ul class="mt-2 space-y-1">
                    <li v-for="metric in getMetricasImpactadas" :key="metric" class="text-sm text-green-800 flex items-center gap-2">
                      <Check class="h-4 w-4 text-green-600" />
                      {{ metric }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- PASO 2: Preguntas -->
          <div v-if="currentStep === 1" class="p-6 space-y-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <FileText class="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">Diseña las preguntas</h2>
                  <p class="text-gray-600">Cada pregunta debe medir algo específico y accionable</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-indigo-600">{{ encuesta.preguntas.length }}</span>
                <span class="text-gray-500 text-sm"> preguntas</span>
              </div>
            </div>

            <!-- Preguntas sugeridas por categoría -->
            <div v-if="preguntasSugeridas.length > 0 && encuesta.preguntas.length === 0" class="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
              <div class="flex items-start gap-3 mb-4">
                <Sparkles class="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 class="font-semibold text-blue-900">Preguntas recomendadas para {{ getDimensionLabel }}</h4>
                  <p class="text-sm text-blue-700">Estas preguntas están validadas científicamente para medir esta dimensión</p>
                </div>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(pregunta, index) in preguntasSugeridas.slice(0, 3)"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ pregunta.texto }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ getTipoLabel(pregunta.tipo) }}</p>
                  </div>
                  <button
                    @click="agregarPreguntaSugerida(pregunta)"
                    class="ml-3 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Plus class="h-4 w-4" />
                    Añadir
                  </button>
                </div>
              </div>
              <button
                @click="agregarTodasSugeridas"
                class="mt-3 w-full py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium"
              >
                Añadir todas las recomendadas
              </button>
            </div>

            <!-- Lista de preguntas -->
            <div v-if="encuesta.preguntas.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <MessageSquare class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 mb-2">Sin preguntas aún</h3>
              <p class="text-gray-500 mb-4">Añade preguntas desde las sugerencias o crea las tuyas</p>
              <Button @click="agregarPregunta">
                <Plus class="h-5 w-5 mr-2" />
                Crear pregunta personalizada
              </Button>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(pregunta, index) in encuesta.preguntas"
                :key="pregunta.id"
                class="border border-gray-200 rounded-xl p-5 bg-gray-50"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <span class="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {{ index + 1 }}
                    </span>
                    <div>
                      <span v-if="pregunta.esValidada" class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        Validada científicamente
                      </span>
                    </div>
                  </div>
                  <button
                    @click="eliminarPregunta(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Texto de la pregunta <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="pregunta.texto"
                      rows="2"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="¿Qué quieres preguntar?"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de respuesta <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="pregunta.tipo"
                        @change="actualizarOpcionesPregunta(index)"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Seleccionar tipo...</option>
                        <option value="escala_1_5">Escala 1-5 (Recomendado para métricas)</option>
                        <option value="si_no">Sí / No</option>
                        <option value="opcion_multiple">Opción múltiple</option>
                        <option value="texto_abierto">Texto abierto</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Dimensión que mide
                      </label>
                      <select
                        v-model="pregunta.dimension"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Igual que la encuesta</option>
                        <option v-for="dim in dimensiones" :key="dim.id" :value="dim.id">
                          {{ dim.nombre }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Opciones para opción múltiple -->
                  <div v-if="pregunta.tipo === 'opcion_multiple'" class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">
                      Opciones de respuesta
                    </label>
                    <div
                      v-for="(opcion, opcionIndex) in pregunta.opciones"
                      :key="opcionIndex"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="pregunta.opciones[opcionIndex]"
                        type="text"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        :placeholder="`Opción ${opcionIndex + 1}`"
                      />
                      <button
                        v-if="pregunta.opciones.length > 2"
                        @click="eliminarOpcion(index, opcionIndex)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      @click="agregarOpcion(index)"
                      class="text-indigo-600 text-sm hover:underline flex items-center gap-1"
                    >
                      <Plus class="h-4 w-4" />
                      Añadir opción
                    </button>
                  </div>

                  <!-- Preview visual -->
                  <div class="p-4 bg-white border border-gray-200 rounded-lg">
                    <p class="text-xs text-gray-500 mb-2">Vista previa:</p>
                    <p class="font-medium text-gray-900 mb-3">{{ pregunta.texto || 'Tu pregunta aquí...' }}</p>

                    <!-- Preview escala -->
                    <div v-if="pregunta.tipo === 'escala_1_5'" class="flex items-center justify-between">
                      <span class="text-xs text-gray-500">Muy insatisfecho</span>
                      <div class="flex gap-2">
                        <div v-for="n in 5" :key="n" class="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-medium">
                          {{ n }}
                        </div>
                      </div>
                      <span class="text-xs text-gray-500">Muy satisfecho</span>
                    </div>

                    <!-- Preview sí/no -->
                    <div v-else-if="pregunta.tipo === 'si_no'" class="flex gap-4">
                      <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        <span class="text-gray-700">Sí</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        <span class="text-gray-700">No</span>
                      </div>
                    </div>

                    <!-- Preview opción múltiple -->
                    <div v-else-if="pregunta.tipo === 'opcion_multiple'" class="space-y-2">
                      <div v-for="(op, i) in pregunta.opciones" :key="i" class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        <span class="text-gray-700">{{ op || `Opción ${i + 1}` }}</span>
                      </div>
                    </div>

                    <!-- Preview texto abierto -->
                    <div v-else-if="pregunta.tipo === 'texto_abierto'" class="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <p class="text-sm text-gray-400 italic">Respuesta de texto libre...</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                @click="agregarPregunta"
                class="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus class="h-5 w-5" />
                Añadir otra pregunta
              </button>
            </div>
          </div>

          <!-- PASO 3: Audiencia -->
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Users class="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">¿A quién quieres encuestar?</h2>
                <p class="text-gray-600">Define la audiencia para obtener datos representativos</p>
              </div>
            </div>

            <!-- Estadísticas de audiencia -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-indigo-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-indigo-600">{{ audienciaEstimada }}</p>
                <p class="text-sm text-indigo-700">Empleados alcanzados</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-green-600">{{ departamentosSeleccionados.length || departamentos.length }}</p>
                <p class="text-sm text-green-700">Departamentos</p>
              </div>
              <div class="bg-purple-50 rounded-xl p-4 text-center">
                <p class="text-3xl font-bold text-purple-600">{{ estimacionRespuestas }}%</p>
                <p class="text-sm text-purple-700">Tasa estimada de respuesta</p>
              </div>
            </div>

            <!-- Tipo de segmentación -->
            <div class="space-y-4">
              <label class="block text-sm font-semibold text-gray-700">
                Alcance de la encuesta
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all"
                  :class="{
                    'border-indigo-500 bg-indigo-50': encuesta.alcance === 'todos',
                    'border-gray-200 hover:border-gray-300': encuesta.alcance !== 'todos'
                  }"
                >
                  <input type="radio" v-model="encuesta.alcance" value="todos" class="sr-only" />
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                    <Globe class="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Toda la empresa</h4>
                    <p class="text-sm text-gray-600">Enviar a todos los {{ totalEmpleados }} empleados</p>
                  </div>
                </label>

                <label
                  class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all"
                  :class="{
                    'border-indigo-500 bg-indigo-50': encuesta.alcance === 'segmentado',
                    'border-gray-200 hover:border-gray-300': encuesta.alcance !== 'segmentado'
                  }"
                >
                  <input type="radio" v-model="encuesta.alcance" value="segmentado" class="sr-only" />
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Filter class="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">Segmentado</h4>
                    <p class="text-sm text-gray-600">Seleccionar departamentos específicos</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Selector de departamentos -->
            <div v-if="encuesta.alcance === 'segmentado'" class="space-y-4">
              <label class="block text-sm font-semibold text-gray-700">
                Selecciona los departamentos
              </label>

              <div v-if="loadingDepartamentos" class="text-center py-8">
                <div class="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                <p class="text-gray-500 mt-2">Cargando departamentos...</p>
              </div>

              <div v-else-if="departamentos.length === 0" class="text-center py-8 bg-gray-50 rounded-xl">
                <Building class="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p class="text-gray-600">No hay departamentos configurados</p>
                <p class="text-sm text-gray-500">Configura departamentos en la sección de empleados</p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  v-for="dept in departamentos"
                  :key="dept.id"
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all"
                  :class="{
                    'border-indigo-500 bg-indigo-50': departamentosSeleccionados.includes(dept.id),
                    'border-gray-200 hover:border-gray-300': !departamentosSeleccionados.includes(dept.id)
                  }"
                >
                  <input
                    type="checkbox"
                    :value="dept.id"
                    v-model="departamentosSeleccionados"
                    class="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div class="ml-3 flex-1">
                    <h4 class="font-medium text-gray-900">{{ dept.nombre }}</h4>
                    <p class="text-sm text-gray-500">{{ getEmpleadosPorDepartamento(dept.id) }} empleados</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Aviso de representatividad -->
            <div v-if="audienciaEstimada < 5" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div class="flex items-start gap-3">
                <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 class="font-semibold text-yellow-900">Muestra pequeña</h4>
                  <p class="text-sm text-yellow-800">
                    Con menos de 5 empleados, los resultados pueden no ser estadísticamente representativos.
                    Considera ampliar la audiencia para obtener datos más fiables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- PASO 4: Privacidad -->
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield class="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Configura la privacidad</h2>
                <p class="text-gray-600">El nivel de anonimato impacta directamente en la sinceridad de las respuestas</p>
              </div>
            </div>

            <!-- Niveles de privacidad -->
            <div class="space-y-4">
              <!-- Anónimo completo -->
              <label
                class="flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all"
                :class="{
                  'border-green-500 bg-green-50 ring-2 ring-green-200': encuesta.privacidadNivel === 'anonimato_completo',
                  'border-gray-200 hover:border-gray-300': encuesta.privacidadNivel !== 'anonimato_completo'
                }"
              >
                <input type="radio" v-model="encuesta.privacidadNivel" value="anonimato_completo" class="sr-only" />
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <ShieldCheck class="h-6 w-6 text-green-600" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-bold text-gray-900 text-lg">Anónimo completo</h4>
                    <span class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                      Recomendado
                    </span>
                  </div>
                  <p class="text-gray-600 mt-1">
                    No se guarda ningún identificador. Solo se muestran resultados agregados globales.
                  </p>
                  <div class="mt-3 p-3 bg-white border border-green-200 rounded-lg">
                    <p class="text-sm text-green-800 flex items-center gap-2">
                      <Check class="h-4 w-4" />
                      Máxima tasa de respuestas sinceras
                    </p>
                  </div>
                </div>
              </label>

              <!-- Anónimo parcial -->
              <label
                class="flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all"
                :class="{
                  'border-orange-500 bg-orange-50 ring-2 ring-orange-200': encuesta.privacidadNivel === 'anonimato_parcial',
                  'border-gray-200 hover:border-gray-300': encuesta.privacidadNivel !== 'anonimato_parcial'
                }"
              >
                <input type="radio" v-model="encuesta.privacidadNivel" value="anonimato_parcial" class="sr-only" />
                <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <BarChart3 class="h-6 w-6 text-orange-600" />
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 text-lg">Anónimo por departamento</h4>
                  <p class="text-gray-600 mt-1">
                    Las respuestas se agrupan por departamento. No se revelan identidades individuales.
                  </p>
                  <div class="mt-3 p-3 bg-white border border-orange-200 rounded-lg">
                    <p class="text-sm text-orange-800 flex items-center gap-2">
                      <BarChart3 class="h-4 w-4" />
                      Permite análisis comparativo entre áreas
                    </p>
                  </div>
                </div>
              </label>

              <!-- Aviso de privacidad parcial -->
              <div v-if="encuesta.privacidadNivel === 'anonimato_parcial' && hayDepartamentoPequeno" class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div class="flex items-start gap-3">
                  <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 class="font-semibold text-yellow-900">Riesgo de identificación</h4>
                    <p class="text-sm text-yellow-800">
                      Tienes departamentos con menos de 5 personas. Con anonimato parcial,
                      las respuestas podrían ser fácilmente identificables.
                      <strong>Recomendamos anonimato completo</strong> para garantizar la privacidad.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Identificado -->
              <label
                class="flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all"
                :class="{
                  'border-blue-500 bg-blue-50 ring-2 ring-blue-200': encuesta.privacidadNivel === 'identificado',
                  'border-gray-200 hover:border-gray-300': encuesta.privacidadNivel !== 'identificado'
                }"
              >
                <input type="radio" v-model="encuesta.privacidadNivel" value="identificado" class="sr-only" />
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <UserCheck class="h-6 w-6 text-blue-600" />
                </div>
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 text-lg">Identificado (con consentimiento)</h4>
                  <p class="text-gray-600 mt-1">
                    Las respuestas se asocian al empleado. Requiere consentimiento explícito.
                  </p>
                  <div class="mt-3 p-3 bg-white border border-blue-200 rounded-lg space-y-2">
                    <p class="text-sm text-blue-800 flex items-center gap-2">
                      <UserCheck class="h-4 w-4" />
                      Permite seguimiento personalizado
                    </p>
                    <p class="text-sm text-yellow-700 flex items-center gap-2">
                      <AlertTriangle class="h-4 w-4" />
                      Puede reducir la sinceridad de las respuestas
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <!-- Mensaje GDPR -->
            <div class="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div class="flex items-start gap-3">
                <Lock class="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <h4 class="font-semibold text-indigo-900">Cumplimiento GDPR</h4>
                  <p class="text-sm text-indigo-800">
                    SMART Bienestar cumple con el Reglamento General de Protección de Datos.
                    Todos los datos se cifran y almacenan en servidores europeos.
                    Los empleados verán la configuración de privacidad antes de responder.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- PASO 5: Resumen y envío -->
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Rocket class="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Revisa y lanza tu encuesta</h2>
                <p class="text-gray-600">Confirma todos los detalles antes de enviar</p>
              </div>
            </div>

            <!-- Resumen de la encuesta -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Info básica -->
              <div class="bg-gray-50 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText class="h-5 w-5 text-indigo-600" />
                  Información básica
                </h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500">Título</p>
                    <p class="font-medium text-gray-900">{{ encuesta.titulo || 'Sin título' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Dimensión</p>
                    <p class="font-medium text-gray-900">{{ getDimensionLabel }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Preguntas</p>
                    <p class="font-medium text-gray-900">{{ encuesta.preguntas.length }} preguntas</p>
                  </div>
                </div>
              </div>

              <!-- Audiencia -->
              <div class="bg-gray-50 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users class="h-5 w-5 text-green-600" />
                  Audiencia
                </h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500">Alcance</p>
                    <p class="font-medium text-gray-900">
                      {{ encuesta.alcance === 'todos' ? 'Toda la empresa' : `${departamentosSeleccionados.length} departamentos` }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Empleados</p>
                    <p class="font-medium text-gray-900">{{ audienciaEstimada }} personas</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Respuestas estimadas</p>
                    <p class="font-medium text-gray-900">~{{ Math.round(audienciaEstimada * estimacionRespuestas / 100) }} respuestas</p>
                  </div>
                </div>
              </div>

              <!-- Privacidad -->
              <div class="bg-gray-50 rounded-xl p-5">
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield class="h-5 w-5 text-blue-600" />
                  Privacidad
                </h3>
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-green-100': encuesta.privacidadNivel === 'anonimato_completo',
                      'bg-orange-100': encuesta.privacidadNivel === 'anonimato_parcial',
                      'bg-blue-100': encuesta.privacidadNivel === 'identificado'
                    }"
                  >
                    <ShieldCheck v-if="encuesta.privacidadNivel === 'anonimato_completo'" class="h-5 w-5 text-green-600" />
                    <BarChart3 v-else-if="encuesta.privacidadNivel === 'anonimato_parcial'" class="h-5 w-5 text-orange-600" />
                    <UserCheck v-else class="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ getPrivacidadLabel }}</p>
                    <p class="text-xs text-gray-500">{{ getPrivacidadDescripcion }}</p>
                  </div>
                </div>
              </div>

              <!-- Impacto en métricas -->
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                <h3 class="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <TrendingUp class="h-5 w-5 text-green-600" />
                  Impacto en analítica
                </h3>
                <ul class="space-y-2">
                  <li v-for="metric in getMetricasImpactadas" :key="metric" class="text-sm text-green-800 flex items-center gap-2">
                    <Check class="h-4 w-4 text-green-600" />
                    {{ metric }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Programación -->
            <div class="bg-white border border-gray-200 rounded-xl p-5">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock class="h-5 w-5 text-purple-600" />
                Programación
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all"
                  :class="{
                    'border-indigo-500 bg-indigo-50': !encuesta.esRecurrente && !encuesta.programada,
                    'border-gray-200 hover:border-gray-300': encuesta.esRecurrente || encuesta.programada
                  }"
                >
                  <input
                    type="radio"
                    :value="false"
                    v-model="encuesta.esRecurrente"
                    @change="encuesta.programada = false"
                    class="w-5 h-5 text-indigo-600"
                  />
                  <div class="ml-3">
                    <h4 class="font-medium text-gray-900">Enviar ahora</h4>
                    <p class="text-sm text-gray-500">La encuesta estará disponible inmediatamente</p>
                  </div>
                </label>

                <label
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all"
                  :class="{
                    'border-indigo-500 bg-indigo-50': encuesta.esRecurrente,
                    'border-gray-200 hover:border-gray-300': !encuesta.esRecurrente
                  }"
                >
                  <input
                    type="radio"
                    :value="true"
                    v-model="encuesta.esRecurrente"
                    class="w-5 h-5 text-indigo-600"
                  />
                  <div class="ml-3">
                    <h4 class="font-medium text-gray-900">Hacer recurrente</h4>
                    <p class="text-sm text-gray-500">Programar envíos periódicos</p>
                  </div>
                </label>
              </div>

              <!-- Configuración de recurrencia -->
              <div v-if="encuesta.esRecurrente" class="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                    <select v-model="encuesta.recurrencia.frecuencia" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="semanal">Semanal</option>
                      <option value="quincenal">Quincenal</option>
                      <option value="mensual">Mensual</option>
                      <option value="trimestral">Trimestral</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Hora de envío</label>
                    <input type="time" v-model="encuesta.recurrencia.horaEnvio" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Días activa</label>
                    <select v-model="encuesta.recurrencia.duracionActiva" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="1">1 día</option>
                      <option value="3">3 días</option>
                      <option value="7">7 días</option>
                      <option value="14">14 días</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Checklist final -->
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <h4 class="font-semibold text-gray-900 mb-3">Checklist antes de lanzar</h4>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center"
                    :class="encuesta.titulo ? 'bg-green-500' : 'bg-gray-300'"
                  >
                    <Check v-if="encuesta.titulo" class="h-3 w-3 text-white" />
                  </div>
                  <span class="text-sm" :class="encuesta.titulo ? 'text-gray-900' : 'text-gray-500'">
                    Título definido
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center"
                    :class="encuesta.categoria ? 'bg-green-500' : 'bg-gray-300'"
                  >
                    <Check v-if="encuesta.categoria" class="h-3 w-3 text-white" />
                  </div>
                  <span class="text-sm" :class="encuesta.categoria ? 'text-gray-900' : 'text-gray-500'">
                    Dimensión seleccionada
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center"
                    :class="encuesta.preguntas.length > 0 ? 'bg-green-500' : 'bg-gray-300'"
                  >
                    <Check v-if="encuesta.preguntas.length > 0" class="h-3 w-3 text-white" />
                  </div>
                  <span class="text-sm" :class="encuesta.preguntas.length > 0 ? 'text-gray-900' : 'text-gray-500'">
                    Al menos una pregunta
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center"
                    :class="preguntasCompletas ? 'bg-green-500' : 'bg-gray-300'"
                  >
                    <Check v-if="preguntasCompletas" class="h-3 w-3 text-white" />
                  </div>
                  <span class="text-sm" :class="preguntasCompletas ? 'text-gray-900' : 'text-gray-500'">
                    Todas las preguntas completas
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con navegación -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <Button
                v-if="currentStep > 0"
                @click="currentStep--"
                variant="outline"
              >
                <ArrowLeft class="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <div v-else></div>

              <div class="flex gap-3">
                <Button
                  v-if="currentStep === 4"
                  @click="guardarBorrador"
                  variant="outline"
                  :disabled="loading"
                >
                  <Save class="h-4 w-4 mr-2" />
                  Guardar borrador
                </Button>

                <Button
                  v-if="currentStep < 4"
                  @click="siguientePaso"
                  :disabled="!puedeAvanzar"
                  class="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Siguiente
                  <ArrowRight class="h-4 w-4 ml-2" />
                </Button>

                <Button
                  v-else
                  @click="lanzarEncuesta"
                  :disabled="!puedeSerLanzada || loading"
                  :loading="loading"
                  class="bg-green-600 text-white hover:bg-green-700"
                >
                  <Rocket class="h-4 w-4 mr-2" />
                  Lanzar encuesta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { useAuthStore } from '@/stores/auth.store';
import { departamentosService } from '@/services/departamentos.service';
import { empleadosService } from '@/services/empleados.service';
import Button from '@/components/ui/Button.vue';
import {
  ArrowLeft,
  ArrowRight,
  Target,
  FileText,
  Users,
  Shield,
  Rocket,
  Plus,
  Trash2,
  X,
  Check,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Globe,
  Filter,
  Building,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Lock,
  UserCheck,
  Clock,
  Save,
  Heart,
  Brain,
  Activity,
  MessageCircle,
  Briefcase,
  Smile
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();
const authStore = useAuthStore();

// Estado
const currentStep = ref(0);
const loading = ref(false);
const loadingDepartamentos = ref(false);
const showDimensionHelp = ref(false);
const departamentos = ref([]);
const empleados = ref([]);
const departamentosSeleccionados = ref([]);

// Steps del wizard
const steps = [
  { id: 'objetivo', name: 'Objetivo', description: 'Qué medir' },
  { id: 'preguntas', name: 'Preguntas', description: 'Diseñar' },
  { id: 'audiencia', name: 'Audiencia', description: 'A quién' },
  { id: 'privacidad', name: 'Privacidad', description: 'Cómo proteger' },
  { id: 'resumen', name: 'Lanzar', description: 'Confirmar' }
];

// Dimensiones de bienestar con metadata para analítica
const dimensiones = [
  {
    id: 'salud-mental',
    nombre: 'Salud Mental',
    descripcion: 'Estrés, ansiedad, bienestar emocional',
    indicador: 'Índice de Salud Mental',
    icon: Brain,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    metricas: ['Índice de Salud Mental', 'Nivel de Estrés', 'Riesgo de Burnout']
  },
  {
    id: 'clima-laboral',
    nombre: 'Clima Laboral',
    descripcion: 'Ambiente de trabajo, relaciones, cultura',
    indicador: 'eNPS',
    icon: Smile,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    metricas: ['eNPS', 'Índice de Satisfacción', 'Calidad de Relaciones']
  },
  {
    id: 'carga-laboral',
    nombre: 'Carga de Trabajo',
    descripcion: 'Balance vida-trabajo, productividad',
    indicador: 'Índice de Balance',
    icon: Activity,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    metricas: ['Índice de Balance', 'Horas Extra', 'Sobrecarga Percibida']
  },
  {
    id: 'comunicacion',
    nombre: 'Comunicación',
    descripcion: 'Claridad, feedback, transparencia',
    indicador: 'Efectividad Comunicación',
    icon: MessageCircle,
    bgColor: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    metricas: ['Efectividad Comunicación', 'Calidad Feedback', 'Transparencia']
  },
  {
    id: 'desarrollo',
    nombre: 'Desarrollo Profesional',
    descripcion: 'Crecimiento, formación, oportunidades',
    indicador: 'Índice de Desarrollo',
    icon: Briefcase,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    metricas: ['Índice de Desarrollo', 'Satisfacción Carrera', 'Acceso a Formación']
  },
  {
    id: 'general',
    nombre: 'Bienestar General',
    descripcion: 'Evaluación global multidimensional',
    indicador: 'Índice de Bienestar',
    icon: Heart,
    bgColor: 'bg-pink-100',
    iconColor: 'text-pink-600',
    metricas: ['Índice de Bienestar Global', 'Satisfacción General', 'Compromiso']
  }
];

// Preguntas sugeridas por categoría (validadas científicamente)
const preguntasPorCategoria = {
  'salud-mental': [
    { texto: '¿Cómo calificarías tu nivel de estrés en el trabajo durante la última semana?', tipo: 'escala_1_5', opciones: [], esValidada: true },
    { texto: '¿Te sientes emocionalmente agotado al final del día laboral?', tipo: 'si_no', opciones: [], esValidada: true },
    { texto: '¿Qué factores contribuyen más a tu estrés laboral?', tipo: 'opcion_multiple', opciones: ['Carga de trabajo', 'Plazos ajustados', 'Conflictos', 'Incertidumbre', 'Falta de reconocimiento'], esValidada: true },
    { texto: '¿Qué recursos te ayudarían a gestionar mejor el estrés?', tipo: 'texto_abierto', opciones: [], esValidada: false }
  ],
  'clima-laboral': [
    { texto: 'Del 1 al 10, ¿qué tan probable es que recomiendes esta empresa como lugar para trabajar?', tipo: 'escala_1_5', opciones: [], esValidada: true },
    { texto: '¿Te sientes valorado por tu trabajo?', tipo: 'si_no', opciones: [], esValidada: true },
    { texto: '¿Cómo describirías el ambiente en tu equipo?', tipo: 'opcion_multiple', opciones: ['Colaborativo', 'Competitivo', 'Tenso', 'Amigable', 'Indiferente'], esValidada: true },
    { texto: '¿Qué mejoraría el clima laboral en tu área?', tipo: 'texto_abierto', opciones: [], esValidada: false }
  ],
  'carga-laboral': [
    { texto: '¿Consideras que tu carga de trabajo actual es manejable?', tipo: 'escala_1_5', opciones: [], esValidada: true },
    { texto: '¿Logras desconectar del trabajo fuera del horario laboral?', tipo: 'si_no', opciones: [], esValidada: true },
    { texto: '¿Con qué frecuencia trabajas fuera de tu horario?', tipo: 'opcion_multiple', opciones: ['Nunca', 'Ocasionalmente', 'Frecuentemente', 'Casi siempre'], esValidada: true },
    { texto: '¿Qué cambios mejorarían tu balance vida-trabajo?', tipo: 'texto_abierto', opciones: [], esValidada: false }
  ],
  'comunicacion': [
    { texto: '¿Qué tan clara es la comunicación en tu equipo?', tipo: 'escala_1_5', opciones: [], esValidada: true },
    { texto: '¿Recibes feedback regular sobre tu trabajo?', tipo: 'si_no', opciones: [], esValidada: true },
    { texto: '¿Cuál es el principal problema de comunicación?', tipo: 'opcion_multiple', opciones: ['Falta de claridad', 'Comunicación tardía', 'Demasiadas reuniones', 'Canales inadecuados'], esValidada: true },
    { texto: '¿Cómo mejorarías la comunicación?', tipo: 'texto_abierto', opciones: [], esValidada: false }
  ],
  'desarrollo': [
    { texto: '¿Sientes que tienes oportunidades de crecimiento?', tipo: 'escala_1_5', opciones: [], esValidada: true },
    { texto: '¿Has recibido formación en el último año?', tipo: 'si_no', opciones: [], esValidada: true },
    { texto: '¿Qué tipo de desarrollo te interesa más?', tipo: 'opcion_multiple', opciones: ['Técnico', 'Liderazgo', 'Certificaciones', 'Mentoring', 'Proyectos desafiantes'], esValidada: true },
    { texto: '¿Qué obstáculos encuentras para tu desarrollo?', tipo: 'texto_abierto', opciones: [], esValidada: false }
  ],
  'general': [
    { texto: '¿Cómo calificarías tu bienestar general en el trabajo?', tipo: 'escala_1_5', opciones: [], esValidada: true },
    { texto: '¿Recomendarías esta empresa como buen lugar para trabajar?', tipo: 'si_no', opciones: [], esValidada: true },
    { texto: '¿Cuál es el aspecto más positivo de trabajar aquí?', tipo: 'opcion_multiple', opciones: ['Ambiente', 'Beneficios', 'Flexibilidad', 'Crecimiento', 'Compañeros'], esValidada: true },
    { texto: '¿Qué sugerencias tienes para mejorar el bienestar?', tipo: 'texto_abierto', opciones: [], esValidada: false }
  ]
};

// Datos de la encuesta
const encuesta = ref({
  titulo: '',
  descripcion: '',
  categoria: '',
  privacidadNivel: 'anonimato_completo',
  preguntas: [],
  alcance: 'todos',
  esRecurrente: false,
  programada: false,
  recurrencia: {
    frecuencia: 'mensual',
    horaEnvio: '09:00',
    duracionActiva: '7'
  }
});

// Computed properties
const totalEmpleados = computed(() => empleados.value.length);

const audienciaEstimada = computed(() => {
  if (encuesta.value.alcance === 'todos') {
    return totalEmpleados.value;
  }
  if (departamentosSeleccionados.value.length === 0) {
    return 0;
  }
  return empleados.value.filter(e =>
    departamentosSeleccionados.value.includes(e.departamento_id)
  ).length;
});

const estimacionRespuestas = computed(() => {
  // Base 70%, ajustar según privacidad
  let base = 70;
  if (encuesta.value.privacidadNivel === 'anonimato_completo') base = 80;
  if (encuesta.value.privacidadNivel === 'identificado') base = 50;
  return base;
});

const hayDepartamentoPequeno = computed(() => {
  if (encuesta.value.alcance === 'todos') {
    return departamentos.value.some(d => getEmpleadosPorDepartamento(d.id) < 5);
  }
  return departamentosSeleccionados.value.some(deptId =>
    getEmpleadosPorDepartamento(deptId) < 5
  );
});

const preguntasSugeridas = computed(() => {
  if (!encuesta.value.categoria) return [];
  return preguntasPorCategoria[encuesta.value.categoria] || [];
});

const getDimensionLabel = computed(() => {
  const dim = dimensiones.find(d => d.id === encuesta.value.categoria);
  return dim?.nombre || 'No seleccionada';
});

const getMetricasImpactadas = computed(() => {
  const dim = dimensiones.find(d => d.id === encuesta.value.categoria);
  return dim?.metricas || [];
});

const getPrivacidadLabel = computed(() => {
  const labels = {
    'anonimato_completo': 'Anónimo completo',
    'anonimato_parcial': 'Anónimo por departamento',
    'identificado': 'Identificado'
  };
  return labels[encuesta.value.privacidadNivel];
});

const getPrivacidadDescripcion = computed(() => {
  const desc = {
    'anonimato_completo': 'Máxima privacidad garantizada',
    'anonimato_parcial': 'Resultados agrupados por área',
    'identificado': 'Requiere consentimiento del empleado'
  };
  return desc[encuesta.value.privacidadNivel];
});

const preguntasCompletas = computed(() => {
  return encuesta.value.preguntas.every(p =>
    p.texto.trim() &&
    p.tipo &&
    (p.tipo !== 'opcion_multiple' || (p.opciones && p.opciones.every(o => o.trim())))
  );
});

const puedeAvanzar = computed(() => {
  switch (currentStep.value) {
    case 0: return encuesta.value.titulo.trim() && encuesta.value.categoria;
    case 1: return encuesta.value.preguntas.length > 0 && preguntasCompletas.value;
    case 2: return audienciaEstimada.value > 0;
    case 3: return encuesta.value.privacidadNivel;
    default: return true;
  }
});

const puedeSerLanzada = computed(() => {
  return encuesta.value.titulo.trim() &&
         encuesta.value.categoria &&
         encuesta.value.preguntas.length > 0 &&
         preguntasCompletas.value &&
         audienciaEstimada.value > 0 &&
         encuesta.value.privacidadNivel;
});

// Métodos
const cargarDatos = async () => {
  loadingDepartamentos.value = true;
  try {
    const [deptData, empData] = await Promise.all([
      departamentosService.getAll(),
      empleadosService.getAll()
    ]);
    departamentos.value = deptData || [];
    empleados.value = empData || [];
  } catch (error) {
    console.error('Error cargando datos:', error);
    toast.error('Error al cargar datos de la empresa');
  } finally {
    loadingDepartamentos.value = false;
  }
};

const getEmpleadosPorDepartamento = (deptId) => {
  return empleados.value.filter(e => e.departamento_id === deptId).length;
};

const getTipoLabel = (tipo) => {
  const labels = {
    'escala_1_5': 'Escala 1-5',
    'si_no': 'Sí / No',
    'opcion_multiple': 'Opción múltiple',
    'texto_abierto': 'Texto abierto'
  };
  return labels[tipo] || tipo;
};

const agregarPreguntaSugerida = (pregunta) => {
  encuesta.value.preguntas.push({
    id: Date.now() + Math.random(),
    texto: pregunta.texto,
    tipo: pregunta.tipo,
    opciones: [...(pregunta.opciones || [])],
    dimension: '',
    esValidada: pregunta.esValidada
  });
  toast.success('Pregunta añadida');
};

const agregarTodasSugeridas = () => {
  preguntasSugeridas.value.forEach(pregunta => {
    encuesta.value.preguntas.push({
      id: Date.now() + Math.random(),
      texto: pregunta.texto,
      tipo: pregunta.tipo,
      opciones: [...(pregunta.opciones || [])],
      dimension: '',
      esValidada: pregunta.esValidada
    });
  });
  toast.success(`${preguntasSugeridas.value.length} preguntas añadidas`);
};

const agregarPregunta = () => {
  encuesta.value.preguntas.push({
    id: Date.now() + Math.random(),
    texto: '',
    tipo: '',
    opciones: ['', ''],
    dimension: '',
    esValidada: false
  });
};

const eliminarPregunta = (index) => {
  encuesta.value.preguntas.splice(index, 1);
};

const actualizarOpcionesPregunta = (index) => {
  const pregunta = encuesta.value.preguntas[index];
  if (pregunta.tipo === 'opcion_multiple') {
    pregunta.opciones = pregunta.opciones.length ? pregunta.opciones : ['', ''];
  } else {
    pregunta.opciones = [];
  }
};

const agregarOpcion = (preguntaIndex) => {
  encuesta.value.preguntas[preguntaIndex].opciones.push('');
};

const eliminarOpcion = (preguntaIndex, opcionIndex) => {
  encuesta.value.preguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
};

const siguientePaso = () => {
  if (puedeAvanzar.value && currentStep.value < 4) {
    currentStep.value++;
  }
};

const volverAlDashboard = () => {
  router.push('/admin/encuestas');
};

const guardarBorrador = async () => {
  if (!encuesta.value.titulo.trim()) {
    toast.warning('Añade un título para guardar el borrador');
    return;
  }

  loading.value = true;
  try {
    await encuestasStore.createNewSurvey({
      titulo: encuesta.value.titulo,
      descripcion: encuesta.value.descripcion,
      categoria: encuesta.value.categoria,
      privacidad_nivel: encuesta.value.privacidadNivel,
      preguntas: encuesta.value.preguntas,
      estado: 'borrador',
      es_recurrente: encuesta.value.esRecurrente,
      recurrencia: encuesta.value.esRecurrente ? encuesta.value.recurrencia : null,
      empresa_id: authStore.empresaId
    });
    toast.success('Borrador guardado correctamente');
    router.push('/admin/encuestas');
  } catch (error) {
    toast.error(error.message || 'Error al guardar el borrador');
  } finally {
    loading.value = false;
  }
};

const lanzarEncuesta = async () => {
  if (!puedeSerLanzada.value) return;

  loading.value = true;
  try {
    await encuestasStore.createNewSurvey({
      titulo: encuesta.value.titulo,
      descripcion: encuesta.value.descripcion,
      categoria: encuesta.value.categoria,
      privacidad_nivel: encuesta.value.privacidadNivel,
      preguntas: encuesta.value.preguntas,
      estado: 'activa',
      es_recurrente: encuesta.value.esRecurrente,
      recurrencia: encuesta.value.esRecurrente ? encuesta.value.recurrencia : null,
      empresa_id: authStore.empresaId
    });
    toast.success('¡Encuesta lanzada exitosamente!');
    router.push('/admin/encuestas');
  } catch (error) {
    toast.error(error.message || 'Error al lanzar la encuesta');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
.input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}
</style>
