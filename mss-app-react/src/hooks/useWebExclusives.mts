import { useMemo, useState } from 'react';

export const useWebExclusives = () => {
  const [isWebGamesHidden, setIsWebGamesHidden] = useState(false);

  const toggleWebExclusives = () => {
    setIsWebGamesHidden((prev) => {
      const newState = !prev;
      const webGames = document.getElementsByClassName('webGame') as HTMLCollectionOf<HTMLElement>;

      Array.from(webGames).forEach((webgame) => {
        webgame.style.display = newState ? 'none' : '';
      });

      return newState;
    });
  };

  const buttonText = useMemo(
    () => (isWebGamesHidden ? 'Show Web Exclusive Games' : 'Hide Web Exclusive Games'),
    [isWebGamesHidden]
  );

  return { isWebGamesHidden, toggleWebExclusives, buttonText };
};
