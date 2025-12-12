
import "../scss/Toggle.scss";

interface SubToggleProps {
    mode: string;
    activeBtn: string;
    setActiveBtn: (value: string) => void;
}
const Toggle = ({ activeBtn, setActiveBtn, mode }: SubToggleProps) => {

    const handleType = (type: string) => {
        setActiveBtn(type)
    }

    return (
        <div className='subToggleWrap'>
            {mode === "sub" && (
                <div className={"subToggle pullInner"}>
                    <div className={`subBtn ${activeBtn === "bundle" ? "active" : ""}`}><button onClick={() => handleType("bundle")}>번들 할인</button></div>
                    <div className={`subBtn ${activeBtn === "disney" ? "active" : ""}`}><button onClick={() => handleType("disney")}>디즈니+</button></div>
                </div>
            )}

            {mode === "pay" && (
                <div className="subToggle pullInner">
                    <div className={`subBtn ${activeBtn === "credit" ? "active" : ""}`}><button onClick={() => handleType("credit")}>신용카드</button></div>
                    <div className={`subBtn ${activeBtn === "naverpay" ? "active" : ""}`}><button onClick={() => handleType("naverpay")}>네이버 페이</button></div>
                </div>
            )}

        </div>
    )
}

export default Toggle