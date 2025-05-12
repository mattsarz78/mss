export interface ValidSportYear {
  season: string;
  hasPostseason: boolean;
  hasNoTVGames: boolean;
  showPPVColumn: boolean;
  conferenceListBase?: string;
  independents?: string;
}

export interface FlexScheduleLink {
  season: string;
  url: string;
}

export interface ConferenceCasing {
  id: string;
  slug: string;
  cased: string;
  lookup?: string;
}

export interface ConferenceData {
  id: string;
  data: string;
}
