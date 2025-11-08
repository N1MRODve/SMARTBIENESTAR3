<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Users, MessageSquare, Gift, Target } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(1);
const loading = ref(false);
const empresa = ref(null);

onMounted(async () => {
  if (authStore.empresaId) {
    const { data } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', authStore.empresaId)
      .maybeSingle();

    empresa.value = data;
  }
});

const steps = [
  {
    number: 1,
    title: 'Bienvenido a Smart Bienestar',
    description: 'Tu plataforma está lista',
    icon: CheckCircle
  },
  {
    number: 2,
    title: 'Invita a tu equipo',
    description: 'Comienza agregando empleados',
    icon: Users
  },
  {
    number: 3,
    title: 'Configura comunicación',
    description: 'Envía tu primer mensaje',
    icon: MessageSquare
  },
  {
    number: 4,
    title: 'Configura recompensas',
    description: 'Motiva a tu equipo',
    icon: Gift
  }
];

const completeOnboarding = async () => {
  loading.value = true;
  try {
    await supabase
      .from('empresas')
      .update({ onboarding_completado: true })
      .eq('id', authStore.empresaId);

    router.push('/admin/dashboard');
  } catch (error) {
    console.error('Error completando onboarding:', error);
  } finally {
    loading.value = false;
  }
};

const skipOnboarding = async () => {
  await completeOnboarding();
};

const goToStep = (action) => {
  switch(action) {
    case 'invite':
      router.push('/admin/empleados');
      break;
    case 'communication':
      router.push('/admin/comunicacion');
      break;
    case 'rewards':
      router.push('/admin/recompensas');
      break;
    default:
      currentStep.value++;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
    <div class="max-w-4xl w-full">

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6">
          <Target class="h-10 w-10 text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">
          ¡Bienvenido a Smart Bienestar!
        </h1>
        <p class="text-xl text-gray-600">
          {{ empresa?.nombre || 'Tu empresa' }}
        </p>
        <p class="text-gray-500 mt-2">
          Configuremos tu plataforma en pocos pasos
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        <!-- Step Indicator -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div v-for="step in steps" :key="step.number" class="flex items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                  currentStep >= step.number
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white'
                ]"
              >
                {{ step.number }}
              </div>
              <div
                v-if="step.number < steps.length"
                :class="[
                  'w-16 h-1 mx-2 transition-all',
                  currentStep > step.number ? 'bg-white' : 'bg-white/20'
                ]"
              ></div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-10">

          <!-- Step 1: Welcome -->
          <div v-if="currentStep === 1" class="text-center py-8">
            <CheckCircle class="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              ¡Tu cuenta está lista!
            </h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Smart Bienestar te ayudará a mejorar el clima laboral, gestionar comunicaciones,
              motivar a tu equipo y más. Comencemos configurando lo básico.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div class="bg-blue-50 rounded-xl p-6">
                <Users class="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 mb-2">Gestiona tu equipo</h3>
                <p class="text-sm text-gray-600">Invita y administra empleados</p>
              </div>
              <div class="bg-indigo-50 rounded-xl p-6">
                <MessageSquare class="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 mb-2">Comunicación efectiva</h3>
                <p class="text-sm text-gray-600">Envía comunicados y encuestas</p>
              </div>
              <div class="bg-purple-50 rounded-xl p-6">
                <Gift class="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 class="font-semibold text-gray-900 mb-2">Recompensas</h3>
                <p class="text-sm text-gray-600">Motiva con puntos y premios</p>
              </div>
            </div>

            <div class="flex gap-4 justify-center mt-10">
              <Button variant="outline" @click="skipOnboarding">
                Saltar configuración
              </Button>
              <Button @click="currentStep = 2">
                Comenzar configuración
              </Button>
            </div>
          </div>

          <!-- Step 2: Invite Team -->
          <div v-if="currentStep === 2" class="text-center py-8">
            <Users class="h-20 w-20 text-blue-600 mx-auto mb-6" />
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Invita a tu equipo
            </h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Comienza agregando a los miembros de tu organización. Podrás gestionar
              departamentos, roles y permisos.
            </p>

            <div class="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
              <p class="text-sm text-gray-600 mb-2">Puedes hacer esto ahora o después desde:</p>
              <p class="font-semibold text-gray-900">Panel de Admin → Empleados</p>
            </div>

            <div class="flex gap-4 justify-center">
              <Button variant="outline" @click="currentStep = 3">
                Hacer después
              </Button>
              <Button @click="goToStep('invite')">
                Invitar empleados ahora
              </Button>
            </div>
          </div>

          <!-- Step 3: Communication -->
          <div v-if="currentStep === 3" class="text-center py-8">
            <MessageSquare class="h-20 w-20 text-indigo-600 mx-auto mb-6" />
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Comunicación con tu equipo
            </h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Envía comunicados importantes, crea encuestas de clima laboral y mantén
              a tu equipo informado.
            </p>

            <div class="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
              <p class="text-sm text-gray-600 mb-2">Accede a estas herramientas desde:</p>
              <p class="font-semibold text-gray-900">Centro de Comunicación</p>
            </div>

            <div class="flex gap-4 justify-center">
              <Button variant="outline" @click="currentStep = 4">
                Hacer después
              </Button>
              <Button @click="goToStep('communication')">
                Explorar comunicación
              </Button>
            </div>
          </div>

          <!-- Step 4: Rewards -->
          <div v-if="currentStep === 4" class="text-center py-8">
            <Gift class="h-20 w-20 text-purple-600 mx-auto mb-6" />
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Sistema de recompensas
            </h2>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Motiva a tu equipo con un sistema de puntos y recompensas. Reconoce
              logros y fomenta el compromiso.
            </p>

            <div class="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
              <p class="text-sm text-gray-600 mb-2">Configura recompensas desde:</p>
              <p class="font-semibold text-gray-900">Gestión de Recompensas</p>
            </div>

            <div class="flex gap-4 justify-center">
              <Button variant="outline" @click="completeOnboarding" :loading="loading">
                Completar después
              </Button>
              <Button @click="goToStep('rewards')">
                Configurar recompensas
              </Button>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-10 py-6 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm text-gray-600">
            <button
              v-if="currentStep > 1"
              @click="currentStep--"
              class="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Anterior
            </button>
            <div v-else></div>

            <span>Paso {{ currentStep }} de {{ steps.length }}</span>

            <button
              @click="skipOnboarding"
              class="text-gray-500 hover:text-gray-700"
            >
              Saltar configuración →
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
