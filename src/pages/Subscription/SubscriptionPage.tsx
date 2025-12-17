import { useEffect, useState } from "react";
import SubscriptionTitle from './components/SubscriptionTitle'
import './scss/SubscriptionPage.scss'
import Toggle from './components/Toggle'
import SubscriptionContent from './components/SubscriptionContent'
import SubscriptionDisneyContent from './components/SubscriptionDisneyContent'
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const SubscriptionPage = () => {
    const [activeBtn, setActiveBtn] = useState("bundle");
    const isLogin = useAuthStore((a) => a.isLogin);
    const loading = useAuthStore((s) => s.loading);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isLogin) {
            navigate("/login", { replace: true });
        }
    }, [loading, isLogin, navigate])

    if (!isLogin) return null;

    return (
        <div className='subscriptionBg pullInner'>
            <div className="subscriptionWrap">
                <SubscriptionTitle />
                <Toggle activeBtn={activeBtn} setActiveBtn={setActiveBtn} mode="sub" />

                {activeBtn === "bundle" && (
                    <div className="contentWrap">
                        <SubscriptionContent price="21,000" wavve="웨이브" num="37" wavves="& 웨이브" wavveImg="/images/subscription/wavveLogo.png" planKey="티빙 웨이브 번들" />
                        <SubscriptionContent price="18,000" num="23" wavve={""} wavves={""} wavveImg={""} planKey="티빙 번들" />
                    </div>
                )}

                {activeBtn === "disney" && (
                    <div className="disneyContentWrap">
                        <SubscriptionDisneyContent title="프리미엄" price="21,500" priceDes="139,000"
                            des1="최대 4K UHD & HDR 화질" des2="최대 Dolby Atomos 오디오" des3="최대 4대 기기 동시 스트리밍" planKey="프리미엄"
                        />
                        <SubscriptionDisneyContent title="스탠다드" price="9,900" priceDes="99,000"
                            des1="최대 1080p Full HD" des2="최대 5.1 사운드" des3="2대 기기 동시 스트리밍" planKey="스탠다드"
                        />
                    </div>
                )}

                <p className='ex'>디즈니에서 구독하게 되는 멤버십은 <span>만 19세 이상</span>만 구독 가능하며, <span>회원님의 가구에 연동된 기기에서만 이용할 수 있습니다.</span></p>
            </div>
        </div>
    )
}

export default SubscriptionPage