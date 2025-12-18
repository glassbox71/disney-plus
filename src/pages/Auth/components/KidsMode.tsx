import { useEffect, useState } from 'react';
import { useKidsStore } from '../../../store/useKidsStore';
import type { KidsModeInfo } from '../../../types/IAuth';
import '../scss/KidsMode.scss';
import { useProfileStore } from '../../../store/useProfileStore';
import { calculateAgeLimit } from '../../../utils/AgeCalculate';

interface KidsModeProps {
  title: string;
  subTitle: string;
  onKidsModeChange: (data: KidsModeInfo) => void;
  initialData?: KidsModeInfo;
}

const KidsMode = ({ title, subTitle, onKidsModeChange, initialData }: KidsModeProps) => {
  const { years, months, date, initYears, initMonth, initDate } = useKidsStore();
  const { setContentLimit, setIsKidsProfile } = useProfileStore();

  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? false);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialData?.year ?? null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(initialData?.month ?? null);
  const [selectedDate, setSelectedDate] = useState<number | null>(initialData?.date ?? null);

  const [openDropdown, setOpenDropdown] =
    useState<'year' | 'month' | 'date' | null>(null);

  const toggleDropdown = (type: 'year' | 'month' | 'date') => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  useEffect(() => {
    onKidsModeChange({
      isActive,
      year: selectedYear,
      month: selectedMonth,
      date: selectedDate,
    });
  }, [isActive, selectedYear, selectedMonth, selectedDate, onKidsModeChange]);

  useEffect(() => {
    setIsKidsProfile(isActive);
  }, [isActive, setIsKidsProfile]);

  useEffect(() => {
    initYears();
    initMonth();
    initDate();
  }, []);

  useEffect(() => {
    if (isActive && selectedYear && selectedMonth && selectedDate) {
      const limit = calculateAgeLimit(selectedYear, selectedMonth, selectedDate);
      setContentLimit(limit);
    }
  }, [isActive, selectedYear, selectedMonth, selectedDate, setContentLimit]);

  return (
    <div className="KidsModeWrap">
      <label>
        <span className="toggleText">{title}</span>
        <input
          className="toggleInput"
          type="checkbox"
          checked={isActive}
          onChange={() => setIsActive((prev) => !prev)}
        />
        <span className={`toggleBg ${isActive ? 'active' : ''}`} />
      </label>

      {isActive && (
        <div>
          <p>{subTitle}</p>

          <div className="selectWrap">
            {/* 연도 */}
            <div className={`dropdownWrap year ${openDropdown === 'year' ? 'active' : ''}`}>
              <div className="dropdownHeader" onClick={() => toggleDropdown('year')}>
                <p>{selectedYear ?? '연도'}</p>
                <span className="dropdownArrow" />
              </div>
              <ul className="dropdownList">
                {years.map((year) => (
                  <li
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setOpenDropdown(null);
                    }}>
                    {year}
                  </li>
                ))}
              </ul>
            </div>

            {/* 월 */}
            <div className={`dropdownWrap month ${openDropdown === 'month' ? 'active' : ''}`}>
              <div className="dropdownHeader" onClick={() => toggleDropdown('month')}>
                <p>{selectedMonth ?? '월'}</p>
                <span className="dropdownArrow" />
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

            {/* 일 */}
            <div className={`dropdownWrap date ${openDropdown === 'date' ? 'active' : ''}`}>
              <div className="dropdownHeader" onClick={() => toggleDropdown('date')}>
                <p>{selectedDate ?? '일'}</p>
                <span className="dropdownArrow" />
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
