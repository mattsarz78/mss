// src/global.d.ts (or #/types/global.d.ts)

interface Window {
  google?: { search?: { cse?: { element?: { go: () => void } } } };
  adsbygoogle?: Record<string, unknown>[];
  twttr?: { widgets?: { load: (el?: HTMLElement) => void } };
}
