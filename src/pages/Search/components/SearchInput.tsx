import { useEffect, useState } from 'react';
import { useSearchStore } from '../../../store/useSearchStore';

const SearchInput = () => {
  const [value, setValue] = useState('');
  const { onSearch, clearSearch, searchWord } = useSearchStore();

  // store의 searchWord와 input 동기화
  useEffect(() => {
    setValue(searchWord);
  }, [searchWord]);

  // debounce 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      } else {
        clearSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch, clearSearch]);

  const handleSearch = () => {
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="searchInputWrap">
      <label>
        <input
          type="text"
          className="searchInput"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="제목 또는 장르를 입력하세요."
        />
      </label>
      <button className="searchBtn" onClick={handleSearch}>
        <img src="/icon/search.svg" alt="검색아이콘" />
      </button>
    </div>
  );
};

export default SearchInput;
