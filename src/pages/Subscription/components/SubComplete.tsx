import React from 'react';
import SucessTop from './SucessTop';
import { useNavigate } from 'react-router-dom';
import '../scss/SubComplete.scss';
import { useAuthStore } from '../../../store/useAuthStore';

const SubComplete = () => {
  const navigate = useNavigate();
  const { userData } = useAuthStore();

  const handleGoDisney = () => {
    if (userData?.kidsMode?.isActive) {
      navigate('/kids', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="subBg">
      <div className="subCompleteWrap">
        <SucessTop />
        <button onClick={handleGoDisney}>디즈니+로 이동</button>
      </div>
    </div>
  );
};

export default SubComplete;
