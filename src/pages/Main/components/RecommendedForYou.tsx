import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import '../scss/movieList.scss';
import { Link } from 'react-router-dom'; // Link 유지
import { useRecommendationStore } from '../../../store/useRecommendationStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useMovieStore } from '../../../store/useMovieStore';
import VideoPopup from './VideoPopup';

const RecommendedForYou = () => {
  const { recommendedItems, isLoading, onGenerateRecommendations } = useRecommendationStore();
  const { activeProfile } = useProfileStore();
  const { onFetchVideo } = useMovieStore();

  // --- 팝업 관련 상태 ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onGenerateRecommendations();
  }, [onGenerateRecommendations]);

  // --- 통합 핸들러 (좌표 계산) ---
  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    // 섹션 기준 상대 좌표 계산
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
        const trailer = videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
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

  if (!isLoading && recommendedItems.length === 0) return null;

  return (
    <section
      className="RecommendedForYou movieList pullInner"
      ref={containerRef}
      style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={`${activeProfile?.name || '회원'}님을 위한 취향저격 콘텐츠`} />

      {isLoading ? (
        <div className="loading-container">
          <p>추천 콘텐츠를 불러오는 중...</p>
        </div>
      ) : (
        <Swiper
          slidesPerView={6.2}
          spaceBetween={20}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper">
          {recommendedItems.map((el) => {
            const title = el.title || el.name || '제목 없음';
            const mediaType = el.media_type === 'tv' ? 'series' : 'movie';

            return (
              <SwiperSlide key={`${el.media_type}-${el.id}`}>
                {/* 기존 Link와 구조를 그대로 유지 (CSS 보존) */}
                <Link
                  to={`/play/${mediaType}/${el.id}`}
                  onMouseEnter={(e) => handleMouseEnter(e, el)}
                  onMouseLeave={() => {
                    if (hoverTimer.current) clearTimeout(hoverTimer.current);
                  }}>
                  <div className="movieThumbnail col">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                      alt={`${title} 썸네일`}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* Swiper 외부 단일 팝업 (구조에 영향 주지 않음) */}
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
            title={popupData.title || popupData.name}
            id={popupData.id}
            mediaType={popupData.media_type === 'tv' ? 'tv' : 'movie'}
            posterPath={popupData.poster_path || ''}
            backdropPath={popupData.backdrop_path}
            onClose={handleMouseLeave}
          />
        </div>
      )}
    </section>
  );
};

export default RecommendedForYou;
