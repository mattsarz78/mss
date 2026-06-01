export const addDontPrintClass = (): void => {
  const selectors = document.querySelectorAll<HTMLElement>(
    'ins.adsbygoogle, ' +
      'ins.adsbygoogle.adsbygoogle-noablate, ' +
      '.gsc-control-cse, ' +
      '.GoogleCreativeContainerClass, ' +
      '.GoogleActiveViewInnerContainer, ' +
      'iframe[id^="aswift"], ' +
      '[class$="side-rail-dismiss-btn"], ' +
      '[class$="side-rail-edge"]'
  );

  Array.from(selectors).forEach((selector) => {
    selector.classList.add('DONTPrint');
  });

  // Also target parent containers
  document.querySelectorAll('[data-ad-client]').forEach((el) => {
    el.classList.add('DONTPrint');
  });
};

let mutationObserver: MutationObserver | undefined;

export const setupPrintListener = (): void => {
  // Initial check
  addDontPrintClass();

  // Add listener for print event
  window.addEventListener('beforeprint', addDontPrintClass);

  // Add mutation observer for dynamically loaded ads
  mutationObserver = new MutationObserver(addDontPrintClass);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
};

export const cleanupPrintListener = (): void => {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = undefined;
  }
  window.removeEventListener('beforeprint', addDontPrintClass);
};
