//TODO 메인 영화 import React from 'react'
import './scss/MainPage.scss';
import MainScreen from "./components/MainScreen"
import RecommendedForYou from "./components/RecommendedForYou"
import WatchList from "./components/WatchList"
import GenreList from './components/GenreList';
import MainBanner from './components/MainBanner';
import Top10List from './components/Top10List';
import { useMovieStore } from '../../store/useMovieStore';
import { useEffect } from 'react';
import HeaderTitle from './components/HeaderTitle';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";


//TODO 메인 영화
const MainMovie = () => {
  const { top10, onFetchTop10 } = useMovieStore();
  useEffect(() => {
    onFetchTop10();
  }, [])
  return (
    <section className="MainPage movie normal">
      <MainScreen />
      <WatchList />
      <RecommendedForYou />
      {/* <section className="top10Wrap movieList pullInner">
        <HeaderTitle mainTitle="현재 인기 영화 TOP 10" />
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={80}
          navigation
          grabCursor
        >
          {top10.map((m, idx) => (
            <SwiperSlide key={m.id}>
              <Top10List rank={idx + 1} showRank>
                <img
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                />
              </Top10List>
            </SwiperSlide>
          ))}
        </Swiper>
      </section> */}
      < MainBanner num={0} />
      <GenreList genreId="28" title="액션" />
    </section>
  )
}

export default MainMovie
