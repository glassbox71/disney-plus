import { create } from "zustand";
import { useWishStore } from "./useWishStore";
import { useWatchingStore } from "./useWatchingStore";
import { useProfileStore } from "./useProfileStore";
import type { Movie } from "../types/IMovie";

/** TMDB에서 movie/tv 공통으로 쓰는 최소 필드 + movie|tv 구분 */
type MediaType = "movie" | "tv";

/** 추천에서 사용할 아이템 타입 (movie/tv 결과에 공통인 필드만 기반으로) */
type RecItem = Movie & {
  id: number;
  media_type: MediaType;
  genre_ids: number[];
  adult?: boolean;
  popularity: number;
  nlCert?: string | null;
};

interface RecommendationState {
  recommendedItems: RecItem[];
  isLoading: boolean;
  onGenerateRecommendations: () => Promise<void>;
  onResetRecommendations: () => void;
}

const getApiKey = () => {
  return import.meta.env.VITE_TMDB_API_KEY || "YOUR_API_KEY_HERE";
};

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = getApiKey();

const ANIMATION_GENRE_ID = 16;

type TmdbDiscoverResponse = {
  results: RecItem[];
};

/* =======================
  NL certification -> 숫자 나이
  ("12+" 대응)
======================= */
const nlCertToAge = (cert?: string | null): number | null => {
  if (!cert) return null;
  const c = String(cert).trim().toUpperCase();

  if (c === "AL" || c === "ALL") return 0;

  const m = c.match(/\d+/);
  if (!m) return null;

  const num = Number(m[0]);
  if ([6, 9, 12, 14, 16, 18].includes(num)) return num;

  return null;
};

/* =======================
  현재 activeProfile 기준
======================= */
const getActiveProfile = () => {
  const { profiles, activeProfileId } = useProfileStore.getState();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;

  const isKidsMode = !!activeProfile?.isKids;
  const limit = activeProfile?.contentLimit;

  const maxAge = isKidsMode ? (limit == null ? 12 : limit) : limit ?? 19;

  return { activeProfile, isKidsMode, maxAge };
};

/* =======================
 Movie: NL certification 가져오기
======================= */
const fetchMovieNlCert = async (id: number | string): Promise<string | null> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}`
    );
    const data = await res.json();

    const nl = (data?.results ?? []).find((r: any) => r.iso_3166_1 === "NL");
    const nlList = nl?.release_dates ?? [];

    const preferTypes = [3, 4, 5, 6, 1, 2];
    for (const t of preferTypes) {
      const found = nlList.find(
        (x: any) => x?.type === t && x?.certification?.trim()
      );
      if (found) return String(found.certification).trim();
    }

    const any = nlList.find((x: any) => x?.certification?.trim());
    return any ? String(any.certification).trim() : null;
  } catch {
    return null;
  }
};

/* =======================
 TV: NL rating 가져오기
======================= */
const fetchTvNlCert = async (id: number | string): Promise<string | null> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/tv/${id}/content_ratings?api_key=${API_KEY}`
    );
    const data = await res.json();

    const nl = (data?.results ?? []).find((r: any) => r.iso_3166_1 === "NL");
    return nl?.rating ? String(nl.rating).trim() : null;
  } catch {
    return null;
  }
};

/* =======================
 상위 N개만 NL 등급 붙여서 필터
  - 키즈면 등급 없으면 숨김
======================= */
const filterByNlAgeTopN = async (
  results: RecItem[],
  maxAge: number,
  isKidsMode: boolean,
  mediaType: MediaType,
  take = 40
): Promise<RecItem[]> => {
  const topN = results.slice(0, take);

  const headWithCert: RecItem[] = await Promise.all(
    topN.map(async (r) => {
      const cert =
        mediaType === "tv" ? await fetchTvNlCert(r.id) : await fetchMovieNlCert(r.id);
      return { ...r, nlCert: cert };
    })
  );

  return headWithCert.filter((r) => {
    const nlAge = nlCertToAge(r.nlCert);

    // 키즈면 등급 없는 건 숨김
    if (nlAge === null) return isKidsMode ? false : true;

    return nlAge <= maxAge;
  });
};

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendedItems: [],
  isLoading: false,

  onGenerateRecommendations: async () => {
    set({ isLoading: true });

    try {
      const { isKidsMode, maxAge } = getActiveProfile();
      console.log("키즈 모드:", isKidsMode, "최대 연령:", maxAge);

      const wishlist = useWishStore.getState().wishlist as Array<{ id: number; media_type: MediaType }>;
      const watching = useWatchingStore.getState().watching as Array<{ id: number; media_type: MediaType }>;
      const allItems = [...wishlist, ...watching];

      if (allItems.length === 0) {
        set({ recommendedItems: [], isLoading: false });
        return;
      }

      // 장르 수집
      const genreCountMap = new Map<number, number>();

      for (const item of allItems) {
        try {
          const endpoint = item.media_type === "movie" ? "movie" : "tv";
          const response = await fetch(
            `${API_BASE_URL}/${endpoint}/${item.id}?api_key=${API_KEY}&language=ko-KR`
          );

          if (response.ok) {
            const details: { genres?: Array<{ id: number; name: string }> } = await response.json();
            details.genres?.forEach((genre) => {
              genreCountMap.set(genre.id, (genreCountMap.get(genre.id) || 0) + 1);
            });
          }
        } catch (error) {
          console.warn("상세 정보 로드 실패:", item, error);
        }
      }

      // TOP 3 장르
      const topGenres = Array.from(genreCountMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genreId]) => genreId);

      const recommendations: RecItem[] = [];
      const seenIds = new Set(allItems.map((i) => `${i.media_type}-${i.id}`));

      // 키즈모드면 movie만 추천(애니메이션 위주)
      const mediaTypes: MediaType[] = isKidsMode ? ["movie"] : ["movie", "tv"];

      for (const mediaType of mediaTypes) {
        for (const genreId of topGenres) {
          const withGenre = isKidsMode ? ANIMATION_GENRE_ID : genreId;

          try {
            const response = await fetch(
              `${API_BASE_URL}/discover/${mediaType}` +
              `?api_key=${API_KEY}` +
              `&language=ko-KR` +
              `&sort_by=popularity.desc` +
              `&with_genres=${withGenre}` +
              `&include_adult=false` +
              `&watch_region=KR&with_watch_providers=337` +
              `&page=1`
            );

            if (!response.ok) {
              console.warn("[추천 fetch 실패]", {
                status: response.status,
                mediaType,
                genreId,
                withGenre,
              });
              continue;
            }

            const data: TmdbDiscoverResponse = await response.json();
            let results: RecItem[] = data.results ?? [];

            // 키즈스토어처럼: 애니메이션(16) 강제 필터
            if (isKidsMode) {
              results = results.filter(
                (r) => Array.isArray(r.genre_ids) && r.genre_ids.includes(ANIMATION_GENRE_ID)
              );
            }

            // 기본 필터(중복/성인)
            results = results
              .filter((r) => {
                if (seenIds.has(`${mediaType}-${r.id}`)) return false;
                if (r.adult) return false;
                return true;
              })
              .slice(0, 40)
              .map((r) => ({ ...r, media_type: mediaType }));

            recommendations.push(...results);
          } catch (error) {
            // 요청하신 catch “내용 채우기”
            console.error("[추천 로드 실패]", { mediaType, genreId, isKidsMode }, error);
          }
        }
      }

      console.log("NL 등급 필터링 전:", recommendations.length);

      const movieItems = recommendations.filter((i) => i.media_type === "movie");
      const tvItems = recommendations.filter((i) => i.media_type === "tv");

      const filteredMovies = await filterByNlAgeTopN(movieItems, maxAge, isKidsMode, "movie", 60);
      const filteredTvs = await filterByNlAgeTopN(tvItems, maxAge, isKidsMode, "tv", 60);

      const ageFiltered = [...filteredMovies, ...filteredTvs];
      console.log("NL 등급 필터링 후:", ageFiltered.length);

      const uniqueRecommendations = Array.from(
        new Map(ageFiltered.map((item) => [`${item.media_type}-${item.id}`, item])).values()
      )
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 20);

      set({ recommendedItems: uniqueRecommendations, isLoading: false });
    } catch (error) {
      console.error("추천 생성 실패:", error);
      set({ isLoading: false, recommendedItems: [] });
    }
  },

  onResetRecommendations: () => set({ recommendedItems: [] }),
}));
