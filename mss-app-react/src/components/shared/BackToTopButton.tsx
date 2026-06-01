import React, { useState, useEffect } from 'react';

const BackToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    setShowButton(window.scrollY > 200);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <p>
      <a
        id="backToTopBtn"
        href="#"
        onClick={scrollToTop}
        style={{
          display: showButton ? 'block' : 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          opacity: showButton ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        Back to top
      </a>
    </p>
  );
};

export default BackToTopButton;
