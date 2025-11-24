import { DEMO_MODE, demoData } from '@/utils/demoData';
import { FITCORP_MOCK_DATA } from './mockData';
import { useAuthStore } from '@/stores/auth.store';

export const wrapServiceWithDemo = (service, demoDataKey) => {
  const wrappedService = {};

  for (const [methodName, originalMethod] of Object.entries(service)) {
    wrappedService[methodName] = async (...args) => {
      const authStore = useAuthStore();

      if (authStore.isDemoMode && demoDataKey) {
        return handleDemoRequest(methodName, demoDataKey, args, FITCORP_MOCK_DATA);
      }

      if (DEMO_MODE.enabled && demoDataKey) {
        return handleDemoRequest(methodName, demoDataKey, args, demoData);
      }

      return originalMethod.apply(service, args);
    };
  }

  return wrappedService;
};

const handleDemoRequest = async (methodName, dataKey, args, mockDataSource) => {
  await simulateDelay();

  switch (methodName) {
    case 'getAll':
      return mockDataSource[dataKey] || [];

    case 'getById':
      const id = args[0];
      const items = mockDataSource[dataKey] || [];
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('No encontrado');
      return item;

    case 'getByCategoria':
      const categoria = args[0];
      const allItems = mockDataSource[dataKey] || [];
      return allItems.filter(i => i.categoria === categoria);

    case 'create':
      const newItem = {
        id: `demo-${dataKey}-${Date.now()}`,
        ...args[0],
        fecha_creacion: new Date().toISOString()
      };
      console.log(`[DEMO MODE] Creando ${dataKey}:`, newItem);
      return newItem;

    case 'update':
      const updateId = args[0];
      const updates = args[1];
      const existingItems = mockDataSource[dataKey] || [];
      const existingItem = existingItems.find(i => i.id === updateId);
      if (!existingItem) throw new Error('No encontrado');
      const updatedItem = { ...existingItem, ...updates };
      console.log(`[DEMO MODE] Actualizando ${dataKey}:`, updatedItem);
      return updatedItem;

    case 'delete':
      console.log(`[DEMO MODE] Eliminando ${dataKey} con id:`, args[0]);
      return { success: true };

    case 'getByAuthUserId':
      return mockDataSource.empleados[0];

    case 'getRespuestas':
      return generateDemoRespuestas(args[0], mockDataSource);

    case 'getLecturas':
      const comunicadoId = args[0];
      const comunicado = mockDataSource.comunicados.find(c => c.id === comunicadoId);
      return comunicado ? generateDemoLecturas(comunicado, mockDataSource) : [];

    case 'marcarComoLeido':
      console.log('[DEMO MODE] Marcando comunicado como leído');
      return { success: true };

    case 'getActive':
      const activeEncuesta = mockDataSource.encuestas.find(e => e.estado === 'activa');
      return activeEncuesta || null;

    case 'submitRespuesta':
      console.log('[DEMO MODE] Enviando respuestas de encuesta:', args);
      return { success: true, message: 'Respuestas guardadas (modo demo)' };

    case 'canjear':
      const [empleadoId, recompensaId] = args;
      const recompensa = mockDataSource.recompensas.find(r => r.id === recompensaId);
      if (!recompensa) throw new Error('Recompensa no encontrada');

      console.log('[DEMO MODE] Canjeando recompensa:', recompensa.nombre);
      return {
        id: `demo-canje-${Date.now()}`,
        empleado_id: empleadoId,
        recompensa_id: recompensaId,
        puntos_gastados: recompensa.puntos_requeridos || recompensa.costo_puntos,
        estado: 'pendiente',
        fecha_canje: new Date().toISOString()
      };

    case 'getHistorialCanjes':
      return mockDataSource.canjes || [];

    case 'updateEstadoCanje':
      const [canjeId, estado, notas] = args;
      console.log(`[DEMO MODE] Actualizando estado de canje a:`, estado);
      return {
        id: canjeId,
        estado,
        fecha_procesado: new Date().toISOString(),
        notas
      };

    case 'getEstadisticasParticipacion':
      return mockDataSource.estadisticas?.participacion || null;

    case 'getEstadisticasDashboard':
      return mockDataSource.estadisticas?.dashboard || null;

    case 'getEstadisticasEncuestas':
      return mockDataSource.estadisticas?.encuestas || null;

    default:
      console.log(`[DEMO MODE] Método no manejado: ${methodName}`);
      return [];
  }
};

const simulateDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
};

const generateDemoRespuestas = (encuestaId, mockDataSource) => {
  const encuesta = mockDataSource.encuestas.find(e => e.id === encuestaId);
  if (!encuesta) return [];

  const respuestas = [];
  const numRespuestas = encuesta.respuestas_totales || 87;

  for (let i = 0; i < numRespuestas; i++) {
    if (encuesta.preguntas_encuesta) {
      encuesta.preguntas_encuesta.forEach(pregunta => {
        respuestas.push({
          id: `demo-resp-${i}-${pregunta.id}`,
          encuesta_id: encuestaId,
          pregunta_id: pregunta.id,
          respuesta: pregunta.tipo === 'escala'
            ? Math.floor(Math.random() * 4) + 7
            : pregunta.tipo === 'opcion_multiple'
            ? pregunta.opciones[Math.floor(Math.random() * pregunta.opciones.length)]
            : `Respuesta demo ${i + 1}`,
          preguntas_encuesta: pregunta,
          fecha_respuesta: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
        });
      });
    }
  }

  return respuestas;
};

const generateDemoLecturas = (comunicado, mockDataSource) => {
  const numLecturas = comunicado.lecturas || 0;
  const lecturas = [];

  for (let i = 0; i < Math.min(numLecturas, mockDataSource.empleados.length); i++) {
    const empleado = mockDataSource.empleados[i];
    lecturas.push({
      id: `demo-lect-${i}`,
      comunicado_id: comunicado.id,
      empleado_id: empleado.id,
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre
      },
      fecha_lectura: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return lecturas;
};

export const getDemoStats = () => {
  if (!DEMO_MODE.enabled) return null;
  return demoData.estadisticas;
};
