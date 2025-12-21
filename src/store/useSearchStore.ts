import { create } from 'zustand';
import { disney } from '../api/data';
import type { LocalContentItem } from '../types/IContentTypes';

type SearchFilter =
  | {
      type: 'genre';
      genreId: number | number[];
      value: string;
    }
  | {
      type: 'country' | 'region';
      value: string | string[];
    };

interface SearchState {
  searchResults: LocalContentItem[];
  searchWord: string;
  selectedFilter: SearchFilter | null;

  setSelectedFilter: (filter: SearchFilter) => void;
  clearSelectedFilter: () => void;

  setSearchWord: (keyword: string) => void;
  clearSearch: () => void;

  onSearch: (keyword: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchResults: [],
  searchWord: '',
  selectedFilter: null,

  /* =========================
     필터 제어
  ========================= */

  setSelectedFilter: (filter) => {
    set({
      selectedFilter: filter,
      // 필터 클릭 시 input에 표시
      searchWord: typeof filter.value === 'string' ? filter.value : '',
    });

    get().onSearch(get().searchWord);
  },

  clearSelectedFilter: () => {
    set({ selectedFilter: null });
    get().onSearch(get().searchWord);
  },

  /* =========================
     검색어 제어
  ========================= */

  setSearchWord: (keyword) => set({ searchWord: keyword }),

  clearSearch: () =>
    set({
      searchWord: '',
      searchResults: [],
      selectedFilter: null,
    }),

  /* =========================
     핵심 검색 로직
  ========================= */

  onSearch: (keyword) => {
    const currentFilter = get().selectedFilter;
    set({ searchWord: keyword });

    // 검색어 + 필터 둘 다 없으면 결과 없음
    if (!keyword.trim() && !currentFilter) {
      set({ searchResults: [] });
      return;
    }

    const results = disney.filter((item) => {
      /* ---------- A. 텍스트 매칭 ---------- */

      const isMovie = item.category === 'movie';
      const title = (isMovie ? (item as any).title : (item as any).name) || '';

      const keywordLower = keyword.toLowerCase();

      const textMatch = keyword.trim()
        ? title.toLowerCase().includes(keywordLower) ||
          item.genre_title?.some((g) => g.toLowerCase().includes(keywordLower))
        : true;

      /* ---------- B. 필터 매칭 ---------- */

      let filterMatch = true;

      if (currentFilter) {
        // 나라 / 지역
        if (currentFilter.type === 'country' || currentFilter.type === 'region') {
          const itemLang = item.original_language?.toLowerCase() || '';
          const target = currentFilter.value;

          filterMatch = Array.isArray(target)
            ? target.map((v) => v.toLowerCase()).includes(itemLang)
            : itemLang === target.toLowerCase();
        }

        // 장르
        if (currentFilter.type === 'genre') {
          const target = currentFilter.genreId;
          const itemGenres = item.genre_ids || [];

          filterMatch = Array.isArray(target)
            ? target.some((id) => itemGenres.includes(id))
            : itemGenres.includes(target);
        }
      }

      return textMatch && filterMatch;
    });

    set({ searchResults: results.slice(0, 100) });
  },
}));
