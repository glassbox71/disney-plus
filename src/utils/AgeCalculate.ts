export const calculateAgeLimit = (year: number, month: number, date: number): number => {
  const today = new Date();
  // 설정한 생년월일
  const birth = new Date(year, month - 1, date);

  // 생년월일 기준으로 기본 나이 계산
  let kidsModeAge = today.getFullYear() - birth.getFullYear();

  // 생일 지났는지 확인하고 만나이 계산하기
  const isBeforeBirth =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  if (isBeforeBirth) {
    kidsModeAge -= 1;
  }
  if (kidsModeAge <= 5) return 0;
  if (kidsModeAge < 7) return 5;
  if (kidsModeAge < 12) return 7;
  return 12;
};
