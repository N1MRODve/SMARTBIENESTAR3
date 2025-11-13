import { DEMO_MODE, demoData } from '@/utils/demoData';

export const wrapServiceWithDemo = (service, demoDataKey) => {
  const wrappedService = {};

  for (const [methodName, originalMethod] of Object.entries(service)) {
    wrappedService[methodName] = async (...args) => {
      if (DEMO_MODE.enabled && demoDataKey) {
        return handleDemoRequest(methodName, demoDataKey, args);
      }
      return originalMethod.apply(service, args);
    };
  }

  return wrappedService;
};

const handleDemoRequest = async (methodName, dataKey, args) => {
  await simulateDelay();

  switch (methodName) {
    case 'getAll':
      return demoData[dataKey] || [];

    case 'getById':
      const id = args[0];
      const items = demoData[dataKey] || [];
      const item = items.find(i => i.id === id);
      if (!item) throw new Error('No encontrado');
      return item;

    case 'create':
      const newItem = {
        id: `demo-${dataKey}-${Date.now()}`,
        ...args[0],
        fecha_creacion: new Date().toISOString()
      };
      return newItem;

    case 'update':
      const updateId = args[0];
      const updates = args[1];
      const existingItems = demoData[dataKey] || [];
      const existingItem = existingItems.find(i => i.id === updateId);
      if (!existingItem) throw new Error('No encontrado');
      return { ...existingItem, ...updates };

    case 'delete':
      return { success: true };

    case 'getByAuthUserId':
      return demoData.empleados[0];

    case 'getRespuestas':
      return generateDemoRespuestas(args[0]);

    case 'getLecturas':
      const comunicadoId = args[0];
      const comunicado = demoData.comunicados.find(c => c.id === comunicadoId);
      return comunicado ? generateDemoLecturas(comunicado) : [];

    case 'marcarComoLeido':
      return { success: true };

    case 'getActive':
      const activeEncuesta = demoData.encuestas.find(e => e.estado === 'activa');
      return activeEncuesta || null;

    default:
      return [];
  }
};

const simulateDelay = () => {
  return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
};

const generateDemoRespuestas = (encuestaId) => {
  const encuesta = demoData.encuestas.find(e => e.id === encuestaId);
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

const generateDemoLecturas = (comunicado) => {
  const numLecturas = comunicado.lecturas || 0;
  const lecturas = [];

  for (let i = 0; i < Math.min(numLecturas, demoData.empleados.length); i++) {
    const empleado = demoData.empleados[i];
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
