import "./scss/KidsMainPage.scss"
import KidsMainScreen from './components/KidsMainScreen'
import KidsWatchingList from './components/KidsWatchingList'
import KidsRecommendedForYou from "./components/KidsRecommendedForYou"
import KidsFriendsSelect from "./components/KIdsFriendsSelect"
import KidsThemeList from "./components/KidsThemeList"
import GenreList from "../Main/components/GenreList"
import MainBanner from "../Main/components/MainBanner"

const KidsMainPage = () => {
    return (
        <div className="KidsMainPage">
            <KidsMainScreen />
            <KidsWatchingList />
            <KidsFriendsSelect />
            <KidsRecommendedForYou />
            <KidsThemeList />
            <GenreList genreId="53" title="슈퍼파워 히어로" />
            {/* <MainBanner num={3} /> */}
            랭크
            <GenreList genreId="16" title="귀여운 동물 친구들" />
            <MainBanner num={0} />
            <GenreList genreId="9648" title="또 다른 세계로" />
        </div>
    )
}

export default KidsMainPage