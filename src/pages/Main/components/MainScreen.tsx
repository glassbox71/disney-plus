import '../scss/MainScreen.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import { Pagination, Autoplay } from 'swiper/modules';
import { MainScreenData } from '../../../store/data';
import { Link } from 'react-router-dom';

const MainScreen = () => {
  // 기본 메인 basic
  // 영화 메인 movie
  // 시리즈 메인 series
  // 오리지널 메인 original
  return (
    <div className="MainScreen">
      <Swiper
        loop={true}
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 3200,
          disableOnInteraction: false,
        }}
        className="mySwiper">
        {MainScreenData.map((el) => {
          return (
            <SwiperSlide className={el.alt} key={el.alt}>
              <div className="textBox">
                <div className={`movieTitleImg ${el.alt}`}></div>
                <div className="movieInfo">
                  <div className={`age age${el.age}`}></div>
                  <div className="releaseDate">2020</div>
                  <div className="genreTitle">{el.genre_title}</div>
                </div>
                <div className="overview">{el.overview}</div>
                <Link to="void" className="nowPlay">
                  지금 재생하기
                </Link>
                <Link to="void" className="detailInfo">
                  상세 정보
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MainScreen;
