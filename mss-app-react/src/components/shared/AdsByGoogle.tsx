import React, { useEffect, useRef } from 'react';
import { useResetAdsenseHeight } from '#/hooks/useResetAdsenseHeight.mjs';

const AdsenseSearchBox: React.FC = () => {
  const adInitialized = useRef(false);
  const mainRef = useResetAdsenseHeight();

  useEffect(() => {
    // 1. Replicating the "v-reset-adsense-height" directive behavior
    // Clears out any stuck heights left over by old ad runs on route switches
    const adElements = document.querySelectorAll('.adsbygoogle');
    adElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.height = '';
      }
    });

    // 2. Inject Google Custom Search Engine (CSE) script
    const cseScript = document.createElement('script');
    cseScript.src = 'https://cse.google.com/cse.js?cx=partner-pub-0296554708545211:rp92al-azpy';
    cseScript.async = true;
    document.body.appendChild(cseScript);

    // 3. Inject Google AdSense Main Library script
    const adsenseScript = document.createElement('script');
    adsenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0296554708545211';
    adsenseScript.async = true;
    adsenseScript.crossOrigin = 'anonymous';
    document.body.appendChild(adsenseScript);

    // 4. Safely push the individual Ad Slot initialization command block
    // Using a ref block guard prevents pushing multiple duplicate tracking requests on hot reloads
    if (!adInitialized.current) {
      try {
        const globalWindow = window as any;
        globalWindow.adsbygoogle = globalWindow.adsbygoogle || [];
        globalWindow.adsbygoogle.push({});
        adInitialized.current = true;
      } catch (err) {
        console.error('AdSense initialization block error:', err);
      }
    }

    // Tearing down elements when switching routes (Replicating unmounted cleanups)
    return () => {
      cseScript.remove();
      adsenseScript.remove();
    };
  }, []);

  return (
    <main ref={mainRef} className="DONTPrint">
      {/* Target anchor container for the Google CSE search bar interface */}
      <div className="gcse-search" />

      {/* Structured Google AdSense rendering ins node layout container */}
      <ins
        className="adsbygoogle DONTPrint"
        style={{ display: 'block' }} // Passed safely as a React style object
        data-ad-client="ca-pub-0296554708545211"
        data-ad-slot="9539391470"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </main>
  );
};

export default AdsenseSearchBox;
