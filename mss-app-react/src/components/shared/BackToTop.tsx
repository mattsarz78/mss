import { BackToTopButton, BackToTopScript } from '#shared/index.tsx';
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
