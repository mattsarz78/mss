import AdsByGoogle from '#shared/AdsByGoogle';
import CopyrightLink from '#shared/CopyrightLink';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';

const CopyrightView: React.FC = () => {
  const title = 'Website Copyright and Usage';

  useEffect(() => {
    addMetaTags(title);
  }, []);

  return (
    <>
      <main style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        <h1>{title}</h1>

        <h2>Copyright Information</h2>
        <p>
          All content on this website is the property of Matt Sarzyniak or its content suppliers and is protected by international copyright laws.
        </p>

        <h2>Permitted Use</h2>
        <p>
          You may view and print pages from this website for personal, non-commercial use only. You may not reproduce, modify, distribute, transmit, display, perform, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from this website.
        </p>

        <h2>Third-Party Content</h2>
        <p>
          This website may contain content from third parties. All third-party content is subject to the terms and conditions of the respective platforms.
        </p>

        <h2>Trademark Information</h2>
        <p>
          All trademarks and brand names are the property of their respective owners. College and university names are used for identification purposes only.
        </p>

        <h2>Contact</h2>
        <p>
          If you have questions, please contact{' '}
          <a href="mailto:footballsked@gmail.com">footballsked@gmail.com</a>.
        </p>

        <AdsByGoogle />
      </main>
      <CopyrightLink />
    </>
  );
};

export default CopyrightView;
