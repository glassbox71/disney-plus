import { useNavigate } from 'react-router-dom';
import AuthTop from './AuthTop';
import '../scss/LoginComplete.scss';

const LoginComplete = () => {
  const navigate = useNavigate();

  const handleDisney = () => {
    navigate('/', { replace: true });
  };
  return (
    <div className="loginCompleteWrap">
      <AuthTop title="로그인이 완료되었습니다." />
      <button onClick={handleDisney}>디즈니 + 이동</button>
    </div>
  );
};

export default LoginComplete;
