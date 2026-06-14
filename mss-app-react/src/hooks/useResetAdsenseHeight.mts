import { useEffect, useRef } from 'react';

export const useResetAdsenseHeight = () => {
  // 1. Create a ref to attach to the DOM node
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // 2. Setup the MutationObserver just like Vue's 'created' hook
    const observer = new MutationObserver(() => {
      el.style.height = '';
      el.style.minHeight = '';
    });

    observer.observe(el, { attributes: true, attributeFilter: ['style'] });

    // 3. Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return elementRef;
};
