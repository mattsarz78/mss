import { useContext } from 'react';
import { WebExclusivesContext } from '../components/weekly/contextAsset/WebExclusiveContext.mjs';

export const useWebExclusivesContext = () => {
  const context = useContext(WebExclusivesContext);
  if (!context) {
    throw new Error('useWebExclusivesContext must be used within a WebExclusivesProvider');
  }
  return context;
};
