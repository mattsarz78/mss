import React, { useEffect } from 'react';

const AdsByGoogle: React.FC = () => {
  useEffect(() => {
    // Trigger adsbygoogle script if available
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className="DONTPrint">
      <script
        async
        src="https://cse.google.com/cse.js?cx=partner-pub-0296554708545211:rp92al-azpy"
      ></script>
      <div className="gcse-search" />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0296554708545211"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle DONTPrint"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0296554708545211"
        data-ad-slot="9539391470"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdsByGoogle;
