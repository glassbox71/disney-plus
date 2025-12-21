// import { create } from 'zustand';
// import { useWishStore } from './useWishStore';
// import { useWatchingStore } from './useWatchingStore';

// interface RecommendationState {
//   recommendedItems: any[];
//   isLoading: boolean;
//   onGenerateRecommendations: () => Promise<void>;
//   onResetRecommendations: () => void;
// }

// // TMDB API 키 설정 (환경변수 사용 권장)
// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// export const useRecommendationStore = create<RecommendationState>((set, get) => ({
//   recommendedItems: [],
//   isLoading: false,

//   onGenerateRecommendations: async () => {
//     set({ isLoading: true });

//     try {
//       // 1. 찜 목록과 시청 목록 가져오기
//       const wishlist = useWishStore.getState().wishlist;
//       const watching = useWatchingStore.getState().watching;

//       // 2. 모든 아이템에서 장르 정보 추출
//       const allItems = [...wishlist, ...watching];

//       if (allItems.length === 0) {
//         console.log('추천할 데이터가 없습니다.');
//         set({ recommendedItems: [], isLoading: false });
//         return;
//       }

//       // 3. 각 아이템의 상세 정보를 가져와 장르 수집
//       const genreCountMap = new Map<number, number>();
//       const genreNameMap = new Map<number, string>();

//       for (const item of allItems) {
//         try {
//           const endpoint = item.media_type === 'movie' ? 'movie' : 'tv';
//           const response = await fetch(
//             `${TMDB_BASE_URL}/${endpoint}/${item.id}?api_key=${API_KEY}&language=ko-KR`
//           );

//           if (response.ok) {
//             const details = await response.json();

//             // 장르별 카운트 증가
//             details.genres?.forEach((genre: any) => {
//               genreCountMap.set(genre.id, (genreCountMap.get(genre.id) || 0) + 1);
//               genreNameMap.set(genre.id, genre.name);
//             });
//           }
//         } catch (error) {
//           console.error(`상세 정보 로드 실패 (${item.id}):`, error);
//         }
//       }

//       // 4. 가장 많이 본 장르 TOP 3 추출
//       const topGenres = Array.from(genreCountMap.entries())
//         .sort((a, b) => b[1] - a[1])
//         .slice(0, 3)
//         .map(([genreId]) => genreId);

//       console.log(
//         '선호 장르:',
//         topGenres.map((id) => genreNameMap.get(id))
//       );

//       // 5. 선호 장르 기반 추천 콘텐츠 가져오기
//       const recommendations: any[] = [];
//       const seenIds = new Set(allItems.map((item) => `${item.media_type}-${item.id}`));

//       // 영화와 TV 각각에서 추천 가져오기
//       for (const mediaType of ['movie', 'tv']) {
//         for (const genreId of topGenres) {
//           try {
//             const response = await fetch(
//               `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId}&page=1`
//             );

//             if (response.ok) {
//               const data = await response.json();

//               // 이미 본 콘텐츠 제외하고 추가
//               const filtered = data.results
//                 .filter((item: any) => !seenIds.has(`${mediaType}-${item.id}`))
//                 .slice(0, 4) // 장르당 4개씩
//                 .map((item: any) => ({
//                   ...item,
//                   media_type: mediaType,
//                 }));

//               recommendations.push(...filtered);
//             }
//           } catch (error) {
//             console.error(`추천 로드 실패 (${mediaType}, genre ${genreId}):`, error);
//           }
//         }
//       }

//       // 6. 중복 제거 및 인기도 순 정렬
//       const uniqueRecommendations = Array.from(
//         new Map(recommendations.map((item) => [`${item.media_type}-${item.id}`, item])).values()
//       )
//         .sort((a, b) => b.popularity - a.popularity)
//         .slice(0, 20); // 최대 20개

//       set({
//         recommendedItems: uniqueRecommendations,
//         isLoading: false,
//       });

//       console.log(`${uniqueRecommendations.length}개의 추천 콘텐츠 생성 완료`);
//     } catch (error) {
//       console.error('추천 생성 실패:', error);
//       set({ isLoading: false });
//     }
//   },

//   onResetRecommendations: () => set({ recommendedItems: [] }),
// }));
import { create } from 'zustand';
import { useWishStore } from './useWishStore';
import { useWatchingStore } from './useWatchingStore';

interface RecommendationState {
  recommendedItems: any[];
  isLoading: boolean;
  onGenerateRecommendations: () => Promise<void>;
  onResetRecommendations: () => void;
}

// TMDB API 설정
const getApiKey = () => {
  // Vite 환경변수 또는 직접 입력
  return import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
};

const API_BASE_URL = 'https://api.themoviedb.org/3';

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendedItems: [],
  isLoading: false,

  onGenerateRecommendations: async () => {
    set({ isLoading: true });

    const API_KEY = getApiKey();

    try {
      // 1. 찜 목록과 시청 목록 가져오기
      const wishlist = useWishStore.getState().wishlist;
      const watching = useWatchingStore.getState().watching;

      // 2. 모든 아이템에서 장르 정보 추출
      const allItems = [...wishlist, ...watching];

      if (allItems.length === 0) {
        console.log('추천할 데이터가 없습니다.');
        set({ recommendedItems: [], isLoading: false });
        return;
      }

      // 3. 각 아이템의 상세 정보를 가져와 장르 수집
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

            // 장르별 카운트 증가
            details.genres?.forEach((genre: any) => {
              genreCountMap.set(genre.id, (genreCountMap.get(genre.id) || 0) + 1);
              genreNameMap.set(genre.id, genre.name);
            });
          }
        } catch (error) {
          console.error(`상세 정보 로드 실패 (${item.id}):`, error);
        }
      }

      // 4. 가장 많이 본 장르 TOP 3 추출
      const topGenres = Array.from(genreCountMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genreId]) => genreId);

      console.log(
        '선호 장르:',
        topGenres.map((id) => genreNameMap.get(id))
      );

      // 5. 선호 장르 기반 추천 콘텐츠 가져오기
      const recommendations: any[] = [];
      const seenIds = new Set(allItems.map((item) => `${item.media_type}-${item.id}`));

      // 영화와 TV 각각에서 추천 가져오기
      for (const mediaType of ['movie', 'tv']) {
        for (const genreId of topGenres) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&with_genres=${genreId}&page=1`
            );

            if (response.ok) {
              const data = await response.json();

              // 이미 본 콘텐츠 제외하고 추가
              const filtered = data.results
                .filter((item: any) => !seenIds.has(`${mediaType}-${item.id}`))
                .slice(0, 4) // 장르당 4개씩
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

      // 6. 중복 제거 및 인기도 순 정렬
      const uniqueRecommendations = Array.from(
        new Map(recommendations.map((item) => [`${item.media_type}-${item.id}`, item])).values()
      )
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20); // 최대 20개

      set({
        recommendedItems: uniqueRecommendations,
        isLoading: false,
      });

      console.log(`${uniqueRecommendations.length}개의 추천 콘텐츠 생성 완료`);
    } catch (error) {
      console.error('추천 생성 실패:', error);
      set({ isLoading: false });
    }
  },

  onResetRecommendations: () => set({ recommendedItems: [] }),
}));
