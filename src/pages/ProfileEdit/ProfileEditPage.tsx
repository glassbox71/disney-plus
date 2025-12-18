import React, { useEffect, useState } from 'react';
import ProfileTitle from '../ProfileSetting/components/ProfileTitle';
import './scss/ProfileEditPage.scss';
import ProfileEditBox from './components/ProfileEditBox';
import { useProfileStore } from '../../store/useProfileStore';
import { useNavigate } from 'react-router-dom';
import ProfileDeletePopup from './components/ProfileDeletePopup';

const ProfileEditPage = () => {
  const { currentProfile, updateProfile } = useProfileStore();
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (!currentProfile) {
      navigate('/profile/select');
    }
  }, [currentProfile, navigate]);

  const handleComplete = () => {
    if (!currentProfile) return;

    updateProfile(currentProfile.id, {
      name: currentProfile.name,
      image: currentProfile.image,
      contentLimit: currentProfile.contentLimit,
    });

    navigate('/profile/select');
  };

  return (
    <div className="profileEditBg pullInner">
      <div className="profileEditWrap inner">
        <ProfileTitle profileTitle="프로필 수정" />
        <ProfileEditBox />
        <div className="profileEditBtnwrap">
          <button className="profileComBtn" onClick={handleComplete}>
            완료
          </button>
          {!currentProfile?.isDefault && (
            <button className="profileDelBtn" onClick={() => setIsDeleteOpen(true)}>
              프로필 삭제
            </button>
          )}
        </div>
        {isDeleteOpen && <ProfileDeletePopup onClose={() => setIsDeleteOpen(false)} />}
      </div>
    </div>
  );
};

export default ProfileEditPage;
