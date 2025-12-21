// TODO 검색창
import { useEffect, useState } from 'react';
import '../../Search/scss/SearchPage.scss';
import { useSearchStore } from '../../../store/useSearchStore';
import { useMovieStore } from '../../../store/useMovieStore';
import SearchInput from '../../Search/components/SearchInput';
import GenreSelect from '../../Search/components/GenreSelect';
import SearchTop10List from '../../Search/components/SearchTop10List';
import SearchList from '../../Search/components/SearchList';
import { useTvStore } from '../../../store/useTvStore';

// TODO 검색페이지에서 해야할 것
// 장르 id를 가져와 검색어와 연결
// 영화 or 시리즈의 제목에 해당하는 값을 가져와 검색어와 연결
// but, 없으면 장르 id를 매치시켜 동일 장르 작품 띄우기
// 화면에 뿌릴 내용 => 포스터 이미지, 로고
// 검색 페이지 첫 화면 / 검색어 입력 전 => 인기 영화 top10 / 인기 시리즈 top10

const KidsSearch = () => {
  const [onKidsMode] = useState(true);
  const { searchWord, selectedFilter } = useSearchStore();
  const { onFetchTOP, Top } = useMovieStore();
  const { onFetchTopTV, TopTV } = useTvStore();

  useEffect(() => {
    onFetchTOP();
  }, [onFetchTOP]);

  useEffect(() => {
    onFetchTopTV();
  }, [onFetchTopTV]);

  const isInitial = !searchWord && !selectedFilter;

  return (
    <div className={`searchPage ${onKidsMode ? 'kids' : 'normal'}`}>
      <div className="inner">
        <div className="searchWrap">
          <div className="searchTop">
            <SearchInput />
            <GenreSelect mode={onKidsMode ? 'kids' : 'normal'} />
          </div>
          <div className="searchBottom">
            {isInitial ? (
              <div>
                {/* 1. 데이터가 존재할 때만 map을 실행하도록 ?. 연산자 추가 */}
                <SearchTop10List
                  title="인기 영화 TOP 10"
                  data={Top?.map((m) => ({ ...m, media_type: 'movie' })) || []}
                />

                <SearchTop10List
                  title="인기 TV TOP 10"
                  data={TopTV?.map((t) => ({ ...t, media_type: 'tv' })) || []}
                />
              </div>
            ) : (
              <SearchList />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidsSearch;
