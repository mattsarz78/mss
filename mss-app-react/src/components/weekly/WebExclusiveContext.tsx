import React, { createContext, useContext } from 'react';
import { useWebExclusives } from '#hooks/useWebExclusives.mjs';

// Define the shape of our context to include the state AND the action
interface WebExclusivesContextType {
  isWebGamesHidden: boolean;
  toggleWebExclusives: () => void;
  buttonText: string;
}

const WebExclusivesContext = createContext<WebExclusivesContextType | undefined>(undefined);

export const WebExclusivesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pull everything out of your hook centrally
  const { isWebGamesHidden, toggleWebExclusives, buttonText } = useWebExclusives();

  return (
    <WebExclusivesContext.Provider value={{ isWebGamesHidden, toggleWebExclusives, buttonText }}>
      {children}
    </WebExclusivesContext.Provider>
  );
};

// Custom hook to tap into the context values
export const useWebExclusivesContext = () => {
  const context = useContext(WebExclusivesContext);
  if (!context) {
    throw new Error('useWebExclusivesContext must be used within a WebExclusivesProvider');
  }
  return context;
};