import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../api/auth';
import type { WishItem } from '../types/IWish_Watching';
import { useProfileStore } from './useProfileStore';
import type { TMDBListItem } from '../types/TMDBListItem';

export interface WishState {
  wishlist: WishItem[];
  onToggleWish: (item: any) => Promise<void>; // 다양한 타입 대응을 위해 any 또는 확장 타입 사용
  onFetchWish: () => Promise<void>;
  onResetWish: () => void;
  onSyncFromList: (items: any[]) => Promise<void>;
}

export const useWishStore = create<WishState>((set, get) => ({
  wishlist: [],

  onToggleWish: async (item) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const activeProfileId = useProfileStore.getState().activeProfileId;
    if (!activeProfileId) return;

    // 1. 타입 추출 (item에 정보가 없다면 undefined가 됨)
    const rawType = item.media_type || item.category || item.type;

    if (!rawType) {
      console.error('카테고리 정보 누락: 이 객체에는 media_type이나 category가 없습니다.', item);
      // 사용자에게 알림을 주려면 여기에 toast 등을 넣으세요.
      return;
    }

    // 2. 정규화
    const normalizedType = rawType === 'series' ? 'tv' : rawType;
    const docId = `${normalizedType}-${item.id}`;
    const ref = doc(db, 'users', user.uid, 'profiles', activeProfileId, 'wishlist', docId);

    const exists = get().wishlist.some(
      (w) => String(w.id) === String(item.id) && w.media_type === normalizedType
    );

    try {
      if (exists) {
        await deleteDoc(ref);
        set({
          wishlist: get().wishlist.filter(
            (w) => !(String(w.id) === String(item.id) && w.media_type === normalizedType)
          ),
        });
      } else {
        const wishItem: WishItem = {
          id: item.id,
          media_type: normalizedType as 'movie' | 'tv', // ⭐ 오타 수정: media_type -> normalizedType
          title: item.title || item.name || '제목 없음',
          poster_path: item.poster_path || '',
          createdAt: Date.now(),
        };
        await setDoc(ref, wishItem);
        set({ wishlist: [...get().wishlist, wishItem] });
      }
    } catch (error) {
      console.error('Firebase Error:', error);
    }
  },
  // ==========================
  // Firestore → Zustand (데이터 로드)
  // ==========================
  onFetchWish: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const activeProfileId = useProfileStore.getState().activeProfileId;
    if (!activeProfileId) return;

    try {
      const snap = await getDocs(
        collection(db, 'users', user.uid, 'profiles', activeProfileId, 'wishlist')
      );
      const data = snap.docs.map((doc) => doc.data() as WishItem);
      set({ wishlist: data });
    } catch (err) {
      console.error('찜 목록 로드 실패:', err);
    }
  },

  // ==========================
  // 자동 동기화 시에도 카테고리 변환 적용
  // ==========================
  onSyncFromList: async (items) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const activeProfileId = useProfileStore.getState().activeProfileId;
    if (!activeProfileId) return;

    const current = get().wishlist;
    const map = new Map(current.map((w) => [`${w.media_type}-${w.id}`, w]));

    for (const item of items) {
      // ⭐ 카테고리 변환 처리
      const media_type = item.media_type || (item.category === 'series' ? 'tv' : item.category);
      const key = `${media_type}-${item.id}`;

      if (map.has(key)) continue;

      const wishItem: WishItem = {
        id: item.id,
        media_type: media_type as 'movie' | 'tv',
        title: item.title || item.name,
        poster_path: item.poster_path,
        createdAt: Date.now(),
      };

      const ref = doc(db, 'users', user.uid, 'profiles', activeProfileId, 'wishlist', key);
      await setDoc(ref, wishItem);
      map.set(key, wishItem);
    }

    set({ wishlist: Array.from(map.values()) });
  },

  onResetWish: () => set({ wishlist: [] }),
}));
