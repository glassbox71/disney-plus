// TODO 회원가입 페이지

import { useState } from 'react';
import AuthTop from './components/AuthTop';
import SignupForm from './components/SignupForm';
import SignupComplete from './components/SignupComplete';
import './scss/SignupPage.scss';

const SignupPage = () => {
  // 회원가입 상태를 체크
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="signupPage normal bg">
      <div className="authWrap">
        {!isComplete ? (
          <div className="scrollWrap">
            <AuthTop
              title="회원가입"
              authText="MyDisney 계정을 만들어 The Walt Disney Family of <br/> Companies에서 제공하는 다양한 서비스를 이용해보세요."
            />
            {/* TODO 회원가입 폼 */}
            <SignupForm onComplete={() => setIsComplete(true)} />
          </div>
        ) : (
          <SignupComplete />
        )}
      </div>
    </div>
  );
};

export default SignupPage;
