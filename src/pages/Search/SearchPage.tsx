// TODO 검색창
import { useEffect, useState } from 'react';
import GenreSelect from './components/GenreSelect';
import SearchInput from './components/SearchInput';
import SearchList from './components/SearchList';
import './scss/SearchPage.scss';
import { useSearchStore } from '../../store/useSearchStore';
import SearchTop10List from './components/SearchTop10List';
import { useMovieStore } from '../../store/useMovieStore';

// TODO 검색페이지에서 해야할 것
// 장르 id를 가져와 검색어와 연결
// 영화 or 시리즈의 제목에 해당하는 값을 가져와 검색어와 연결
// but, 없으면 장르 id를 매치시켜 동일 장르 작품 띄우기
// 화면에 뿌릴 내용 => 포스터 이미지, 로고
// 검색 페이지 첫 화면 / 검색어 입력 전 => 인기 영화 top10 / 인기 시리즈 top10
//  ${onKidsMode ? 'kids' : 'normal'}
const SearchPage = () => {
  const [onKidsMode] = useState(false);
  const { searchWord, selectedFilter } = useSearchStore();
  const { onFetchTOP, onFetchTOPTV, Top, TopTV } = useMovieStore();

  useEffect(() => {
    onFetchTOP();
    onFetchTOPTV();
  }, []);

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
              <>
                <SearchTop10List title="인기 영화 TOP 10" data={Top} />
                <SearchTop10List title="인기 TV TOP 10" data={TopTV} />
              </>
            ) : (
              <SearchList />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
