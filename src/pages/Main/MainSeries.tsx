import './scss/MainPage.scss';
import MainScreen from './components/MainScreen';
import TvRatedList from './components/TvRatedList';
import TvTop10List from './components/TvTop10List';
import TvUpcomingList from './components/TvUpcomingList';

//TODO 메인 시리즈
const MainSeries = () => {
  return (
    <section className="MainSeries MainPage normal">
      <MainScreen />
      <TvRatedList title="최고 평점 시리즈" />
      <TvUpcomingList title="공개 예정" />
      <TvTop10List title="현재 인기 시리즈 TOP 7" />
    </section>
  );
};

export default MainSeries;
