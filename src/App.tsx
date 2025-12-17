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
import Footer from './pages/Footer/Footer';
import MainMovie from './pages/Main/MainMovie';
import MainSeries from './pages/Main/MainSeries';
import MainOriginal from './pages/Main/MainOriginal';
import ProfileSelectPage from './pages/ProfileSelect/ProfileSelectPage';
import ProfileCreatePageImage from './pages/ProfileCreate/ProfileCreatePageImage';
import ProfileCreatePageInfo from './pages/ProfileCreate/ProfileCreatePageInfo';
import SubComplete from './pages/Subscription/components/SubComplete';
import KidsMainPage from './pages/KidsMain/KidsMainPage';
import VideoPlayer from './pages/VideoPlayer/VideoPlayer';
import SearchPage from './pages/Search/SearchPage';

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
        <Route path="/play/:type/:id" element={<VideoPlayer />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/subscription/success" element={<SubComplete />} />
        <Route path="/profile/setting" element={<ProfileSettingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile/select" element={<ProfileSelectPage />} />
        <Route path="profile/create/image" element={<ProfileCreatePageImage />} />
        <Route path="profile/create/info" element={<ProfileCreatePageInfo />} />
        <Route path="kids" element={<KidsMainPage />} />
        <Route path="search" element={<SearchPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
