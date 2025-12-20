import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import '../scss/movieList.scss';
import { Pagination } from 'swiper/modules';
import HeaderTitle from './HeaderTitle';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useProfileStore } from '../../../store/useProfileStore';
import { useWatchingStore } from '../../../store/useWatchingStore';

const WatchList = () => {
  const { watching, onFetchWatching, onRemoveWatching } = useWatchingStore();
  const { profiles, activeProfileId } = useProfileStore();

  // 현재 활성화된 프로필 찾기
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId);

  // 프로필이 변경되거나 컴포넌트가 마운트될 때 시청 목록 로드
  useEffect(() => {
    if (activeProfileId) {
      onFetchWatching();
    }
  }, [activeProfileId]);

  // 시청 중인 콘텐츠가 없으면 섹션 자체를 숨김
  if (watching.length === 0) return null;

  return (
    <section className="WatchList movieList pullInner marginUp">
      <HeaderTitle
        mainTitle={
          activeProfile ? `${activeProfile.name}님이 시청 중인 콘텐츠` : '시청 중인 콘텐츠'
        }
      />
      <Swiper
        slidesPerView={4.3}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper">
        {watching.map((el) => {
          // ⭐ 중요: el.type 대신 el.media_type을 사용합니다.
          const currentType = el.media_type || 'movie';

          return (
            <SwiperSlide key={`${currentType}-${el.id}`}>
              {/* 비디오 플레이어로 이동하는 경로 수정 */}
              <Link className="flex" to={`/play/${currentType}/${el.id}/video`}>
                <div className="movieThumbnail row">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${el.backdrop_path}`}
                    alt={`${el.title} 썸네일`}
                    // 이미지 로드 실패 시 대체 이미지 처리 (선택사항)
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-image.png';
                    }}
                  />
                  <span className="movieTitle">{el.title}</span>

                  {/* 삭제 버튼 추가 시 활용 (필요할 경우 주석 해제)
                  <button 
                    className="removeBtn" 
                    onClick={(e) => {
                      e.preventDefault(); // Link 이동 방지
                      onRemoveWatching(el.id, currentType);
                    }}
                  >✕</button> 
                  */}
                </div>

                {/* 진행 바 (WatchBar 값이 있는 경우) */}
                <div className="progressBar">
                  <div className="now" style={{ width: `${el.WatchBar || 0}%` }}></div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default WatchList;
