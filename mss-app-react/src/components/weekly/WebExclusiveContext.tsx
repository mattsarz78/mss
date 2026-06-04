import React from 'react';
import { useWebExclusives } from '#hooks/useWebExclusives.mjs';
import { WebExclusivesContext } from './contextAsset/WebExclusiveContext.mjs';

export const WebExclusivesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isWebGamesHidden, toggleWebExclusives, buttonText } = useWebExclusives();

  return (
    <WebExclusivesContext.Provider value={{ isWebGamesHidden, toggleWebExclusives, buttonText }}>
      {children}
    </WebExclusivesContext.Provider>
  );
};