import { useState } from 'react'
import PaymentRadioBtn from './components/PaymentRadioBtn'
import "./scss/PaymentPage.scss";
import Toggle from './components/Toggle';
import PayCredit from './components/PayCredit';
import PayCheck from './components/PayCheck';
import PayDes from './components/PayDes';
import PayBtn from './components/PayBtn';
import PayPopup from './components/PayPopup';
import PayContent from './components/PayContent';
import { useLocation, useNavigate } from 'react-router-dom';
import { subscription } from '../../store/subscription';
import { useSubStore } from "../../store/useSubStore"

const PaymentPage = () => {
    const [activeBtn, setActiveBtn] = useState("credit");
    const [popup, setPopup] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const saveMembership = useSubStore((s) => s.saveMenbership)

    const planKey = (location.state as { planKey?: string } | null)?.planKey;
    const selectedPlan = subscription.find((p) => p.key === planKey);

    if (!selectedPlan) {
        navigate("/subscription")
        return null;
    }

    const handlePaySuccess = () => {
        // console.log("결제 버튼 클릭됨")
        saveMembership(selectedPlan);
        navigate("/subscription/success")
    }

    const handleClosePopup = () => {
        setPopup(false);
    }
    return (
        <div className='paymentBg'>
            <div className="paymentWrap">
                <p className='payTitle'>지금 바로 스트리밍을 시작하세요</p>
                <PayContent plan={selectedPlan} />
                <PaymentRadioBtn plan={selectedPlan} />
                <Toggle activeBtn={activeBtn} setActiveBtn={setActiveBtn} mode="pay" />
                {activeBtn === "credit" && (
                    <PayCredit onPopupOpen={() => setPopup(true)} />
                )}
                {activeBtn === "credit" && (
                    <PayCheck />
                )}
                <PayDes />
                <PayBtn activeBtn={activeBtn} onPay={handlePaySuccess} />
                {popup ? <PayPopup onClose={handleClosePopup} /> : ""}

            </div>

        </div>
    )
}

export default PaymentPage