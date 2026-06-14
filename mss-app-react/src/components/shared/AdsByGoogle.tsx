import { useResetAdsenseHeight } from '#hooks/index.mjs';
import React, { useEffect, useRef } from 'react';

const AdsByGoogle: React.FC = () => {
  // 1. Explicitly type the ref to HTMLModElement to satisfy the exact properties of the <ins> tag
  const mainRef = useResetAdsenseHeight();
  const insRef = useRef<HTMLModElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // 1. Function to force Google to scan the DOM for the search div
    const initializeGcse = () => {
      if (window.google?.search?.cse?.element) {
        window.google.search.cse.element.go();
      }
    };
    // 2. Load Google Custom Search Engine script if not present
    if (!document.querySelector('script[src*="cse.js"]')) {
      const cseScript = document.createElement('script');
      cseScript.src = 'https://cse.google.com/cse.js?cx=partner-pub-0296554708545211:rp92al-azpy';
      cseScript.async = true;
      // 🚀 Force initialization the exact moment the script finishes downloading
      cseScript.onload = initializeGcse;
      document.body.appendChild(cseScript);
    } else {
      // 🚀 If the script was already downloaded on a previous page view, force a re-scan now
      initializeGcse();
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
              window.adsbygoogle = window.adsbygoogle || [];
              window.adsbygoogle.push({});
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
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0296554708545211"
        data-ad-slot="9539391470"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </main>
  );
};

export default AdsByGoogle;
