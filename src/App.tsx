import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './pages/Header/Header';
import MainPage from './pages/Main/MainPage';
import SubscriptionPage from './pages/Subscription/SubscriptionPage';
import ProfileSettingPage from './pages/ProfileSetting/ProfileSettingPage';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/profile/setting" element={<ProfileSettingPage />} />
      </Routes>
    </div>
  );
}

export default App;
