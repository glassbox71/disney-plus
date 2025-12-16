// 회원가입 폼 컴포넌트

import { useState } from 'react';
import TermsAgreement from './TermsAgreement';
import { useAuthStore } from '../../../store/useAuthStore';
import MyDisney from './MyDisney';
import KidsMode from './KidsMode';
import type { KidsModeInfo } from '../../../types/IAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../api/auth';

// props type 선언
interface SignupProps {
  onComplete: () => void;
}

const SignupForm = ({ onComplete }: SignupProps) => {
  const { onMember } = useAuthStore();

  // 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 아이디 / 비밀번호 상태 체크
  const [emailStatus, setEmailStatus] = useState<'none' | 'valid' | 'invalid' | 'checking'>('none');
  const [emailMsg, setEmailMsg] = useState('');
  const [pwStatus, setPwStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [pwMsg, setPwMsg] = useState('');
  const [confirmPwStatus, setConfirmPwStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [confirmPwMsg, setConfirmPwMsg] = useState('');

  // 비밀번호 표시 상테
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 강도 상태 체크
  const [pwStrength, setPwStrength] = useState(0);
  const [pwLabel, setPwLabel] = useState('');

  // 가입하기 버튼 활성화
  const isFormValid =
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword;

  // 키즈 모드 정보 상태
  const [kidsModeData, setKidsModeData] = useState<KidsModeInfo>({
    isActive: false,
    year: null,
    month: null,
    date: null,
  });

  // 아이디 유효성
  const validateID = (id: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(id);
  };

  // 비밀번호 유효성
  const validatePW = (pwd: string) => {
    const pwLetter = /[a-zA-Z]/.test(pwd);
    const pwNumber = /[0-9]/.test(pwd);
    const pwSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const noSpace = !/\s/.test(pwd);

    const typeCount = [pwLetter, pwNumber, pwSpecial].filter(Boolean).length;
    const pwLengthValid = pwd.length >= 8 && pwd.length <= 16;

    return typeCount >= 2 && pwLengthValid && noSpace;
  };

  // 이메일 중복 체크
  const checkEmailExists = async (email) => {
    try {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (err: any) {
      console.log(err.message);
      return false;
    }
  };

  // 이메일 변경
  const handleIdChange = async (value: string) => {
    setEmail(value);

    if (!value) {
      setEmailStatus('none');
      setEmailMsg('');
      return;
    }

    if (!validateID(value)) {
      setEmailStatus('invalid');
      setEmailMsg('이메일 형식이 올바르지 않습니다.');
      return;
    }

    // Firebase에서 이메일 중복 체크
    const exists = await checkEmailExists(value);

    if (exists) {
      setEmailStatus('invalid');
      setEmailMsg('이미 사용 중인 이메일입니다. 로그인 후 이용해 주세요.');
    } else {
      setEmailStatus('valid');
      setEmailMsg('올바른 이메일 형식입니다. 사용 가능한 이메일입니다.');
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return false;
    }

    if (!validateID(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return false;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return false;
    }

    if (!validatePW(password)) {
      alert('비밀번호 형식이 올바르지 않습니다.');
      return false;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  // 비밀번호 강도 계산하기
  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);

    if (!pwd) {
      setPwStrength(0);
      setPwLabel('');
      setPwStatus('none');
      setPwMsg('');
      return;
    }

    let score = 0;

    if (pwd.length >= 8) score++;
    if (/[a-zA-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    setPwStrength(score);

    if (score <= 1) {
      setPwLabel('위험');
    } else if (score === 2) {
      setPwLabel('약함');
    } else if (score === 3) {
      setPwLabel('보통');
    } else if (score === 4) {
      setPwLabel('강력');
    }

    if (validatePW(pwd)) {
      setPwStatus('valid');
      setPwMsg('');
    } else {
      setPwStatus('invalid');
      setPwMsg('');
    }

    if (confirmPassword) {
      handleConfirmPasswordCheck(confirmPassword, pwd);
    }
  };

  // 비밀번호 확인 체크
  const handleConfirmPasswordCheck = (confirmPwd: string, currentPwd?: string) => {
    setConfirmPassword(confirmPwd);

    const pwdToCompare = currentPwd !== undefined ? currentPwd : password;

    if (!confirmPwd) {
      setConfirmPwStatus('none');
      setConfirmPwMsg('');
      return;
    }

    if (confirmPwd === pwdToCompare) {
      setConfirmPwStatus('valid');
      setConfirmPwMsg('비밀번호가 일치합니다.');
    } else {
      setConfirmPwStatus('invalid');
      setConfirmPwMsg('비밀번호가 일치하지 않습니다.');
    }
  };

  // 회원가입 메서드
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // 키즈 모드 활성화시 생년월일 체크
    if (kidsModeData.isActive) {
      if (!kidsModeData.year || !kidsModeData.month || !kidsModeData.date) {
        alert('생년월일을 입력해주세요.');
        return;
      }
    }

    try {
      await onMember(email, password, kidsModeData);

      // 성공 시 상태 초기화
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setEmailStatus('none');
      setEmailMsg('');
      setPwStatus('none');
      setPwMsg('');
      setConfirmPwStatus('none');
      setConfirmPwMsg('');

      onComplete();
    } catch (err: any) {
      console.error('회원가입 오류:', err);
    }
  };

  return (
    <div className="signupFormWrap">
      <form className="signupForm" id="signupForm" onSubmit={handleSignup}>
        <div className="idPwWrap">
          <div className={`idWrap ${emailStatus}`}>
            <label>
              이메일
              <input
                type="email"
                id="id"
                name="id"
                placeholder="이메일을 입력해주세요"
                required
                value={email}
                onChange={(e) => handleIdChange(e.target.value)}
              />
            </label>
            {emailMsg && <p className={`validMsg ${emailStatus}`}>{emailMsg}</p>}
          </div>

          <div className={`pwWrap ${pwStatus}`}>
            <label>
              비밀번호
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                required
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              <span
                className={`togglePwBtn ${showPassword ? 'active' : ''}`}
                onClick={() => setShowPassword(!showPassword)}></span>
            </label>
            <p className="pwDec">
              비밀번호는 영문(대소문자 구분), 숫자, 특수문자를 포함해 8자 이상이어야 합니다.
            </p>
            {password && (
              <div className="progressBarWrap">
                <p className={`pwProgressBar strength${pwStrength}`}>
                  <span className="pwColorBar"></span>
                </p>
                <span className="pwText">{pwLabel}</span>
              </div>
            )}
            {pwMsg && <p className={`validMsg ${pwStatus}`}>{pwMsg}</p>}
          </div>

          <div className={`confirmPwWrap ${confirmPwStatus}`}>
            <label>
              비밀번호 확인
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="비밀번호를 입력해주세요"
                required
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordCheck(e.target.value)}
              />
              <span
                className={`togglePwBtn ${showConfirmPassword ? 'active' : ''}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}></span>
            </label>
            {confirmPwMsg && <p className={`validMsg ${confirmPwStatus}`}>{confirmPwMsg}</p>}
          </div>
        </div>

        <KidsMode
          title="키즈모드 설정"
          subTitle="키즈 모드 이용 시 연령에 맞는 콘텐츠 제공을 위해 생년월일을 선택해주세요."
          onKidsModeChange={setKidsModeData}
        />

        <TermsAgreement />

        <p>
          '가입하기'를 누르면 위의 동의에 더하여 당신의 개인정보 처리방침과 개인 정보 처리방침
          부속서를 일독하였을 확인합니다.
        </p>
      </form>

      <button
        className={`signupBtn ${!isFormValid ? 'disabled' : 'active'}`}
        form="signupForm"
        type="submit"
        disabled={!isFormValid}>
        가입하기
      </button>

      <MyDisney />
    </div>
  );
};

export default SignupForm;
