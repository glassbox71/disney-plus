import '../scss/movieList.scss';
import { useEffect, useState } from 'react';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useParams } from 'react-router-dom';
import type { TV } from '../../../types/ITV';
interface keyProps {
  Key: number;
  title: string;
}

const TvKeywordList = ({ Key, title }: keyProps) => {
  const [TV, setTV] = useState<TV[]>([]);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const { id } = useParams();
  console.log('id확인', id);

  useEffect(() => {
    const onFetchTopTV = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=ko-KR&with_keywords=${Key}`
      );
      const data = await res.json();
      setTV(data.results);
    };
    // 컴포넌트가 마운트될 때 해당 키워드 ID로 데이터를 요청
    onFetchTopTV();
  }, [Key]); // Key(키워드 ID)가 바뀔 때마다 새로 호출

  console.log('TV', TV);

  return (
    <div className="TvKeywordList movieList pullInner">
      <HeaderTitle mainTitle={title} />
      <Swiper slidesPerView={6.2} spaceBetween={20} className="mySwiper">
        {/* API 결과가 TV 객체 배열이므로 바로 map을 돌립니다 */}
        {TV.map((el) => (
          <SwiperSlide key={el.id}>
            <Link to={`/play/tv/${el.id}`}>
              <div className="col movieThumbnail">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                  alt={`${el.name} 썸네일`}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default TvKeywordList;
