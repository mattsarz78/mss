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
