import { useEffect, useRef, useState } from 'react';
import { useTvStore } from '../../../store/useTvStore';
import type { title } from '../../../types/IMovie';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import VideoPopup from './VideoPopup';
import HeaderTitle from './HeaderTitle';
import 'swiper/swiper.css';
import '../scss/movieList.scss';

const TvRatedList = ({ title }: title) => {
  // useTvStore에서 평점 높은 리스트와 TV 전용 비디오 페칭 함수를 가져옵니다.
  const { onFetchRated, RatedTv, onFetchTvVideo } = useTvStore();

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (RatedTv.length === 0) {
      onFetchRated(); //
    }
  }, [onFetchRated, RatedTv]);

  // 마우스 진입 시 좌표 계산 및 TV 비디오 로드
  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    const position = {
      top: rect.top - (containerRect?.top || 0),
      left: rect.left - (containerRect?.left || 0),
      width: rect.width,
    };

    hoverTimer.current = setTimeout(async () => {
      setPopupData(el);
      setPopupPos(position);
      setHoveredId(el.id);

      try {
        // TV 전용 비디오 API 호출 (ID를 string으로 변환하여 전달)
        const videos = await onFetchTvVideo(String(el.id));

        if (videos && videos.length > 0) {
          // Trailer 또는 Teaser 중 YouTube 영상을 우선적으로 찾습니다.
          const trailer =
            videos.find(
              (v: any) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
            ) || videos.find((v: any) => v.site === 'YouTube');

          setYoutubeKey(trailer ? trailer.key : '');
        } else {
          setYoutubeKey('');
        }
      } catch (error) {
        console.error('TV 비디오 로드 실패:', error);
        setYoutubeKey('');
      }
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
    setYoutubeKey('');
    setPopupData(null);
  };

  return (
    <section
      className="TvRatedList movieList pullInner"
      ref={containerRef}
      style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={title} />

      <Swiper
        slidesPerView={6.2}
        spaceBetween={20}
        className="mySwiper"
        style={{ overflow: 'visible' }}>
        {RatedTv.slice(0, 10).map((el) => (
          <SwiperSlide key={el.id}>
            <Link
              to={`/play/tv/${el.id}`}
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}>
              <div className="movieThumbnail">
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

      {/* TV 전용 팝업 레이어 */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 15,
            left: popupPos.left - popupPos.width * 0.1,
            width: popupPos.width * 1.2,
            zIndex: 9999,
            pointerEvents: 'auto',
          }}>
          <VideoPopup
            youtubeKey={youtubeKey}
            title={popupData.name}
            id={popupData.id}
            mediaType="tv"
            posterPath={popupData.poster_path || ''}
            backdropPath={popupData.backdrop_path}
            onClose={handleMouseLeave}
          />
        </div>
      )}
    </section>
  );
};

export default TvRatedList;
