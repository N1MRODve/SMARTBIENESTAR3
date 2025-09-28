// /src/services/mock/comunicados.service.js
import { ref } from 'vue';

const comunicados = ref([
  { id: 'com-01', titulo: '¡Bienvenida a la nueva plataforma!', contenido: 'Estamos muy contentos de...', fechaCreacion: new Date().toISOString() }
]);

export const getComunicados = async () => {
  return new Promise(resolve => resolve(comunicados.value));
};

export const addComunicado = async (comunicadoData) => {
  const nuevoComunicado = {
    id: `com-${Date.now()}`,
    ...comunicadoData,
    fechaCreacion: new Date().toISOString()
  };
  comunicados.value.unshift(nuevoComunicado); // Añade al principio
  return new Promise(resolve => resolve({ success: true }));
};