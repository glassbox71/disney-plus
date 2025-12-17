import { create } from 'zustand';
import type { ITVStore } from '../types/ITV';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useTvStore = create<ITVStore>((set, get) => ({
  UpComingTv: [],
  RatedTv: [],
  TopTV: [],
  playID: [],

  //TODO TV 공개 예정
  onFetchNewTV: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();
    const resData = data.results;
    set({ UpComingTv: resData });
  },

  //TODO 최고 평점
  onFetchRated: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const data = await res.json();
    const resData = data.results;
    set({ RatedTv: resData });
  },

  //TODO 인기 시리즈
  onFetchTopTV: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = await res.json();
    const resData = data.results;
    set({ TopTV: resData });
  },

  //TODO ID  검색
  onFetchID: async (id, type) => {
    if (get().playID[id]) return;
  },
}));
