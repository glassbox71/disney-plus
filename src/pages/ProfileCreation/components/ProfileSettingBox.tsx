import React from 'react';
import '../scss/ProfileSettingBox.scss';

interface ProfileSettingBoxProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSettingBox = ({ title, children }: ProfileSettingBoxProps) => {
  return (
    <div className="profileBox">
      <div className="profileBoxTitle">
        <span>{title}</span>
      </div>
      <div className="profileBoxChild">{children}</div>
    </div>
  );
};

export default ProfileSettingBox;
