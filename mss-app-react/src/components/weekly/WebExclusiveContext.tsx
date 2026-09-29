import { useWebExclusives } from '#hooks/index.mjs';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { WebExclusivesContext } from './contextAsset/WebExclusiveContext.mjs';

const WebExclusivesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return <WebExclusivesProviderState key={location.pathname}>{children}</WebExclusivesProviderState>;
};

const WebExclusivesProviderState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isWebGamesHidden, toggleWebExclusives, buttonText } = useWebExclusives();

  return (
    <WebExclusivesContext.Provider value={{ isWebGamesHidden, toggleWebExclusives, buttonText }}>
      {children}
    </WebExclusivesContext.Provider>
  );
};

export default WebExclusivesProvider;
