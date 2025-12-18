import { create } from "zustand";
import type { Movie } from "../types/IMovie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const LIONKING_IDS = [8587, 9732, 11430, 420818];

interface KidsMovieProps {
    kidsThemeMoive: Movie[];
    fetchCollctionMovie: () => Promise<void>;
    fetchLion: () => Promise<void>;
}

export const useKidsMoiveStore = create<KidsMovieProps>((set) => ({

    kidsThemeMoive: [],


    fetchCollctionMovie: async () => {
        // const res = await fetch(`https://api.themoviedb.org/3/collection/137681?api_key=${API_KEY}&language=ko-KR`);
        const res = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=mickey&with_genres=16&language=ko-KR`);
        // const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=12&language=ko-KR`);

        const data = await res.json();
        // console.log("컬렉션", data.parts);
        console.log("공주 컬렉션", data.results)

        const animationOnly = (data.results ?? []).filter((item: Movie) =>
            Array.isArray(item.genre_ids) && item.genre_ids.includes(16)
        );
        // const res = await fetch(
        //     `https://api.themoviedb.org/3/search/keyword?api_key=${API_KEY}&query=Mickey%20Mouse`
        // );
        // const data = await res.json();
        // console.log("키워드 검색 결과:", data.results);
        set({ kidsThemeMoive: animationOnly })
    },

    fetchLion: async () => {
        const results = await Promise.all(
            LIONKING_IDS.map(async (id) => {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`);
                return res.json();
            })
        );
        console.log("라이온킹", results);
    }


}))