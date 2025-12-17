import { useMemo, useState } from "react";
import "../scss/PayCredit.scss"
import { payErrorMsg } from "../../../store/subscription";


interface payCreditProps {
    onPopupOpen: () => void;
}

const NAME_REGEX = /^[가-힣a-zA-Z]{2,30}(?:\s[가-힣a-zA-Z]{2,30})?$/;
const CARD_REGEX = /^\d{16}$/;
const EXP_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
const PW2_REGEX = /^\d{2}$/;
const BIRTH_REGEX =
    /^(19\d{2}|20\d{2})\s*\/\s*(0[1-9]|1[0-2])\s*\/\s*(0[1-9]|[12]\d|3[01])$/;

const digitsOnly = (v: string) => v.replace(/\D/g, "");

//16자리 숫자를 4자리씩 띄우기
const formatCardNo = (v: string) => {
    const d = digitsOnly(v).slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, "$1 ");
};

// MMYY -> MM/YY
const formatExp = (v: string) => {
    const d = digitsOnly(v).slice(0, 4); // MMYY
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
};

// YYYYMMDD -> YYYY / MM / DD
const formatBirth = (v: string) => {
    const d = digitsOnly(v).slice(0, 8); // YYYYMMDD
    if (d.length <= 4) return d;
    if (d.length <= 6) return `${d.slice(0, 4)} / ${d.slice(4)}`;
    return `${d.slice(0, 4)} / ${d.slice(4, 6)} / ${d.slice(6)}`;
};

const PayCredit = ({ onPopupOpen }: payCreditProps) => {
    const [form, setForm] = useState({
        owner: "",
        cardNo: "",
        exp: "",
        pw2: "",
        birth: "",
    });

    const [touched, setTouched] = useState({
        owner: false,
        cardNo: false,
        exp: false,
        pw2: false,
        birth: false,
    })



    const validity = useMemo(() => {
        const ownerOk = NAME_REGEX.test(form.owner.trim());
        const cardOk = CARD_REGEX.test(digitsOnly(form.cardNo));
        const expOk = EXP_REGEX.test(form.exp.trim());
        const pw2Ok = PW2_REGEX.test(digitsOnly(form.pw2));
        const birthOk = BIRTH_REGEX.test(form.birth.trim());
        return { ownerOk, cardOk, expOk, pw2Ok, birthOk };
    }, [form]);

    //상태 클래스
    const inputState = (key: keyof typeof touched, ok: boolean) => {
        if (!touched[key]) return "";
        return ok ? "success" : "error";
    };

    const showError = {
        owner: touched.owner && !validity.ownerOk,
        cardNo: touched.cardNo && !validity.cardOk,
        exp: touched.exp && !validity.expOk,
        pw2: touched.pw2 && !validity.pw2Ok,
        birth: touched.birth && !validity.birthOk,
    }

    const onBlur = (key: keyof typeof touched) => () => {
        setTouched((p) => ({ ...p, [key]: true }));
    }

    type FormKey = keyof typeof form;

    const onChange = (key: FormKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        switch (key) {
            case "cardNo":
                value = formatCardNo(value);
                break;

            case "exp":
                value = formatExp(value);
                break;
            case "birth":
                value = formatBirth(value);
                break;
            case "pw2":
                value = digitsOnly(value).slice(0, 2);
                break;
            case "owner":
            default:
                break;
        }
        setForm((p) => ({ ...p, [key]: value }))
    }




    return (
        <div className="payInputWrap">
            <div className="inputWrap">
                <p>카드 소유주 성명</p>
                <input type="text" placeholder="카드 소유주 성명을 입력해주세요"
                    value={form.owner}
                    onChange={onChange("owner")}
                    onBlur={onBlur("owner")}
                    className={inputState("owner", validity.ownerOk)}
                />
                {showError.owner && (
                    <span className="errorMsg">{payErrorMsg.owner}</span>
                )}
            </div>
            <div className="inputWrap anyCard">
                <p>카드번호</p>
                <input type="text" placeholder="카드번호를 입력해주세요"
                    value={form.cardNo}
                    onChange={onChange("cardNo")}
                    onBlur={onBlur("cardNo")}
                    className={inputState("cardNo", validity.cardOk)}
                    inputMode="numeric"
                />
                <button onClick={onPopupOpen}><img src="/images/subscription/moreInfo.png" alt="" /></button>
                {showError.cardNo && (
                    <span className="errorMsg">{payErrorMsg.cardNo}</span>
                )}
            </div>
            <div className="cardInfo">
                <div className="inputWrap">
                    <p>카드 만료일</p>
                    <input type="text" placeholder="MM/YY"
                        value={form.exp}
                        onChange={onChange("exp")}
                        onBlur={onBlur("exp")}
                        className={inputState("exp", validity.expOk)}
                        inputMode="numeric"
                    />
                    {showError.exp && (
                        <span className="errorMsg">{payErrorMsg.exp}</span>
                    )}
                </div>
                <div className="inputWrap">
                    <p>카드 비밀번호</p>
                    <input type="text" placeholder="앞 두자리를 입력해주세요"
                        value={form.pw2}
                        onChange={onChange("pw2")}
                        onBlur={onBlur("pw2")}
                        className={inputState("pw2", validity.pw2Ok)}
                        inputMode="numeric"
                    />
                    {showError.pw2 && (
                        <span className="errorMsg">{payErrorMsg.pw2}</span>
                    )}
                </div>
            </div>
            <div className="inputWrap">
                <p>생년월일</p>
                <input type="text" placeholder="YYYY / MM / DD"
                    value={form.birth}
                    onChange={onChange("birth")}
                    onBlur={onBlur("birth")}
                    className={inputState("birth", validity.birthOk)}
                    inputMode="numeric"
                />
                {showError.birth && (
                    <span className="errorMsg">{payErrorMsg.birth}</span>
                )}
            </div>
        </div>
    )
}

export default PayCredit