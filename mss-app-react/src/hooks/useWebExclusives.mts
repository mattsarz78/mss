import { useMemo, useState } from 'react';

export const useWebExclusives = () => {
  const [isWebGamesHidden, setIsWebGamesHidden] = useState(false);

  const toggleWebExclusives = () => {
    setIsWebGamesHidden((prev) => !prev);
  };

  // Replicating Vue's computed property using useMemo
  const buttonText = useMemo(() => {
    return isWebGamesHidden ? 'Show Web Exclusive Games' : 'Hide Web Exclusive Games';
  }, [isWebGamesHidden]);

  return { isWebGamesHidden, toggleWebExclusives, buttonText };
};
