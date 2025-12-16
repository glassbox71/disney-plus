import { create } from 'zustand';
import type { useTvStore } from '../types/IMovie';

export const useTvStore = create<useTvStore>((set, get) => ({
  TopTv: [],

  //TODO TV 최고 TOP
  onFetchTopTV: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}language=en-US&page=1`
    );

    const data = await res.json();
    const resData = data.results;

    set({ TopTv: resData });
  },
}));
