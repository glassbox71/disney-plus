// TODO 로그인 페이지

import { useState } from 'react';
import AuthTop from './components/AuthTop';
import LoginForm from './components/LoginForm';
import LoginComplete from './components/LoginComplete';
import './scss/LoginPage.scss';

const LoginPage = () => {
  // 로그인 상태 체크
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="loginPage normal bg">
      <div className="authWrap">
        {!isComplete ? (
          <div className="loginWrap">
            <AuthTop
              title="로그인"
              authText="등록된 계정이 없으시면 회원가입 후 이용하실 수 있습니다."
            />
            <LoginForm onComplete={() => setIsComplete(true)} />
          </div>
        ) : (
          <LoginComplete />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
