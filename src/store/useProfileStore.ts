import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  id: string;
  name: string;
  image: string;
  contentLimit: number;
  isKids: boolean;
  isDefault: boolean;
}

interface ProfileState {
  profiles: Profile[];

  // 임시 작업용 (생성/수정) 수정중인 프로필
  currentProfile: Profile | null;

  // 현재 내가 선택한 들어간 프로필 시청중인거
  activeProfileId: string | null;
  setActiveProfile: (id: string) => void;

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
      profiles: [],
      currentProfile: null,

      activeProfileId: null,

      // 아이디로 프로필 구분
      setActiveProfile: (id) =>
        set({
          activeProfileId: id,
        }),

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

          return {
            profiles: [
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
                contentLimit: 0,
                isKids: true,
                isDefault: true,
              },
            ],
          };
        }),

      // 반드시 복사본으로 세팅
      selectProfile: (profile) =>
        set({
          currentProfile: { ...profile },
        }),

      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles, profile],
          currentProfile: null,
        })),

      updateProfile: (id, data) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...data } : p)),
          currentProfile: null,
        })),

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
    { name: 'profile-storage' }
  )
);
