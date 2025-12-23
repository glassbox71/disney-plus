import '../scss/SeasonDate.scss';
import '../scss/movieList.scss';
import { SeasonNavData } from '../../../store/data';
import { useMovieStore } from '../../../store/useMovieStore';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import VideoPopup from './VideoPopup';

const getDay = (dateString: string): number => {
  const [month, day] = dateString.split('-').map(Number);
  const date = new Date(2001, month - 1, day);
  const startOfYear = new Date(2001, 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const SeasonList = () => {
  const { onfetchSeason, seasonMovies, onFetchVideo } = useMovieStore();

  // --- 비디오 팝업 관련 상태 ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 현재 날짜 및 시즌 계산 로직 (기존 유지)
  const { nowDayNum } = useMemo(() => {
    const nowMonthDayStr = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
    return { nowDayNum: getDay(nowMonthDayStr) };
  }, []);

  const currentSeason = useMemo(() => {
    return SeasonNavData.find((season) => {
      const startDayNum = getDay(season.startDate);
      const endDayNum = getDay(season.endDate);
      return startDayNum <= endDayNum
        ? nowDayNum >= startDayNum && nowDayNum <= endDayNum
        : nowDayNum >= startDayNum || nowDayNum <= endDayNum;
    });
  }, [nowDayNum]);

  useEffect(() => {
    if (currentSeason) onfetchSeason(currentSeason);
  }, [currentSeason?.title, onfetchSeason]);

  // --- 통합 핸들러 ---
  const handleMouseEnter = (e: React.MouseEvent, movie: any) => {
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
    setYoutubeKey('');
    setPopupData(null);
  };

  const SeasonTitle = currentSeason
    ? `디즈니플러스 ${currentSeason.h2Title}`
    : '디즈니 추천 콘텐츠';
  const SeasonText = currentSeason ? currentSeason.text : '지금 시청할 수 있는 인기 콘텐츠';
  const SeasonLogo = currentSeason ? currentSeason.title : 'basic';

  return (
    <section
      className="SeasonList pullInner movieList"
      ref={containerRef}
      style={{ position: 'relative' }}>
      <div className="top">
        <h2>
          <div className={`logo ${SeasonLogo}`}></div>
          <div className="title">{SeasonTitle}</div>
        </h2>
        <h3>
          {SeasonText}
          <span className="arrow"></span>
        </h3>
      </div>

      <div className="SeasonListList">
        <Swiper
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 2.8,
              spaceBetween: 8,
            },
            281: {
              slidesPerView: 3.2,
              spaceBetween: 8,
            },
            361: {
              slidesPerView: 3.6,
              spaceBetween: 16,
            },
            769: {
              slidesPerView: 4.8,
              spaceBetween: 16,
            },
            1201: {
              slidesPerView: 5.4,
              spaceBetween: 16,
            },
          }}
          className="mySwiper">
          {seasonMovies.length > 0 ? (
            seasonMovies
              .filter((el) => el.poster_path)
              .slice(0, 10)
              .map((el) => (
                <SwiperSlide key={el.id}>
                  <div
                    className="movieThumbnail"
                    onMouseEnter={(e) => handleMouseEnter(e, el)}
                    style={{ cursor: 'pointer' }}>
                    <img src={`https://image.tmdb.org/t/p/w500${el.poster_path}`} alt={el.title} />
                  </div>
                </SwiperSlide>
              ))
          ) : (
            <p>데이터를 불러오는 중...</p>
          )}
        </Swiper>
      </div>

      {/* Swiper 외부 단일 팝업 렌더링 */}
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

export default SeasonList;
