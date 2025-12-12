import { create } from 'zustand';
import type { Movie, MovieState } from '../types/IContent';
const APT_KEY = import.meta.env.VITE_TMDB_API_KEY;

//TODO 영화를 가지고 오는 메서드
export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  genres: [],
  category: {},
  theme: [],
  // trailer: [],

  //TODO 장르
  onFetchGenres: async () => {
    const resGen = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${APT_KEY}&language=ko`
    );
    const dataGen = await resGen.json();
    set({ genres: dataGen.genres });
    return dataGen.genres;
  },

  //TODO 장르 맵
  getGenreMap: async () => {
    let currentGenres = get().genres;
    if (currentGenres.length === 0) {
      currentGenres = await get().onFetchGenres();
    }

    const genreMap = currentGenres.reduce((v, i) => {
      v[i.id] = i.name;
      return v;
    }, {} as Record<number, string>);

    return genreMap;
  },

  //TODO 곧 개봉될 영화
  onFetchUpcoming: async () => {
    const genreMap = await get().getGenreMap();

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${APT_KEY}&language=en-US&page=1`
    );
    const data = await res.json();

    //TODO 로고
    const ExtraInfo = await Promise.all(
      data.results.map(async (movie: Movie) => {
        const resLogo = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${APT_KEY}`
        );
        const dataLogo = await resLogo.json();
        const logo = dataLogo.logos?.[0]?.file_path || 'none';
        // console.log(dataLogo, '로고 확인');
        // console.log(logo, '로고 재확인');

        const genreNames = (movie.genre_ids || [])
          .map((id) => genreMap[id])
          .filter((name): name is string => !!name);

        return {
          ...movie,
          logo,
          genreNames,
        };
      })
    );

    set({ movies: ExtraInfo as Movie[] });
    return data.results;
  },

  //TODO 카테고리별 영화
  onfetchCate: async (genreId) => {
    const genreMap = await get().getGenreMap();
    if (get().category[genreId]?.length > 0) return;
    console.log('장르 확인', genreMap);

    const resCate = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${APT_KEY}&language=ko&with_genres=${genreId}`
    );
    const dataCate = await resCate.json();
    const genreMov = dataCate.results;
    // genreMov는 한글 장르명이 안들어간 단순 장르
    // console.log('봅시다', genreMov);

    const krGenreMov = genreMov.map((mov: Movie) => {
      const genreNames = (mov.genre_ids || [])
        .map((id: number) => genreMap[id])
        .filter((name: string): name is string => !!name);
      return { ...mov, genreNames };
    });
    // console.log('확인', krGenreMov);
    set((state) => ({
      category: {
        ...state.category,
        [genreId]: krGenreMov,
      },
    }));
    return krGenreMov;
  },

  onfetchTheme: async (companyId: string) => {
    const genreMap = await get().getGenreMap();

    const resTv = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${APT_KEY}&language=ko-KR&with_watch_providers=${companyId}&watch_region=KR`
    );
    const resMovie = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${APT_KEY}&language=ko-KR&with_companies=${companyId}&watch_region=KR`
    );

    const dataTv = await resTv.json();
    const dataMovie = await resMovie.json();

    const krResTv = dataTv.results.map((mov: Movie) => {
      const genreNames = (mov.genre_ids || [])
        .map((id: number) => genreMap[id])
        .filter((el: string): el is string => !!el);
      return { ...mov, genreNames };
    });

    const krResMovie = dataMovie.results.map((mov: Movie) => {
      const genreNames = (mov.genre_ids || [])
        .map((id: number) => genreMap[id])
        .filter((el: string): el is string => !!el);
      return { ...mov, genreNames };
    });

    const krThemeMov = [...krResTv, ...krResMovie];

    set({ theme: krThemeMov });
    return krThemeMov;
  },
}));
