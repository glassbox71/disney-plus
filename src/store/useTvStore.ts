import { create } from 'zustand';
import type { ITVStore } from '../types/ITV';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const useTvStore = create<ITVStore>((set) => ({
  UpComingTv: [],
  RatedTv: [],
  TopTV: [],
  videos: [],

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
  // TODO 시리즈 tv 영상을 불러올 메서드
  onFetchTvVideo: async (id: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    console.log(data);
    set({ videos: data.results });
    return data.results;
  },

  //TODO tv 시리즈 시즌
  seasons: [],

  // tv 시리즈 시즌
  onFetchSeasons: async (id: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    console.log('시즌', data);
    set({ seasons: data.results });
  },

  // 시즌 에피소드
  episodes: [],

  // 에피소드를 불러올 메서드
  onFetchEpisodes: async (id: string, season: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    console.log('에피소드', data.episodes);
    set({ episodes: data.results });
  },
}));
