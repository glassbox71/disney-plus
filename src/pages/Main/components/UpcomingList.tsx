import '../scss/UpcomingList.scss';
import 'swiper/swiper.css';
import '../scss/movieList.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import { useMovieStore } from '../../../store/useMovieStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

//TODO 개봉 예정 콘텐츠
const UpcomingList = () => {
  const { movies, genres, onFetchUpcoming, onFetchGenres } = useMovieStore();

  useEffect(() => {
    if (movies.length === 0) {
      onFetchUpcoming();
      onFetchGenres();
    }
  }, [movies, genres, onFetchUpcoming, onFetchGenres]);

  return (
    <section className="UpcomingList movieList pullInner">
      <HeaderTitle mainTitle="공개예정" />
      <>
        <Swiper
          slidesPerView={6.2}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper">
          {movies.map((el) => {
            return (
              <SwiperSlide>
                <Link className="" to="void">
                  <div className="col movieThumbnail">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                      alt={`${el.title} 썸네일`}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    </section>
  );
};

export default UpcomingList;
