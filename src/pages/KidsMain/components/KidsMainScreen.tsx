import "../scss/KidsMainScreen.scss";

interface KidsScreenProps {
    num: number;
}
const KidsMainScreen = ({ num }: KidsScreenProps) => {
    return (
        <div className="kidsScreenWrap">
            <div className="imgBox">
                <img src={`/images/kidsMain/kidsMain${num}.png`} alt="" />
            </div>
            <div className="titleBox">
                <img src="/images/logo.svg" alt="" />
                <p className="title">for Kids</p>
                <p className="des">디즈니+와 함께 떠나는 환상의 모험과 즐거움이 가득한 시간</p>
            </div>
            <div className="bgGra"></div>
        </div>
    )
}

export default KidsMainScreen