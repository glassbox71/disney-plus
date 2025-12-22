import { useNavigate } from 'react-router-dom';
import { useWishStore } from '../../../store/useWishStore';
import { useWatchingStore } from '../../../store/useWatchingStore';
import '../scss/VideoPopup.scss';

interface VideoPopupProps {
  youtubeKey: string;
  title: string;
  onClose: () => void;
  id: number;
  mediaType: 'movie' | 'tv';
  posterPath: string;
  backdropPath?: string;
}

const VideoPopup = ({
  youtubeKey,
  onClose,
  title,
  id,
  mediaType,
  posterPath,
  backdropPath,
}: VideoPopupProps) => {
  const navigate = useNavigate();
  const { wishlist, onToggleWish } = useWishStore();
  const { onRemoveWatching, watching, onAddWatching } = useWatchingStore();

  // 유효한 유튜브 키가 있는지 확인
  const hasVideo = youtubeKey && youtubeKey !== '' && youtubeKey !== 'undefined';

  // 찜 토글 핸들러
  const handleWishToggle = () => {
    if (!id || !mediaType || !posterPath) return;
    onToggleWish({
      id: Number(id),
      media_type: mediaType,
      poster_path: posterPath,
      backdrop_path: backdropPath || '',
      title: title,
    });
  };

  // 재생 버튼 핸들러 (실제 재생 페이지로 이동)
  const handlePlay = async () => {
    await onAddWatching({
      id,
      media_type: mediaType,
      poster_path: posterPath,
      backdrop_path: backdropPath || '',
      title: title,
      currentTime: 0,
      duration: 0,
    });

    // 재생 페이지 이동
    const playType = mediaType;
    navigate(`/play/${playType}/${id}/video`);
  };

  // 시청 기록 삭제 핸들러
  const handleRemove = () => {
    if (!id || !mediaType) return;
    if (window.confirm('시청 기록에서 삭제하시겠습니까?')) {
      onRemoveWatching(Number(id), mediaType);
      onClose();
    }
  };

  // 상세보기 핸들러
  const handleDetail = () => {
    // TV는 series, 영화는 movie로 경로 구분
    const detailType = mediaType;
    navigate(`/play/${detailType}/${id}`);
  };

  // 현재 콘텐츠가 재생 목록(시청 기록)에 있는지 확인
  const isWatching = watching.some(
    (item) => String(item.id) === String(id) && item.media_type === mediaType
  );

  // 현재 콘텐츠가 찜 목록에 있는지 확인
  const isWished = wishlist.some(
    (item) => String(item.id) === String(id) && item.media_type === mediaType
  );

  return (
    <div className="videoPopupBg">
      <div className="videoPopupWrap" onMouseLeave={onClose}>
        <div className="videoWrap">
          {/* 영상이 있으면 iframe 재생, 없으면 배경미지 출력 */}
          {hasVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
              allow="autoplay; fullscreen; picture-in-picture"
              title="YouTube trailer"
            />
          ) : (
            <div className="no-video-fallback">
              <img
                src={`https://image.tmdb.org/t/p/w500${backdropPath || posterPath}`}
                alt="fallback"
              />
            </div>
          )}
        </div>

        <h2>{title}</h2>

        <div className="controlWrap">
          <div className="controlLeft">
            {/* 재생 버튼 */}
            <button
              className={`playBtn ${isWatching ? 'active' : ''}`}
              onClick={handlePlay}
              title={isWatching ? '이어보기' : '재생'}>
              {isWatching && <span className="btnText">이어보기</span>}
              <span className="btnImg"></span>
            </button>
            {/* 찜하기 버튼 */}
            <button
              className={`wishBtn ${isWished ? 'active' : ''}`}
              onClick={handleWishToggle}
              title={isWished ? '찜 목록에서 제거' : '찜 목록에 추가'}></button>
            {/* 기록 삭제 버튼 */}
            <button
              className="deleteBtn"
              onClick={handleRemove}
              title="시청 기록에서 삭제"></button>
          </div>

          <div className="controlRight">
            {/* 상세보기 버튼 */}
            <button className="hamBtn" onClick={handleDetail} title="상세보기">
              <img src="/icon/hamIcon.svg" alt="상세보기" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
