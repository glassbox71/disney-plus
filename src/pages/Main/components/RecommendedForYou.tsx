import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import '../scss/movieList.scss';
import { Link } from 'react-router-dom';
import { useRecommendationStore } from '../../../store/useRecommendationStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useMovieStore } from '../../../store/useMovieStore';
import { useWatchingStore } from '../../../store/useWatchingStore'; // 추가
import VideoPopup from './VideoPopup';

const RecommendedForYou = () => {
  const { recommendedItems, isLoading, onGenerateRecommendations } = useRecommendationStore();
  const { profiles, activeProfileId } = useProfileStore();
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  const { watching } = useWatchingStore(); // 시청 목록 감시를 위해 추가
  const { onFetchVideo } = useMovieStore();

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ⭐ 수정 1: 새로고침 대응 및 시청 목록 변화 시 추천 다시 생성
  useEffect(() => {
    if (activeProfileId) {
      onGenerateRecommendations();
    }
  }, [activeProfileId, watching.length, onGenerateRecommendations]);

  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // ⭐ 수정 2: 팝업 잘림 방지 로직 (WatchList와 동일하게 적용)
    let leftPos = rect.left - (containerRect?.left || 0);
    const popupWidth = rect.width * 1.3;

    if (leftPos < 0) leftPos = 0;
    if (rect.left + popupWidth > windowWidth) {
      leftPos = leftPos - (popupWidth - rect.width);
    }

    const position = {
      top: rect.top - (containerRect?.top || 0),
      left: leftPos,
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
      style={{ position: 'relative', overflow: 'visible' }} // overflow visible 추가
    >
      {/* ⭐ 수정 3: 타이틀 이름 수정 */}
      <HeaderTitle
        mainTitle={activeProfile ? `${activeProfile.name}님을 위한 취향저격 콘텐츠` : '추천 콘텐츠'}
      />

      {isLoading ? (
        <div className="loading-container" style={{ padding: '40px', color: '#aaa' }}>
          <p>추천 콘텐츠를 불러오는 중...</p>
        </div>
      ) : (
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          breakpoints={{
            0: {
              slidesPerView: 2.2,
              spaceBetween: 8,
            },
            281: {
              slidesPerView: 3.1,
              spaceBetween: 8,
            },
            361: {
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
          className="mySwiper"
          style={{ overflow: 'visible' }} // Swiper 잘림 방지
        >
          {recommendedItems.map((el) => {
            const title = el.title || el.name || '제목 없음';
            const mediaType = el.media_type;

            return (
              <SwiperSlide key={`${el.media_type}-${el.id}`} style={{ overflow: 'visible' }}>
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
                        e.currentTarget.src = '/images/no-image.png';
                      }}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* 팝업 포털 */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseEnter={() => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 10,
            left: popupPos.left,
            width: popupPos.width,
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
