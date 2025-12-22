import "./scss/KidsMainPage.scss"
import KidsMainScreen from './components/KidsMainScreen'
import KidsWatchingList from './components/KidsWatchingList'
import KidsRecommendedForYou from "./components/KidsRecommendedForYou"
import MainBanner from "../Main/components/MainBanner"
import KidsTop10 from './components/KidsTop10'
import KidsGenreList from "./components/KidsGenreList"


const KidsMovie = () => {
    return (
        <div className="KidsMainPage">
            <KidsMainScreen num={2} />
            <KidsWatchingList />
            <KidsRecommendedForYou />
            <KidsTop10 title={"현재 인기 이야기 TOP 7"} />
            <KidsGenreList genreId="12" title="슈퍼파워 히어로" />
            <MainBanner num={0} />
            <KidsGenreList genreId="10751" title="귀여운 동물 친구들" />
            <KidsGenreList genreId="14" title="또 다른 세계로" />
        </div>
    )
}

export default KidsMovie