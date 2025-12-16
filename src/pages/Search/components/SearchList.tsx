import { Link } from 'react-router-dom';
import { useSearchStore } from '../../../store/useSearchStore';
import { useMovieStore } from '../../../store/useMovieStore';

const SearchList = () => {
  const { searchResults, searchWord, selectedGenreId } = useSearchStore();
  const { getMovieByGenre, upcomingMovies, popularMovies } = useMovieStore();

  console.log('검색어:', searchWord);
  console.log('결과:', searchResults);

  // 표시할 결과 내용
  let displayResults = searchResults;

  if (searchWord && searchResults.length === 0) {
    // 장르 기반
    displayResults = selectedGenreId ? getMovieByGenre(selectedGenreId) || [] : popularMovies;
  }
  if (!displayResults || displayResults.length === 0) {
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
            <Link to="/void">
              <div className="imgBox">
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title || item.name}
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
