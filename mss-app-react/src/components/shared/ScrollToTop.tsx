import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force the document viewport back to the absolute top-left corner
    window.scrollTo(0, 0);
  }, [pathname]); // Fires instantly every single time the route path updates

  return null; // This component is purely a behavioral side-effect, rendering no HTML layout
};

export default ScrollToTop;
