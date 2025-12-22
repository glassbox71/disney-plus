import { useEffect } from 'react';
import GenreSelect from './components/GenreSelect';
import SearchInput from './components/SearchInput';
import SearchList from './components/SearchList';
import './scss/SearchPage.scss';
import { useSearchStore } from '../../store/useSearchStore';
import SearchTop10List from './components/SearchTop10List';
import { useMovieStore } from '../../store/useMovieStore';
import { useTvStore } from '../../store/useTvStore';

const SearchPage = () => {
  const onKidsMode = false;

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
              <>
                <SearchTop10List
                  title="인기 영화 TOP 10"
                  data={
                    Top?.map((m) => ({
                      ...m,
                      media_type: 'movie' as const,
                    })) ?? []
                  }
                />

                <SearchTop10List
                  title="인기 TV TOP 10"
                  data={
                    TopTV?.map((t) => ({
                      ...t,
                      media_type: 'tv' as const,
                    })) ?? []
                  }
                />
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
