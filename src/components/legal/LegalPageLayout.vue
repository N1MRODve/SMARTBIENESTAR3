<script setup>
import { useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: Object, default: null },
  lastModified: { type: String, default: '25 de febrero de 2026' }
});

const router = useRouter();

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
    <!-- Sticky Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft :size="20" />
          <span class="text-sm font-medium">Volver</span>
        </button>
        <div class="flex items-center gap-2">
          <component
            v-if="icon"
            :is="icon"
            :size="20"
            class="text-blue-600"
          />
          <span class="text-sm font-semibold text-slate-700">{{ title }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <!-- Content Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 legal-content">
        <slot></slot>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-xs text-slate-400 space-y-2">
        <p>Última modificación: {{ lastModified }}</p>
        <p>
          Texto legal desarrollado por:
          <a
            href="https://areadigitalabogados.es/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:underline"
          >
            Área Digital Abogados
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legal-content :deep(h1),
.legal-content :deep(h2),
.legal-content :deep(h3) {
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.legal-content :deep(h1) {
  font-size: 1.875rem;
}

.legal-content :deep(h2) {
  font-size: 1.5rem;
}

.legal-content :deep(h3) {
  font-size: 1.125rem;
}

.legal-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: #334155;
}

.legal-content :deep(ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.75;
  color: #334155;
}

.legal-content :deep(ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.legal-content :deep(th),
.legal-content :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  text-align: left;
}

.legal-content :deep(th) {
  background-color: #f1f5f9;
  font-weight: 600;
  color: #334155;
}

.legal-content :deep(td) {
  color: #475569;
}

.legal-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.legal-content :deep(a:hover) {
  color: #1d4ed8;
}

.legal-content :deep(strong) {
  font-weight: 600;
}

.legal-content :deep(em) {
  font-style: italic;
}

.legal-content :deep(blockquote) {
  border-left: 4px solid #cbd5e1;
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 1rem;
  color: #475569;
}
</style>
