import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSearchStore } from '../../../store/useSearchStore';
import { useContentMatchStore } from '../../../store/useContentMatchStore';

const SearchList = () => {
  const { searchResults, searchWord } = useSearchStore();
  const { mergedList, setLocalList } = useContentMatchStore();

  // 검색 결과가 변경될 때 매칭 스토어에 데이터 주입
  useEffect(() => {
    setLocalList(searchResults);
  }, [searchResults, setLocalList]);

  // 핵심: 매칭된 결과(mergedList)가 비어있다면 원본 검색 결과(searchResults)를 가공해서 사용
  // 이렇게 하면 TMDb 매칭 데이터가 없더라도 화면에 로컬 데이터가 즉시 나타납니다.
  const displayResults = useMemo(() => {
    if (mergedList.length > 0) return mergedList;

    // 매칭 결과가 없을 때 로컬 데이터를 정규화하여 반환
    return searchResults.map((item: any) => ({
      id: item.id,
      media_type: item.category === 'movie' ? 'movie' : 'tv',
      title: item.title || item.name,
      poster_path: item.poster_path,
    }));
  }, [mergedList, searchResults]);

  console.log('최종 출력 리스트:', displayResults);

  if (searchWord && displayResults.length === 0) {
    return (
      <div className="searchListWrap">
        <p className="noResult">
          "<strong>{searchWord}</strong>" 에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="searchListWrap">
      <ul className="searchList">
        {displayResults.map((item) => (
          <li key={`${item.media_type}-${item.id}`} className="searchItem">
            <Link to={`/play/${item.media_type}/${item.id}`}>
              <div className="imgBox">
                <img
                  src={
                    item.poster_path
                      ? item.poster_path.startsWith('http')
                        ? item.poster_path
                        : `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : '/assets/no-image.png'
                  }
                  alt={item.title}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchList;
