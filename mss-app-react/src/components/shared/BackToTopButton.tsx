import React, { useState, useEffect } from 'react';
// 1. Import the styles object from the module
import styles from './BackToTopButton.module.css'; 

const BackToTopButton: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Safely stitch classes together using string interpolation
  const buttonClass = `${styles.backToTopBtn} ${showButton ? styles.show : ''}`;

  return (
    <a
      href="#"
      className={buttonClass} // 👈 Evaluates to something unique like "_backToTopBtn_x1y2z _show_x1y2z"
      onClick={scrollToTop}
    >
      Back to top
    </a>
  );
};

export default BackToTopButton;