// 키즈 모드 설정 컴포넌트
// type 지정하기

import { useEffect, useState } from 'react';
import { useKidsStore } from '../../../store/useKidsStore';
import type { KidsModeInfo } from '../../../types/IAuth';
import '../scss/KidsMode.scss';

interface KidsModeProps {
  title: string;
  subTitle: string;
  onKidsModeChange: (data: KidsModeInfo) => void;
  initialData?: KidsModeInfo;
}

const KidsMode = ({ title, subTitle, onKidsModeChange, initialData }: KidsModeProps) => {
  const { years, months, date, initYears, initMonth, initDate } = useKidsStore();

  // 드롭다운 선택 상태
  const [selectedYear, setSelectedYear] = useState(initialData?.year || null);
  const [selectedMonth, setSelectedMonth] = useState(initialData?.month || null);
  const [selectedDate, setSelectedDate] = useState(initialData?.date || null);

  // 토글 체크 상태
  const [isActive, setIsActive] = useState(false);

  // 드롭다운 open 상태 (한 번에 하나만 열림)
  const [openDropdown, setOpenDropdown] = useState<'year' | 'month' | 'date' | null>(null);

  // 드롭다운 클릭 처리
  const toggleDropdown = (type: 'year' | 'month' | 'date') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  // 데이터 변경 시 부모 컴포넌트에 전달
  useEffect(() => {
    if (onKidsModeChange) {
      onKidsModeChange({
        isActive,
        year: selectedYear,
        month: selectedMonth,
        date: selectedDate,
      });
    }
  }, [isActive, selectedYear, selectedMonth, selectedDate]);

  useEffect(() => {
    initYears();
    initMonth();
    initDate(); // 1~31일 고정
  }, []);

  return (
    <div className="KidsModeWrap">
      {/* TODO label에 class줘서 상태 체크 */}
      <label>
        <span className="toggleText">{title}</span>
        <input
          className="toggleInput"
          type="checkbox"
          checked={isActive}
          onChange={() => setIsActive(!isActive)}
        />
        <span className={`toggleBg ${isActive ? 'active' : ''}`}></span>
      </label>

      {isActive && (
        // TODO 생년월일 배열로 만들기..?
        <div>
          <p>{subTitle}</p>
          <div className="selectWrap">
            {/* 연도 드롭다운 */}
            <div className={`dropdownWrap year ${openDropdown === 'year' ? 'active' : ''}`}>
              <div className="dropdownHeader" onClick={() => toggleDropdown('year')}>
                <p>{selectedYear ?? '연도'}</p>
                <span className="dropdownArrow"></span>
              </div>
              <ul className="dropdownList">
                {years.map((year) => (
                  <li
                    key={year}
                    onClick={() => {
                      setSelectedYear(year); // 선택 상태 업데이트
                      setOpenDropdown(null); // 드롭다운 닫기
                    }}>
                    {year}
                  </li>
                ))}
              </ul>
            </div>
            {/* 월 드롭다운 */}
            <div className={`dropdownWrap month ${openDropdown === 'month' ? 'active' : ''}`}>
              <div className="dropdownHeader" onClick={() => toggleDropdown('month')}>
                <p>{selectedMonth ?? '월'}</p>
                <span className="dropdownArrow"></span>
              </div>
              <ul className="dropdownList">
                {months.map((month) => (
                  <li
                    key={month}
                    onClick={() => {
                      setSelectedMonth(Number(month));
                      setOpenDropdown(null);
                    }}>
                    {month}
                  </li>
                ))}
              </ul>
            </div>
            {/* 일 드롭다운 */}
            <div className={`dropdownWrap date ${openDropdown === 'date' ? 'active' : ''}`}>
              <div className="dropdownHeader" onClick={() => toggleDropdown('date')}>
                <p>{selectedDate ?? '일'}</p>
                <span className="dropdownArrow"></span>
              </div>
              <ul className="dropdownList">
                {date.map((d) => (
                  <li
                    key={d}
                    onClick={() => {
                      setSelectedDate(Number(d));
                      setOpenDropdown(null);
                    }}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidsMode;
