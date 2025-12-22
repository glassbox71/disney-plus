import "../scss/PayBtn.scss";

interface payBtnProps {
    activeBtn: string;
    onPay: () => void;
    disabled?: boolean;
}

const PayBtn = ({ activeBtn, onPay, disabled = false }: payBtnProps) => {
    const isNaverPay = activeBtn === "naverpay"
    return (
        <div className="payBtnWrap">
            {isNaverPay ? (
                <button onClick={onPay}><p><img src="/images/subscription/naverpay.png" alt="네이버페이" /></p>
                    <p>결제 및 구독</p>
                </button>
            ) : (
                <button onClick={onPay} disabled={disabled}><p>결제 및 구독하기</p></button>
            )}

        </div>
    )
}

export default PayBtn