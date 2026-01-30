// //TODO 탑10 리스트

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import HeaderTitle from './HeaderTitle';
import VideoPopup from './VideoPopup';
import { useTvStore } from '../../../store/useTvStore';
import type { title } from '../../../types/IMovie';
import 'swiper/swiper.css';
import '../scss/Top10List.scss';

const TvTop10List = ({ title }: title) => {
  // useTvStore에서 인기 리스트와 비디오 페칭 함수를 가져옵니다.
  const { onFetchTopTV, TopTV, onFetchTvVideo } = useTvStore();

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (TopTV.length === 0) {
      onFetchTopTV(); //
    }
  }, [TopTV, onFetchTopTV]);

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
        // TV 전용 비디오 API 호출 (ID를 string으로 전달)
        const videos = await onFetchTvVideo(String(el.id));

        if (videos && videos.length > 0) {
          const trailer =
            videos.find(
              (v: any) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
            ) || videos.find((v: any) => v.site === 'YouTube');

          setYoutubeKey(trailer ? trailer.key : '');
        } else {
          setYoutubeKey('');
        }
      } catch (error: any) {
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
    <section className="TvTop10List Top10List" ref={containerRef} style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={title} />

      <Swiper
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
            spaceBetween: 8,
          },
          281: {
            slidesPerView: 1.8,
            spaceBetween: 8,
          },
          481: {
            slidesPerView: 2.4,
            spaceBetween: 16,
          },
          769: {
            slidesPerView: 3.4,
            spaceBetween: 16,
          },
          1201: {
            slidesPerView: 4.2,
            spaceBetween: 16,
          },
        }}
        className="mySwiper"
        style={{ overflow: 'visible' }}>
        {TopTV.slice(0, 10).map((el, i) => (
          <SwiperSlide key={el.id}>
            {/*  기존 랭킹 넘버링 클래스 구조 유지 */}
            <Link
              to={`/play/tv/${el.id}`}
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}>
              <div className={`movieThumbnail TopNumber number${1 + i}`}>
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

      {/*  10 전용 팝업 레이어 */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 20,
            left: popupPos.left - popupPos.width * 0.05,
            width: popupPos.width * 1.1,
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

export default TvTop10List;
