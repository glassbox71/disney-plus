import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useKidsMoiveStore } from '../../../store/useKidsMovieStore';
import '../scss/KidsDeatil.scss';
import { characterMovieData } from '../../../store/kidsMovieData';

type MediaType = 'movie' | 'tv' | 'discover';
interface KidsDeatilItems {
  id: string;
  img: string;
  name: string;
  text: string;
  type: MediaType;
  query: string;
}

const KidsDetail = () => {
  const { friends } = useParams<{ friends: string }>();
  const { kidsCharacterMovie, onFethCharacterMovie } = useKidsMoiveStore();
  const selected = characterMovieData.find((c) => c.id === friends) as KidsDeatilItems | undefined;

  useEffect(() => {
    if (!selected) return;
    onFethCharacterMovie({ type: selected.type, query: selected.query });
  }, [onFethCharacterMovie, selected]);
  return (
    <div className="kidsDetailListWrap">
      <h2 className="title">{selected?.text}</h2>
      <ul className="kidsList">
        {kidsCharacterMovie.map((item) => (
          <li className="kidsItem" key={`${item.id}`}>
            <Link to={`/play/${item.id}`}>
              <div className="imgBox">
                <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.title} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KidsDetail;
