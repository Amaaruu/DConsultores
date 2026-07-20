import { site } from '../data/site';

export type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
};

export function absoluteUrl(path = '/') {
  return new URL(path, site.url).toString();
}

export function pageTitle(title: string) {
  return title === site.name ? title : `${title} | ${site.name}`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url: site.url,
    email: site.email,
    areaServed: 'CL',
    description: site.description,
  };
}
