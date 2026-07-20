# D-Consultores

Sitio corporativo Astro segun `SPEC.md`.

## Comandos

```bash
pnpm dev
pnpm build
pnpm preview
pnpm post:nuevo
```

## Variables

```text
PUBLIC_SITE_URL
PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
GOOGLE_BOOKING_URL
```

Sitio genera HTML estatico. Solo `/api/contacto` usa ejecucion server-side para Cloudflare Pages Functions.
