import React, { useEffect } from 'react';
import ProfileTitle from '../ProfileSetting/components/ProfileTitle';
import { useProfileStore } from '../../store/useProfileStore';
import './scss/ProfileCreatePageImage.scss';
import { useNavigate } from 'react-router-dom';

interface ProfileImage {
  id: number;
  src: string;
}

const profileImages: ProfileImage[] = [
  { id: 1, src: '/images/profile/profile1.png' },
  { id: 2, src: '/images/profile/profile2.png' },
  { id: 3, src: '/images/profile/profile3.png' },
  { id: 4, src: '/images/profile/profile4.png' },
  { id: 5, src: '/images/profile/profile5.png' },
  { id: 6, src: '/images/profile/profile6.png' },
  { id: 7, src: '/images/profile/profile7.png' },
  { id: 8, src: '/images/profile/profile8.png' },
  { id: 9, src: '/images/profile/profile9.png' },
  { id: 10, src: '/images/profile/profile10.png' },
];

const ProfileCreatePageImage: React.FC = () => {
  const { currentProfile, initCurrentProfile, setProfileImage } = useProfileStore();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/profile/create/info');
  };
  useEffect(() => {
    if (!currentProfile) {
      initCurrentProfile();
    }
  }, [currentProfile, initCurrentProfile]);

  return (
    <div className="profileImageBg pullInner">
      <div className="profileImageWrap inner">
        <div className="profileImageTop">
          <ProfileTitle profileTitle="프로필 이미지 선택하기" />
          <div className="selectImg">
            {currentProfile?.image && <img src={currentProfile.image} alt="선택된 프로필" />}
          </div>
        </div>
        <div className="profileImageBottom">
          {profileImages.map((img) => (
            <button
              key={img.id}
              className={`profileImg ${currentProfile?.image === img.src ? 'active' : ''}`}
              onClick={() => setProfileImage(img.src)}>
              <img src={img.src} alt={`{img.id}`} />
            </button>
          ))}
        </div>
        <div className="profileImgBtnWrap">
          <button className="profileImgBtn" onClick={handleNext}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreatePageImage;
