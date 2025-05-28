import gql from 'graphql-tag';

export interface SeasonContentsInput {
  season: string;
}

export interface ConferenceGamesInput {
  season: string;
  conference: string;
}

export interface TvGamesInput {
  season: string;
  sport: string;
  week: number;
}

export interface NoTvGamesInput {
  season: string;
  week: number;
}

export interface SeasonContentsData {
  conferenceListBase?: string;
  hasPostseason: boolean;
  seasonContents: WeekInfo[];
}
export interface WeekInfo {
  startDate: string;
  endDate: string;
  week: number;
  postseasonInd?: string;
}

export interface ConferenceGame {
  gameTitle?: string;
  visitingTeam: string[];
  homeTeam: string[];
  location?: string;
  timeWithOffset: string;
  mediaIndicator: string;
  network?: string;
  tvtype?: string;
  conference?: string;
}

export interface TvGame {
  season: string;
  gameTitle?: string;
  visitingTeam?: string[];
  homeTeam?: string[];
  location?: string;
  network?: string;
  networkJpg?: string;
  coverageNotes?: string;
  ppv?: string;
  mediaIndicator: string;
  timeWithOffset?: string;
}

export interface NoTvGame {
  gameTitle?: string;
  visitingTeam: string;
  homeTeam: string;
  location?: string;
  conference: string;
  tvOptions: string;
  timeWithOffset: string;
  fcs?: string;
}

export interface TvGameData {
  showPPVColumn: boolean;
  hasNoTVGames: boolean;
  tvGames: TvGame[];
}

export interface ConferenceGameData {
  conferenceGames: ConferenceGame[];
  conferences: string[];
}

export const SEASON_CONTENTS = gql`
  query seasonContents($input: SeasonContentsInput) {
    seasonContents(input: $input) {
      conferenceListBase
      hasPostseason
      seasonContents {
        startDate
        endDate
        week
        postseasonInd
      }
    }
  }
`;

export const CONFERENCE_GAMES = gql`
  query conferenceGames($input: ConferenceGamesInput) {
    conferenceGames(input: $input) {
      conferences
      conferenceGames {
        gameTitle
        visitingTeam
        homeTeam
        location
        timeWithOffset
        mediaIndicator
        network
        tvtype
        conference
      }
    }
  }
`;

export const TV_GAMES = gql`
  query tvGames($input: TvGamesInput) {
    tvGames(input: $input) {
      showPPVColumn
      hasNoTVGames
      tvGames {
        season
        gameTitle
        visitingTeam
        homeTeam
        location
        network
        networkJpg
        coverageNotes
        ppv
        mediaIndicator
        timeWithOffset
      }
    }
  }
`;

export const DAILY_TV_GAMES = gql`
  query dailyTvGames($input: DailyTvGamesInput) {
    dailyTvGames(input: $input) {
      showPPVColumn
      hasNoTVGames
      tvGames {
        season
        gameTitle
        visitingTeam
        homeTeam
        location
        network
        networkJpg
        coverageNotes
        ppv
        mediaIndicator
        timeWithOffset
      }
    }
  }
`;

export const NO_TV_GAMES = gql`
  query noTvGames($input: NoTvGamesInput) {
    noTvGames(input: $input) {
      gameTitle
      visitingTeam
      homeTeam
      location
      conference
      tvOptions
      timeWithOffset
      fcs
    }
  }
`;
