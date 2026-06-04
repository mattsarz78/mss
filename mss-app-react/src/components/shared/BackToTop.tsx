import BackToTopButton from '#shared/BackToTopButton.tsx';
import BackToTopScript from '#shared/BackToTopScript.tsx';
import React from 'react';

const BackToTop: React.FC = () => {
  return (
    <>
      <BackToTopScript />
      <BackToTopButton />
    </>
  );
};

export default BackToTop;
