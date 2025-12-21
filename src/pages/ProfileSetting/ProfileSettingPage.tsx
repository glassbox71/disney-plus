import React, { useState } from 'react';
import ProfileSettingBox from './components/ProfileSettingBox';
import { Link, useNavigate } from 'react-router-dom';
import './scss/ProfileSettingPage.scss';
import ProfileTitle from './components/ProfileTitle';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubStore } from '../../store/useSubStore';
import { useProfileStore } from '../../store/useProfileStore';

const ProfileSettingPage = () => {
  const { userData } = useAuthStore();
  const { membership } = useSubStore();
  const { activeProfileId, profiles, autoKidsLogin, setAutoKidsLogin } = useProfileStore();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState();

  const handleComplete = () => {
    const profile = profiles.find((p) => p.id === activeProfileId);

    if (!profile) return;
    if (profile.isKids) {
      navigate('/kids');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="profileCreationBg pullInner">
      <div className="profileCreateWrap inner">
        <ProfileTitle profileTitle="계정 설정" />
        <div className="profileCreateBoxWrap">
          <ProfileSettingBox title="계정 정보">
            <div className="profileCreateBox">
              <span className=" userEmail profileBoxSubTitle">{userData?.email}</span>
            </div>
          </ProfileSettingBox>

          <ProfileSettingBox title="멤버십">
            <div className="profileCreateBox membershipInfo profileBoxContent bottomLine">
              <span className="profileBoxSubTitle">
                {membership ? membership.plan.title : '멤버십 없음'}
              </span>
              <div className="fontSize14">
                <span>갱신일 : </span>
                <span>
                  {membership?.startedAt
                    ? new Date(membership.startedAt).toLocaleDateString('ko-KR')
                    : '-'}
                </span>
              </div>
            </div>
            <div className="profileCreateBox membershipChange profileBoxContent">
              <div>
                <span className="profileBoxSubTitle">멤버십 변경</span>
                <div className="membershipMoreWrap">
                  <Link to="/subscription" className="membershipMore"></Link>
                </div>
              </div>
              <span className="fontSize14">내게 꼭 맞는 디즈니 멤버십을 선택해보세요.</span>
            </div>
          </ProfileSettingBox>

          <ProfileSettingBox title="기타 설정">
            <div className="profileCreateBox profileSetting profileBoxContent">
              <div>
                <span className="profileBoxSubTitle">키즈 프로필을 기본 프로필로 설정</span>
                <button
                  className={`toggleBg ${autoKidsLogin ? 'active' : ''}`}
                  onClick={() => setAutoKidsLogin(!autoKidsLogin)}></button>
              </div>
              <span className="fontSize14">
                키즈 프로필을 기본으로 설정하면 접속 시 자동으로 키즈 프로필로 들어갑니다.
              </span>
            </div>
          </ProfileSettingBox>
        </div>

        <button onClick={handleComplete} className="profileCreateBtn">
          완료
        </button>
      </div>
    </div>
  );
};

export default ProfileSettingPage;
