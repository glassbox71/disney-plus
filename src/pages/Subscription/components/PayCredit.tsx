import "../scss/PayCredit.scss"

interface payCreditProps {
    onPopupOpen: () => void;
}

const payCredit = ({ onPopupOpen }: payCreditProps) => {
    return (
        <div className="payInputWrap">
            <div className="inputWrap">
                <p>카드 소유주 성명</p>
                <input type="text" placeholder="카드 소유주 성명을 입력해주세요" />
            </div>
            <div className="inputWrap anyCard">
                <p>카드번호</p>
                <input type="text" placeholder="카드번호를 입력해주세요" />
                <button onClick={onPopupOpen}><img src="/images/subscription/moreInfo.png" alt="" /></button>
            </div>
            <div className="cardInfo">
                <div className="inputWrap">
                    <p>카드 만료일</p>
                    <input type="text" placeholder="MM/YY" />
                </div>
                <div className="inputWrap">
                    <p>카드 비밀번호</p>
                    <input type="text" placeholder="앞 두자리를 입력해주세요" />
                </div>
            </div>
            <div className="inputWrap">
                <p>생년월일</p>
                <input type="text" placeholder="YYYY / MM / DD" />
            </div>
        </div>
    )
}

export default payCredit