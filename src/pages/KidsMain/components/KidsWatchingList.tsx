import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import '../../Main/scss/movieList.scss';
import { Pagination } from 'swiper/modules';
import { useMatch } from 'react-router-dom';
import HeaderTitle from '../../Main/components/HeaderTitle';
import VideoPopup from '../../Main/components/VideoPopup';
import { useWatchingStore } from '../../../store/useWatchingStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useMovieStore } from '../../../store/useMovieStore';
import { useTvStore } from '../../../store/useTvStore';
import { generateProgress } from '../../../utils/progress';

const WatchList = () => {
  const { watching, onFetchWatching } = useWatchingStore();
  const { activeProfile } = useProfileStore();
  const { onFetchVideo } = useMovieStore();
  const { onFetchTvVideo } = useTvStore();

  const isKidsPath = !!useMatch('/kids/*');

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeProfile) return;

    const fetchWatching = async () => {
      await onFetchWatching();
    };

    fetchWatching();
  }, [activeProfile, onFetchWatching]);

  const displayWatching = watching
    .filter((item: any) => item.id && item.poster_path)
    .map((item: any) => ({
      ...item,
      media_type: item.media_type || (item.title ? 'movie' : 'tv'),
    }));

  if (displayWatching.length === 0) return null;

  /** 썸네일 hover */
  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    const position = {
      top: rect.top - (containerRect?.top || 0),
      left: rect.left - (containerRect?.left || 0),
      width: rect.width,
    };

    hoverTimer.current = setTimeout(async () => {
      const mediaType = el.media_type || (el.title ? 'movie' : 'tv');

      let key = '';
      try {
        const videos =
          mediaType === 'tv' ? await onFetchTvVideo(String(el.id)) : await onFetchVideo(el.id);

        const trailer =
          videos?.find(
            (v: any) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
          ) || videos?.find((v: any) => v.site === 'YouTube');

        key = trailer ? trailer.key : '';
      } catch (e) {
        console.error('비디오 로드 실패', e);
      }

      setYoutubeKey(key);
      setPopupData({ ...el, media_type: mediaType });
      setPopupPos(position);
      setHoveredId(el.id);
    }, 400);
  };

  /** 닫기 (지연 처리) */
  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    closeTimer.current = setTimeout(() => {
      setHoveredId(null);
      setPopupData(null);
      setYoutubeKey('');
    }, 150);
  };

  if (!displayWatching || displayWatching.length === 0) return null;

  return (
    <section
      className="WatchList movieList pullInner marginUp"
      ref={containerRef}
      style={{ position: 'relative', overflow: 'visible' }}>
      <HeaderTitle mainTitle={`${activeProfile?.name || '회원'}님이 시청 중인 콘텐츠`} />

      <Swiper
        slidesPerView={4.3}
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="mySwiper"
        style={{ overflow: 'visible' }}>
        {displayWatching.map((el, idx) => {
          const mediaType = el.media_type || (el.title ? 'movie' : 'tv');
          const progress = generateProgress(el.id);

          return (
            <SwiperSlide key={`${el.id}-${idx}`} style={{ overflow: 'visible' }}>
              <div className="hover-target" onMouseEnter={(e) => handleMouseEnter(e, el)}>
                <div className={`movieThumbnail row ${isKidsPath ? 'kids' : ''}`}>
                  <img
                    src={
                      el.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500/${el.backdrop_path}`
                        : '/images/no-image.png'
                    }
                    alt={el.title || el.name}
                  />
                  <span className="movieTitle">{el.title || el.name}</span>
                </div>
              </div>
              {/* 재생바 */}
              <div className="progressBar">
                <div className="now" style={{ width: `${progress}%` }} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 팝업 (Swiper 밖 / Section 안) */}
      {hoveredId && popupData && (
        <div
          className="external-popup-portal"
          onMouseEnter={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
          }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: popupPos.top - 10,
            left: popupPos.left,
            width: popupPos.width,
            zIndex: 10000,
            pointerEvents: 'auto',
          }}>
          <VideoPopup
            youtubeKey={youtubeKey}
            title={popupData.title || popupData.name}
            id={popupData.id}
            mediaType={popupData.media_type}
            posterPath={popupData.poster_path || ''}
            backdropPath={popupData.backdrop_path}
            onClose={handleMouseLeave}
          />
        </div>
      )}
    </section>
  );
};

export default WatchList;
