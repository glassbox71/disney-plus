import { Link } from "react-router-dom"
import "../scss/PayBtn.scss";

interface payBtnProps {
    activeBtn: string;
}

const PayBtn = ({ activeBtn }: payBtnProps) => {
    const isNaverPay = activeBtn === "naverpay"
    return (
        <div className="payBtnWrap">
            {isNaverPay ? (
                <button><p> <img src="/images/subscription/naverpay.png" alt="네이버페이" /></p>
                    <p><Link to="/">결제 및 구독</Link></p>
                </button>
            ) : (
                <button><p><Link to="/">결제 및 구독하기</Link></p></button>
            )}

        </div>
    )
}

export default PayBtn