import { Link, useLocation, useNavigate } from 'react-router-dom';
import './scss/Header.scss';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDepthOpen, setIsDepthOpen] = useState(false);
  const { isLogin, onLogout } = useAuthStore();
  const { profiles, activeProfileId, editActiveProfile } = useProfileStore();
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const isProfilePage = path.startsWith('/profile');
  const isLoginPage = path.startsWith('/login');
  const isSignupPage = path.startsWith('/signup');
  const isSubPage = path.startsWith('/subscription');
  const isPayPage = path.startsWith('/payment');

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId);

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

  if (isProfilePage || isLoginPage || isSubPage || isPayPage) {
    return (
      <div className={`Header isprofile pullInner ${isScrolled ? 'active' : ''}`}>
        <div className="Header-left">
          <Link to="/">
            <img src="/images/logo.svg" alt="로고" />
          </Link>
        </div>

        <div className="Header-right">
          <button className="onLogoutBtn" onClick={() => onLogout()}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`Header pullInner ${isScrolled ? 'active' : ''} `}>
      {isLogin && !isSignupPage ? (
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
            </nav>
          </div>
          <div className="Header-right">
            <button className="search" onClick={() => navigate('/search')}>
              <img src="/icon/search.svg" alt="검색 아이콘" />
            </button>
            <Link className="MyWish LinkBtn" to="/wishlist">
              내가 찜한 콘텐츠
            </Link>
            <div className="MyProfileDepth">
              <button className="MyProfile" onClick={toggleProfileDepth}>
                <img src={activeProfile?.image} alt={activeProfile?.name || '프로필'} />
              </button>
              <ul
                className={`ProfileDropdown ${isDepthOpen ? 'open' : ''}`}
                onMouseLeave={closeDepth}>
                <li>
                  <button
                    className="dropdownLink"
                    onClick={() => {
                      editActiveProfile();
                      navigate('/profile/edit');
                    }}>
                    내 프로필 수정
                  </button>
                </li>
                <li>
                  <Link to="/profile/select" className="dropdownLink">
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
