import MainScreen from './components/MainScreen';
import WatchList from './components/WatchList';
import './scss/MainPage.scss';
import RecommendedForYou from './components/RecommendedForYou';
import ThemeList from './components/ThemeList';
import UpcomingList from './components/UpcomingList';
import GenreList from './components/GenreList';

const MainPage = () => {
  return (
    <section className="MainPage normal">
      <MainScreen />
      <WatchList />
      <RecommendedForYou />
      <ThemeList />
      <GenreList genreId="16" title="애니메이션" />
      <UpcomingList />
      <GenreList genreId="10749" title="로맨스" />
    </section>
  );
};

export default MainPage;
