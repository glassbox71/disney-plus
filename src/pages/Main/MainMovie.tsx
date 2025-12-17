//TODO 메인 영화 import React from 'react'
import './scss/MainPage.scss';
import MainScreen from "./components/MainScreen"
import RecommendedForYou from "./components/RecommendedForYou"
import WatchList from "./components/WatchList"
import GenreList from './components/GenreList';
import MainBanner from './components/MainBanner';



//TODO 메인 영화
const MainMovie = () => {

  return (
    <section className="MainPage movie normal">
      <MainScreen />
      <WatchList />
      <RecommendedForYou />
      < MainBanner num={0} />
      <GenreList genreId="28" title="액션" />
    </section>
  )
}

export default MainMovie
