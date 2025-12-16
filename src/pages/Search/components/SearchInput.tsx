import { useEffect, useState } from 'react';
import { useSearchStore } from '../../../store/useSearchStore';

const SearchInput = () => {
  const [value, setValue] = useState('');
  const { onSearch, clearSearch } = useSearchStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      } else {
        clearSearch();
      }
    });
  }, [onSearch]);

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);

    if (!v.trim()) {
      clearSearch();
    }
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
