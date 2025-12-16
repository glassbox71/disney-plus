// 일반, 키즈 조건문

import { useState } from 'react';
import { useGenreStore } from '../../../store/useGenreStore';
import { useSearchStore } from '../../../store/useSearchStore';

interface GenreSelectProps {
  mode: 'normal' | 'kids';
}

const GenreSelect = ({ mode }: GenreSelectProps) => {
  const [isOpenGenre, setIsOpenGenre] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('장르');
  const { genreList } = useGenreStore();
  const { setSelectedFilter } = useSearchStore();

  // mode에 맞는 장르만 필터
  const filteredGenres = genreList.filter((genre) => genre.type === mode);

  const handleSelectGenres = (genre: any) => {
    setSelectedFilter(genre.filter);
    setSelectedGenre(genre.title);
    setIsOpenGenre(false);
  };

  return (
    <div className={`genreSelectWrap ${isOpenGenre ? 'active' : ''}`}>
      <div className="genreSelectHeader" onClick={() => setIsOpenGenre(!isOpenGenre)}>
        <p>{selectedGenre}</p>
        <span className="genreToggle"></span>
      </div>
      <ul className="genreList">
        {filteredGenres.map((genre, id) => (
          <li key={id}>
            <button onClick={() => handleSelectGenres(genre)}>{genre.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreSelect;
