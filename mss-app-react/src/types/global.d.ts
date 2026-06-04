// src/global.d.ts (or #/types/global.d.ts)

interface Window {
  twttr?: {
    widgets?: {
      load: (el?: HTMLElement) => void;
    };
  };
}