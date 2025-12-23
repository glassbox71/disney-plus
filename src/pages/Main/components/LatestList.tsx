import '../scss/movieList.scss';
import { useEffect, useRef, useState } from 'react';
import HeaderTitle from './HeaderTitle';
import { useMovieStore } from '../../../store/useMovieStore';
import { useTvStore } from '../../../store/useTvStore';
import type { title } from '../../../types/IMovie';
import { Swiper, SwiperSlide } from 'swiper/react';
import VideoPopup from './VideoPopup';

const LatestList = ({ title }: title) => {
  const { onfetchLatest, Latest, onFetchVideo } = useMovieStore();
  const { onFetchTvVideo } = useTvStore();

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [popupData, setPopupData] = useState<any>(null); // 현재 팝업에 띄울 데이터 객체
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 0 }); // 위치 상태

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Latest.length === 0) onfetchLatest();
  }, [Latest.length, onfetchLatest]);

  const handleMouseEnter = (e: React.MouseEvent, movie: any) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);

    // 1. 호버한 요소의 위치 정보 계산
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 부모 섹션(.LatestList) 기준 상대 위치를 잡기 위해 나중에 스타일에서 계산하거나
    // absolute 기준이 될 부모의 offset을 뺍니다.
    const position = {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
    };

    hoverTimer.current = setTimeout(async () => {
      try {
        const mediaType = movie.media_type || 'tv';
        let videos =
          mediaType === 'tv' ? await onFetchTvVideo(movie.id) : await onFetchVideo(movie.id);
        const trailer = videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

        setYoutubeKey(trailer ? trailer.key : '');
        setPopupData(movie); // 현재 영화 정보 통째로 저장
        setPopupPos(position); // 계산된 위치 저장
        setHoveredId(movie.id);
      } catch (error) {
        setYoutubeKey('');
        setPopupData(movie);
        setPopupPos(position);
        setHoveredId(movie.id);
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredId(null);
    setYoutubeKey('');
    setPopupData(null);
  };

  return (
    // 부모 섹션에 position: relative가 있어야 팝업이 이 안에서 돕니다.
    <section className="LatestList movieList pullInner" style={{ position: 'relative' }}>
      <HeaderTitle mainTitle={title} />

      <Swiper
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 2.2,
            spaceBetween: 8,
          },
          281: {
            slidesPerView: 3.1,
            spaceBetween: 8,
          },
          481: {
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
        className="mySwiper">
        {Latest.map((el) => (
          <SwiperSlide key={el.id}>
            <div
              className="movieThumbnail"
              onMouseEnter={(e) => handleMouseEnter(e, el)}
              onMouseLeave={() => {
                if (hoverTimer.current) clearTimeout(hoverTimer.current);
              }}
              style={{ cursor: 'pointer' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                alt={el.title || el.name}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* [수정 핵심] Swiper 외부에서 딱 하나만 존재하는 팝업 */}
      {hoveredId && popupData && (
        <div
          className="fixed-popup-wrapper"
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute', // 혹은 fixed (스크롤 설정에 따라 다름)
            top: 0, // 초기 위치 초기화
            left: popupPos.left - popupPos.width * 0.1, // 썸네일보다 살짝 왼쪽에서 시작 (중앙정렬용)
            width: popupPos.width * 1.2, // 썸네일보다 1.2배 크게
            zIndex: 1000,
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
          }}>
          <VideoPopup
            youtubeKey={youtubeKey}
            title={popupData.title || popupData.name}
            id={popupData.id}
            mediaType={popupData.media_type || 'tv'}
            posterPath={popupData.poster_path || ''}
            backdropPath={popupData.backdrop_path}
            onClose={handleMouseLeave}
          />
        </div>
      )}
    </section>
  );
};

export default LatestList;
