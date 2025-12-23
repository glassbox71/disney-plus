import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import '../scss/movieList.scss';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import { useProfileStore } from '../../../store/useProfileStore';
import { useWatchingStore } from '../../../store/useWatchingStore';
import { useMovieStore } from '../../../store/useMovieStore';
import { useTvStore } from '../../../store/useTvStore';
import VideoPopup from './VideoPopup';
import { generateProgress } from '../../../utils/progress';

const WatchList = () => {
  const { watching, onFetchWatching } = useWatchingStore();
  const { profiles, activeProfileId } = useProfileStore();
  const { onFetchVideo } = useMovieStore();
  const { onFetchTvVideo } = useTvStore();

  const [youtubeKey, setYoutubeKey] = useState('');
  const [hoveredItem, setHoveredItem] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  useEffect(() => {
    if (activeProfileId) onFetchWatching();
  }, [activeProfileId, onFetchWatching]);

  if (!watching || watching.length === 0) return null;

  /** 썸네일 hover */
  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const windowWidth = window.innerWidth;

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
      const mediaType = el.media_type === 'series' ? 'tv' : el.media_type || 'movie';

      let key = '';
      try {
        const videos =
          mediaType === 'movie' ? await onFetchVideo(el.id) : await onFetchTvVideo(el.id);

        const trailer =
          videos?.find(
            (v: any) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
          ) || videos?.find((v: any) => v.site === 'YouTube');

        key = trailer ? trailer.key : '';
      } catch (e) {
        console.error('비디오 로드 실패', e);
      }

      setYoutubeKey(key);
      setPopupPos(position);
      setHoveredItem(el);
    }, 200);
  };

  /** 팝업 닫기 (지연) */
  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    closeTimer.current = setTimeout(() => {
      setHoveredItem(null);
      setYoutubeKey('');
    }, 100);
  };

  return (
    <section
      className="WatchList movieList pullInner marginUp"
      ref={containerRef}
      style={{ position: 'relative', overflow: 'visible' }}>
      <HeaderTitle
        mainTitle={
          activeProfile ? `${activeProfile.name}님이 시청 중인 콘텐츠` : '시청 중인 콘텐츠'
        }
      />
      <Swiper
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1.8,
            spaceBetween: 8,
          },
          281: {
            slidesPerView: 2.2,
            spaceBetween: 8,
          },
          361: {
            slidesPerView: 3.4,
            spaceBetween: 16,
          },
          769: {
            slidesPerView: 3.8,
            spaceBetween: 16,
          },
          1201: {
            slidesPerView: 4.2,
            spaceBetween: 16,
          },
        }}
        className="mySwiper"
        style={{ overflow: 'visible' }}>
        {watching.map((el) => {
          const title = el.title || el.name;
          const progress = generateProgress(el.id);

          return (
            <SwiperSlide key={`${el.media_type}-${el.id}`} style={{ overflow: 'visible' }}>
              <div
                className="movieThumbnail row"
                onMouseEnter={(e) => handleMouseEnter(e, el)}
                style={{ cursor: 'pointer' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${el.backdrop_path}`}
                  alt={title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/no-image.png';
                  }}
                />
                <span className="movieTitle">{title}</span>
              </div>
              {/* 재생바 */}
              <div className="progressBar">
                <div className="now" style={{ width: `${progress}%` }} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 팝업 (Swiper 밖, section 기준) */}
      {hoveredItem && (
        <div
          className="video-popup-container-portal"
          onMouseEnter={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 20,
            left: popupPos.left,
            width: popupPos.width,
            zIndex: 9999,
            pointerEvents: 'auto',
          }}>
          <VideoPopup
            youtubeKey={youtubeKey}
            title={hoveredItem.title || hoveredItem.name || ''}
            id={hoveredItem.id}
            mediaType={
              (hoveredItem.media_type === 'series' ? 'tv' : hoveredItem.media_type) as
                | 'movie'
                | 'tv'
            }
            posterPath={hoveredItem.poster_path || ''}
            backdropPath={hoveredItem.backdrop_path}
            onClose={handleMouseLeave}
          />
        </div>
      )}
    </section>
  );
};

export default WatchList;
