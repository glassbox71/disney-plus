import React from 'react'
import '../scss/SubscriptionContent.scss'
import { Link } from 'react-router-dom'

interface SubContentProps {
    planKey: string;
    wavve: string;
    num: string;
    price: string;
    wavves: string;
    wavveImg: string;
}

const SubscriptionContent = ({ planKey, wavve, num, price, wavves, wavveImg }: SubContentProps) => {
    return (
        <div className="subscriptionContentWrap">
            <div className="imgBox">
                <div><img className="disney" src="/images/logo.svg" alt="디즈니로고" /></div>
                <div><img className="tving" src="/images/subscription/tvingLogo.png" alt="티빙로고" /></div>
                <div className={wavveImg ? "wavve" : "none"}><img className="wavve" src={wavveImg} alt="웨이브로고" /></div>
            </div>
            <div className="title"><p>디즈니+ 티빙 {wavve} 번들</p></div>
            <div className="price">
                <p className="priceTitle">월 {price}원(부가세 포함)</p>
                {/* <p className="priceDes">또는 연 139,000원(부가세 포함, 16% 이상 할인된 가격)</p> */}
            </div>
            <div className="desWrap">
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />디즈니+ 티빙 {wavve} 스탠다드 멤버십 번들</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />개별 구독 대비 최대 {num}% 절약</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />디즈니+ {wavves}: 최대 1080p Full HD 화질</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />티빙: 고화질</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />2대 기기 동시 스트리밍</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />광고 없는 스트리밍</p>

            </div>
            <Link to="/payment" state={{ planKey }}><button>멤버십 선택</button></Link>
        </div>
    )
}

export default SubscriptionContent