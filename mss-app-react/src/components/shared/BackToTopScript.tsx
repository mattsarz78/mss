import React, { useEffect } from 'react';

const BackToTopScript: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const backToTopBtn = document.getElementById('backToTopBtn');

      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn?.classList.add('show');
      } else {
        backToTopBtn?.classList.remove('show');
      }
    };

    // Replicating onMounted
    window.addEventListener('scroll', handleScroll);

    // Replicating onUnmounted (Cleanup routine)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Parity matching the empty placeholder layout node
  return <div />;
};

export default BackToTopScript;
