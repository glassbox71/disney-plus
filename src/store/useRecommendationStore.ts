import { create } from 'zustand';
import { useWishStore } from './useWishStore';
import { useWatchingStore } from './useWatchingStore';
import { useProfileStore } from './useProfileStore';

interface RecommendationState {
  recommendedItems: any[];
  isLoading: boolean;
  onGenerateRecommendations: () => Promise<void>;
  onResetRecommendations: () => void;
}

// TMDB API 설정
const getApiKey = () => {
  return import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
};

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = getApiKey();

// 키즈 친화적 장르 ID
const KIDS_GENRES = [16, 10751, 12, 14, 10402, 35]; // 애니메이션, 가족, 어드벤처, 판타지, 음악, 코미디

/* NL certification -> 숫자 나이 */
const nlCertToAge = (cert?: string | null): number | null => {
  if (!cert) return null;
  const c = String(cert).trim().toUpperCase();
  if (c === 'AL' || c === 'ALL') return 0;
  const num = Number(c);
  if ([6, 9, 12, 14, 16, 18].includes(num)) return num;
  return null;
};

/* 현재 activeProfile 기준으로 키즈모드 + maxAge 계산 */
const getActiveProfile = () => {
  const { profiles, activeProfileId } = useProfileStore.getState();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;
  const isKidsMode = !!activeProfile?.isKids;
  const limit = activeProfile?.contentLimit;
  const maxAge = isKidsMode ? (limit == null ? 12 : limit) : limit ?? 19;
  return { activeProfile, isKidsMode, maxAge };
};

/* Movie: NL certification 가져오기 */
const fetchMovieNlCert = async (id: number | string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}`);
    const data = await res.json();
    const nl = (data?.results ?? []).find((r: any) => r.iso_3166_1 === 'NL');
    const nlList = nl?.release_dates ?? [];
    const preferTypes = [3, 4, 5, 6, 1, 2];

    for (const t of preferTypes) {
      const found = nlList.find((x: any) => x?.type === t && x?.certification?.trim());
      if (found) return String(found.certification).trim();
    }

    const any = nlList.find((x: any) => x?.certification?.trim());
    return any ? String(any.certification).trim() : null;
  } catch (error) {
    return null;
  }
};

/* TV: NL rating 가져오기 */
const fetchTvNlCert = async (id: number | string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tv/${id}/content_ratings?api_key=${API_KEY}`);
    const data = await res.json();
    const nl = (data?.results ?? []).find((r: any) => r.iso_3166_1 === 'NL');
    return nl?.rating ? String(nl.rating).trim() : null;
  } catch (error) {
    return null;
  }
};

/* NL 등급 기반 필터링 */
const filterByNlAge = async (items: any[], maxAge: number, isKidsMode: boolean) => {
  const itemsWithCert = await Promise.all(
    items.map(async (item) => {
      const cert =
        item.media_type === 'tv' ? await fetchTvNlCert(item.id) : await fetchMovieNlCert(item.id);
      return { ...item, nlCert: cert };
    })
  );

  return itemsWithCert.filter((item) => {
    const nlAge = nlCertToAge(item.nlCert);

    // 키즈모드면 등급 없는 건 숨김
    if (nlAge === null) return isKidsMode ? false : true;

    return nlAge <= maxAge;
  });
};

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendedItems: [],
  isLoading: false,

  onGenerateRecommendations: async () => {
    set({ isLoading: true });

    try {
      // 1. 현재 프로필 정보 가져오기
      const { isKidsMode, maxAge } = getActiveProfile();
      console.log('키즈 모드:', isKidsMode, '최대 연령:', maxAge);

      // 2. 찜 목록과 시청 목록 가져오기
      const wishlist = useWishStore.getState().wishlist;
      const watching = useWatchingStore.getState().watching;
      const allItems = [...wishlist, ...watching];

      if (allItems.length === 0) {
        console.log('추천할 데이터가 없습니다.');
        set({ recommendedItems: [], isLoading: false });
        return;
      }

      // 3. 장르 정보 수집
      const genreCountMap = new Map<number, number>();
      const genreNameMap = new Map<number, string>();

      for (const item of allItems) {
        try {
          const endpoint = item.media_type === 'movie' ? 'movie' : 'tv';
          const response = await fetch(
            `${API_BASE_URL}/${endpoint}/${item.id}?api_key=${API_KEY}&language=ko-KR`
          );

          if (response.ok) {
            const details = await response.json();
            details.genres?.forEach((genre: any) => {
              genreCountMap.set(genre.id, (genreCountMap.get(genre.id) || 0) + 1);
              genreNameMap.set(genre.id, genre.name);
            });
          }
        } catch (error) {
          console.error(`상세 정보 로드 실패 (${item.id}):`, error);
        }
      }

      // 4. TOP 3 장르 추출
      const topGenres = Array.from(genreCountMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genreId]) => genreId);

      console.log(
        '선호 장르:',
        topGenres.map((id) => genreNameMap.get(id))
      );

      // 5. 추천 콘텐츠 가져오기
      const recommendations: any[] = [];
      const seenIds = new Set(allItems.map((item) => `${item.media_type}-${item.id}`));

      for (const mediaType of ['movie', 'tv']) {
        for (const genreId of topGenres) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId}&include_adult=false&page=1`
            );

            if (response.ok) {
              const data = await response.json();

              // 기본 필터링
              const filtered = data.results
                .filter((item: any) => {
                  // 이미 본 콘텐츠 제외
                  if (seenIds.has(`${mediaType}-${item.id}`)) return false;

                  // 성인 콘텐츠 제외
                  if (item.adult) return false;

                  // 키즈모드일 때만 장르 필터링
                  if (isKidsMode) {
                    const hasKidsGenre = item.genre_ids?.some((id: number) =>
                      KIDS_GENRES.includes(id)
                    );
                    return hasKidsGenre;
                  }

                  return true;
                })
                .slice(0, 8) // 장르당 8개씩 (NL 필터링 후 4개 정도 남을 것으로 예상)
                .map((item: any) => ({
                  ...item,
                  media_type: mediaType,
                }));

              recommendations.push(...filtered);
            }
          } catch (error) {
            console.error(`추천 로드 실패 (${mediaType}, genre ${genreId}):`, error);
          }
        }
      }

      // 6. NL 등급 기반 필터링
      console.log('NL 등급 필터링 전:', recommendations.length);
      const ageFiltered = await filterByNlAge(recommendations, maxAge, isKidsMode);
      console.log('NL 등급 필터링 후:', ageFiltered.length);

      // 7. 중복 제거 및 인기도 순 정렬
      const uniqueRecommendations = Array.from(
        new Map(ageFiltered.map((item) => [`${item.media_type}-${item.id}`, item])).values()
      )
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

      set({
        recommendedItems: uniqueRecommendations,
        isLoading: false,
      });

      console.log(`✅ ${uniqueRecommendations.length}개의 추천 콘텐츠 생성 완료`);
    } catch (error) {
      console.error('❌ 추천 생성 실패:', error);
      set({ isLoading: false, recommendedItems: [] });
    }
  },

  onResetRecommendations: () => set({ recommendedItems: [] }),
}));
