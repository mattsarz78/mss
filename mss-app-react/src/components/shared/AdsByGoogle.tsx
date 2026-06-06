import { useResetAdsenseHeight } from '#/hooks/useResetAdsenseHeight.mjs';
import React, { useEffect, useRef } from 'react';

const AdsByGoogle: React.FC = () => {
  // 1. Explicitly type the ref to HTMLModElement to satisfy the exact properties of the <ins> tag
  const mainRef = useResetAdsenseHeight();
  const insRef = useRef<HTMLModElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // 2. Load Google Custom Search Engine script if not present
    if (!document.querySelector('script[src*="cse.js"]')) {
      const cseScript = document.createElement('script');
      cseScript.src = 'https://cse.google.com/cse.js?cx=partner-pub-0296554708545211:rp92al-azpy';
      cseScript.async = true;
      document.body.appendChild(cseScript);
    }

    // 3. Ensure core AdSense scripts are loaded globally
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const adsenseScript = document.createElement('script');
      adsenseScript.src =
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0296554708545211';
      adsenseScript.async = true;
      adsenseScript.crossOrigin = 'anonymous';
      document.body.appendChild(adsenseScript);
    }

    const insElement = insRef.current;
    if (!insElement || initialized.current) return;

    // 4. Use a ResizeObserver to wait until the DOM layout calculates a non-zero pixel width
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        if (width > 0 && !initialized.current) {
          if (!insElement.hasAttribute('data-adsbygoogle-status')) {
            try {
              const globalWindow = window as any;
              globalWindow.adsbygoogle = globalWindow.adsbygoogle || [];
              globalWindow.adsbygoogle.push({});
              initialized.current = true;
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
    // Outer wrapper div matches the structural layout of the legacy Vue code
    <main ref={mainRef} className="DONTPrint">
      {/* Google Custom Search Engine Entry Node */}
      <div className="gcse-search" />

      {/* Google AdSense Unit Slot */}
      <ins
        ref={insRef}
        className="adsbygoogle DONTPrint"
        style={{ display: 'block', minWidth: '250px', minHeight: '90px' }}
        data-ad-client="ca-pub-0296554708545211"
        data-ad-slot="9539391470"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </main>
  );
};

export default AdsByGoogle;
