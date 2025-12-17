import { Link } from 'react-router-dom'
import "../scss/SubscriptionDisneyContent.scss"

interface SubDisneyContentProps {
    planKey: string;
    title: string;
    price: string;
    priceDes: string;
    des1: string;
    des2: string;
    des3: string;
}

const SubscriptionDisneyContent = ({ planKey, title, price, priceDes, des1, des2, des3 }: SubDisneyContentProps) => {
    return (
        <div className="subscriptionDisneyContentWrap">
            <div className="imgBox">
                <div><img className="disney" src="/images/logo.svg" alt="디즈니로고" /></div>
            </div>
            <div className="title"><p>디즈니+ {title}</p></div>
            <div className="price">
                <p className="priceTitle">월 {price}원(부가세 포함)</p>
                <p className="priceDes">또는 연 {priceDes}원(부가세 포함, 16% 이상 할인된 가격)</p>
            </div>
            <div className="desWrap">
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />{des1}</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />{des2}</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />{des3}</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />광고 없는 스트리밍</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />최대 10대 기기에서 콘텐츠 저장 가능</p>

            </div>
            <Link to="/payment" state={{ planKey }}><button>멤버십 선택</button></Link>
        </div>
    )
}

export default SubscriptionDisneyContent