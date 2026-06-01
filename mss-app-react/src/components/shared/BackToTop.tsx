import React from 'react';
import BackToTopButton from '#shared/BackToTopButton.tsx';
import BackToTopScript from '#shared/BackToTopScript.tsx';

const BackToTop: React.FC = () => {
  return (
    <p>
      <BackToTopScript />
      <BackToTopButton />
    </p>
  );
};

export default BackToTop;
