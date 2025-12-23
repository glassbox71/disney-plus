import { create } from 'zustand';
import type { Movie } from '../types/IMovie';
import { useProfileStore } from './useProfileStore'; //activeProfile 가져오기
import { useMovieStore } from './useMovieStore';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export interface KidsMovie {
  title: string;
  logo: string;
  genreNames: string[];
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  adult: boolean;
  genre_ids: number[];
}
interface kidsCharacterRequest {
  type: MediaType;
  query: string;
  animationOnly?: boolean;
}

export type MediaType = 'movie' | 'tv' | 'discover';

type NlMovie = Movie & { nlCert?: string | null };
interface NlCertAge {
  iso_3166_1: string;
  // release_dates?: Array<{
  certification?: string;
  type?: number;
  // }>
}
interface KidsMovieProps {
  kidsThemeMoive: NlMovie[];
  kidsCharacterMovie: KidsMovie[];
  characterExist: Record<string, boolean>;
  kidsTopMovie: KidsMovie[];
  category: Record<string, KidsMovie[]>;
  onFetchCollctionMovie: (item: kidsCharacterRequest) => Promise<void>;
  onFethCharacterMovie: (
    item: kidsCharacterRequest & {
      characterId?: string;
      isCharacter?: boolean;
    }
  ) => Promise<void>;
  onFetchTop10Movies: () => Promise<void>;
  onFetchKidsCate: (genreId: string) => Promise<void>;
  clearKidsCategory: () => void;
}


// NL certification -> 숫자 나이

const nlCertToAge = (cert?: string | null): number | null => {
  if (!cert) return null;
  const c = String(cert).trim().toUpperCase();

  if (c === 'AL' || c === 'ALL') return 0;

  const num = Number(c);
  if ([6, 9, 12, 14, 16, 18].includes(num)) return num;

  return null;
};


// 현재 activeProfile 기준으로  키즈모드 + maxAge 계산
const getActiveProfile = () => {
  const { profiles, activeProfileId } = useProfileStore.getState();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;

  const isKidsMode = !!activeProfile?.isKids;

  //contentLimit 값: 0,5,7,12,15,19 그대로 maxAge로 사용
  //키즈에서 설정 안하면 12 기본 처리
  const limit = activeProfile?.contentLimit;

  const maxAge = isKidsMode
    ? limit == null
      ? 12
      : limit // 키즈 기본 12
    : limit ?? 19; // 성인/일반

  return { activeProfile, isKidsMode, maxAge };
};


// Movie: NL certification 가져오기
const fetchMovieNlCert = async (id: number | string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${API_KEY}`
  );
  const data = await res.json();

  const nl = (data?.results ?? []).find((r: NlCertAge) => r.iso_3166_1 === 'NL');
  const nlList = nl?.release_dates ?? [];

  //콘텐츠를 제공해주는 타입
  const preferTypes = [3, 4, 5, 6, 1, 2];
  for (const t of preferTypes) {
    const found = nlList.find((x: NlCertAge) => x?.type === t && x?.certification?.trim());
    if (found) return String(found.certification).trim();
  }

  const any = nlList.find((x: NlCertAge) => x?.certification?.trim());
  return any ? String(any.certification).trim() : null;
};


//TV: NL rating 가져오기
const fetchTvNlCert = async (id: number | string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${API_KEY}`
  );
  const data = await res.json();

  const nl = (data?.results ?? []).find((r: NlCertAge) => r.iso_3166_1 === 'NL');
  return nl?.rating ? String(nl.rating).trim() : null;
};


// 상위 N개만 NL 등급 붙여서 필터 - 키즈면 등급 없으면 숨김
const filterByNlAgeTopN = async (
  results: KidsMovie[],
  maxAge: number,
  isKidsMode: boolean,
  mediaType: 'movie' | 'tv',
  take = 20
) => {
  const topN = results.slice(0, take);

  const headWithCert = await Promise.all(
    topN.map(async (r) => {
      const cert = mediaType === 'tv' ? await fetchTvNlCert(r.id) : await fetchMovieNlCert(r.id);
      return { ...r, nlCert: cert };
    })
  );

  return headWithCert.filter((r) => {
    const nlAge = nlCertToAge(r.nlCert);

    //키즈면 등급 없는 건 숨김
    if (nlAge === null) return isKidsMode ? false : true;

    return nlAge <= maxAge;
  });
};

export const useKidsMoiveStore = create<KidsMovieProps>((set, get) => ({
  kidsThemeMoive: [],
  kidsCharacterMovie: [],
  kidsTopMovie: [],
  genres: [],
  category: {},
  characterExist: {},

  onFethCharacterMovie: async (item) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/${item.type
      }?api_key=${API_KEY}&query=${encodeURIComponent(item.query ?? '')}&language=ko-KR`
    );
    const data = await res.json();
    let results = data.results ?? [];

    //장르 애니메이션 필터
    results = results.filter(
      (r: KidsMovie) => Array.isArray(r.genre_ids) && r.genre_ids.includes(16)
    );

    //캐릭터도 activeProfile 기준으로 동일 적용
    const { isKidsMode, maxAge } = getActiveProfile();
    const mediaType: 'movie' | 'tv' = item.type === 'tv' ? 'tv' : 'movie';
    const filtered = await filterByNlAgeTopN(results, maxAge, isKidsMode, mediaType, 20);

    if (item.characterId) {
      set((state) => ({
        characterExist: {
          ...state.characterExist,
          [item.characterId as string]: filtered.length > 0,
        },
      }));
    }
    if (!item.isCharacter) {
      set({ kidsCharacterMovie: filtered });
    }
  },

  onFetchCollctionMovie: async (item) => {
    let url = '';

    if (item.type === 'movie' || item.type === 'tv') {
      url = `https://api.themoviedb.org/3/search/${item.type
        }?api_key=${API_KEY}&query=${encodeURIComponent(item.query ?? '')}&language=ko-KR`;
    }



    if (!url) {
      console.error('url이 비어있', item.type);
      return;
    }

    const res = await fetch(url);
    const data = await res.json();
    let results = data.results ?? [];

    //기존 애니메이션 필터 유지
    if (
      (item.type === 'movie' || item.type === 'tv' || item.type === 'discover') &&
      item.animationOnly
    ) {
      results = results.filter(
        (r: KidsMovie) => Array.isArray(r.genre_ids) && r.genre_ids.includes(16)
      );
    }

    //activeProfile 기준
    const { isKidsMode, maxAge } = getActiveProfile();
    const mediaType: 'movie' | 'tv' = item.type === 'tv' ? 'tv' : 'movie';

    results = await filterByNlAgeTopN(results, maxAge, isKidsMode, mediaType, 20);

    set({ kidsThemeMoive: results });
  },

  onFetchTop10Movies: async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=16&watch_region=KR&with_watch_providers=337&with_watch_monetization_types=flatrate&sort_by=popularity.desc&page=1`
    );
    const data = await res.json();
    let results: KidsMovie[] = data.results ?? [];
    const { isKidsMode, maxAge } = getActiveProfile();
    results = await filterByNlAgeTopN(results, maxAge, isKidsMode, 'movie', 20);
    set({ kidsTopMovie: results.slice(0, 7) });
  },
  onFetchKidsCate: async (genreId) => {
    if (get().category[genreId]) return;
    const genreMap = await useMovieStore.getState().getGenreMap();

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}&adult=false&watch_region=KR&with_watch_providers=337`
    );
    const data = await res.json();

    let results: KidsMovie[] = (data.results ?? []) as KidsMovie[];
    const { isKidsMode, maxAge } = getActiveProfile();
    results = await filterByNlAgeTopN(results, maxAge, isKidsMode, 'movie', 60);

    const mapped = results.map((mov: KidsMovie) => ({
      ...mov,
      genreNames: mov.genre_ids?.map((id) => genreMap[id]).filter(Boolean),
    }));

    set((state) => ({
      category: {
        ...state.category,
        [genreId]: mapped,
      },
    }));
  },
  clearKidsCategory: () => set({ category: {} }),
}));
