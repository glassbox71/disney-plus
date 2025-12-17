import type { SubPlan } from "../../../store/subscription";
import "../scss/PayContent.scss";

interface payContentProps {
    plan: SubPlan;
}

const PayContent = ({ plan }: payContentProps) => {
    return (
        <div className="payContentWrap">
            <div className="imgBox">
                <div><img className="disney" src="/images/logo.svg" alt="디즈니로고" /></div>
                <div className={plan.tving_logo ? "" : "none"}>{plan.tving_logo && <img className="tving" src={plan.tving_logo} alt="티빙로고" />}</div>
                <div className={plan.wavve_logo ? "" : "none"}>{plan.wavve_logo && <img className="wavve" src={plan.wavve_logo} alt="티빙로고" />}</div>
            </div>
            <div className="title"><p>{plan.title}</p></div>
            <div className="price">
                <p className="priceTitle">월 {plan.price}원(부가세 포함)</p>
            </div>
            <div className="desWrap">
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />{plan.des1}</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />{plan.des2}</p>
                <p><img src="/images/subscription/check.png" alt="체크아이콘" />{plan.des3}</p>
            </div>
        </div>
    )
}

export default PayContent