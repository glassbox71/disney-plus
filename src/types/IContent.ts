export interface MediaBase {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  adult: boolean;
  genre_ids: number[];
}

//TODO  Movie
// title이 movie랑 tv 네임이 다름
export interface Movie extends MediaBase {
  title: string;
  logo: string;
  genreNames: string[];
}

export interface Genre {
  id: number;
  name: string;
}
export interface Theme extends MediaBase {
  title: string;
  name: string;
}

//TODO 시즌 타입
export interface SeasonData {
  title: string;
  keywordId?: string;
  genreId?: string;
  startDate: string;
  endDate: string;
  type: 'keyword' | 'genre' | 'mixed';
}

export interface MovieState {
  movies: Movie[];
  genres: Genre[];
  category: Record<string, Movie[]>;
  theme: Theme[];
  onFetchUpcoming: () => Promise<void>;
  onFetchGenres: () => Promise<void>;
  onfetchSeason: () => Promise<void>;
  getGenreMap: () => Promise<Record<number, string>>;
  onfetchTheme: (companyId: string) => Promise<Theme[] | void>;
  onfetchCate: (genreId: string) => Promise<Movie[] | void>;
}
