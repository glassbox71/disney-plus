import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import { useMovieStore } from '../../../store/useMovieStore';
import { Link } from 'react-router-dom';
import VideoPopup from './VideoPopup';
import 'swiper/swiper.css';
import '../scss/movieList.scss';

const UpcomingList = () => {
  const { movies, onFetchUpcoming, onFetchGenres, onFetchVideo } = useMovieStore();

  // --- 팝업 관련 상태 ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (movies.length === 0) {
      onFetchUpcoming();
      onFetchGenres();
    }
  }, [movies, onFetchUpcoming, onFetchGenres]);

  // --- 통합 핸들러 (좌표 계산) ---
  const handleMouseEnter = (e: React.MouseEvent, movie: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

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
      setPopupData(movie);
      setPopupPos(position);
      setHoveredId(movie.id);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
  };

  return (
    <section
      className="UpcomingList movieList pullInner"
      ref={containerRef}
      style={{ position: 'relative' }}>
      <HeaderTitle mainTitle="공개예정" />

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
        {movies.map((el) => (
          <SwiperSlide key={el.id}>
            {/* 기존 구조 유지 (Link > div.col.movieThumbnail) */}
            <Link
              to={`/play/movie/${el.id}`}
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}>
              <div className="col movieThumbnail">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                  alt={`${el.title} 썸네일`}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper 외부 단일 팝업 (가로 스크롤 방지 핵심) */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 10,
            left: popupPos.left - popupPos.width * 0.1,
            width: popupPos.width * 1.2,
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

export default UpcomingList;
