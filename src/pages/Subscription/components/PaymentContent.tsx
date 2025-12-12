import "../scss/PaymentContent.scss";

interface payContentProps {
    wavve: string;
    num: string;
    price: string;
    wavves: string;
    wavveImg: string;
    tvingImg: string;
}

const PaymentContent = ({ wavve, num, price, wavves, wavveImg, tvingImg, tving, sub }: payContentProps) => {
    return (
        <div className="payContentWrap">
            <div className="imgBox">
                <div><img className="disney" src="/images/logo.svg" alt="디즈니로고" /></div>
                <div className={tvingImg ? "tving" : "none"}><img className="tving" src="/images/subscription/tvingLogo.png" alt="티빙로고" /></div>
                <div className={wavveImg ? "wavve" : "none"}><img className="wavve" src={wavveImg} alt="웨이브로고" /></div>
            </div>
            <div className="title"><p>디즈니+ {tving} {wavve} {sub}</p></div>
            <div className="price">
                <p className="priceTitle">월 {price}원(부가세 포함)</p>
            </div>
            <div className="desWrap">
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />최대 4K UHD & HDR 화질 / 최대 Dolby Atomos 오디오  </p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />최대 4대 기기 동시 스트리밍 / 최대 10대 기기에서 콘텐츠 저장 가능 </p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />광고 없는 스트리밍</p>
            </div>
        </div>
    )
}

export default PaymentContent