/**
 * Add or update meta tags for the current page.
 * Uses native DOM manipulation instead of external library.
 */
export const addMetaTags = (title: string) => {
  // Update document title
  document.title = title;

  // Helper to get or create meta tag
  const getOrCreateMeta = (name: string, property?: boolean): HTMLMetaElement => {
    const attr = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    return meta;
  };

  // Update meta tags
  getOrCreateMeta('twitter:title').content = title;
  getOrCreateMeta('twitter:text:title').content = title;
  getOrCreateMeta('og:title', true).content = title;
  getOrCreateMeta('og:url', true).content = window.location.href;

  // Update or create JSON-LD script tag
  let jsonLdScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }
  jsonLdScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: window.location.href
  });
};
