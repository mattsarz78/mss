// src/global.d.ts (or #/types/global.d.ts)

interface Window {
  adsbygoogle?: Record<string, unknown>[];
  twttr?: {
    widgets?: {
      load: (el?: HTMLElement) => void;
    };
  };
}
