
import HeaderTitle from '../../Main/components/HeaderTitle'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import "../scss/KidsFriendsSelect.scss";

const friendsImg = [
    {
        img: "/images/kidsMain/friends1.png",
        name: "엘사"
    },
    {
        img: "/images/kidsMain/friends2.png",
        name: "미니마우스"
    },
    {
        img: "/images/kidsMain/friends3.png",
        name: "곰돌이푸"
    },
    {
        img: "/images/kidsMain/friends4.png",
        name: "올라프"
    },
    {
        img: "/images/kidsMain/friends5.png",
        name: "스티치"
    },
    {
        img: "/images/kidsMain/friends6.png",
        name: "재규어"
    },
    {
        img: "/images/kidsMain/friends7.png",
        name: "미녀"
    },
]
const KidsFriendsSelect = () => {
    return (
        <section className="frindsSelect pullInner movieList">
            <HeaderTitle mainTitle="디즈니+ 친구들" />
            <>
                <Swiper
                    slidesPerView={6.7}
                    spaceBetween={3}
                    modules={[Pagination]}
                >
                    {friendsImg.map((i) => (
                        <SwiperSlide>
                            <div className="imgBox">
                                <img src={i.img} alt={i.name} />
                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        </section>
    )
}

export default KidsFriendsSelect