import { Link } from 'react-router-dom';
import './scss/Header.scss';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div className={`Header pullInner ${isScrolled ? 'active' : ''} `}>
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
        <Link className="MyProfile LinkBtn" to="void">
          <img src="/images/exProfile.png" alt="프로필 이미지" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
