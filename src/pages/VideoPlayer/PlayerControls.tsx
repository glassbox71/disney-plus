// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import './scss/PlayerControls.scss'; // 전용 스타일 파일

// interface PlayerControlsProps {
//   type: 'movie' | 'tv';
//   id: number;
//   onClose: () => void;
// }

// const PlayerControls = ({ type, id, onClose }: PlayerControlsProps) => {
//   const { type, id } = useParams(); // URL에서 type(movie/tv)과 id 추출
//   const [videoKey, setVideoKey] = useState<string | null>(null);
//   const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         // 영상 데이터를 가져오기 위해 비디오 API 호출
//         const res = await fetch(
//           `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=ko-KR`
//         );
//         const data = await res.json();

//         // 1. 한국어 예고편 검색 -> 2. 없으면 영어 예고편 중 'Trailer' 타입 검색
//         const trailer = data.results?.find(
//           (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
//         );
//         const finalKey = trailer?.key || data.results?.[0]?.key;

//         setVideoKey(finalKey);
//       } catch (error) {
//         console.error('영상 데이터를 불러오는 데 실패했습니다:', error);
//       }
//     };

//     if (id && type) fetchVideo();
//   }, [id, type, API_KEY]);

//   return (
//     <div className="videoInner">
//       <div className="videoWrap">
//         {videoKey ? (
//           <iframe
//             src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=0&rel=0&modestbranding=1`}
//             allow="autoplay; encrypted-media; fullscreen"
//             allowFullScreen></iframe>
//         ) : (
//           <div className="loading">영상을 준비 중입니다...</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlayerControls;

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './scss/PlayerControls.scss';

const PlayerControls = () => {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [videoKey, setVideoKey] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=ko-KR`
        );
        const data = await res.json();

        const trailer =
          data.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') ||
          data.results?.[0];

        setVideoKey(trailer?.key ?? null);
      } catch (e) {
        console.error(e);
      }
    };

    if (type && id) fetchVideo();
  }, [type, id, API_KEY]);

  return (
    <div className="playerModal">
      <button className="closeBtn" onClick={() => navigate(-1)}></button>

      {videoKey ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
          allow="autoplay; fullscreen"
          allowFullScreen
          title="player"
        />
      ) : (
        <div className="loading">영상을 불러오는 중...</div>
      )}
    </div>
  );
};

export default PlayerControls;
