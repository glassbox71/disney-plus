import { Link } from "react-router-dom"
import "../scss/PayBtn.scss";

const PayBtn = () => {
    return (
        <div className="payBtnWrap">
            <button><p><Link to="/">결제 및 구독하기</Link></p></button>
        </div>
    )
}

export default PayBtn