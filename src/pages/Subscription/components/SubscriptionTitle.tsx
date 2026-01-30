
import '../scss/SubscriptionTitle.scss'

const SubscriptionTitle = () => {
    return (
        <div className="subTitleWrap">
            <div className="subLogo">
                <img src="/public/images/logo.svg" alt="디즈니플러스로고" />
            </div>
            <div className="textBox">
                <p className='title'>원하시는 멤버십을 선택해주세요</p>
                <p className='des'>디즈니+는 두 가지의 멥버십 유형을 제공하고 있습니다.<br />
                    멤버십은 언제든지 변경 또는 취소할 수 있습니다.</p>
            </div>
        </div>

    )
}

export default SubscriptionTitle