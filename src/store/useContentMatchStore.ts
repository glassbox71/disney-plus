import { create } from 'zustand';
import type { LocalContentItem, TMDBItem, MergedContentItem } from '../types/IContentTypes';

interface ContentMatchState {
  localList: LocalContentItem[];
  tmdbList: TMDBItem[];
  mergedList: MergedContentItem[];

  setLocalList: (list: LocalContentItem[]) => void;
  setTMDBList: (list: TMDBItem[]) => void;

  matchContents: () => void;
  reset: () => void;
}

export const useContentMatchStore = create<ContentMatchState>((set, get) => ({
  localList: [],
  tmdbList: [],
  mergedList: [],

  // --------------------
  // 로컬 JSON 주입
  // --------------------
  setLocalList: (list) => {
    set({ localList: list });
    get().matchContents();
  },

  // --------------------
  // TMDb 데이터 주입
  // --------------------
  setTMDBList: (list) => {
    set({ tmdbList: list });
    get().matchContents();
  },

  // --------------------
  // 매칭 및 카테고리 정규화 로직 (핵심)
  // --------------------
  matchContents: () => {
    const { localList, tmdbList } = get();

    // TMDb 데이터를 Map으로 변환 (검색 최적화)
    const tmdbMap = new Map<string, any>();
    tmdbList.forEach((item) => {
      tmdbMap.set(`${item.media_type}-${item.id}`, item);
    });

    const merged: any[] = [];

    localList.forEach((local) => {
      // ⭐ 'series'를 'tv'로 변환하여 media_type 결정
      const media_type = local.category === 'movie' ? 'movie' : 'tv';
      const key = `${media_type}-${local.id}`;

      const tmdb = tmdbMap.get(key);

      // 매칭되는 TMDb 데이터가 있는 경우에만 mergedList에 추가
      if (tmdb) {
        merged.push({
          ...local,
          id: local.id,
          media_type, // 'movie' 또는 'tv'로 저장됨
          title: tmdb.title || tmdb.name || (local as any).title || (local as any).name,
          poster_path: tmdb.poster_path || local.poster_path,
          tmdb,
        });
      }
    });

    set({ mergedList: merged });
  },

  reset: () => {
    set({
      localList: [],
      tmdbList: [],
      mergedList: [],
    });
  },
}));
