export const addDontPrintClass = (): void => {
  const selectors = document.querySelectorAll<HTMLElement>(
    'ins.adsbygoogle, ' +
      'ins.adsbygoogle.adsbygoogle-noablate, ' +
      '.gsc-control-cse, ' +
      '.GoogleCreativeContainerClass, ' +
      '.GoogleActiveViewInnerContainer, ' +
      'iframe[id^="aswift"]' // Add any iframe that starts with google_ads
  );

  Array.from(selectors).forEach((selector) => {
    selector.classList.add('DONTPrint');
  });

  // Also target parent containers
  document.querySelectorAll('[data-ad-client]').forEach((el) => {
    el.classList.add('DONTPrint');
  });
};

export const setupPrintListener = (): void => {
  // Initial check
  addDontPrintClass();

  // Add listener for print event
  window.addEventListener('beforeprint', addDontPrintClass);

  // Add mutation observer for dynamically loaded ads
  const observer = new MutationObserver(addDontPrintClass);
  observer.observe(document.body, { childList: true, subtree: true });
};
