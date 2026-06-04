import React from 'react';
import { Link } from 'react-router-dom';

const CopyrightLink: React.FC = () => (
  <div className="DONTPrint">
    <p>
      <Link to="/copyright">Website Copyright</Link>
    </p>
  </div>
);

export default CopyrightLink;
