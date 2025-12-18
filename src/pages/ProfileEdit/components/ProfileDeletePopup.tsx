import React, { useEffect } from 'react';
import { useProfileStore } from '../../../store/useProfileStore';
import { useNavigate } from 'react-router-dom';
import '../scss/ProfileDeletePopup.scss';

interface ProfileDeletePopupProps {
  onClose: () => void;
}

const ProfileDeletePopup = ({ onClose }: ProfileDeletePopupProps) => {
  const { currentProfile, deleteProfile } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDelete = () => {
    if (!currentProfile) return;

    if (currentProfile.isDefault) {
      alert('기본 프로필은 삭제할 수 없습니다.');
      return;
    }

    deleteProfile(currentProfile.id);
    navigate('/profile/select');
  };

  return (
    <div className="profileDelPopupWrap">
      <div className="profileDelPopup">
        <div className="profileDelTitle">
          <span>{`"${currentProfile?.name}" `}</span>
          <span>프로필을 삭제하시겠습니까?</span>
        </div>
        <div className="profileDelInfo">
          <span>프로필 기록, 관심 콘텐츠 및 시청 기록이 삭제되며, 실행 후 취소할 수 없습니다.</span>
        </div>
        <div className="profileDelBtnWrap">
          <button className="profileDelBtn back" onClick={onClose}>
            취소
          </button>
          <button className="profileDelBtn next" onClick={handleDelete}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDeletePopup;
