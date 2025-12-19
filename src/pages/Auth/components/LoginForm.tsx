import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

//props type 선언
interface LoginProps {
  onComplete: () => void;
}

const LoginForm = ({ onComplete }: LoginProps) => {
  const navigate = useNavigate();

  // 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin, onGoogleLogin } = useAuthStore();

  // 비밀번호 표시 상테
  const [showPassword, setShowPassword] = useState(false);

  // 일반 이메일 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(email, password);
      navigate('/auth/redirect');
      setEmail('');
      setPassword('');
      onComplete();
    } catch (err) {
      console.log(err);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    try {
      await onGoogleLogin();
      onComplete();
    } catch (err) {
      console.log('구글 로그인 실패', err);
    }
  };

  return (
    <div className="loginFormWrap">
      <form className="loginForm" onSubmit={handleLogin}>
        <label>
          <input
            type="email"
            placeholder="이메일"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className={`togglePwBtn ${showPassword ? 'active' : ''}`}
            onClick={() => setShowPassword(!showPassword)}></span>
        </label>
        <button className="loginBtn" type="submit">
          로그인 하기
        </button>
        <button className="googleLoginBtn" onClick={handleGoogleLogin}>
          <span></span>
          구글 로그인
        </button>
        <button onClick={() => navigate('/signup')}>회원가입</button>
      </form>
    </div>
  );
};

export default LoginForm;
