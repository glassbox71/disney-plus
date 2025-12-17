// TODO ============================================
import { create } from 'zustand';
import { useMovieStore } from './useMovieStore';

// ==============================
// 디즈니 관련 ID 정의
// ==============================
const DISNEY_COMPANY_IDS = [2, 3, 420, 7505, 13252, 3166]; // 제작사
const DISNEY_NETWORK_IDS = [2739, 210024, 453, 88, 34]; // 네트워크

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// ==============================
// OR 조건 필터링 함수
// ==============================
const matchesFilter = (detail: any, selectedGenreId: number | null, keyword: string) => {
  const byCompany = (detail.production_companies || []).some((c: any) =>
    DISNEY_COMPANY_IDS.includes(c.id)
  );
  const byNetwork = (detail.networks || []).some((n: any) => DISNEY_NETWORK_IDS.includes(n.id));
  const byGenre =
    selectedGenreId != null &&
    (detail.genres?.map((g: any) => g.id) || []).includes(selectedGenreId);
  const byKeyword = (detail.title?.toLowerCase() || detail.name?.toLowerCase() || '').includes(
    keyword.toLowerCase()
  );

  return byCompany || byNetwork || byGenre || byKeyword;
};

// ==============================
// Search Store
// ==============================
export const useSearchStore = create<any>((set, get) => ({
  // 상태
  searchResults: [],
  searchWord: '',
  selectedFilter: null,
  selectedGenreId: null,

  // ==========================
  // 장르 관련
  // ==========================
  setSelectedFilter: (filter: number) => {
    console.log('🎯 선택된 장르 ID:', filter);
    set({ selectedFilter: filter, selectedGenreId: filter });
  },
  clearSelectedFilter: () => set({ selectedFilter: null, selectedGenreId: null }),

  // ==========================
  // 검색 상태
  // ==========================
  setSearchWord: (keyword: string) => set({ searchWord: keyword }),
  setSearchResults: (results: any[]) => set({ searchResults: results }),
  clearSearch: () => set({ searchWord: '', searchResults: [] }),

  // ==========================
  // 메인 검색 로직
  // ==========================
  onSearch: async (keyword: string) => {
    console.log('🔍 검색 시작:', keyword);

    if (!keyword.trim()) {
      get().clearSearch();
      return;
    }

    set({ searchWord: keyword });

    try {
      const movieStore = useMovieStore.getState();
      const genres =
        movieStore.genres.length > 0 ? movieStore.genres : await movieStore.onFetchGenres();

      const genreMap = genres.reduce((acc: any, cur: any) => {
        acc[cur.id] = cur.name;
        return acc;
      }, {});

      const normalize = (item: any, type: 'movie' | 'tv') => ({
        ...item,
        media_type: type,
        title: item.title || item.name,
        genreNames: (item.genre_ids || []).map((id: number) => genreMap[id]).filter(Boolean),
      });

      // 1. 제목 검색
      const [movieSearchRes, tvSearchRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(
            keyword
          )}`
        ),
        fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(
            keyword
          )}`
        ),
      ]);

      const movieSearchData = await movieSearchRes.json();
      const tvSearchData = await tvSearchRes.json();

      // 2. 상세 조회 및 OR 조건 필터링
      const disneyMovies = (
        await Promise.all(
          (movieSearchData.results || []).slice(0, 20).map(async (movie: any) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=ko-KR`
              );
              const detail = await res.json();

              if (!matchesFilter(detail, get().selectedGenreId, keyword)) return null;

              return {
                ...movie,
                genre_ids: detail.genres?.map((g: any) => g.id) || movie.genre_ids,
                poster_path: movie.poster_path || detail.poster_path,
              };
            } catch {
              return null;
            }
          })
        )
      ).filter(Boolean);

      const disneyTVs = (
        await Promise.all(
          (tvSearchData.results || []).slice(0, 20).map(async (tv: any) => {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${API_KEY}&language=ko-KR`
              );
              const detail = await res.json();

              if (!matchesFilter(detail, get().selectedGenreId, keyword)) return null;

              return {
                ...tv,
                genre_ids: detail.genres?.map((g: any) => g.id) || tv.genre_ids,
                poster_path: tv.poster_path || detail.poster_path,
              };
            } catch {
              return null;
            }
          })
        )
      ).filter(Boolean);

      let allResults = [
        ...disneyMovies.map((m) => normalize(m, 'movie')),
        ...disneyTVs.map((t) => normalize(t, 'tv')),
      ];

      // 3. 제목 결과 없으면 장르 fallback
      if (allResults.length === 0) {
        const matchedGenres = genres.filter((genre: any) =>
          genre.name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchedGenres.length > 0) {
          const genreIds = matchedGenres
            .slice(0, 2)
            .map((g: any) => g.id)
            .join(',');
          const companyIds = DISNEY_COMPANY_IDS.join('|');
          const networkIds = DISNEY_NETWORK_IDS.join('|');

          const [genreMovieRes, genreTVRes] = await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_companies=${companyIds}&with_genres=${genreIds}&sort_by=popularity.desc`
            ),
            fetch(
              `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=ko-KR&with_networks=${networkIds}&with_genres=${genreIds}&sort_by=popularity.desc`
            ),
          ]);

          const movieData = await genreMovieRes.json();
          const tvData = await genreTVRes.json();

          allResults = [
            ...(movieData.results || []).map((m: any) => normalize(m, 'movie')),
            ...(tvData.results || []).map((t: any) => normalize(t, 'tv')),
          ].filter((item) => matchesFilter(item, get().selectedGenreId, keyword));
        }
      }

      // 4. 중복 제거
      const uniqueResults = allResults.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id && t.media_type === item.media_type)
      );

      console.log('✨ 최종 검색 결과:', uniqueResults.length);

      set({ searchResults: uniqueResults });
    } catch (err) {
      console.error('❌ 검색 오류:', err);
      set({ searchResults: [] });
    }
  },
}));
