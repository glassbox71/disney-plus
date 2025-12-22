import { useNavigate } from 'react-router-dom';
import { useWishStore } from '../../store/useWishStore';
import './scss/WishlistPage.scss';
import { useEffect, useMemo, useState } from 'react';
import { useProfileStore } from '../../store/useProfileStore';
import FilterSelect from './components/FilterSelect';

const WishlistPage = () => {
  const { wishlist, onToggleWish, onFetchWish } = useWishStore();
  const { activeProfileId } = useProfileStore();
  const navigate = useNavigate();

  // 🔹 필터 상태
  const [mediaFilter, setMediaFilter] = useState<'all' | 'movie' | 'tv'>('all');

  // 🔹 프로필 변경 시 찜 목록 재호출
  useEffect(() => {
    if (activeProfileId) {
      onFetchWish();
    }
  }, [activeProfileId, onFetchWish]);

  // 🔹 필터링된 찜 목록
  const filteredWishlist = useMemo(() => {
    if (mediaFilter === 'all') return wishlist;
    return wishlist.filter((wish) => wish.media_type === mediaFilter);
  }, [wishlist, mediaFilter]);

  // 🔹 찜 목록 자체가 비었을 때
  if (wishlist.length === 0) {
    return (
      <div className="wishlistPage normal">
        <div className="inner">
          <div className="wishWrap">
            <div className="pageTopWrap">
              <h2>내가 찜한 콘텐츠</h2>
            </div>
            <div className="wishListWrap">
              <p className="emptyMessage">
                찜한 콘텐츠가 없습니다. <br /> 취향에 맞는 콘텐츠를 담아주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlistPage normal pullInner">
      <div className="inner">
        <div className="wishWrap">
          <div className="pageTopWrap">
            <h2>내가 찜한 콘텐츠</h2>
            <FilterSelect mode="normal" value={mediaFilter} onChange={setMediaFilter} />
          </div>

          <div className="wishListWrap">
            {filteredWishlist.length === 0 ? (
              <p className="emptyMessage">해당 조건의 콘텐츠가 없습니다.</p>
            ) : (
              <ul className="listWrap">
                {filteredWishlist.map((wish) => (
                  <li key={`${wish.media_type}-${wish.id}`} className="wishItem">
                    <div className="imgBox">
                      <img
                        src={
                          wish.poster_path
                            ? `https://image.tmdb.org/t/p/w500${wish.poster_path}`
                            : '/assets/no-image.png'
                        }
                        alt={wish.title}
                      />
                    </div>

                    <div className="hoverWrap">
                      <div className="hoverBg">
                        <ul className="wishTab">
                          <li>
                            <button onClick={() => onToggleWish(wish)} title="찜 목록에서 제거">
                              <img src="/icon/trashIcon.svg" alt="제거" />
                            </button>
                          </li>
                          <li>
                            <button
                              title="재생"
                              onClick={() => navigate(`/play/${wish.media_type}/${wish.id}/video`)}>
                              <img src="/icon/playIcon.svg" alt="재생" />
                            </button>
                          </li>
                          <li>
                            <button
                              title="상세 정보"
                              onClick={() => navigate(`/play/${wish.media_type}/${wish.id}`)}>
                              <img src="/icon/hamIcon.svg" alt="상세 정보" />
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
