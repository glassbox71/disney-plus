import { useState } from 'react'
import PaymentRadioBtn from './components/PaymentRadioBtn'
import "./scss/PaymentPage.scss";
import Toggle from './components/Toggle';
import PayCredit from './components/payCredit'
import PayCheck from './components/PayCheck';
import PayDes from './components/PayDes';
import PayBtn from './components/PayBtn';
import PaymentContent from './components/PaymentContent';

const PaymentPage = () => {
    const [activeBtn, setActiveBtn] = useState("credit");
    // const [payOrSub, setpayOrSub] = useState("")
    return (
        <div className='paymentBg'>
            <div className="paymentWrap">
                <p className='payTitle'>지금 바로 스트리밍을 시작하세요</p>
                <PaymentContent price="13,900" />
                <PaymentRadioBtn />
                <Toggle activeBtn={activeBtn} setActiveBtn={setActiveBtn} mode="pay" />
                <PayCredit />
                <PayCheck />
                <PayDes />
                <PayBtn />
            </div>

        </div>
    )
}

export default PaymentPage