import './scss/VideoPlayerPage.scss';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Genre, DATA } from '../../types/ITV';
import { useWatchingStore } from '../../store/useWatchingStore';
import { useWishStore } from '../../store/useWishStore';

const VideoPlayer = () => {
  // --- 상태 관리 ---
  const [player, setPlayer] = useState<DATA | any>({});
  const [logo, setLogo] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [certification, setCertification] = useState<string>('none');
  const [activeTab, setActiveTab] = useState('추천 콘텐츠');
  const [isSticky, setIsSticky] = useState(false);

  // --- 훅 및 변수 ---
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const { id, type } = useParams();
  const { onAddWatching, onFetchWatching } = useWatchingStore();
  const { onToggleWish } = useWishStore();
  const navigate = useNavigate();
  const stickyRef = useRef<HTMLDivElement>(null);

  // TODO 1. 탭 리스트 동적 생성 ---
  const hasRecommend = player.overview || player.production_companies || player.release_date;
  const hasCollection = player.seasons;
  const hasBelongs = player.belongs_to_collection;
  const hasProduction = player.production_companies;
  const tabList = ['추천 콘텐츠'];
  if (hasRecommend) tabList.push('작품정보');
  if (hasProduction) tabList.push('예고편');
  if (hasCollection) tabList.push('컬렉션');
  if (hasBelongs) tabList.unshift('에피소드');

  // --- 비동기 데이터 호출 함수들 ---
  // TODO 2. 추천 콘텐츠 호출 (onFetchID 내부에서 호출됨)
  const onFetchRecommend = async (genres: Genre[]) => {
    const genreIds = genres.map((g) => g.id).join(',');
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&with_genres=${genreIds}&language=ko-KR&sort_by=popularity.desc`
    );
    const data = await res.json();
    const filtered = data.results?.filter((item: any) => item.id !== Number(id)).slice(0, 12) || [];
    setRecommendations(filtered);
  };

  // TODO 3. 상세 데이터 호출
  const onFetchID = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=ko-KR`
    );
    const data = await res.json();
    setPlayer(data);
    if (data.genres) onFetchRecommend(data.genres);
  };

  // TODO 4. 연령 등급 호출
  const onFetchAge = async () => {
    const endpoint = type === 'movie' ? 'release_dates' : 'content_ratings';
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/${endpoint}?api_key=${API_KEY}`
    );
    const data = await res.json();
    const NLInfo = data.results.find((el: any) => el.iso_3166_1 === 'NL');
    const cAge =
      type === 'movie'
        ? NLInfo?.release_dates?.[0]?.certification || 'none'
        : NLInfo?.rating || 'none';
    setCertification(cAge);
  };

  //TODO 5. 로고 이미지 호출
  const onFetchLogo = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${API_KEY}`);
    const data = await res.json();
    setLogo(data.logos?.[0]?.file_path || null);
  };

  // TODO6. 예고편 호출
  const onFetchVideo = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await res.json();
    const trailers = data.results.filter((v: any) => v.type === 'Trailer');
    setVideos(trailers.length > 0 ? trailers : data.results);
  };

  console.log(id, type, player, player.episode_run_time);

  // --- Side Effects ---
  useEffect(() => {
    onFetchWatching();
  }, [onFetchWatching]);

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동 시 최상단으로
    onFetchID();
    onFetchAge();
    onFetchLogo();
    onFetchVideo();
  }, [id, type]);

  // 스티키 감지 Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(entry.boundingClientRect.top <= 80);
      },
      { rootMargin: '-81px 0px 0px 0px', threshold: [1] }
    );
    if (stickyRef.current) observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, []);

  // TODO 재생 목록 파이어베이스 저장
  const handleVideoOpen = async () => {
    if (!id || !type || !player.poster_path) return;
    const watchingItem = {
      id: Number(id),
      poster_path: player.poster_path,
      backdrop_path: player.backdrop_path || '',
      currentTime: 0,
      duration: 0,
      title: player.title || player.name,
    };
    await onAddWatching(watchingItem);
    navigate(`/play/${type}/${id}/video`);
  };

  const handleWishToggle = () => {
    onToggleWish({
      id: Number(id),
      poster_path: player.poster_path,
      backdrop_path: player.backdrop_path || '',
      title: player.title || player.name,
    });
  };

  // 데이터 가공
  const firstDate = player.first_air_date || player.release_date;
  const year = firstDate ? firstDate.split('-')[0] : '';
  const runTimeDisplay =
    type === 'movie'
      ? player.runtime
        ? `${player.runtime}분`
        : ''
      : player.episode_run_time?.[0]
      ? `${player.episode_run_time[0]}분`
      : '';

  return (
    <section className="VideoPlayer">
      {/* 메인 비주얼 영역 */}
      <div className="playerMain">
        <img
          src={`https://image.tmdb.org/t/p/original/${player.backdrop_path || player.poster_path}`}
          alt={player.name || player.title}
        />
        <div className="info-wrap">
          <div className="logo">
            {logo ? (
              <img src={`https://image.tmdb.org/t/p/original/${logo}`} alt="logo" />
            ) : (
              <h1 className="logo-text">{player.title || player.name}</h1>
            )}
          </div>
          <div className="flex">
            <span className={`info1 age age${certification}`}></span>
            <div className="innerFlex">
              <span className="info2">{year}</span>
              <span className="info3">{runTimeDisplay}</span>
              <p className="info4">
                {player.genres?.map((genre: Genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </p>
            </div>
          </div>
          <div className="buttonWrap">
            <button className="play" onClick={handleVideoOpen}>
              지금 재생하기
            </button>
            <button className="MyWish LinkBtn" onClick={handleWishToggle}></button>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 및 상세 콘텐츠 영역 */}
      <div className="relatedInfo">
        <div ref={stickyRef} className={`buttonWrap ${isSticky ? 'stuck' : ''}`}>
          {tabList.map((el, i) => (
            <button
              key={i}
              className={activeTab === el ? 'active' : ''}
              onClick={() => setActiveTab(el)}>
              {el}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === '에피소드' && (
            <div className="recommend tab">
              <ul className="collection-list grid col">
                <li className="grid-item">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${player.belongs_to_collection.poster_path}`}
                    alt="collection"
                  />
                  <p>{player.belongs_to_collection.name}</p>
                </li>
              </ul>
            </div>
          )}

          {/* 1. 추천 콘텐츠 */}
          {activeTab === '추천 콘텐츠' && (
            <div className="recommend tab">
              <div className="grid col">
                {recommendations.map((item) => (
                  <Link key={item.id} to={`/play/${type}/${item.id}`} className="grid-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                      alt={item.title}
                    />
                    <p>{item.title || item.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. 작품정보 */}
          {activeTab === '작품정보' && (
            <div className="detailData tab">
              <ul>
                <li className="title">줄거리</li>
                <li className="overview">{player.overview || '등록된 줄거리가 없습니다.'}</li>
              </ul>
              {player.production_companies?.length > 0 && (
                <ul>
                  <li className="title">제작사</li>
                  <li className="prod-list">
                    {player.production_companies.map((el: any, idx: number) => (
                      <span key={el.id}>
                        {el.name}
                        {idx < player.production_companies.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </li>
                </ul>
              )}
              {player.release_date && (
                <ul>
                  <li className="title">개봉일</li>
                  <li>{player.release_date}</li>
                </ul>
              )}
            </div>
          )}

          {/* 3. 예고편 */}
          {activeTab === '예고편' && (
            <div className="trailers tab">
              <div className="videoWarp grid row">
                {videos.length > 0 ? (
                  videos.slice(0, 6).map((video) => (
                    <div key={video.id} className="grid-item">
                      <div className="iframe-box">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          allowFullScreen></iframe>
                      </div>
                      <p>{video.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="info">등록된 예고편 영상이 없습니다.</p>
                )}
              </div>
            </div>
          )}

          {/* 4. 컬렉션 */}
          {activeTab === '컬렉션' && (
            <div className="collection tab">
              <ul className="collection-list grid col">
                {/* TV 시즌 */}
                {player.seasons?.map((el: any) => (
                  <li key={el.id} className="grid-item">
                    <Link to={`/play/${type}/${id}/season/${el.season_number}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                        alt={el.name}
                      />
                      <p>{el.name}</p>
                    </Link>
                  </li>
                ))}
                {/* 영화 시리즈 */}
                {/* {player.belongs_to_collection && (
                  <li className="grid-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${player.belongs_to_collection.poster_path}`}
                      alt="collection"
                    />
                    <p>{player.belongs_to_collection.name}</p>
                  </li>
                )} */}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
