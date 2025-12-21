import { useState } from 'react';

type FilterValue = 'all' | 'movie' | 'tv';

interface FilterSelectProps {
  mode: 'normal' | 'kids';
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filterList = [
  { type: 'normal', title: '전체', value: 'all' },
  { type: 'normal', title: '영화', value: 'movie' },
  { type: 'normal', title: '시리즈', value: 'tv' },

  { type: 'kids', title: '전체', value: 'all' },
  { type: 'kids', title: '영화', value: 'movie' },
  { type: 'kids', title: '시리즈', value: 'tv' },
] as const;

type FilterItem = (typeof filterList)[number];

const FilterSelect = ({ mode, value, onChange }: FilterSelectProps) => {
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const filtered = filterList.filter((f) => f.type === mode);
  const selectedTitle = filtered.find((f) => f.value === value)?.title ?? '전체';

  const handleSelectFilter = (f: FilterItem) => {
    onChange(f.value);
    setIsOpenFilter(false);
  };

  return (
    <>
      {isOpenFilter && <div className="filterDim" onClick={() => setIsOpenFilter(false)} />}

      <div className={`filterSelectWrap ${isOpenFilter ? 'active' : ''}`}>
        <div className="filterSelectHeader" onClick={() => setIsOpenFilter(!isOpenFilter)}>
          <p>{selectedTitle}</p>
          <span className="filterToggle" />
        </div>

        {isOpenFilter && (
          <ul className="filterList">
            {filtered.map((f) => (
              <li key={f.value}>
                <button onClick={() => handleSelectFilter(f)}>{f.title}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default FilterSelect;
