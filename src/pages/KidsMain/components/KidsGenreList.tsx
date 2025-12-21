import { useEffect, useRef, useState } from 'react';
import '../../Main/scss/movieList.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Link, useMatch } from 'react-router-dom';
import HeaderTitle from '../../Main/components/HeaderTitle';
import { useKidsMoiveStore } from '../../../store/useKidsMovieStore';
import { useMovieStore } from '../../../store/useMovieStore'; // 비디오 페칭용
import VideoPopup from '../../Main/components/VideoPopup'; // 경로 확인 필요
import 'swiper/swiper.css';

interface GenreListProps {
  genreId: string;
  title: string;
}

const KidsGenreList = ({ genreId, title }: GenreListProps) => {
  const { category, onFetchKidsCate } = useKidsMoiveStore();
  const { onFetchVideo } = useMovieStore(); // 영화 비디오 가져오기 함수
  const isKids = useMatch('/kids/*');

  const GenreMovies = category[genreId] || [];

  // --- 팝업 상태 관리 ---
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!category[genreId]) {
      onFetchKidsCate(genreId);
    }
  }, [genreId, category, onFetchKidsCate]);

  // --- 화면 경계 인식 마우스 핸들러 ---
  const handleMouseEnter = (e: React.MouseEvent, el: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // 1. 기본 왼쪽 시작점 계산
    let leftPos = rect.left - (containerRect?.left || 0);

    // 2. 팝업 예상 너비 (아이템의 약 1.2배)
    const popupWidth = rect.width * 1.2;

    // 3. 우측 경계 인식: 팝업이 화면 오른쪽 끝을 벗어나면 왼쪽으로 밀기
    if (rect.left + popupWidth > windowWidth - 20) {
      leftPos = leftPos - (popupWidth - rect.width);
    }

    const position = {
      top: rect.top - (containerRect?.top || 0),
      left: leftPos,
      width: rect.width,
    };

    hoverTimer.current = setTimeout(async () => {
      setPopupData(el);
      setPopupPos(position);
      setHoveredId(el.id);

      try {
        const videos = await onFetchVideo(el.id);
        if (videos && videos.length > 0) {
          const trailer =
            videos.find(
              (v: any) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
            ) || videos.find((v: any) => v.site === 'YouTube');
          setYoutubeKey(trailer ? trailer.key : '');
        }
      } catch (error) {
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
      className="GenreList movieList pullInner"
      ref={containerRef}
      style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={title} />
      <Swiper
        slidesPerView={6.2}
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="mySwiper"
        style={{ overflow: 'visible' }} // 팝업이 잘리지 않도록 설정
      >
        {GenreMovies.map((el) => (
          <SwiperSlide key={el.id}>
            <Link
              to={`/play/movie/${el.id}`}
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}>
              <div className={`col movieThumbnail ${isKids ? 'kids' : ''}`}>
                <div className="imgBox">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                    alt={`${el.title} 썸네일`}
                  />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 화면 안쪽으로 뜨도록 설계된 비디오 팝업 */}
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

export default KidsGenreList;
