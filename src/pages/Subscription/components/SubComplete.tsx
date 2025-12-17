import React from 'react'
import SucessTop from './SucessTop'
import { useNavigate } from 'react-router-dom'
import "../scss/SubComplete.scss";

const SubComplete = () => {
    const navigate = useNavigate();

    const handleGoDisney = () => {
        navigate("/")
    }
    return (
        <div className="subBg">
            <div className="subCompleteWrap">
                <SucessTop />
                <button onClick={handleGoDisney}>디즈니+로 이동</button>
            </div>
        </div>

    )
}

export default SubComplete