import '../scss/movieList.scss';
import HeaderTitle from './HeaderTitle';
import { useEffect } from 'react';
import { useTvStore } from '../../../store/useTvStore';
import type { title } from '../../../types/IMovie';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

const TvUpcomingList = ({ title }: title) => {
  const { onFetchNewTV, UpComingTv } = useTvStore();

  useEffect(() => {
    if (UpComingTv.length === 0) {
      onFetchNewTV();
    }
  }, [onFetchNewTV, UpComingTv]);

  console.log('TopTv', UpComingTv);

  return (
    <section className="TvUpcomingList movieList">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={6.2} spaceBetween={20} className="mySwiper">
        {UpComingTv.slice(0, 10).map((el) => {
          return (
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
          );
        })}
      </Swiper>
    </section>
  );
};

export default TvUpcomingList;
