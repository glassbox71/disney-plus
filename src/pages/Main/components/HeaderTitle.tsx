import '../scss/HeaderTitle.scss';

interface headerTItleProps {
  mainTitle: string | number;
}

const HeaderTitle = ({ mainTitle }: headerTItleProps) => {
  return (
    <div className="mainTItle">
      <h1 className="">
        {mainTitle}
        <span className="arrow"></span>
      </h1>
    </div>
  );
};

export default HeaderTitle;
