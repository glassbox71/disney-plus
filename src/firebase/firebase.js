// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDgyRq9ymznzJi4HP6QkuVbQgXkX2LdEs",
  authDomain: "ott-sample-3c668.firebaseapp.com",
  projectId: "ott-sample-3c668",
  storageBucket: "ott-sample-3c668.firebasestorage.app",
  messagingSenderId: "85853357886",
  appId: "1:85853357886:web:f5258e7f05f0335b624e6f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app); // 권한설정 내보내기
export const db = getFirestore(app); // 파이어베이스 내보내기
export const storage = getStorage(app);
