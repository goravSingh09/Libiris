/**
 * Pure lightweight utility for client-side dynamic SEO and Schema.org JSON-LD updates.
 * Zero external libraries, zero overhead.
 */

export interface SEOData {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'book';
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'Libiris - Online Digital Library';
const DEFAULT_DESCRIPTION =
  'Libiris is an online digital library where readers can discover, explore, and manage books in one place.';
const BASE_URL = 'https://libiris-digital.vercel.app';

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
  setMetaTag('property', 'og:site_name', 'Libiris');

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);

  // 6. Dynamic JSON-LD Structured Data
  if (data.jsonLd) {
    setJsonLd(data.jsonLd);
  } else {
    // Reset to default WebSite + DigitalDocumentLibrary JSON-LD
    setJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          url: `${BASE_URL}/`,
          name: 'Libiris',
          description: DEFAULT_DESCRIPTION,
          inLanguage: 'en-US',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'DigitalDocumentLibrary',
          '@id': `${BASE_URL}/#library`,
          name: 'Libiris',
          url: `${BASE_URL}/`,
          description: DEFAULT_DESCRIPTION,
        },
      ],
    });
  }
}

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  // Never modify google-site-verification
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
