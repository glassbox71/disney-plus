import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/IntroPage.scss';

const IntroPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // 재생 속도 설정
      video.playbackRate = 0.6;

      // 비디오 종료 이벤트 리스너
      const handleVideoEnd = () => {
        console.log('비디오 종료 - 로그인 페이지로 이동');
        navigate('/login');
      };

      // 이벤트 리스너 등록
      video.addEventListener('ended', handleVideoEnd);

      // 클린업 함수
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [navigate]);

  return (
    <div className="pullInner">
      <div className="introWrap">
        <video src="/video/introVideo.mp4" ref={videoRef} autoPlay muted playsInline />
      </div>
    </div>
  );
};

export default IntroPage;
