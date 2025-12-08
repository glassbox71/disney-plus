import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './pages/Header/Header';
import MainPage from './pages/Main/MainPage';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
