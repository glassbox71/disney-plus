import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useKidsMoiveStore } from "./useKidsMovieStore";


const saveProfilesToUserStorage = (state: ProfileState) => {
  if (!state.currentUserId) return;

  const key = `profile-storage-${state.currentUserId}`;
  localStorage.setItem(
    key,
    JSON.stringify({
      state: {
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        autoKidsLogin: state.autoKidsLogin,
      },
    })
  );
};

export interface Profile {
  id: string;
  name: string;
  image: string;
  contentLimit: number;
  isKids: boolean;
  isDefault: boolean;
}

interface ProfileState {
  currentUserId: string | null;

  initWithUser: (userId: string) => void;

  profiles: Profile[];

  // 임시 작업용 (생성/수정) 수정중인 프로필
  currentProfile: Profile | null;

  // 키즈모드인가? 아닌가? 체크하는 메서드
  setIsKidsProfile: (isKids: boolean) => void;

  // 어떤 프로필을 사용해도 키즈모드로 로그인 되도록
  autoKidsLogin: boolean;
  setAutoKidsLogin: (value: boolean) => void;

  // 현재 내가 선택한 들어간 프로필 시청중인거
  activeProfileId: string | null;
  setActiveProfile: (id: string) => void;
  editActiveProfile: () => void;

  // 초기화
  initCurrentProfile: () => void;
  initDefaultProfiles: () => void;
  resetCurrentProfile: () => void;

  // 수정할 프로필 선택
  selectProfile: (profile: Profile) => void;

  // 확정된 프로필 저장
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;

  // 수정중인 프로필 정보
  setProfileName: (name: string) => void;
  setProfileImage: (image: string) => void;
  setContentLimit: (limit: number) => void;

  // 프로필 삭제
  deleteProfile: (id: string) => void;

  // 계정 리셋
  resetProfiles: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      currentUserId: null,

      initWithUser: (userId) => {
        const key = `profile-storage-${userId}`;
        const saved = localStorage.getItem(key);

        if (saved) {
          const parsed = JSON.parse(saved);

          const profiles = parsed.state.profiles ?? [];
          let activeProfileId = parsed.state.activeProfileId ?? null;
          const autoKidsLogin = parsed.state.autoKidsLogin ?? false;

          if (autoKidsLogin) {
            const kidsProfile = profiles.find((p: Profile) => p.isKids);
            if (kidsProfile) {
              activeProfileId = kidsProfile.id;
            }
          } else if (!activeProfileId && profiles.length > 0) {
            const defaultAdult = profiles.find((p: Profile) => p.id === 'default-adult');
            activeProfileId = defaultAdult?.id ?? profiles[0].id;
          }

          set({
            currentUserId: userId,
            profiles,
            activeProfileId,
            autoKidsLogin,
            currentProfile: null,
          });
        } else {
          set({
            currentUserId: userId,
            profiles: [],
            activeProfileId: null,
            currentProfile: null,
            autoKidsLogin: false,
          });
        }
      },

      profiles: [],
      currentProfile: null,

      setIsKidsProfile: (isKids) =>
        set((state) =>
          state.currentProfile
            ? {
              currentProfile: {
                ...state.currentProfile,
                isKids,
              },
            }
            : state
        ),

      autoKidsLogin: false,

      setAutoKidsLogin: (value) =>
        set((state) => {
          const next = { autoKidsLogin: value };

          saveProfilesToUserStorage({
            ...state,
            ...next,
          });

          return next;
        }),

      activeProfileId: null,

      // 아이디로 프로필 구분
      setActiveProfile: (id) =>
        set((state) => {
          const next = { activeProfileId: id };

          saveProfilesToUserStorage({
            ...state,
            ...next,
          });

          return next;
        }),

      editActiveProfile: () => {
        const { profiles, activeProfileId } = get();

        if (!activeProfileId) return;

        const active = profiles.find((p) => p.id === activeProfileId);
        if (!active) return;

        set({
          currentProfile: { ...active },
        });
      },

      resetCurrentProfile: () => set({ currentProfile: null }),

      // 생성/수정 진입 시 항상 새로 만듦
      initCurrentProfile: () =>
        set({
          currentProfile: {
            id: crypto.randomUUID(),
            name: '',
            image: '/images/profile/profile1.png',
            contentLimit: 19,
            isKids: false,
            isDefault: false,
          },
        }),

      initDefaultProfiles: () =>
        set((state) => {
          if (state.profiles.length > 0) return state;

          const profiles = [
            {
              id: 'default-adult',
              name: '계정 1',
              image: '/images/profile/profile1.png',
              contentLimit: 19,
              isKids: false,
              isDefault: true,
            },
            {
              id: 'default-kid',
              name: '키즈',
              image: '/images/profile/kidsProfile_big.svg',
              contentLimit: 12,
              isKids: true,
              isDefault: true,
            },
          ];

          return {
            profiles,
            activeProfileId: profiles[0].id,
          };
        }),

      // 반드시 복사본으로 세팅
      selectProfile: (profile) =>
        set({
          currentProfile: { ...profile },
        }),

      addProfile: (profile) =>
        set((state) => {
          const newState = {
            profiles: [...state.profiles, profile],
            currentProfile: null,
          };

          saveProfilesToUserStorage({ ...state, ...newState });
          return newState;
        }),

      updateProfile: (id, data) =>
        set((state) => {
          const prev = state.profiles.find((p) => p.id === id);

          const nextProfiles = state.profiles.map((p) => (p.id === id ? { ...p, ...data } : p));


          const next = {
            profiles: nextProfiles,
            currentProfile: null,
          };

          saveProfilesToUserStorage({
            ...state,
            ...next,
          });

          //여기서 “현재 활성 프로필”의 제한/키즈여부가 바뀌면 캐시 날리기 추가
          const isActive = state.activeProfileId === id;
          const limitChanged = prev?.contentLimit !== (data.contentLimit ?? prev?.contentLimit);
          const kidsChanged = prev?.isKids !== (data.isKids ?? prev?.isKids);

          if (isActive && (limitChanged || kidsChanged)) {
            useKidsMoiveStore.getState().clearKidsCategory?.();
          }

          return next;
        }),

      // 수정중인 프로필 변경사항
      setProfileName: (name) =>
        set((state) =>
          state.currentProfile ? { currentProfile: { ...state.currentProfile, name } } : state
        ),

      setProfileImage: (image) =>
        set((state) =>
          state.currentProfile ? { currentProfile: { ...state.currentProfile, image } } : state
        ),

      setContentLimit: (limit) =>
        set((state) =>
          state.currentProfile
            ? {
              currentProfile: {
                ...state.currentProfile,
                contentLimit: limit,
              },
            }
            : state
        ),

      deleteProfile: (id) =>
        set((state) => {
          const target = state.profiles.find((p) => p.id === id);
          if (target?.isDefault) return state;

          return {
            profiles: state.profiles.filter((p) => p.id !== id),
            currentProfile: state.currentProfile?.id === id ? null : state.currentProfile,
          };
        }),

      resetProfiles: () => ({
        profiles: [],
        currentProfile: null,
      }),
    }),
    {
      name: 'profile-storage-temp',
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
      }),
    }
  )
);
