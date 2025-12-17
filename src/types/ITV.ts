export interface TV {
  adult: boolean;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: [];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ITVStore {
  UpComingTv: TV[];
  RatedTv: TV[];
  TopTV: TV[];
  playID: TV[];
  onFetchNewTV: () => Promise<void>;
  onFetchRated: () => Promise<void>;
  onFetchTopTV: () => Promise<void>;
  onFetchID: (id: number, type: string) => Promise<TV[] | void>;
}
