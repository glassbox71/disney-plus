import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import '../scss/movieList.scss';
import { Pagination } from 'swiper/modules';
import { NowWatchListData } from '../../../store/data';
import HeaderTitle from './HeaderTitle';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../../../store/useProfileStore';

//TODO 현재 시청 중인 콘텐츠
// ? 로그인 전에는 노출 불가
const WatchList = () => {
  const { profiles, activeProfileId } = useProfileStore();

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId);

  return (
    <section className="WatchList movieList pullInner marginUp">
      <HeaderTitle
        mainTitle={activeProfile ? `${activeProfile.name}님이 시청중인 콘텐츠` : '시청중인 콘텐츠'}
      />
      <>
        <Swiper
          slidesPerView={4.3}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper">
          {NowWatchListData.map((el) => {
            return (
              <SwiperSlide>
                <Link className="flex" to="void">
                  <div className="movieThumbnail row">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${el.backdrop_path}`}
                      alt={`${el.title} 썸네일`}
                    />
                    <span className="movieTitle">{el.title}</span>
                  </div>
                  <div className="progressBar">
                    <div className="now" style={{ width: `${el.WatchBar}%` }}>
                      progressBar
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    </section>
  );
};

export default WatchList;
