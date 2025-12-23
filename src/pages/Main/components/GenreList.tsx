import { useEffect, useRef, useState } from 'react';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useMatch } from 'react-router-dom';
import { useMovieStore } from '../../../store/useMovieStore';
import VideoPopup from './VideoPopup';

interface GenreListProps {
  genreId: string;
  title: string;
}

const GenreList = ({ genreId, title }: GenreListProps) => {
  const { category, onfetchCate, onFetchVideo } = useMovieStore();
  const isKids = useMatch('/kids/*');
  const GenreMovies = category[genreId] || [];

  // --- 비디오 팝업 관련 상태 ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (GenreMovies.length === 0) {
      onfetchCate(genreId);
    }
  }, [genreId, onfetchCate, GenreMovies.length]);

  // --- 통합 핸들러 (좌표 계산 포함) ---
  const handleMouseEnter = (e: React.MouseEvent, movie: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    // 섹션(.GenreList) 기준 상대 좌표 계산
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    const position = {
      top: rect.top - (containerRect?.top || 0),
      left: rect.left - (containerRect?.left || 0),
      width: rect.width,
    };

    hoverTimer.current = setTimeout(async () => {
      try {
        const videos = await onFetchVideo(movie.id);
        const trailer = videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        setYoutubeKey(trailer ? trailer.key : '');
      } catch (error) {
        setYoutubeKey('');
      }
      // 영상 유무와 상관없이 팝업을 띄우기 위해 데이터 설정
      setPopupData(movie);
      setPopupPos(position);
      setHoveredId(movie.id);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
    setYoutubeKey('');
    setPopupData(null);
  };

  return (
    <section
      className="GenreList movieList pullInner"
      ref={containerRef}
      style={{ position: 'relative' }} // 팝업의 기준점
    >
      <HeaderTitle mainTitle={title} />
      <Swiper
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 2.2,
            spaceBetween: 8,
          },
          281: {
            slidesPerView: 3.1,
            spaceBetween: 8,
          },
          481: {
            slidesPerView: 4.1,
            spaceBetween: 16,
          },
          769: {
            slidesPerView: 5.4,
            spaceBetween: 16,
          },
          1201: {
            slidesPerView: 6.2,
            spaceBetween: 16,
          },
        }}
        className="mySwiper">
        {GenreMovies.map((el) => (
          <SwiperSlide key={el.id}>
            <div
              className={`col movieThumbnail ${isKids ? 'kids' : ''}`}
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              style={{ cursor: 'pointer' }}>
              <img src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`} alt={el.title} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper 외부 단일 팝업 렌더링 (포털 방식) */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 15, // 살짝 위로 띄움
            left: popupPos.left - popupPos.width * 0.1, // 좌우 균형 있게 확대
            width: popupPos.width * 1.2, // 썸네일보다 1.2배 크게
            zIndex: 1000,
            pointerEvents: 'auto',
          }}>
          <VideoPopup
            youtubeKey={youtubeKey}
            title={popupData.title}
            id={popupData.id}
            mediaType="movie"
            posterPath={popupData.poster_path || ''}
            backdropPath={popupData.backdrop_path}
            onClose={handleMouseLeave}
          />
        </div>
      )}
    </section>
  );
};

export default GenreList;
