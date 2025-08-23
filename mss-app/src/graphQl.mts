import { gql } from '@apollo/client/core';
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

export interface SeasonDataInput {
  season: string;
}

export interface SeasonContentsData {
  conferenceListBase?: string;
  hasPostseason: boolean;
  flexScheduleLink?: string;
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
  flexScheduleLink?: string;
  showPPVColumn: boolean;
  hasNoTVGames: boolean;
  tvGames: TvGame[];
}

export interface ConferenceGameData {
  conferenceGames: ConferenceGame[];
  conferences: string[];
  contractYearData: ContractData[];
}

export interface ContractData {
  conference: string;
  contractText: string;
}

export interface SeasonData {
  flexScheduleLink?: string;
}

export const SEASON_CONTENTS = gql`
  query seasonContents($input: SeasonContentsInput) {
    seasonContents(input: $input) {
      conferenceListBase
      hasPostseason
      flexScheduleLink
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
      contractYearData {
        conference
        contractText
      }
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
      flexScheduleLink
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

export const SEASON_DATA = gql`
  query seasonData($input: SeasonDataInput) {
    seasonData(input: $input) {
      flexScheduleLink
    }
  }
`;
