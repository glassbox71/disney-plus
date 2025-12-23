import { useMatch } from 'react-router-dom';
import '../scss/HeaderTitle.scss';

interface headerTItleProps {
  mainTitle: string | number;
}

const HeaderTitle = ({ mainTitle }: headerTItleProps) => {
  const isKids = useMatch("/kids/*")
  return (
    <div className="mainTItle">
      <h1 className={`${isKids ? "kidsTitle" : ""}`}>
        {mainTitle}
        <span className="arrow"></span>
      </h1>
    </div>
  );
};

export default HeaderTitle;
