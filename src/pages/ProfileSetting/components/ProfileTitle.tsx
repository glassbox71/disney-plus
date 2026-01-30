import React from 'react';

interface ProfileTitleProps {
  profileTitle: string;
  fontSize?: string;
  fontWeight?: string;
}

const ProfileTitle = ({
  profileTitle,
  fontSize = '4rem',
  fontWeight = '500',
}: ProfileTitleProps) => {
  return (
    <div className="profileTitleWrap" style={{ fontSize: fontSize, fontWeight: fontWeight }}>
      {profileTitle}
    </div>
  );
};

export default ProfileTitle;
