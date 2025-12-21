import { useEffect, useState, useRef } from 'react';
import { useMovieStore } from '../../../store/useMovieStore';
import HeaderTitle from './HeaderTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import type { title } from '../../../types/IMovie';
import VideoPopup from './VideoPopup';
import '../scss/movieList.scss';
import '../scss/Top10List.scss';

const Top10List = ({ title }: title) => {
  const { onFetchTOP, Top, onFetchVideo } = useMovieStore();

  // --- 팝업 관련 상태 (기능만 추가) ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Top.length === 0) {
      onFetchTOP();
    }
  }, [Top, onFetchTOP]);

  // --- 팝업 핸들러 (기존 구조를 방해하지 않음) ---
  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    // 섹션 기준 좌표 계산 (팝업 위치용)
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    const position = {
      top: rect.top - (containerRect?.top || 0),
      left: rect.left - (containerRect?.left || 0),
      width: rect.width,
    };

    hoverTimer.current = setTimeout(async () => {
      try {
        const videos = await onFetchVideo(el.id);
        const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        setYoutubeKey(trailer ? trailer.key : '');
      } catch (error) {
        setYoutubeKey('');
      }
      setPopupData(el);
      setPopupPos(position);
      setHoveredId(el.id);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
  };

  return (
    // ref 추가 외에 section 클래스명 유지
    <section className="Top10List" ref={containerRef} style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={title} />

      {/* Swiper 스타일 및 구조 유지 */}
      <Swiper slidesPerView={4.2} spaceBetween={20} className="mySwiper">
        {Top.slice(0, 10).map((el, i) => (
          <SwiperSlide key={el.id}>
            {/* 기존 Link -> div(TopNumber) -> div(imgBox) 구조를 그대로 유지 */}
            <Link
              to={`/play/movie/${el.id}`}
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}>
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
        ))}
      </Swiper>

      {/* 팝업은 Swiper 외부에서 별도로 렌더링 (구조에 영향 0%) */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 10,
            left: popupPos.left + popupPos.width * 0.1,
            width: popupPos.width * 1.1,
            zIndex: 1000,
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

export default Top10List;
