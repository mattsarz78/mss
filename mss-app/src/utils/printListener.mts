export const addDontPrintClass = (): void => {
  const selectors = document.querySelectorAll<HTMLElement>(
    'ins.adsbygoogle,ins.adsbygoogle.adsbygoogle-noablate,.gsc-control-cse,.GoogleCreativeContainerClass,.GoogleActiveViewInnerContainer'
  );
  Array.from(selectors).forEach((selector) => {
    selector.classList.add('DONTPrint');
  });
};

export const setupPrintListener = (): void => {
  window.addEventListener('beforeprint', addDontPrintClass);
};
