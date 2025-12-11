import "../scss/SubscriptionToggle.scss";

// interface SubToggleProps {
//     activeBtn: string;
//     setActiveBtn: ;
// }
const SubscriptionToggle = ({ activeBtn, setActiveBtn }
    // : SubToggleProps
) => {


    const handleBundle = () => {
        setActiveBtn("bundle")
    }
    const handleDisney = () => {
        setActiveBtn("disney");
    }
    return (
        <div className='subToggleWrap'>
            <div className="subToggle pullInner">
                <div className={`subBtn ${activeBtn === "bundle" ? "active" : ""}`}><button onClick={handleBundle}>번들 할인</button></div>
                <div className={`subBtn ${activeBtn === "disney" ? "active" : ""}`}><button onClick={handleDisney}>디즈니+</button></div>
            </div>
        </div>
    )
}

export default SubscriptionToggle