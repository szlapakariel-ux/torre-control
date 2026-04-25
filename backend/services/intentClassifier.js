const RULES = [
  {
    intent: 'error',
    priority: 'alta',
    keywords: ['se cayó', 'no funciona', 'error', 'falla', 'bug', 'roto', 'falló', 'problema', 'crash', 'no anda', 'se rompió'],
    response: 'Detecté un posible error. Antes de avanzar, necesito entender mejor qué pasó.',
    nextStep: 'Aclarar el contexto y alcance del error antes de ejecutar acciones.',
  },
  {
    intent: 'tarea',
    priority: 'media',
    keywords: ['hay que', 'hacer', 'crear', 'conectar', 'implementar', 'agregar', 'desarrollar', 'armar', 'construir', 'resolver', 'terminar', 'completar', 'modificar'],
    response: 'Anotado como tarea. ¿Querés definir pasos concretos o asignarlo directamente?',
    nextStep: 'Definir responsable, criterio de completitud y prioridad.',
  },
  {
    intent: 'decisión',
    priority: 'alta',
    keywords: ['decido', 'confirmo', 'aprobado', 'decidimos', 'vamos con', 'elegimos', 'queda', 'definimos', 'acordamos'],
    response: 'Decisión registrada. ¿Querés documentar el razonamiento o avanzar directo?',
    nextStep: 'Documentar contexto de la decisión y notificar si aplica.',
  },
  {
    intent: 'duda',
    priority: 'baja',
    keywords: ['qué', 'cómo', 'por qué', 'cuándo', 'dónde', 'cuál', '?', 'no sé', 'no entiendo', 'no está claro', 'explicame'],
    response: 'Buena pregunta. Vamos a clarificarlo antes de avanzar.',
    nextStep: 'Investigar y responder con precisión antes de continuar.',
  },
  {
    intent: 'idea',
    priority: 'baja',
    keywords: ['se me ocurrió', 'idea', 'podría', 'qué tal si', 'imagina', 'y si', 'sería bueno', 'sería interesante', 'propongo'],
    response: 'Interesante idea. ¿Querés explorarla ahora o la dejamos en el backlog?',
    nextStep: 'Evaluar viabilidad e impacto antes de ejecutar.',
  },
  {
    intent: 'browser',
    priority: 'media',
    keywords: ['leelo', 'lee esto', 'leer página', 'leer la página', 'leer url', 'leer link', 'abrir link', 'abrir url', 'navegar', 'buscar en', 'revisar link', 'revisar url', 'cargar página'],
    response: 'Entendido. Accedí a la página y estoy analizando el contenido.',
    nextStep: 'Resumir la información clave de la página para continuar.',
  },
];

const DEFAULT = {
  intent: 'consulta_general',
  priority: 'baja',
  response: 'Entendido. ¿Podés darme más contexto para ayudarte mejor?',
  nextStep: 'Ampliar información para poder avanzar.',
};

function classifyIntent(text) {
  const lower = text.toLowerCase();

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return {
        intent: rule.intent,
        priority: rule.priority,
        response: rule.response,
        nextStep: rule.nextStep,
      };
    }
  }

  return { ...DEFAULT };
}

module.exports = { classifyIntent };
