import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import '../scss/ThemeList.scss';
import '../scss/movieList.scss';
import { ThemeListNavData } from '../../../store/data';
import { useMovieStore } from '../../../store/useMovieStore';
import { Link } from 'react-router-dom'; // Link 복구
import VideoPopup from './VideoPopup';

const ThemeList = () => {
  const { onfetchTheme, themeMovies, isLoading, onFetchVideo } = useMovieStore();
  const [activeTheme, setActiveTheme] = useState(ThemeListNavData[0].title);

  // --- 팝업 상태 ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedRef = useRef(false);

  const activeThemeData = ThemeListNavData.find((v) => v.title === activeTheme);
  const activeThemeId = activeThemeData?.companyId ?? '';
  const activeThemeText = activeThemeData?.text ?? '';

  useEffect(() => {
    if (!activeThemeId) return;
    onfetchTheme(activeThemeId);
  }, [activeThemeId, onfetchTheme]);

  const handleMouseEnter = (e: React.MouseEvent, movie: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

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
  };

  const skeletonClassName = isLoading ? 'skeleton' : 'hidden skeleton';

  return (
    // 기존 클래스명 ThemeList 유지
    <section className="ThemeList ThemeWrap" ref={containerRef} style={{ position: 'relative' }}>
      <nav className="menu">
        <ul>
          {ThemeListNavData.map((v, i) => (
            <li
              key={i}
              className={`${v.title} ${v.title === activeTheme ? 'active' : ''}`}
              onClick={() => {
                setActiveTheme(v.title);
                fetchedRef.current = false;
                setHoveredId(null);
              }}
            />
          ))}
        </ul>

        {/* 기존 div 구조와 클래스명 ThemeList 절대 유지 */}
        <div className="ThemeList">
          <div className="themeText">
            <p>{activeThemeText}</p>
            <button>둘러보기</button>
          </div>

          <div className="themeMovie">
            <div className={skeletonClassName}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="div"></div>
              ))}
            </div>

            {!isLoading && themeMovies.length > 0 && (
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
                }}>
                {themeMovies
                  .filter((el) => el.poster_path)
                  .slice(0, 10)
                  .map((el) => (
                    <SwiperSlide key={el.id}>
                      {/* 기존 Link 구조 복구 (CSS 깨짐 방지 핵심) */}
                      <Link
                        to={`/play/movie/${el.id}`}
                        onMouseEnter={(e) => handleMouseEnter(e, el)}
                        onMouseLeave={() => {
                          if (hoverTimer.current) clearTimeout(hoverTimer.current);
                        }}>
                        <img
                          src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
                          alt={el.title}
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
              </Swiper>
            )}
          </div>
        </div>
      </nav>

      {/* 팝업 포털 - 구조 밖에서 렌더링되므로 기존 CSS에 영향 미치지 않음 */}
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

export default ThemeList;
