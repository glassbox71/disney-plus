import React from 'react';
import ProfileSettingBox from './components/ProfileSettingBox';
import { Link } from 'react-router-dom';
import './scss/ProfileSettingPage.scss';
import ProfileTitle from './components/ProfileTitle';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubStore } from '../../store/useSubStore';

const ProfileSettingPage = () => {
  const { userData } = useAuthStore();
  const { membership } = useSubStore();

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('ko-KR');
  };

  return (
    <div className="profileCreationBg pullInner">
      <div className="profileCreateWrap inner">
        <ProfileTitle profileTitle="계정 설정" />
        <div className="profileCreateBoxWrap">
          <ProfileSettingBox title="계정 정보">
            <span className="profileCreateBox userEmail profileBoxSubTitle">{userData?.email}</span>
          </ProfileSettingBox>

          <ProfileSettingBox title="멤버십">
            <div className="profileCreateBox membershipInfo profileBoxContent bottomLine">
              <span className="profileBoxSubTitle">
                {membership ? membership.plan.title : '멤버십 없음'}
              </span>
              <div className="fontSize14">
                <span>갱신일</span>
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
                <span className="profileBoxSubTitle">프로필 생성 제한</span>
                <span></span>
              </div>
              <span className="fontSize14">
                제한 시 새로운 프로필 생성하려면 계정 비밀번호를 입력해야 합니다.
              </span>
            </div>
          </ProfileSettingBox>
        </div>

        <div className="profileCreateBtnwrap">
          <Link to="/void">
            <button className="profileCreateBtn">완료</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingPage;
