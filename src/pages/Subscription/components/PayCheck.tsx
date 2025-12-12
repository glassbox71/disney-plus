import "../scss/PayCheck.scss";

const PayCheck = () => {
    return (
        <div className="payCheckWrap">
            <div className="check">
                <input type="checkbox" />
                <p>The Walt Disney Family of Companies에서 사용할 수 있도록 본인의 <br />
                    결제 정보를 저장합니다. <span>더 알아보기</span></p>
            </div>
            <div className="check">
                <input type="checkbox" />
                <p><span>전자금융거래 기본약관</span> 및 <span>신용카드정보 유효성 확인 서비스 약관</span>에 <br />
                    동의합니다. (필수)</p>
            </div>
            <div className="check">
                <input type="checkbox" />
                <p><span>개인정보 제3자 제공에 동의합니다.</span> (필수)</p>
            </div>
        </div>
    )
}

export default PayCheck