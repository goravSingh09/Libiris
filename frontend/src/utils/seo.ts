/**
 * Pure lightweight utility for client-side dynamic SEO and Schema.org JSON-LD updates.
 * Shree Bala Ji Adhyayan Kendra Library Management System (SBLMS)
 */

export interface SEOData {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'SBLMS — Shree Bala Ji Adhyayan Kendra Library';
const DEFAULT_DESCRIPTION =
  'Shree Bala Ji Adhyayan Kendra Library Management System (SBLMS) — Dedicated reading rooms, ergonomic seats, air-conditioned study environment, and student portal in Nagaur, Rajasthan.';
const BASE_URL = 'https://sblms.vercel.app';

export function updateSEO(data: SEOData = {}): void {
  const title = data.title || DEFAULT_TITLE;
  const description = data.description || DEFAULT_DESCRIPTION;
  const canonicalUrl = data.canonicalUrl || `${BASE_URL}/`;
  const ogType = data.ogType || 'website';

  // 1. Page Title
  document.title = title;

  // 2. Meta Description
  setMetaTag('name', 'description', description);

  // 3. Canonical URL
  setCanonical(canonicalUrl);

  // 4. Open Graph Tags
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:site_name', 'Shree Bala Ji Adhyayan Kendra Library');

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  // 6. Dynamic JSON-LD Structured Data
  if (data.jsonLd) {
    setJsonLd(data.jsonLd);
  } else {
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Library',
      name: 'Shree Bala Ji Adhyayan Kendra Library',
      description: DEFAULT_DESCRIPTION,
      url: BASE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Opp. Mali Samaj, Hari Om Market, Didwana Road',
        addressLocality: 'Nagaur',
        addressRegion: 'Rajasthan',
        postalCode: '341001',
        addressCountry: 'IN'
      },
      telephone: '+91 9413402116',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
          ],
          opens: '05:00',
          closes: '22:00'
        }
      ]
    });
  }
}

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  if (attributeValue === 'google-site-verification') return;

  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(schemaData: Record<string, unknown> | Array<Record<string, unknown>>): void {
  let script = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamic-seo-schema';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaData);
}
