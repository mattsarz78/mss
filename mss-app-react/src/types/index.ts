// Common type definitions used across the application

export interface Game {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  television?: string;
  location?: string;
}

export interface Conference {
  id: string;
  name: string;
  games: Game[];
}

export interface Season {
  year: number;
  season: string;
  games: Game[];
}

export interface Team {
  id: string;
  name: string;
  conference?: string;
  logo?: string;
}
