import type { APIRoute } from 'astro';
import { validateProjectBriefForm, type ProjectBriefPayload } from '../../utils/validation';

const genericError = { success: false, message: 'No fue posible enviar el mensaje. Inténtalo nuevamente.' };
const successMessage = { success: true, message: 'Recibimos los antecedentes de tu proyecto. Revisaremos la información y nos pondremos en contacto contigo.' };

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  
  if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
    return json(genericError, 415);
  }
  
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 32_768) return json(genericError, 413);

  const formData = await request.formData();
  const { valid, payload } = validateProjectBriefForm(formData);

  if (!valid) return json(genericError, 400);

  const turnstileOk = await verifyTurnstile(payload.turnstileToken);
  if (!turnstileOk) return json(genericError, 400);

  const emailOk = await sendContactEmail(payload);
  if (!emailOk) return json(genericError, 502);

  return json(successMessage, 200);
};

async function verifyTurnstile(token = '') {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return import.meta.env.DEV;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  
  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

async function sendContactEmail(payload: ProjectBriefPayload) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) return import.meta.env.DEV;

  const requestId = crypto.randomUUID();
  const text = [
    `Fecha: ${new Date().toISOString()}`,
    `Solicitud: ${requestId}`,
    `Nombre: ${payload.name}`,
    `Organización: ${payload.organization}`,
    `Cargo: ${payload.role || 'No indicado'}`,
    `Correo: ${payload.email}`,
    `Teléfono: ${payload.phone || 'No indicado'}`,
    `Tipo de necesidad: ${payload.serviceType}${payload.serviceTypeOther ? ` (${payload.serviceTypeOther})` : ''}`,
    `Objetivo: ${payload.objective}`,
    `Situación actual: ${payload.currentSituation}`,
    `Plataforma actual: ${payload.currentPlatform || 'No indicada'}`,
    `Tipos de contenido: ${payload.contentTypes.join(', ')}`,
    `Tipos de usuarios: ${payload.userTypes.join(', ')}`,
    `Migración requerida: ${payload.migrationRequired}`,
    `Origen de migración: ${payload.migrationSource || 'No indicado'}`,
    `Registros aproximados: ${payload.approximateRecords || 'No indicado'}`,
    `Archivos aproximados: ${payload.approximateFiles || 'No indicado'}`,
    `Formatos conocidos: ${payload.knownFormats || 'No indicado'}`,
    `Etapa del proyecto: ${payload.projectStage}`,
    `Plazo objetivo: ${payload.targetTimeframe || 'No indicado'}${payload.targetDate ? ` (${payload.targetDate})` : ''}`,
    `Presupuesto estimado: ${payload.estimatedBudget || 'No indicado'}`,
    '',
    `Comentarios adicionales: ${payload.additionalComments || 'Sin comentarios'}`,
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nuevo proyecto web - ${payload.serviceType} - ${payload.organization}`,
      text,
      reply_to: payload.email,
    }),
  });

  return response.ok;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}