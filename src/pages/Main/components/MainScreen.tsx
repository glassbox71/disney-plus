import '../scss/MainScreen.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import { Pagination, Autoplay } from 'swiper/modules';
import { MainScreenData, type MainScreenItem } from '../../../store/data';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useWatchingStore } from '../../../store/useWatchingStore';
import { useEffect } from 'react';

//TODO 메인 베너
const MainScreen = () => {
  // 기본 메인 basic
  // 영화 메인 movie
  // 시리즈 메인 series
  // 오리지널 메인 original

  const navigate = useNavigate();
  const { onAddWatching, onFetchWatching } = useWatchingStore();

  useEffect(() => {
    onFetchWatching();
  }, [onFetchWatching]);

  const handleVideoOpen = async (movie: MainScreenItem) => {
    console.log('클릭 이벤트 실행');
    try {
      // TMDB API를 통해 실제 이미지 경로 가져오기
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      console.log('apikey', API_KEY);
      const endpoint =
        movie.type === 'movie'
          ? `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=ko-KR`
          : `https://api.themoviedb.org/3/tv/${movie.id}?api_key=${API_KEY}&language=ko-KR`;

      const response = await fetch(endpoint);
      const data = await response.json();

      const watchingItem = {
        id: Number(movie.id),
        poster_path: data.poster_path || '',
        backdrop_path: data.backdrop_path || '',
        currentTime: 0,
        duration: 0,
        media_type: movie.type, // ⭐ 추가
      };

      // 영화면 title, TV면 name 추가
      if (movie.type === 'movie') {
        watchingItem.title = data.title;
      } else {
        watchingItem.name = data.name;
      }

      console.log('저장할 데이터:', watchingItem);
      await onAddWatching(watchingItem);
      console.log('Firebase 저장 완료');

      // Firebase 저장 후 재생 페이지로 이동
      navigate(`/play/${movie.type}/${movie.id}/video`);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="MainScreen pullInner">
      <Swiper
        loop={true}
        pagination={true}
        modules={[Pagination, Autoplay]}
        // autoplay={{
        //   delay: 3200,
        //   disableOnInteraction: false,
        // }}
        breakpoints={{
          0: {
            slidesPerView: 1.1,
            spaceBetween: 16,
          },
          360: {
            slidesPerView: 1,
          },
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
                <div className="flexbox">
                  <button
                    className="nowPlay"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleVideoOpen(el);
                    }}>
                    지금 재생하기
                  </button>
                  <Link to={`/play/${el.type}/${el.id}`} className="detailInfo">
                    상세 정보
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="bgGra"></div>
    </div>
  );
};

export default MainScreen;
