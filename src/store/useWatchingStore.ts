import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { useProfileStore } from './useProfileStore';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../api/auth';
import type { WatchingItem } from '../types/IWish_Watching';

interface WatchingState {
  watching: WatchingItem[];
  onAddWatching: (item: WatchingItem) => Promise<void>;
  onRemoveWatching: (id: number) => Promise<void>;
  onResetWatching: () => void;
  onFetchWatching: () => Promise<void>;
}

export const useWatchingStore = create<WatchingState>((set, get) => ({
  // 플레이한 영화를 저장할 변수
  watching: [],

  // 사용자 별로 플레이한 리스트를 저장할 메서드
  onAddWatching: async (item) => {
    console.log('추가');
    // 1. 로그인 상태, 이미지 정보
    // 이미지 정보가 없으면 저장 안함.
    if (!item.poster_path) return;
    // 로그인 상태를 체크하기 위해 다른 전역변수 가져오기
    const user = useAuthStore.getState().user;
    if (!user) return alert('로그인 해주세요.');
    // 프로필 다른 전역 상태변수 가져오기
    const activeProfileId = useProfileStore.getState().activeProfileId;

    // 2. firebase 저장 위치 결정하기
    // users/{uid}/profiles/{activeProfileId}/playlist/{movieId}
    const ref = doc(
      db,
      'users',
      user.uid,
      'profiles',
      activeProfileId,
      'playlist',
      String(item.id)
    );

    // 3. 중복 방지
    const exists = get().watching.find((w) => w.id === item.id);
    if (exists) return;

    // 4. firestore 저장
    await setDoc(ref, {
      ...item,
      updateAt: Date.now(),
    });

    // zustand 상태 업데이트
    set({
      watching: [
        ...get().watching,
        {
          ...item,
          updateAt: Date.now(),
        },
      ],
    });
  },

  // 플레이 리스트를 삭제할 메서드
  onRemoveWatching: async (id) => {
    console.log('삭제 완료');
  },

  // 사용자 별 플레이리스트 저장목록을 불러올 메서드
  onFetchWatching: async () => {
    const user = useAuthStore.getState().user;
    const activeProfileId = useProfileStore.getState().activeProfileId;

    // 1. 유저 정보가 없으면 중단
    if (!user || !user.uid) {
      console.log('유저 정보가 없습니다.');
      return;
    }

    // 2. 중요: activeProfileId가 null이면 Firebase 경로를 만들 수 없으므로 중단
    if (!activeProfileId) {
      console.log('선택된 프로필이 없습니다. 데이터를 불러오지 않습니다.');
      return;
    }

    try {
      // 이제 모든 인자가 존재함이 보장됩니다.
      const snap = await getDocs(
        collection(db, 'users', user.uid, 'profiles', activeProfileId, 'playlist')
      );

      const data = snap.docs.map((doc) => doc.data() as WatchingItem);
      set({ watching: data });
      console.log('데이터 로드 완료');
    } catch (error) {
      console.error('데이터 로드 중 에러 발생:', error);
    }
  },

  // 사용자가 변경되면 기존 플레이 리스트 리셋
  onResetWatching: () => set({ watching: [] }),
}));
