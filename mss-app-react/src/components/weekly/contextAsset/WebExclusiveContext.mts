import { createContext } from 'react';

export interface WebExclusivesContextType {
  isWebGamesHidden: boolean;
  toggleWebExclusives: () => void;
  buttonText: string;
}

export const WebExclusivesContext = createContext<WebExclusivesContextType | undefined>(undefined);
