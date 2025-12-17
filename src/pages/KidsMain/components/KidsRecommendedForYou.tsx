import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css';
import { Pagination } from 'swiper/modules';
import { RecommendedForYouData } from '../../../store/data';
import '../scss/KidsMovieList.scss';
import { Link } from 'react-router-dom';
import HeaderTitle from '../../Main/components/HeaderTitle';

//TODO 사용자 맞춤 추천 목록
const RecommendedForYou = () => {
    return (
        <section className="RecommendedForYou movieList pullInner">
            <HeaderTitle mainTitle="@@@님이 좋아할 만한 이야기" />
            <>
                <Swiper
                    slidesPerView={6.2}
                    spaceBetween={20}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper">
                    {RecommendedForYouData.map((el) => {
                        return (
                            <SwiperSlide>
                                <Link to="void">
                                    <div className="movieThumbnail col">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500/${el.poster_path}`}
                                            alt={`${el.title} 썸네일`}
                                        />
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </>
        </section>
    );
};

export default RecommendedForYou;
