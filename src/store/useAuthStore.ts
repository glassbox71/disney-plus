import { create } from 'zustand';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../api/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AuthState, KidsModeInfo, UserData } from '../types/IAuth';
import { useSubStore } from './useSubStore';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  isLogin: false,
  error: null,

  clearError: () => set({ error: null }),

  setUser: (user) => set({ user, loading: false, isLogin: !!user }),

  // 인증 상태 초기화
  initAuth: async () => {
    set({ loading: true });
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({
          user: null,
          userData: null,
          loading: false,
          isLogin: false,
        });
        console.log('사용자 로그인 상태 아님');
        return;
      }
      // 로그인된 경우 Firestore에서 사용자 데이터 가져오기
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let userData: UserData | null = null;
      if (userDoc.exists()) {
        userData = userDoc.data() as UserData;
      }
      set({ user: firebaseUser, userData, loading: false, isLogin: true });

      //Firestore에서 membership만 가져와서 subStore로 복구
      // await useSubStore.getState().fetchMembership(firebaseUser.uid);
    });
  },

  // 회원가입
  onMember: async (email, password, kidsModeData) => {
    try {
      console.log('회원가입 시작:', email);
      console.log('키즈 모드 데이터:', kidsModeData);

      // Firebase Authentication으로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('Firebase 사용자 생성 완료:', firebaseUser.uid);

      // Firestore에 저장할 사용자 정qh
      const userData = {
        uid: firebaseUser.uid,
        name: '',
        phone: '',
        email,
        nickname: '',
        file: '',
        profile: '',
        createdAt: new Date(),
        // 키즈 모드가 활성화되어 있으면 추가
        ...(kidsModeData?.isActive ? { kidsMode: { ...kidsModeData } } : {}),
      };

      if (kidsModeData?.isActive) {
        userData.kidsMode = {
          isActive: kidsModeData.isActive,
          year: kidsModeData.year,
          month: kidsModeData.month,
          date: kidsModeData.date,
        };
      }

      console.log('Firestore에 저장할 데이터:', userData);

      // Firestore의 'users' 컬렉션에 사용자 정보 저장
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, userData);

      console.log('Firestore 저장 완료');

      set({
        user: firebaseUser,
        userData,
        loading: false,
        isLogin: true,
      });

      console.log('회원가입 성공 - 모든 과정 완료');
      alert('회원가입이 완료되었습니다!');
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      alert(err.message);
      throw err;
    }
  },

  // 기본 로그인
  onLogin: async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Firestore에서 사용자 정보 가져오기
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let userData: UserData | null = null;

      if (userDoc.exists()) {
        userData = userDoc.data() as UserData;
      }

      set({
        user: firebaseUser,
        userData,
        isLogin: true,
      });

      console.log('로그인 성공');
    } catch (err: any) {
      console.error('로그인 실패:', err);
      alert(err.message);
      throw err;
    }
  },

  // 구글 로그인
  onGoogleLogin: async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Firestore에서 사용자 정보 확인
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let userData: UserData;

      if (!userDoc.exists()) {
        // 신규 사용자인 경우 정보 저장
        userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          phone: '',
          email: firebaseUser.email || '',
          nickname: '',
          file: firebaseUser.photoURL || '',
          profile: firebaseUser.photoURL || '',
          createdAt: new Date(),
        };

        await setDoc(userRef, userData);
      } else {
        userData = userDoc.data() as UserData;
      }

      set({
        user: firebaseUser,
        userData,
        isLogin: true,
      });

      console.log('구글 로그인 성공');
    } catch (err: any) {
      console.error('구글 로그인 실패:', err);
      alert(err.message);
      throw err;
    }
  },

  // 키즈모드 업데이트
  updateKidsMode: async (kidsMode: KidsModeInfo) => {
    try {
      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('로그인이 필요합니다.');
      }

      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          kidsMode: {
            isActive: kidsMode.isActive,
            year: kidsMode.year,
            month: kidsMode.month,
            date: kidsMode.date,
          },
        },
        { merge: true }
      );

      // 업데이트
      const userData = get().userData;
      if (userData) {
        set({
          userData: {
            ...userData,
            kidsMode,
          },
        });
      }
      console.log('키즈 모드 업데이트 완료');
    } catch (err: any) {
      console.error(err.message);
    }
  },

  // 로그아웃
  onLogout: async () => {
    await signOut(auth);
    set({ user: null, userData: null, isLogin: false });
    console.log('로그아웃 완료');
  },
}));
