import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import '../scss/movieList.scss';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import { useEffect, useRef, useState } from 'react';
import { useProfileStore } from '../../../store/useProfileStore';
import { useWatchingStore } from '../../../store/useWatchingStore';
import { useMovieStore } from '../../../store/useMovieStore';
import { useTvStore } from '../../../store/useTvStore';
import VideoPopup from './VideoPopup';

const generateProgress = (id: number): number => {
  const seed = id * 9301 + 49297;
  const random = (seed % 233280) / 233280;
  return Math.floor(random * (98 - 5 + 1)) + 5;
};

const WatchList = () => {
  const { watching, onFetchWatching } = useWatchingStore();
  const { profiles, activeProfileId } = useProfileStore();
  const { onFetchVideo } = useMovieStore();
  const { onFetchTvVideo } = useTvStore();

  const [youtubeKey, setYoutubeKey] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId);

  useEffect(() => {
    if (activeProfileId) {
      onFetchWatching();
    }
  }, [activeProfileId, onFetchWatching]);

  if (!watching || watching.length === 0) return null;

  const handleMouseEnter = (id: number, mediaType: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    hoverTimer.current = setTimeout(async () => {
      try {
        let videos = [];
        // mediaType이 'tv'나 'series'로 들어올 경우를 모두 대비
        if (mediaType === 'movie') {
          videos = await onFetchVideo(id);
        } else {
          videos = await onFetchTvVideo(id);
        }

        const trailer = videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

        if (trailer) {
          setYoutubeKey(trailer.key);
        } else {
          setYoutubeKey(''); // 영상 없으면 빈값
        }

        // 영상 유무와 상관없이 팝업을 띄우기 위해 ID 설정
        setHoveredId(id);
      } catch (error) {
        console.error('비디오 로드 실패:', error);
        setYoutubeKey('');
        setHoveredId(id);
      }
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
    setYoutubeKey('');
  };

  return (
    <section className="WatchList movieList pullInner marginUp" style={{ position: 'relative' }}>
      <HeaderTitle
        mainTitle={
          activeProfile ? `${activeProfile.name}님이 시청 중인 콘텐츠` : '시청 중인 콘텐츠'
        }
      />

      <Swiper
        slidesPerView={4.3}
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="mySwiper"
        style={{ overflow: 'visible' }}>
        {watching.map((el) => {
          // [중요] 상세페이지 경로를 위한 미디어 타입 변환
          // TMDB 데이터가 'tv'로 오면 'tv'를 유지하거나, 프로젝트 구조상 'series'가 필요하면 여기서 교정
          const rawType = el.media_type || 'movie';
          const mediaTypeForPopup = rawType === 'series' ? 'tv' : rawType;

          const title = el.title || el.name;
          const progress = generateProgress(el.id);
          const isHovered = hoveredId === el.id;

          return (
            <SwiperSlide
              key={`${rawType}-${el.id}`}
              style={{ zIndex: isHovered ? 100 : 1, overflow: 'visible' }}>
              <div className="flex" onMouseLeave={handleMouseLeave}>
                <div
                  className="movieThumbnail row"
                  onMouseEnter={() => handleMouseEnter(el.id, mediaTypeForPopup)}
                  style={{ position: 'relative', cursor: 'pointer' }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${el.backdrop_path}`}
                    alt={`${title} 썸네일`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-image.png';
                    }}
                  />
                  <span className="movieTitle">{title}</span>

                  <div className="progressBar">
                    <div className="now" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                {/* youtubeKey가 있거나 빈 문자열("")이어도 hoveredId만 맞으면 팝업 노출 */}
                {isHovered && (
                  <div
                    className="video-popup-container"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                    <VideoPopup
                      youtubeKey={youtubeKey}
                      title={title || '제목 없음'}
                      id={el.id}
                      mediaType={mediaTypeForPopup as 'movie' | 'tv'}
                      posterPath={el.poster_path || ''}
                      backdropPath={el.backdrop_path}
                      onClose={handleMouseLeave}
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default WatchList;
