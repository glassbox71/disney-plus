import './scss/MainPage.scss';
import MainScreen from './components/MainScreen';
import TvRatedList from './components/TvRatedList';
import TvTop10List from './components/TvTop10List';
import TvUpcomingList from './components/TvUpcomingList';
import MainBanner from './components/MainBanner';
import TvKeywordList from './components/TvKeywordList';

//TODO 메인 시리즈
const MainSeries = () => {
  return (
    <section className="MainSeries MainPage normal">
      <MainScreen />
      <TvRatedList title="최고 평점 시리즈" />
      <TvUpcomingList title="공개 예정" />
      <TvTop10List title="현재 인기 시리즈 TOP 7" />
      <MainBanner num={1} />
      <TvKeywordList title="애니메이션" Key={210024} />
      <TvKeywordList title="슈퍼히어로" Key={9715} />
      <TvKeywordList title="소설원작" Key={818} />
    </section>
  );
};

export default MainSeries;
