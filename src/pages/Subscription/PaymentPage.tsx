import { act, useState } from 'react'
import PaymentRadioBtn from './components/PaymentRadioBtn'
import "./scss/PaymentPage.scss";
import Toggle from './components/Toggle';
import PayCredit from './components/PayCredit';
import PayCheck from './components/PayCheck';
import PayDes from './components/PayDes';
import PayBtn from './components/PayBtn';
import PayPopup from './components/PayPopup';
import PayContent from './components/PayContent';

const PaymentPage = () => {
    const [activeBtn, setActiveBtn] = useState("credit");
    const [popup, setPopup] = useState(false);
    // const [payOrSub, setpayOrSub] = useState("")

    const handleClosePopup = () => {
        setPopup(false);
    }
    return (
        <div className='paymentBg'>
            <div className="paymentWrap">
                <p className='payTitle'>지금 바로 스트리밍을 시작하세요</p>
                <PayContent price="13,900" />
                <PaymentRadioBtn />
                <Toggle activeBtn={activeBtn} setActiveBtn={setActiveBtn} mode="pay" />
                {activeBtn === "credit" && (
                    <PayCredit onPopupOpen={() => setPopup(true)} />
                )}
                {activeBtn === "credit" && (
                    <PayCheck />
                )}
                <PayDes />
                <PayBtn activeBtn={activeBtn} />
                {popup ? <PayPopup onClose={handleClosePopup} /> : ""}

            </div>

        </div>
    )
}

export default PaymentPage