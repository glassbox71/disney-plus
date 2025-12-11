import '../scss/ThemeList.scss';
import { ThemeListNavData } from '../../../store/data';
import { useEffect, useState } from 'react';

//TODO 테마별 콘텐츠
const ThemeList = () => {
  //네비에 클릭하면 active가 추가되고 다른 li들은 active 해제.
  //active가 추가된 애의 data-set 을 가지고와서  data에서 동일한 카테고리의 moive list 10개 출력 .
  const [isClickNav, setIsClickNav] = useState(false);

  useEffect (()=> {
    
  })
  return (
    <section className="ThemeList">
      {/* 1번 */}
      <nav>
        <ul>
          {ThemeListNavData.map((v, i) => {
            return <li key={i} className={`${v.title} ${isClickNav ? 'active' : ''}`}></li>;
          })}
        </ul>
        <div className="ThemeList">
          <div className="themeText">
            {ThemeListNavData.map((v, i) => (
              <li key={i}>{v.text}</li>
            ))}
          </div>
          <div className="themeMovie"></div>
        </div>
      </nav>
    </section>
  );
};

export default ThemeList;
