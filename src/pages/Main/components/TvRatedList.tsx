import '../scss/movieList.scss';
import { useEffect } from 'react';
import { useTvStore } from '../../../store/useTvStore';
import type { title } from '../../../types/IMovie';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

const TvRatedList = ({ title }: title) => {
  const { onFetchRated, RatedTv } = useTvStore();

  useEffect(() => {
    if (RatedTv.length === 0) {
      onFetchRated();
    }
  }, [onFetchRated, RatedTv]);

  console.log('RatedTv', RatedTv);

  return (
    <section className="TvRatedList movieList">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={6.2} spaceBetween={20} className="mySwiper">
        {RatedTv.slice(0, 10).map((el) => (
          <SwiperSlide>
            <Link to="void">
              <div className="movieThumbnail">
                <div className="imgBox">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                    alt={`${el.name} 썸네일`}
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default TvRatedList;
