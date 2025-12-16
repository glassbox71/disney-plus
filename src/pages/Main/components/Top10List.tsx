import '../scss/Top10List.scss';
import { useEffect } from 'react';
import { useMovieStore } from '../../../store/useMovieStore';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import type { title } from '../../../types/IMovie';

//TODO 탑10 리스트

const Top10List = ({ title }: title) => {
  const { onFetchTOP, Top } = useMovieStore();

  useEffect(() => {
    if (Top.length === 0) {
      onFetchTOP();
    }
  }, [Top, onFetchTOP]);

  return (
    <section className="Top10List">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={3.4} spaceBetween={20} className="mySwiper">
        {Top.slice(0, 10).map((el, i) => {
          return (
            <SwiperSlide>
              <Link to="void">
                <div className={`movieThumbnail TopNumber number${1 + i}`}>
                  <div className="imgBox">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                      alt={`${el.title} 썸네일`}
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

export default Top10List;
