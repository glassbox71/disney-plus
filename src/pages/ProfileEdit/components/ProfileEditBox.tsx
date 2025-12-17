import { useState } from 'react';
import ProfileSettingBox from '../../ProfileSetting/components/ProfileSettingBox';
import ProfileUidBox from './ProfileUidBox';
import AgeSettingPopup from './AgeSettingPopup';
import { useProfileStore } from '../../../store/useProfileStore';
import '../scss/ProfileEditBox.scss';


const ProfileEditBox =() => {
  const { currentProfile, selectProfile } = useProfileStore();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!currentProfile) return null;

  return (
    <>
      <div className="profileEditBoxWrap">
        <div className="profileEditBoxTop">
          <ProfileUidBox
            username={currentProfile.name}
            image={currentProfile.image}
            onChangeName={(value) => selectProfile({ ...currentProfile, name: value })}
          />
        </div>
        <div className="profileEditBoxBottom">
          <ProfileSettingBox title="시청 제한 설정">
            <div className="profileBoxContent">
              <div className="ageSetting top">
                <span className="SubTitle">콘텐츠 등급 설정</span>
                <button className='ageSettingBtn' onClick={() => setIsPopupOpen(true)} />
              </div>
              <div className="ageSetting bottom">
                <span>{currentProfile.contentLimit}세 이상</span>
                <span>등급 콘텐츠까지 시청할 수 있습니다.</span>
              </div>
            </div>
          </ProfileSettingBox>
        </div>
      </div>

      {isPopupOpen && <AgeSettingPopup onClose={() => setIsPopupOpen(false)} />}
    </>
  );
};

export default ProfileEditBox;
