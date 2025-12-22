import "./scss/KidsMainPage.scss"
import KidsMainScreen from './components/KidsMainScreen'
import KidsWatchingList from './components/KidsWatchingList'
import KidsRecommendedForYou from "./components/KidsRecommendedForYou"
import KidsFriendsSelect from "./components/KidsFriendsSelect"
import MainBanner from "../Main/components/MainBanner"
import KidsTop10 from './components/KidsTop10'
import KidsGenreList from "./components/KidsGenreList"



const KidsMainPage = () => {

    return (
        <div className="KidsMainPage">
            <KidsMainScreen num={1} />
            <KidsWatchingList />
            <KidsFriendsSelect />
            <KidsRecommendedForYou />
            <KidsTop10 title={"현재 인기 이야기 TOP 7"} />
            <KidsGenreList genreId="12" title="슈퍼파워 히어로" />
            <KidsGenreList genreId="10751" title="귀여운 동물 친구들" />
            <MainBanner num={0} />
            <KidsGenreList genreId="14" title="또 다른 세계로" />
        </div>
    )
}

export default KidsMainPage