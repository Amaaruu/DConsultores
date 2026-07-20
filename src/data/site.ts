export const site = {
  name: 'D-Consultores',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://www.dconsultores.cl',
  description:
    'Consultoria especializada en repositorios digitales, plataformas, infraestructura e inteligencia artificial aplicada.',
  email: 'contacto@dconsultores.cl',
  phone: '+56 9 0000 0000',
  bookingUrl:
    import.meta.env.GOOGLE_BOOKING_URL ?? 'https://calendar.app.google/d3bo6kebVwssXB4L9',
};

export { navItems } from './navigation';

export const services = [
  {
    title: 'Repositorios digitales',
    problem: 'Ordenar, preservar y publicar colecciones digitales con criterios sostenibles.',
    body: 'Diseno, migracion y mejora de repositorios para instituciones que necesitan gobernanza, trazabilidad y acceso confiable.',
    result: 'Colecciones publicables, mantenibles y preparadas para crecimiento.',
    capabilities: ['Arquitectura de metadatos', 'Flujos de ingesta', 'Preservacion digital', 'Interoperabilidad'],
  },
  {
    title: 'DSpace y Dataverse',
    problem: 'Modernizar plataformas academicas sin perder continuidad operativa.',
    body: 'Implementacion, upgrade, integraciones y soporte para ecosistemas DSpace y Dataverse.',
    result: 'Repositorios estables, seguros y alineados a necesidades institucionales.',
    capabilities: ['Instalacion y upgrades', 'Temas visuales', 'Integraciones', 'Operacion y soporte'],
  },
  {
    title: 'Desarrollo de plataformas',
    problem: 'Resolver procesos criticos con software sobrio y mantenible.',
    body: 'Construccion de aplicaciones web, portales e integraciones con foco en rendimiento, seguridad y adopcion.',
    result: 'Plataformas claras, documentadas y listas para evolucionar.',
    capabilities: ['Arquitectura web', 'APIs', 'Automatizacion', 'Experiencia de usuario'],
  },
  {
    title: 'Infraestructura y DevOps',
    problem: 'Reducir fragilidad operativa y mejorar despliegues.',
    body: 'Automatizacion de ambientes, monitoreo, respaldos y practicas de entrega continua.',
    result: 'Operaciones repetibles, observables y menos dependientes de intervencion manual.',
    capabilities: ['CI/CD', 'Contenedores', 'Monitoreo', 'Hardening'],
  },
  {
    title: 'Inteligencia artificial aplicada',
    problem: 'Usar IA donde crea valor medible, sin agregar complejidad innecesaria.',
    body: 'Prototipos, asistentes internos y automatizaciones conectadas a datos y procesos reales.',
    result: 'Casos de uso validados, seguros y faciles de gobernar.',
    capabilities: ['RAG', 'Evaluacion', 'Automatizacion documental', 'Gobernanza'],
  },
];

export const projects = [
  {
    title: 'Biblioteca digital institucional',
    client: 'Organismo publico',
    context: 'Colecciones documentales con alto valor historico y operativo.',
    challenge: 'Normalizar metadatos, mejorar acceso publico y asegurar continuidad.',
    solution: 'Repositorio digital con flujos de carga, criterios de preservacion y capacitacion.',
    technologies: ['DSpace', 'PostgreSQL', 'Linux', 'Nginx'],
    result: 'Plataforma estable para consulta publica y gestion documental.',
  },
  {
    title: 'Catalogo documental interoperable',
    client: 'Institucion tecnica',
    context: 'Fuentes dispersas y procesos manuales de actualizacion.',
    challenge: 'Reducir duplicacion y publicar informacion confiable.',
    solution: 'Modelo de datos, automatizaciones y capa web para busqueda y publicacion.',
    technologies: ['Astro', 'APIs', 'PostgreSQL', 'Docker'],
    result: 'Menos operacion manual y mayor calidad de informacion publicada.',
  },
  {
    title: 'Automatizacion de repositorio de datos',
    client: 'Centro de investigacion',
    context: 'Datos cientificos con requerimientos de cita, versionado y acceso.',
    challenge: 'Mejorar la publicacion de datasets y la trazabilidad de cambios.',
    solution: 'Implementacion Dataverse, reglas de metadatos y soporte operativo.',
    technologies: ['Dataverse', 'Solr', 'Java', 'Linux'],
    result: 'Datasets publicables con identificadores persistentes y gobierno claro.',
  },
];
