import { Link, useLocation, useNavigate } from 'react-router-dom';
import './scss/Header.scss';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDepthOpen, setIsDepthOpen] = useState(false);
  const { isLogin, onLogout } = useAuthStore();
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const isProfilePage = path.startsWith('/profile');
  const isLoginPage = path.startsWith('/login');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);

  const toggleProfileDepth = () => {
    setIsDepthOpen((prev) => !prev);
  };

  const closeDepth = () => {
    setIsDepthOpen(false);
  };

  if (isProfilePage || isLoginPage) {
    return (
      <div className={`Header isprofile pullInner ${isScrolled ? 'active' : ''}`}>
        <div className="Header-left">
          <Link to="/">
            <img src="/images/logo.svg" alt="로고" />
          </Link>
        </div>

        <div className="Header-right">
          <button onClick={() => onLogout()}>로그아웃</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`Header pullInner ${isScrolled ? 'active' : ''} `}>
      {isLogin ? (
        <>
          <div className="Header-left">
            <h1 className="logo">
              <Link to="/">
                <img src="/images/logo.svg" alt="로고" />
              </Link>
            </h1>
            <nav>
              <Link className="LinkBtn" to="/">
                홈
              </Link>
              <Link className="LinkBtn" to="/movie">
                영화
              </Link>
              <Link className="LinkBtn" to="/series">
                시리즈
              </Link>
              <Link className="LinkBtn" to="/original">
                오리지널
              </Link>
            </nav>
          </div>
          <div className="Header-right">
            <button className="search" onClick={() => navigate('/search')}>
              <img src="/icon/search.svg" alt="검색 아이콘" />
            </button>
            <Link className="MyWish LinkBtn" to="void">
              내가 찜한 콘텐츠
            </Link>
            <Link className="Kids LinkBtn" to="void">
              키즈
            </Link>
            <div className="MyProfileDepth">
              <button className="MyProfile" onClick={toggleProfileDepth}>
                <img src="/images/exProfile.png" alt="프로필 이미지" />
              </button>
              <ul
                className={`ProfileDropdown ${isDepthOpen ? 'open' : ''}`}
                onMouseLeave={closeDepth}>
                <li>
                  <Link to="/profile/edit" className="dropdownLink">
                    내 프로필 수정
                  </Link>
                </li>
                <li>
                  <Link to="/profile/change" className="dropdownLink">
                    프로필 변경
                  </Link>
                </li>
                <li>
                  <Link to="/profile/setting" className="dropdownLink">
                    계정 설정
                  </Link>
                </li>
                <li>
                  <button className="dropdownLink" onClick={() => onLogout()}>
                    로그아웃
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="Header-left">
            <h1 className="logo">
              <Link to="/">
                <img src="/images/logo.svg" alt="로고" />
              </Link>
            </h1>
          </div>
          <div className="Header-right">
            <Link to="/login" className="LinkBtn">
              로그인
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
