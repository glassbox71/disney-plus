//TODO 메인 영화 import React from 'react'
import './scss/MainPage.scss';
import MainScreen from "./components/MainScreen"
import RecommendedForYou from "./components/RecommendedForYou"
import WatchList from "./components/WatchList"
import GenreList from './components/GenreList';
import MainBanner from './components/MainBanner';
import Top10List from './components/Top10List';
import UpcomingList from './components/UpcomingList';



//TODO 메인 영화
const MainMovie = () => {

  return (
    <section className="MainPage movie normal">
      <MainScreen />
      <WatchList />
      <RecommendedForYou />
      <Top10List title="현재 인기 영화 TOP 7" />
      <UpcomingList />
      < MainBanner num={0} />
      <GenreList genreId="28" title="액션" />
      <GenreList genreId="16" title="애니메이션" />
      <GenreList genreId="10749" title="로맨스" />
    </section>
  )
}

export default MainMovie
