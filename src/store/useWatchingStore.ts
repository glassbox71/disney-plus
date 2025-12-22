import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { useProfileStore } from './useProfileStore';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../api/auth';
import type { WatchingItem } from '../types/IWish_Watching';

interface WatchingState {
  watching: WatchingItem[];
  onAddWatching: (item: WatchingItem) => Promise<void>;
  onRemoveWatching: (id: number, media_type: string) => Promise<void>; // 타입 추가
  onResetWatching: () => void;
  onFetchWatching: () => Promise<void>;
}

export const useWatchingStore = create<WatchingState>((set, get) => ({
  watching: [],

  onAddWatching: async (item) => {
    // 1. 데이터 검증 (media_type 유무 확인이 가장 중요합니다)
    if (!item.poster_path || !item.id) return;

    // media_type이 누락되었을 경우를 대비한 방어 로직
    const rawType = item.media_type || (item as any).type || (item as any).category;

    const typeMap: Record<string, 'tv' | 'movie'> = {
      series: 'tv',
      movie: 'movie',
    };

    const normalizedType = typeMap[rawType];
    if (!normalizedType) {
      console.error('알 수 없는 media_type:', rawType);
      return;
    }

    const user = useAuthStore.getState().user;
    const activeProfileId = useProfileStore.getState().activeProfileId;
    if (!user || !activeProfileId) return;

    // 2. 문서 ID를 "type-id" 형식으로 생성 (안전성)
    const docId = `${normalizedType}-${item.id}`;
    const ref = doc(db, 'users', user.uid, 'profiles', activeProfileId, 'playlist', docId);

    const updateData = {
      ...item,
      media_type: normalizedType, // 타입 정규화해서 저장
      updateAt: Date.now(),
    };

    try {
      // 3. Firestore 저장
      await setDoc(ref, updateData);

      // 4. Zustand 상태 업데이트 (기존 목록에 있으면 교체, 없으면 추가)
      // const isExist = get().watching.some(
      //   (w) => String(w.id) === String(item.id) && w.media_type === normalizedType
      // );
      const isExist = get().watching.some(
        (w) => String(w.id) === String(item.id) && w.media_type === normalizedType
      );

      if (isExist) {
        set({
          watching: get().watching.map((w) =>
            String(w.id) === String(item.id) && w.media_type === normalizedType ? updateData : w
          ),
        });
      } else {
        set({ watching: [updateData, ...get().watching] });
      }
    } catch (error) {
      console.error('시청 기록 저장 에러:', error);
    }
  },

  onRemoveWatching: async (id, media_type) => {
    const user = useAuthStore.getState().user;
    const activeProfileId = useProfileStore.getState().activeProfileId;
    if (!user || !activeProfileId) return;

    const docId = `${media_type}-${id}`;
    const ref = doc(db, 'users', user.uid, 'profiles', activeProfileId, 'playlist', docId);

    try {
      await deleteDoc(ref);
      set({
        watching: get().watching.filter(
          (w) => !(String(w.id) === String(id) && w.media_type === media_type)
        ),
      });
      console.log('시청 기록 삭제 완료');
    } catch (error) {
      console.error('삭제 에러:', error);
    }
  },

  onFetchWatching: async () => {
    const user = useAuthStore.getState().user;
    const activeProfileId = useProfileStore.getState().activeProfileId;

    if (!user || !activeProfileId) return;

    try {
      const snap = await getDocs(
        collection(db, 'users', user.uid, 'profiles', activeProfileId, 'playlist')
      );

      // const data = snap.docs.map((doc) => doc.data() as WatchingItem);
      const data = snap.docs
        .map((doc) => {
          const d = doc.data();
          if (!d.id || !d.media_type) return null;
          return d as WatchingItem;
        })
        .filter(Boolean) as WatchingItem[];

      // 최신 시청 순으로 정렬하여 저장
      const sortedData = data.sort((a, b) => (b.updateAt || 0) - (a.updateAt || 0));

      set({ watching: sortedData });
    } catch (error) {
      console.error('시청 기록 로드 에러:', error);
    }
  },

  onResetWatching: () => set({ watching: [] }),
}));
