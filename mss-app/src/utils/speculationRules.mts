import type { RouteLocationNormalized } from 'vue-router';

interface SpeculationRule {
  action: 'preload' | 'prefetch' | 'prerender';
  url: string;
  as?: 'document' | 'script' | 'style' | 'image' | 'fetch' | 'font' | 'worker';
  importance?: 'auto' | 'high' | 'low';
  type?: string;
  referrerPolicy?: string;
  headers?: Record<string, string>;
}

const isSpeculationSupported = (): boolean => typeof document !== 'undefined' && 'speculationRules' in document;

const setSpeculationRules = (rules: SpeculationRule[]): void => {
  if (!isSpeculationSupported()) return;

  const doc = document as unknown as { speculationRules?: SpeculationRule[] };
  doc.speculationRules = [];
  doc.speculationRules = rules;
};

const buildRule = (url: string, action: SpeculationRule['action'], as?: SpeculationRule['as']): SpeculationRule => ({
  action,
  url,
  ...(as ? { as } : {})
});

export const updateSpeculationForRoute = (route: RouteLocationNormalized): void => {
  if (!isSpeculationSupported()) return;

  const candidates: SpeculationRule[] = [];

  // Example: when viewing schedule, prefetch text version and next week link.
  if (route.name === 'Weekly' || route.name === 'Weekly Text') {
    const sport = route.params.sport;
    const year = route.params.year;
    const week = Number(route.params.week);

    if (sport && year && Number.isFinite(week)) {
      const base = `/schedule/${sport}/${year}/${week}`;
      candidates.push(buildRule(`${base}/text`, 'prefetch', 'document'));

      const nextWeek = week + 1;
      candidates.push(buildRule(`/schedule/${sport}/${year}/${nextWeek}`, 'prefetch', 'document'));
    }
  }

  // Example: when on home, prefetch an entry route.
  if (route.name === 'home') {
    candidates.push(buildRule('/season/football/2026', 'prefetch', 'document'));
    candidates.push(buildRule('/tv-windows/2026', 'prefetch', 'document'));
  }

  // Example: when on season page, prefetch conference list and daily schedule.
  if (route.path.startsWith('/season/')) {
    const [, , sport, year] = route.path.split('/');
    if (sport && year) {
      candidates.push(buildRule(`/schedule/${sport}/${year}/1`, 'prefetch', 'document'));
      candidates.push(buildRule(`/contract/${sport}/${year}`, 'prefetch', 'document'));
    }
  }

  // Avoid too many speculation rules.
  setSpeculationRules(candidates.slice(0, 6));
};

export const clearSpeculationRules = (): void => {
  if (!isSpeculationSupported()) return;
  const doc = document as unknown as { speculationRules?: SpeculationRule[] };
  doc.speculationRules = [];
};
