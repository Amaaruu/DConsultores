export const serviceTypes = [
  'repositorio-digital',
  'dspace-dataverse',
  'migracion-actualizacion',
  'desarrollo-plataforma',
  'infraestructura-devops',
  'ia',
  'soporte-mantencion',
  'otro',
] as const;

export const currentSituations = [
  'nuevo',
  'mejorar',
  'actualizar',
  'migrar-reemplazar',
  'no-definido',
] as const;

export const contentTypes = [
  'documentos',
  'publicaciones-academicas',
  'tesis',
  'datos-investigacion',
  'fotografias',
  'videos-audios',
  'archivos-historicos',
  'otro',
  'no-definido',
] as const;

export const userTypes = [
  'publico-general',
  'funcionarios',
  'investigadores',
  'academicos',
  'estudiantes',
  'administradores-internos',
  'otro',
  'no-definido',
] as const;

export const migrationOptions = ['yes', 'no', 'unknown'] as const;

export const projectStages = [
  'idea-inicial',
  'levantando-requerimientos',
  'necesitamos-cotizacion',
  'licitacion-tdr',
  'en-ejecucion',
  'plataforma-con-problemas',
  'otro',
] as const;

export const targetTimeframes = [
  'lo-antes-posible',
  '1-mes',
  '2-3-meses',
  '4-6-meses',
  'mas-adelante',
  'no-definido',
  'fecha-especifica',
] as const;

export const estimatedBudgets = [
  'no-definido',
  'menos-5m',
  '5m-10m',
  '10m-25m',
  'mas-25m',
  'reunion',
] as const;

export type ProjectBriefPayload = {
  serviceType: (typeof serviceTypes)[number];
  serviceTypeOther?: string;
  objective: string;
  currentSituation: (typeof currentSituations)[number];
  currentPlatform?: string;
  contentTypes: string[];
  userTypes: string[];
  migrationRequired: (typeof migrationOptions)[number];
  migrationSource?: string;
  approximateRecords?: string;
  approximateFiles?: string;
  knownFormats?: string;
  projectStage: (typeof projectStages)[number];
  targetTimeframe?: (typeof targetTimeframes)[number];
  targetDate?: string;
  estimatedBudget?: (typeof estimatedBudgets)[number];
  name: string;
  organization: string;
  role?: string;
  email: string;
  phone?: string;
  additionalComments?: string;
  privacyConsent: boolean;
  website?: string;
  turnstileToken?: string;
};

export function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function normalizeLongText(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function uniqueAllowed(values: FormDataEntryValue[], allowed: readonly string[]) {
  const normalized = values.filter((value): value is string => typeof value === 'string' && allowed.includes(value));
  return Array.from(new Set(normalized));
}

function optionalAllowed<T extends readonly string[]>(value: string, allowed: T) {
  return value && allowed.includes(value) ? value : undefined;
}

function isPastDate(value: string) {
  if (!value) return false;
  const target = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(target.valueOf())) return true;
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return target < todayUtc;
}

export function validateProjectBriefForm(formData: FormData) {
  const payload = {
    serviceType: normalizeText(formData.get('serviceType')),
    serviceTypeOther: normalizeText(formData.get('serviceTypeOther')),
    objective: normalizeLongText(formData.get('objective')),
    currentSituation: normalizeText(formData.get('currentSituation')),
    currentPlatform: normalizeText(formData.get('currentPlatform')),
    contentTypes: uniqueAllowed(formData.getAll('contentTypes'), contentTypes),
    userTypes: uniqueAllowed(formData.getAll('userTypes'), userTypes),
    migrationRequired: normalizeText(formData.get('migrationRequired')),
    migrationSource: normalizeText(formData.get('migrationSource')),
    approximateRecords: normalizeText(formData.get('approximateRecords')),
    approximateFiles: normalizeText(formData.get('approximateFiles')),
    knownFormats: normalizeText(formData.get('knownFormats')),
    projectStage: normalizeText(formData.get('projectStage')),
    targetTimeframe: optionalAllowed(normalizeText(formData.get('targetTimeframe')), targetTimeframes),
    targetDate: normalizeText(formData.get('targetDate')),
    estimatedBudget: optionalAllowed(normalizeText(formData.get('estimatedBudget')), estimatedBudgets),
    name: normalizeText(formData.get('name')),
    organization: normalizeText(formData.get('organization')),
    role: normalizeText(formData.get('role')),
    email: normalizeText(formData.get('email')).toLowerCase(),
    phone: normalizeText(formData.get('phone')),
    additionalComments: normalizeLongText(formData.get('additionalComments')),
    privacyConsent: formData.get('privacyConsent') === 'on',
    website: normalizeText(formData.get('website')),
    turnstileToken: normalizeText(formData.get('cf-turnstile-response')),
  };

  const errors: Record<string, string> = {};
  if (!serviceTypes.includes(payload.serviceType as ProjectBriefPayload['serviceType'])) errors.serviceType = 'Selecciona un tipo de necesidad.';
  if (payload.serviceType === 'otro' && (payload.serviceTypeOther.length < 2 || payload.serviceTypeOther.length > 100)) errors.serviceTypeOther = 'Describe la necesidad.';
  if (payload.objective.length < 20 || payload.objective.length > 1500) errors.objective = 'El objetivo debe tener entre 20 y 1500 caracteres.';
  if (!currentSituations.includes(payload.currentSituation as ProjectBriefPayload['currentSituation'])) errors.currentSituation = 'Selecciona la situacion actual.';
  if (payload.currentPlatform.length > 200) errors.currentPlatform = 'La plataforma actual supera el largo permitido.';
  if (payload.contentTypes.length === 0) errors.contentTypes = 'Selecciona al menos un tipo de contenido.';
  if (payload.userTypes.length === 0) errors.userTypes = 'Selecciona al menos un tipo de usuario.';
  if (!migrationOptions.includes(payload.migrationRequired as ProjectBriefPayload['migrationRequired'])) errors.migrationRequired = 'Selecciona si requiere migracion.';
  for (const key of ['migrationSource', 'approximateRecords', 'approximateFiles', 'knownFormats'] as const) {
    if (payload[key].length > 300) errors[key] = 'El campo supera el largo permitido.';
  }
  if (!projectStages.includes(payload.projectStage as ProjectBriefPayload['projectStage'])) errors.projectStage = 'Selecciona etapa del proyecto.';
  if (payload.targetTimeframe === 'fecha-especifica' && (!payload.targetDate || isPastDate(payload.targetDate))) errors.targetDate = 'Ingresa una fecha futura.';
  if (payload.targetTimeframe !== 'fecha-especifica') payload.targetDate = '';
  if (payload.name.length < 2 || payload.name.length > 100) errors.name = 'Ingresa un nombre valido.';
  if (payload.organization.length < 2 || payload.organization.length > 150) errors.organization = 'Ingresa una organizacion valida.';
  if (payload.role.length > 100) errors.role = 'El cargo supera el largo permitido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || payload.email.length > 254) errors.email = 'Ingresa un correo valido.';
  if (payload.phone.length > 30) errors.phone = 'El telefono supera el largo permitido.';
  if (payload.additionalComments.length > 2000) errors.additionalComments = 'Los comentarios superan el largo permitido.';
  if (!payload.privacyConsent) errors.privacyConsent = 'Debes aceptar la politica de privacidad.';
  if (payload.website) errors.website = 'No fue posible enviar el mensaje.';

  return {
    payload: payload as ProjectBriefPayload,
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
