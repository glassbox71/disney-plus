// import { useEffect } from 'react';
// import { useMovieStore } from '../../../store/useMovieStore';
import HeaderTitle from '../../Main/components/HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import '../scss/SearchTop10List.scss';

//TODO 탑10 리스트

interface SearchTop10Props {
  title: string | number;
  data: [];
}

const SearchTop10List = ({ title, data }: SearchTop10Prop) => {
  if (!data || data.length === 0) return null;

  console.log('Top', data);
  return (
    <section className="searchTop10List">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={5.3} spaceBetween={20} className="mySwiper">
        {data.slice(0, 10).map((el, i) => {
          return (
            <SwiperSlide>
              <Link to="void">
                <div className="movieThumbnail">
                  <div className="imgBox">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                      alt={`${el.title || el.name} 썸네일`}
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

export default SearchTop10List;
