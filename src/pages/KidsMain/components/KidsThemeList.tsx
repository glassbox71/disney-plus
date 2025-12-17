//   const isMovieLoaded = theme.length > 0 && !isLoading;
//   console.log("테마와 로딩중", theme, isLoading, isMovieLoaded)

//   return (
//     <section className="ThemeList">
//       {/* 1번 */}
//       <div className='menu'>
//         <ul>
//           {ThemeListNavData.map((v, i) => {
//             const isActive = v.title === activeTheme;
//             return (
//               <li
//                 key={i}
//                 className={` ${v.title} ${isActive ? 'active' : ''}`}
//                 onClick={() => handleNavClick(v.title)}></li>
//             );
//           })}
//         </ul>
//         <div className="ThemeList">
//           <div className="themeText">
//             <p>{activeThemeText}</p>
//             <button>둘러보기</button>
//           </div>
//           <div className="themeMovie">
//             <div className={skeletonClassName}>
//               <div className="div"></div>
//               <div className="div"></div>
//               <div className="div"></div>
//               <div className="div"></div>
//               <div className="div"></div>
//             </div>

//             {/* {isMovieLoaded && ( */}
//             {!isLoading && theme.length > 0 && (
//               <Swiper
//                 slidesPerView={4.4}
//                 spaceBetween={20}
//                 pagination={{
//                   clickable: true,
//                 }}
//                 className="mySwiper">
//                 {theme &&
//                   theme
//                     .filter((el) => el.poster_path)
//                     .slice(0, 10)
//                     .map((el) => (
//                       <SwiperSlide>
//                         <Link className="" to="void">
//                           <div className="col movieThumbnail">
//                             <img
//                               src={`https://image.tmdb.org/t/p/w500${el.poster_path}`}
//                               alt={`${el.title || el.name} 썸네일`}
//                             />
//                           </div>
//                         </Link>
//                       </SwiperSlide>
//                     ))}
//               </Swiper>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ThemeList;

import '../scss/KidsThemeList.scss';
import 'swiper/swiper.css';
import { KidsThemeListNavData } from '../../../store/data';
import { useMovieStore } from '../../../store/useMovieStore';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

//TODO 테마별 콘텐츠
const KidsThemeList = () => {
    const { onfetchTheme, themeMovies, isLoading } = useMovieStore();
    const [activeTheme, setActiveTheme] = useState(KidsThemeListNavData[0].title);

    //TODO 현재 선택된 테마의 데이터를 찾습니다.
    const activeThemeData = KidsThemeListNavData.find((v) => v.title === activeTheme);
    //TODO 현재 선택된 테마의 코드를 찾습니다.
    const activeThemeId = activeThemeData?.companyId ?? '';
    const activeThemeText = activeThemeData?.text ?? '';

    //  최초 1회만 fetch
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!activeThemeId || fetchedRef.current) return;
        fetchedRef.current = true;
        onfetchTheme(activeThemeId);
    }, [activeThemeId]);

    const skeletonClassName = isLoading ? 'skeleton' : 'hidden skeleton';

    return (
        <section className="ThemeList">
            <nav className="menu">
                <ul>
                    {KidsThemeListNavData.map((v, i) => (
                        <li
                            key={i}
                            className={`${v.title} ${v.title === activeTheme ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTheme(v.title);
                                fetchedRef.current = false;
                            }}
                        />
                    ))}
                </ul>

                <div className="ThemeList">
                    <div className="themeText">
                        <p>{activeThemeText}</p>
                        <button>둘러보기</button>
                    </div>

                    <div className="themeMovie">
                        {/* {isLoading && <div className="skeleton" />} */}
                        <div className={skeletonClassName}>
                            <div className="div"></div>
                            <div className="div"></div>
                            <div className="div"></div>
                            <div className="div"></div>
                            <div className="div"></div>
                        </div>

                        {!isLoading && themeMovies.length > 0 && (
                            <Swiper slidesPerView={4.4} spaceBetween={20}>
                                {themeMovies
                                    .filter((m) => m.poster_path)
                                    .slice(0, 10)
                                    .map((m) => (
                                        <SwiperSlide key={m.id}>
                                            <Link to="void">
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                                                    alt={m.title}
                                                />
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </nav>
        </section>
    );
};

export default KidsThemeList;
