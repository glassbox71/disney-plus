import { Link, useLocation } from 'react-router-dom';
import './scss/Header.scss';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDepthOpen, setIsDepthOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  const isProfilePage = path.startsWith('/profile');

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

  if (isProfilePage) {
    return (
      <div className={`Header isprofile pullInner ${isScrolled ? 'active' : ''}`}>
        <div className="Header-left">
          <Link to="/">
            <img src="/images/logo.svg" alt="로고" />
          </Link>
        </div>

        <div className="Header-right">
          <button>로그아웃</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`Header pullInner ${isScrolled ? 'active' : ''} `}>
      {/* {isLogin ? ( */}
      <>
        <div className="Header-left">
          <h1 className="logo">
            <Link to="void">
              <img src="/images/logo.svg" alt="로고" />
            </Link>
          </h1>
          <nav>
            <Link className="LinkBtn" to="void">
              홈
            </Link>
            <Link className="LinkBtn" to="void">
              영화
            </Link>
            <Link className="LinkBtn" to="void">
              시리즈
            </Link>
            <Link className="LinkBtn" to="void">
              오리지널
            </Link>
          </nav>
        </div>
        <div className="Header-right">
          <button className="search">
            <img src="/icon/search.svg" alt="" />
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
                <Link to="/profile/edit">내 프로필 수정</Link>
              </li>
              <li>
                <Link to="/profile/change">프로필 변경</Link>
              </li>
              <li>
                <Link to="/profile/setting">계정 설정</Link>
              </li>
              <li>
                <button>로그아웃</button>
              </li>
            </ul>
          </div>
        </div>
      </>
      {/* ) : (
        <>
          <div className="Header-left">
            <h1 className="logo">
              <Link to="/">
                <img src="/images/logo.svg" alt="로고" />
              </Link>
            </h1>
          </div>
          <div className="Header-right">
            <Link to="/void">로그인</Link>
          </div>
        </>
      )} */}
    </div>
  );
};

export default Header;
