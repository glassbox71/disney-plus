// movie & tv 공통 타입
export interface MediaBase {
  id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  adult: boolean;
  logo: string;
  cAge: string;
  title?: string;
  name?: string;
}

// 플레이 리스트 타입
export interface WatchingItem {
  id: number;
  title?: string;
  type: 'movie' | 'tv';
  name?: string;
  backdrop_path: string;
  poster_path: string;
  currentTime?: number; // 현재 재생 위치 (초)
  duration?: number; // 영상 전체 길이 (초)
  updateAt: number;
}

// 찜목록 타입
export interface WishItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
}
