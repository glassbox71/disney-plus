import React, { useState } from 'react'
import "../scss/PaymentRadioBtn.scss";
import type { SubPlan } from '../../../store/subscription';


interface payRadioProps {
    plan: SubPlan;
}
const PaymentRadioBtn = ({ plan }: payRadioProps) => {
    const [activeRadio, setActiveRadio] = useState<boolean>(true);

    const handleRadio = () => {
        if (activeRadio) return setActiveRadio(false);
        setActiveRadio(true)

    }
    return (
        <div className="paymentRadioBtnWrap">
            <div className={`radioBtn ${activeRadio ? "active" : ""}`}>
                <p>월 {plan.price}원</p>
                <input type="radio" checked={activeRadio === true} onChange={handleRadio} />
            </div>
            <div className={`radioBtn ${activeRadio ? "" : "active"}`}>
                <p>월 {plan.year_price}원</p>
                <input type="radio" checked={activeRadio === false} onChange={handleRadio} />
                <div className="salePer">
                    <p>16% 이상 할인된 가격</p>
                </div>
            </div>
        </div>
    )
}

export default PaymentRadioBtn