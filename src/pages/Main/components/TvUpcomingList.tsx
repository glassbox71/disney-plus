import { useEffect, useRef, useState } from 'react';
import { useTvStore } from '../../../store/useTvStore';
import type { title } from '../../../types/IMovie';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import VideoPopup from './VideoPopup';
import HeaderTitle from './HeaderTitle';
import 'swiper/swiper.css';
import '../scss/movieList.scss';

const TvUpcomingList = ({ title }: title) => {
  // useTvStore에서 TV 전용 데이터와 페칭 함수를 가져옵니다.
  const { onFetchNewTV, UpComingTv, onFetchTvVideo } = useTvStore();

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (UpComingTv.length === 0) {
      onFetchNewTV(); //
    }
  }, [onFetchNewTV, UpComingTv]);

  // 마우스 진입 시 좌표 계산 및 비디오 로드
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
      // 팝업창 기본 정보 먼저 세팅 (즉시 반응을 위해)
      setPopupData(el);
      setPopupPos(position);
      setHoveredId(el.id);

      try {
        // 중요: useTvStore의 onFetchTvVideo를 호출합니다.
        // 스토어 정의에 따라 ID를 string으로 변환하여 전달합니다.
        const videos = await onFetchTvVideo(String(el.id));

        if (videos && videos.length > 0) {
          // 트레일러(Trailer)나 티저(Teaser) 중 YouTube 영상을 우선적으로 찾습니다.
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
      className="TvUpcomingList movieList pullInner"
      ref={containerRef}
      style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={title} />

      <Swiper
        slidesPerView={6.2}
        spaceBetween={20}
        className="mySwiper"
        style={{ overflow: 'visible' }}>
        {UpComingTv.slice(0, 10).map((el) => (
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

      {/* 좌표 기반 팝업 출력 */}
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
            title={popupData.name} // TV는 name 속성 사용
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

export default TvUpcomingList;
