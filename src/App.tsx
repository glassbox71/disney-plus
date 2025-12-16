import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './pages/Header/Header';
import MainPage from './pages/Main/MainPage';
import SubscriptionPage from './pages/Subscription/SubscriptionPage';
import PaymentPage from './pages/Subscription/PaymentPage';
import ProfileSettingPage from './pages/ProfileSetting/ProfileSettingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import ProfileEditPage from './pages/ProfileEdit/ProfileEditPage';
import MainMovie from './pages/Main/MainMovie';
import MainSeries from './pages/Main/MainSeries';
import MainOriginal from './pages/Main/MainOriginal';
import SearchPage from './pages/Search/SearchPage';
import Footer from './pages/Footer/Footer';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth(); // 앱 시작 시 로그인 상태 초기화
  }, [initAuth]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie" element={<MainMovie />} />
        <Route path="/series" element={<MainSeries />} />
        <Route path="/original" element={<MainOriginal />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/profile/setting" element={<ProfileSettingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
