import React, { useEffect, useState } from 'react';
import './scss/VideoPlayerPage.scss';
import { useParams } from 'react-router-dom';
import type { TV } from '../../types/ITV';

const VideoPlayer = () => {
  const [player, setPlayer] = useState<TV[]>([]);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const { id, type } = useParams();

  useEffect(() => {
    const onFetchID = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=ko-KR`
      );
      const data = await res.json();
      setPlayer(data);
    };
    onFetchID();
  }, [id]);

  console.log(id, type, player);

  return (
    <section className="VideoPlayer">
      <div className="playerMain">
        <img src={`https://image.tmdb.org/t/p/w500/${player.poster_path}`} alt="" />
        <div className="info-wrap">
          <div className="logo"></div>
          <div className="flex">
            <div className="info1"></div>
            <div className="info2"></div>
            <div className="info3"></div>
            <div className="info4"></div>
            <div className="info5"></div>
          </div>
          <div className="infoTitle"></div>
          <div className="bar"></div>
          <div className="buttonWrap">
            <button>지금 재생하기</button>
            <div className="zzim"></div>
          </div>
        </div>
      </div>
      <div className="relatedInfo">
        <div className="buttonWrap">
          <button>추천 콘텐츠</button>
          <button>예고편</button>
          <button>컬렉션</button>
        </div>
      </div>
    </section>
  );
};

export default VideoPlayer;
