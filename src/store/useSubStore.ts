import { create } from "zustand";
import type { SubPlan } from "./subscription";
import { auth, db } from "../api/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";


interface MembershipState {
    membership: SubPlan | null;
    loading: boolean;
    setMembership: (plan: SubPlan) => void;
    saveMenbership: (plan: SubPlan) => Promise<void>;
    clearMembership: () => void;
}

export const useSubStore = create<MembershipState>((set) => ({
    membership: null,
    loading: false,

    //TODO 구독 전역으로 저장
    setMembership: (plan) => {
        set({ membership: plan })
        // console.log(plan)
    },

    //TODO 구독 파이어베이스에 저장
    saveMenbership: async (plan) => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("로그인 필요");
        const membership = {
            ...plan,
            status: "active",
            startedAt: Date.now(),
        };

        const ref = doc(db, "users", uid);

        await setDoc(
            ref,
            {
                membership,
                updateAt: serverTimestamp(),
            },
            { merge: true }
        );

        set({ membership })
    },

    //TODO
    fetchMembership: async (uidParam: string) => {
        const uid = uidParam ?? auth.currentUser?.uid;
        if (!uid) return;

        set({ loading: true });
        try {
            const ref = doc(db, "users", uid);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                set({ membership: null, loading: false });
                return;
            }

            const data = snap.data();
            set({ membership: (data.membership ?? null) as SubPlan | null, loading: false });
        } catch (e) {
            set({ loading: false });
            throw e;
        }
    },

    //TODO 구독삭제
    clearMembership: () =>
        set({ membership: null }),

}))