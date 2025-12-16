import { create } from 'zustand';
import { useMovieStore } from './useMovieStore';

export const useSearchStore = create((set, get) => ({
  // 검색한 목록을 저장할 배열
  searchResults: [],
  // 입력한 검색어
  searchWord: '',
  // 선택된 장르
  selectedFilter: null,

  // 장르 관련 메서드
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  clearSelectedFilter: () => set({ selectedFilter: null }),

  // 검색 관련 메서드
  setSearchWord: (keyword) => set({ searchWord: keyword }),
  setSearchResults: (results) => set({ searchResults: results }),
  clearSearch: () =>
    set({
      searchWord: '',
      searchResults: [],
    }),

  onSearch: async (keyword) => {
    if (!keyword.trim()) {
      get().clearSearch();
      return;
    }

    set({ searchWord: keyword });

    try {
      const movieStore = useMovieStore.getState();
      const { onSearchMultiRaw, onfetchCate } = movieStore;

      // 제목으로 검색
      const movieResults = await onSearchMultiRaw(keyword);
      let allResults = [...movieResults];

      // genres가 없으면 로드 (필수)
      const genres =
        movieStore.genres.length > 0 ? movieStore.genres : await movieStore.onFetchGenres();

      // 제목 검색 결과가 없을 때만 장르 fallback
      if (allResults.length === 0) {
        const matchedGenres = genres.filter((genre) =>
          genre.name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchedGenres.length > 0) {
          const topGenres = matchedGenres.slice(0, 2);

          const genreMovieResults = await Promise.all(
            topGenres.map((genre) => onfetchCate(genre.id))
          );

          const genreMovies = genreMovieResults.flat().filter(Boolean);

          allResults = genreMovies;
        }
      }

      set({ searchResults: allResults });
    } catch (err) {
      console.error('검색 오류:', err);
      set({ searchResults: [] });
    }
  },
}));
