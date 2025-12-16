import '../scss/movieList.scss';
import { useEffect } from 'react';
import HeaderTitle from './HeaderTitle';
import { useMovieStore } from '../../../store/useMovieStore';
import type { title } from '../../../types/IMovie';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

const LatestList = ({ title }: title) => {
  const { onfetchLatest, Latest } = useMovieStore();

  useEffect(() => {
    if (Latest.length === 0) {
      onfetchLatest();
    }
  });
  console.log('Latest', Latest);

  return (
    <section className="LatestList movieList">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={6.2} spaceBetween={20} className="mySwiper">
        {Latest.map((el) => {
          return (
            <SwiperSlide>
              <Link className="" to="void">
                <div className="movieThumbnail">
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
    </section>
  );
};

export default LatestList;
