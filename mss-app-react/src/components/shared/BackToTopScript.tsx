import React, { useEffect } from 'react';

const BackToTopScript: React.FC = () => {
  useEffect(() => {
    const scroll = () => {
      const backToTopBtn = document.getElementById('backToTopBtn');
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn?.classList.add('show');
      } else {
        backToTopBtn?.classList.remove('show');
      }
    };

    window.addEventListener('scroll', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
    };
  }, []);

  return null;
};

export default BackToTopScript;
