// import '../scss/KidsThemeList.scss';
// import 'swiper/swiper.css';
// import { KidsThemeListNavData } from '../../../store/kidsMovieData';
// import { useMovieStore } from '../../../store/useMovieStore';
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { useKidsMoiveStore } from '../../../store/useKidsMovieStore';
// import { kidsCollectionsData } from '../../../store/kidsMovieData';

// //TODO 테마별 콘텐츠
// const KidsThemeList = () => {
//     const { isLoading } = useMovieStore();
//     const { kidsThemeMoive, onFetchCollctionMovie } = useKidsMoiveStore()
//     const [activeTheme, setActiveTheme] = useState(KidsThemeListNavData[0].title);

//     //TODO 현재 선택된 테마의 데이터를 찾습니다.
//     const activeThemeData = KidsThemeListNavData.find((v) => v.title === activeTheme);

//     const activeThemeText = activeThemeData?.text ?? '';



//     useEffect(() => {
//         // title이랑  kidsCollectionData id랑 같은거 찾기
//         const selected = kidsCollectionsData.find((s) => s.id === activeTheme);
//         if (!selected) {
//             console.log("해당 테마 없음", activeTheme);
//             return;
//         }
//         onFetchCollctionMovie(selected)
//     }, [activeTheme, kidsCollectionsData]);


//     const skeletonClassName = isLoading ? 'skeleton' : 'hidden skeleton';

//     return (
//         <section className="kidsThemeList">
//             <nav className="menu">
//                 <ul>
//                     {KidsThemeListNavData.map((v, i) => (
//                         <li
//                             key={i}
//                             className={`${v.title} ${v.title === activeTheme ? 'active' : ''}`}
//                             onClick={() => {
//                                 setActiveTheme(v.title);
//                             }}
//                         />
//                     ))}
//                 </ul>

//                 <div className="kidsThemeList">
//                     <div className="themeText">
//                         <p>{activeThemeText}</p>
//                         <button>둘러보기</button>
//                     </div>

//                     <div className="kidsthemeMovie">
//                         {/* {isLoading && <div className="skeleton" />} */}
//                         <div className={skeletonClassName}>
//                             <div className="div"></div>
//                             <div className="div"></div>
//                             <div className="div"></div>
//                             <div className="div"></div>
//                             <div className="div"></div>
//                         </div>

//                         {!isLoading && kidsThemeMoive.length > 0 && (
//                             <Swiper slidesPerView={4.4} spaceBetween={20}>
//                                 {kidsThemeMoive
//                                     .filter((m) => m.poster_path)
//                                     .slice(0, 10)
//                                     .map((m) => (
//                                         <SwiperSlide key={m.id}>
//                                             <Link to="void">
//                                                 <img
//                                                     src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
//                                                     alt={m.title}
//                                                 />
//                                             </Link>
//                                         </SwiperSlide>
//                                     ))}
//                             </Swiper>
//                         )}
//                     </div>
//                 </div>
//             </nav>
//         </section>
//     );
// };

// export default KidsThemeList;
