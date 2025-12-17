import BannerBtn from '../../../common/BannerBtn';
import { mainBanner } from '../../../store/mainBanner';
import '../scss/MainBanner.scss';

interface MainBannerProps {
  num: number;
}
const MainBanner = ({ num }: MainBannerProps) => {
  const banner = mainBanner[num];
  if (!banner) return null;
  return (
    <section className="mainBannerWrap pullInner">
      <div className="bgImg">
        <img src={banner.background_img} alt={banner.title} />
        <div className="content">
          <div className="imgBox">
            <p className={`logo ${banner.logo_size}`}>
              <img src={banner.logo} alt={banner.title} />
            </p>
          </div>
          <div className="textBox">
            <div className="movieInfo">
              <div className={`age age${banner.age}`}></div>
              <div className="releaseDate">{banner.release_date}</div>
              <div className="time">{banner.running_time || banner.total_series}</div>
              <div className="genreTitle">{banner.genres}</div>
            </div>
          </div>
        </div>
        <BannerBtn />
      </div>
    </section>
  );
};

export default MainBanner;
