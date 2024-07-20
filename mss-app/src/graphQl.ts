import gql from 'graphql-tag';

export type SeasonContentsInput = {
  season: string;
};

export type ConferenceGamesInput = {
  season: string;
  conference: string;
};

export type TvGamesInput = {
  season: string;
  sport: string;
  week: number;
};

export type NoTvGamesInput = {
  season: string;
  week: number;
};

export type WeekInfo = {
  startDate: string;
  endDate: string;
  week: number;
  postseasonInd?: string;
};

export type ConferenceGame = {
  gameTitle?: string;
  visitingTeam: string[];
  homeTeam: string[];
  location?: string;
  time: string;
  mediaIndicator: string;
  network?: string;
  tvtype?: string;
  conference?: string;
};

export type TvGame = {
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
};

export type NoTvGame = {
  gameTitle?: string;
  visitingTeam: string;
  homeTeam: string;
  location?: string;
  conference: string;
  tvOptions: string;
  timeWithOffset: string;
  fcs?: string;
};

export const SEASON_CONTENTS = gql`
  query seasonContents($input: SeasonContentsInput) {
    seasonContents(input: $input) {
      startDate
      endDate
      week
      postseasonInd
    }
  }
`;

export const CONFERENCE_GAMES = gql`
  query conferenceGames($input: ConferenceGamesInput) {
    conferenceGames(input: $input) {
      gameTitle
      visitingTeam
      homeTeam
      location
      time
      mediaIndicator
      network
      tvtype
      conference
    }
  }
`;

export const TV_GAMES = gql`
  query tvGames($input: TvGamesInput) {
    tvGames(input: $input) {
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
