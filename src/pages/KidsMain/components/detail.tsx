import React from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useKidsMoiveStore } from '../../../store/useKidsMovieStore';
import 'swiper/swiper.css';
import { Pagination } from 'swiper/modules';

const detail = () => {
    const { kidsThemeMoive } = useKidsMoiveStore();
    return (

        <section className="RecommendedForYou movieList pullInner">
            {/* <HeaderTitle mainTitle="@@@님이 좋아할 만한 이야기" /> */}
            <>
                <Swiper
                    slidesPerView={6.2}
                    spaceBetween={20}
                    // Pagination={{
                    //     clickable: true,
                    // }}
                    modules={[Pagination]}
                    className="mySwiper">
                    {kidsThemeMoive.map((el) => {
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

}

export default detail