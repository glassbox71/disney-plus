import React from 'react'
import "../scss/PaymentRadioBtn.scss";

const PaymentRadioBtn = () => {
    return (
        <div className="paymentRadioBtnWrap">
            <div className="radioBtn active">
                <p>월 13,900원</p>
                <input type="radio" />
            </div>
            <div className="radioBtn">
                <p>월 139,000원</p>
                <input type="radio" />
                <div className="salePer">
                    <p>16% 이상 할인된 가격</p>
                </div>
            </div>
        </div>
    )
}

export default PaymentRadioBtn