import { useEffect } from 'react';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { useMovieStore } from '../../../store/useMovieStore';

interface GenreListProps {
  genreId: string;
  title: string;
}

//TODO 재사용 가능한 장르 콘텐츠 목록
const GenreList = ({ genreId, title }: GenreListProps) => {
  const { movies, category, onfetchCate } = useMovieStore();
  const { kids } = useParams();

  const GenreMovies = category[genreId] || [];

  useEffect(() => {
    if (movies.length === 0) {
      onfetchCate(genreId);
    }
    console.log('????????', GenreMovies);
  }, []);

  return (
    <section className="GenreList movieList pullInner">
      <HeaderTitle mainTitle={title} />
      <Swiper
        slidesPerView={6.2}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper">
        {GenreMovies.map((el) => {
          return (
            <SwiperSlide>
              <Link className="" to={`/play/movie/${el.id}`}>
                <div className={`col movieThumbnail ${kids ? 'kids' : ''}`}>
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

export default GenreList;
