import '../scss/Top10List.scss';
import { useEffect } from 'react';
import { useMovieStore } from '../../../store/useMovieStore';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';

//TODO 탑10 리스트

interface Top10Props {
  title: string | number;
}
const Top10List = ({ title }: Top10Props) => {
  const { onFetchTOP, Top } = useMovieStore();

  useEffect(() => {
    if (Top.length === 0) {
      onFetchTOP();
    }
  }, [Top, onFetchTOP]);

  console.log('Top', Top);
  return (
    <section className="Top10List">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={3.4} spaceBetween={20} className="mySwiper">
        {Top.slice(0, 10).map((el, i) => {
          return (
            <SwiperSlide>
              <Link to="void">
                <div className={`movieThumbnail TopNumber number${1 + i}`}>
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

export default Top10List;
