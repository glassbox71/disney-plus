import React from 'react';
import ProfileTitle from '../ProfileSetting/components/ProfileTitle';
import ProfileEditBox from '../ProfileEdit/components/ProfileEditBox';
import { useNavigate } from 'react-router-dom';
import './scss/ProfileCreatePageInfo.scss';
import { useProfileStore } from '../../store/useProfileStore';

const ProfileCreatePageInfo = () => {
  const { addProfile, currentProfile, resetCurrentProfile } = useProfileStore();

  const navigate = useNavigate();

  const handleCreate = () => {
    if (!currentProfile) return;
    addProfile(currentProfile);
    resetCurrentProfile();
    navigate('/profile/select');
  };

  return (
    <div className="profileCreateBg pullInner">
      <div className="profileCreateWrap inner">
        <ProfileTitle profileTitle="프로필 생성" />
        <ProfileEditBox />
        <div className="profileCreateBtnWrap">
          <button className="profileCreateBtn" onClick={handleCreate}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreatePageInfo;
