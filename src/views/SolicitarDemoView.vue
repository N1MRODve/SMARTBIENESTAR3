<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Heart class="w-6 h-6 text-white" />
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SMART Bienestar
            </span>
          </router-link>

          <div class="flex items-center gap-4">
            <router-link
              to="/login"
              class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Iniciar sesión
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-24 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Calendar class="w-4 h-4" />
            Agenda tu demostración personalizada
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Solicitar una Demo
          </h1>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Descubre cómo SMART Bienestar puede transformar la cultura de bienestar en tu empresa.
            Te mostraremos todas las funcionalidades adaptadas a tus necesidades.
          </p>
        </div>

        <div class="grid lg:grid-cols-5 gap-8">
          <!-- Form -->
          <div class="lg:col-span-3">
            <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <form @submit.prevent="submitDemo" class="space-y-6">

                <!-- Datos de contacto -->
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User class="w-5 h-5 text-blue-600" />
                    Datos de contacto
                  </h3>

                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        Nombre completo *
                      </label>
                      <input
                        v-model="form.nombre"
                        type="text"
                        required
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        Email corporativo *
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="tu@empresa.com"
                      />
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        v-model="form.telefono"
                        type="tel"
                        required
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        Cargo
                      </label>
                      <input
                        v-model="form.cargo"
                        type="text"
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Director de RRHH"
                      />
                    </div>
                  </div>
                </div>

                <!-- Datos de empresa -->
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 class="w-5 h-5 text-blue-600" />
                    Datos de la empresa
                  </h3>

                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        Nombre de la empresa *
                      </label>
                      <input
                        v-model="form.empresa"
                        type="text"
                        required
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700 mb-2">
                        Número de empleados *
                      </label>
                      <select
                        v-model="form.tamano"
                        required
                        class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Selecciona un rango</option>
                        <option value="1-10">1 - 10 empleados</option>
                        <option value="11-50">11 - 50 empleados</option>
                        <option value="51-200">51 - 200 empleados</option>
                        <option value="201-500">201 - 500 empleados</option>
                        <option value="501+">Más de 500 empleados</option>
                      </select>
                    </div>
                  </div>

                  <div class="mt-4">
                    <label class="block text-sm font-medium text-slate-700 mb-2">
                      Sector de la empresa
                    </label>
                    <select
                      v-model="form.sector"
                      class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Selecciona un sector</option>
                      <option value="tecnologia">Tecnología</option>
                      <option value="salud">Salud</option>
                      <option value="educacion">Educación</option>
                      <option value="finanzas">Finanzas y Banca</option>
                      <option value="retail">Retail y Comercio</option>
                      <option value="manufactura">Manufactura</option>
                      <option value="servicios">Servicios profesionales</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <!-- Intereses -->
                <div>
                  <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Target class="w-5 h-5 text-blue-600" />
                    ¿Qué te interesa conocer?
                  </h3>

                  <div class="grid md:grid-cols-2 gap-3">
                    <label
                      v-for="interes in intereses"
                      :key="interes.value"
                      class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                      :class="{ 'border-blue-500 bg-blue-50': form.intereses.includes(interes.value) }"
                    >
                      <input
                        type="checkbox"
                        :value="interes.value"
                        v-model="form.intereses"
                        class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span class="text-sm text-slate-700">{{ interes.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- Mensaje adicional -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    Cuéntanos más sobre tus necesidades
                  </label>
                  <textarea
                    v-model="form.mensaje"
                    rows="4"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="¿Qué retos de bienestar laboral enfrentas actualmente? ¿Qué objetivos te gustaría lograr?"
                  ></textarea>
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                  <Send v-else class="w-5 h-5" />
                  {{ loading ? 'Enviando...' : 'Solicitar Demo Gratuita' }}
                </button>

                <p class="text-xs text-center text-slate-500">
                  Al enviar este formulario, aceptas nuestra política de privacidad.
                  Nos pondremos en contacto contigo en menos de 24 horas hábiles.
                </p>
              </form>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-2 space-y-6">
            <!-- What to expect -->
            <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">
                ¿Qué incluye la demo?
              </h3>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-slate-600 text-sm">Tour completo de la plataforma adaptado a tu sector</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-slate-600 text-sm">Resolución de todas tus dudas en tiempo real</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-slate-600 text-sm">Propuesta personalizada según tus necesidades</span>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-slate-600 text-sm">Sin compromiso de compra</span>
                </li>
              </ul>
            </div>

            <!-- Contact info -->
            <div class="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 class="text-lg font-semibold mb-4">
                ¿Prefieres contactarnos directamente?
              </h3>
              <div class="space-y-3">
                <a
                  href="mailto:hola@smartbienestar.com"
                  class="flex items-center gap-3 text-blue-100 hover:text-white transition-colors"
                >
                  <Mail class="w-5 h-5" />
                  <span>hola@smartbienestar.com</span>
                </a>
                <a
                  href="tel:+34900000000"
                  class="flex items-center gap-3 text-blue-100 hover:text-white transition-colors"
                >
                  <Phone class="w-5 h-5" />
                  <span>+34 900 000 000</span>
                </a>
              </div>
            </div>

            <!-- Testimonial placeholder -->
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <div class="flex items-center gap-1 mb-3">
                <Star v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <p class="text-slate-600 text-sm italic mb-4">
                "SMART Bienestar nos ayudó a entender realmente cómo se sienten nuestros empleados
                y a tomar acciones concretas para mejorar su bienestar."
              </p>
              <p class="text-sm font-medium text-slate-900">— Director de RRHH</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div
        v-if="showSuccess"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showSuccess = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="w-10 h-10 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-3">
            ¡Solicitud enviada!
          </h3>
          <p class="text-slate-600 mb-6">
            Gracias por tu interés en SMART Bienestar. Nuestro equipo se pondrá en contacto contigo
            en las próximas 24 horas hábiles para agendar tu demostración personalizada.
          </p>
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            Volver al inicio
          </router-link>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import {
  Heart,
  Calendar,
  User,
  Building2,
  Target,
  Send,
  Check,
  CheckCircle,
  Mail,
  Phone,
  Star,
  Loader2,
  ArrowLeft
} from 'lucide-vue-next';

const loading = ref(false);
const showSuccess = ref(false);

const form = reactive({
  nombre: '',
  email: '',
  telefono: '',
  cargo: '',
  empresa: '',
  tamano: '',
  sector: '',
  intereses: [],
  mensaje: ''
});

const intereses = [
  { value: 'encuestas', label: 'Encuestas de bienestar' },
  { value: 'comunicados', label: 'Comunicación interna' },
  { value: 'recompensas', label: 'Sistema de recompensas' },
  { value: 'analitica', label: 'Analítica y reportes' },
  { value: 'servicios', label: 'Catálogo de servicios' },
  { value: 'integraciones', label: 'Integraciones' }
];

const submitDemo = async () => {
  loading.value = true;

  try {
    // Simular envío - aquí iría la lógica real de envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    // En producción, aquí se enviaría el formulario a un endpoint
    console.log('Demo request:', form);

    showSuccess.value = true;

    // Reset form
    Object.assign(form, {
      nombre: '',
      email: '',
      telefono: '',
      cargo: '',
      empresa: '',
      tamano: '',
      sector: '',
      intereses: [],
      mensaje: ''
    });

  } catch (error) {
    console.error('Error al enviar solicitud:', error);
  } finally {
    loading.value = false;
  }
};
</script>
