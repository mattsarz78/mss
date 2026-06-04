import React, { useEffect, useRef } from 'react';

const AdsByGoogle: React.FC = () => {
  const containerRef = useRef<HTMLModElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // 1. Clean up stale height states left over from prior view renders
    const adElements = document.querySelectorAll('.adsbygoogle');
    adElements.forEach((el) => {
      if (el instanceof HTMLElement) el.style.height = '';
    });

    // 2. Ensure core AdSense scripts are loaded globally
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const adsenseScript = document.createElement('script');
      adsenseScript.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0296554708545211';
      adsenseScript.async = true;
      adsenseScript.crossOrigin = 'anonymous';
      document.body.appendChild(adsenseScript);
    }

    const insElement = containerRef.current;
    if (!insElement || initialized.current) return;

    // 3. Use a ResizeObserver to wait until the DOM layout
    // calculates a real, non-zero pixel width for this slot.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        // Once the container stretches beyond 0px, it is safe to request the ad
        if (width > 0 && !initialized.current) {
          // Check if Google hasn't claimed this slot already
          if (!insElement.hasAttribute('data-adsbygoogle-status')) {
            try {
              const globalWindow = window as any;
              globalWindow.adsbygoogle = globalWindow.adsbygoogle || [];
              globalWindow.adsbygoogle.push({});
              initialized.current = true;

              // Disconnect immediately so we don't trigger duplicate pushes on window resizes
              observer.disconnect();
            } catch (err) {
              console.error('AdSense initialization block error:', err);
            }
          }
        }
      }
    });

    observer.observe(insElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ins
      ref={containerRef} // 👈 Connect the hook observer target directly to the node
      className="adsbygoogle DONTPrint"
      style={{ display: 'block', minWidth: '250px', minHeight: '90px' }} // Fallback base constraints
      data-ad-client="ca-pub-0296554708545211"
      data-ad-slot="9539391470"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdsByGoogle;
