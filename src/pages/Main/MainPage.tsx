import MainScreen from './components/MainScreen';
import WatchList from './components/WatchList';
import './scss/MainPage.scss';
import RecommendedForYou from './components/RecommendedForYou';
import ThemeList from './components/ThemeList';
import UpcomingList from './components/UpcomingList';
import GenreList from './components/GenreList';

// 12: "모험"
// 14: "판타지"
// 16: "애니메이션"
// 18: "드라마"
// 27: "공포"
// 28: "액션"
// 35: "코미디"
// 36: "역사"
// 37: "서부"
// 53: "스릴러"
// 80: "범죄"
// 99: "다큐멘터리"
// 878: "SF"
// 9648: "미스터리"
// 10402: "음악"
// 10749: "로맨스"
// 10751: "가족"
// 10752: "전쟁"
// 10770: "TV 영화"
const MainPage = () => {
  return (
    <section className="MainPage normal">
      <MainScreen />
      <WatchList />
      <GenreList genreId="27" title="공포" />
      <RecommendedForYou />
      <ThemeList />
      <UpcomingList />
      <GenreList genreId="16" title="애니메이션" />
      <GenreList genreId="10749" title="로맨스" />
    </section>
  );
};

export default MainPage;
