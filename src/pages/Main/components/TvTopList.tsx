import { useEffect } from 'react';
import { useTvStore } from '../../../store/useTvStore';

const TvTopList = () => {
  const { onFetchTopTV, TopTv } = useTvStore();

  useEffect(() => {
    if (TopTv.length === 0) {
      onFetchTopTV();
    }
  }, [onFetchTopTV, TopTv]);

  console.log('TopTv', TopTv);

  return <section className="TvTopList"></section>;
};

export default TvTopList;
