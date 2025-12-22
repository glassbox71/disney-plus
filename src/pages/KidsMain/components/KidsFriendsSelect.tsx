
import HeaderTitle from '../../Main/components/HeaderTitle'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import "../scss/KidsFriendsSelect.scss";
import { Link } from 'react-router-dom';
import { characterMovieData } from '../../../store/kidsMovieData';
import { useKidsMoiveStore, type MediaType } from '../../../store/useKidsMovieStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { useEffect } from 'react';



const KidsFriendsSelect = () => {
    const { characterExist, onFethCharacterMovie } = useKidsMoiveStore();
    const activeProfileId = useProfileStore((p) => p.activeProfileId);
    const profiles = useProfileStore((p) => p.profiles);

    const active = profiles.find((p) => p.id === activeProfileId);
    const contentLimit = active?.contentLimit;
    const isKids = active?.isKids;

    useEffect(() => {
        characterMovieData.forEach((c) => {
            onFethCharacterMovie({
                type: c.type as MediaType,
                query: c.query,
                characterId: c.id,
                isCharacter: true,
            })
        })
    }, [onFethCharacterMovie, contentLimit, isKids, activeProfileId])

    const hideCharacters = characterMovieData.filter((c) => characterExist[c.id] !== false)

    return (
        <section className="frindsSelect pullInner movieList">
            <HeaderTitle mainTitle="디즈니+ 친구들" />
            <>
                <Swiper
                    slidesPerView={5.2}
                    spaceBetween={1}
                    modules={[Pagination]}
                >
                    {hideCharacters.map((i) => (
                        <SwiperSlide key={i.id}>
                            <div className="imgBox">
                                <Link to={`/kids/${encodeURIComponent(i.id)}`}>
                                    <img src={i.img} alt={i.name} />
                                </Link>

                            </div>

                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        </section >
    )
}

export default KidsFriendsSelect