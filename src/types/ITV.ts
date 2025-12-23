// 기본 공통 타입
export interface Genre {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  logo_path?: string;
  origin_country?: string;
}

export interface ProductionCompany extends Company {
  logo_path: string | null;
  origin_country: string;
}

// TV 시리즈 시즌
export interface Season {
  id: number;
  name: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
  overview: string;
  season_number: number;
}

// 영화 컬렉션
export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

// 컬렉션 내 영화 목록
export interface CollectionMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

// 비디오 (예고편 등)
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

// 영화 상세 정보
export interface MovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: BelongsToCollection | null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// TV 시리즈 상세 정보
export interface TVDetail {
  adult: boolean;
  backdrop_path: string | null;
  created_by: { id: number; name: string; profile_path: string | null }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  networks: Company[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: { iso_3166_1: string; name: string }[];
  seasons: Season[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

// 영화와 TV를 모두 지원하는 통합 타입
export type MediaDetail = MovieDetail | TVDetail;

// 리스트용 간단한 TV 타입
export interface TV {
  adult: boolean;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

// 리스트용 간단한 영화 타입
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// 시청 중인 콘텐츠
export interface WatchingItem {
  id: number;
  poster_path: string;
  backdrop_path: string;
  currentTime: number;
  duration: number;
  title: string;
}

// 찜 목록 아이템
export interface WishItem {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title: string;
}

// 스토어 타입
export interface ITVStore {
  UpComingTv: TV[];
  RatedTv: TV[];
  TopTV: TV[];
  videos: [];
  episodes: [];
  seasons: [];
  onFetchNewTV: () => Promise<void>;
  onFetchRated: () => Promise<void>;
  onFetchTopTV: () => Promise<void>;
  onFetchTvVideo: (id: string) => Promise<void[]>;
}

// 타입 가드 함수들
export function isMovieDetail(media: MediaDetail): media is MovieDetail {
  return 'title' in media && 'release_date' in media;
}

export function isTVDetail(media: MediaDetail): media is TVDetail {
  return 'name' in media && 'first_air_date' in media;
}

export interface ReleaseDate {
  certification: string;
  release_date: string;
  type: number;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface ContentRatingResult {
  iso_3166_1: string;
  rating: string;
}

export interface CollectionResponse {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: CollectionMovie[];
}

// types/ITV.ts 에 추가 권장
export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  runtime: number | null;
}
