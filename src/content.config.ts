import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('D-Consultores'),
    tags: z.array(z.string()).default([]),
    cover: z
      .object({
        src: z.string(),
        alt: z.string().min(1),
      })
      .optional(),
    draft: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    video: z
      .object({
        provider: z.enum(['youtube', 'cloudflare']),
        id: z.string(),
        title: z.string(),
        thumbnail: z.string().optional(),
      })
      .optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(1),
    shortTitle: z.string().min(1),
    description: z.string().min(1),
    order: z.number(),
    featured: z.boolean().default(false),
    icon: z.string().default('repository'),
    audiences: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    cta: z.string().default('Cuéntanos tu proyecto'),
    sourceType: z.enum(['legacy-wordpress-wxr', 'legacy-wordpress-media', 'public-official', 'internal-verified', 'new-proposal', 'needs-review']).default('new-proposal'),
    verificationStatus: z.enum(['verified', 'needs-review', 'internal-only']).default('needs-review'),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    client: z.string().min(1),
    clientDisplay: z.boolean().default(false),
    description: z.string().min(1),
    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['published', 'needs-review', 'internal-only']).default('needs-review'),
    services: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    result: z.string().optional(),
    cover: z
      .object({
        src: z.string(),
        alt: z.string().min(1),
      })
      .optional(),
    publicUrl: z.string().url().optional(),
    publicationApproved: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

export const collections = { posts, services, projects };
