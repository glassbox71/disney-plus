import '../scss/SeasonDate.scss';
import { SeasonNavData } from '../../../store/data';
import { useMovieStore } from '../../../store/useMovieStore';
import { useEffect, useMemo } from 'react'; // ⭐️ useMemo 임포트
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// getDay 함수는 동일

const getDay = (dateString: string): number => {
  const [month, day] = dateString.split('-').map(Number);
  const date = new Date(2001, month - 1, day);
  const startOfYear = new Date(2001, 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const SeasonList = () => {
  const { onfetchSeason, seasonMovies } = useMovieStore();

  // ⭐️ 1. 현재 날짜 계산을 useMemo로 감싸서 리렌더링 시 불필요하게 계산되지 않도록 함
  const { nowDayNum } = useMemo(() => {
    const nowMonthDayStr = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
    const nowDayNum = getDay(nowMonthDayStr);
    return { nowDayNum };
  }, []); // ⭐️ 빈 배열: 마운트 시 한 번만 계산

  // ⭐️ 2. currentSeason 계산을 useMemo로 감싸서 오브젝트 인스턴스 안정화
  const currentSeason = useMemo(() => {
    return SeasonNavData.find((season) => {
      const startDayNum = getDay(season.startDate);
      const endDayNum = getDay(season.endDate);

      if (startDayNum <= endDayNum) {
        return nowDayNum >= startDayNum && nowDayNum <= endDayNum;
      } else {
        // 연말연시처럼 해를 넘기는 경우
        return nowDayNum >= startDayNum || nowDayNum <= endDayNum;
      }
    });
  }, [nowDayNum]); // ⭐️ nowDayNum이 바뀔 때만 재계산 (하루에 한 번만 바뀜)

  // ⭐️ 3. API 호출 로직 (useEffect는 동일)
  useEffect(() => {
    if (currentSeason) {
      onfetchSeason(currentSeason);
    }
  }, [currentSeason?.title, onfetchSeason]);

  // 렌더링을 위한 데이터 준비 (이 부분은 동일)
  const SeasonTitle = currentSeason
    ? `디즈니플러스${currentSeason.h2Title}`
    : '디즈니가 추천하는 시즌 콘텐츠';
  const SeasonText = currentSeason ? currentSeason.text : '지금 시청할 수 있는 인기 콘텐츠';
  const SeasonLogo = currentSeason ? currentSeason.title : 'basic';

  return (
    <section className="SeasonList pullInner">
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
        <Swiper slidesPerView={5.4} spaceBetween={20} className="mySwiper">
          {seasonMovies.length > 0 ? (
            <>
              {seasonMovies &&
                seasonMovies
                  .filter((el) => el.poster_path)
                  .slice(0, 10)
                  .map((el) => (
                    <SwiperSlide key={el.id}>
                      <Link className="" to="void">
                        <div className="MovieItem">
                          {/* 포스터 이미지 (TMDB 경로에 맞게 수정 필요) */}
                          <img
                            src={`https://image.tmdb.org/t/p/w300${el.poster_path}`}
                            alt={el.title}
                          />
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
            </>
          ) : (
            // 로딩 또는 데이터가 없을 때의 UI
            <p>
              {currentSeason ? '시즌 영화 목록을 불러오는 중...' : '현재 시즌 정보가 없습니다.'}
            </p>
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default SeasonList;
