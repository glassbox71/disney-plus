import '../scss/Top10List.scss';
import { useEffect } from 'react';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import type { title } from '../../../types/IMovie';
import { useTvStore } from '../../../store/useTvStore';

//TODO 탑10 리스트

const TvTop10List = ({ title }: title) => {
  const { onFetchTopTV, TopTV } = useTvStore();

  useEffect(() => {
    if (TopTV.length === 0) {
      onFetchTopTV();
    }
  }, [TopTV, onFetchTopTV]);

  return (
    <section className="TvTop10List Top10List">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={4.2} spaceBetween={20} className="mySwiper">
        {TopTV.slice(0, 7).map((el, i) => (
          <SwiperSlide>
            <Link to="void">
              <div className={`movieThumbnail TopNumber number${1 + i}`}>
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

export default TvTop10List;
