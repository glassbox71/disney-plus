export interface SubPlan {
  key: string;
  logo: string;
  title: string;
  price: string;
  year_price: string;
  des1: string;
  des2: string;
  des3: string;
  tving_logo?: string;
  wavve_logo?: string;
}
export interface Membership {
  plan: SubPlan;
  status: 'active' | 'inactive';
  startedAt: number;
}

export const subscription: SubPlan[] = [
  {
    key: '프리미엄',
    logo: '/images/logo.svg',
    title: '디즈니+ 프리미엄',
    price: '13,900',
    year_price: '139,000',
    des1: '최대 4K UHD & HDR 화질 / 최대 Dolby Atomos 오디오',
    des2: '최대 4대 기기 동시 스트리밍 / 최대 10대 기기에서 콘텐츠 저장 가능',
    des3: '광고 없는 스트리밍',
  },
  {
    key: '스탠다드',
    logo: '/images/logo.svg',
    title: '디즈니+ 스탠다드',
    price: '9,900',
    year_price: '99,000',
    des1: '최대 1080p Full HD / 최대 5.1 사운드',
    des2: '2대 기기 동시 스트리밍 / 최대 10대 기기에서 콘텐츠 저장 가능',
    des3: '광고 없는 스트리밍',
  },
  {
    key: '티빙 웨이브 번들',
    logo: '/images/logo.svg',
    tving_logo: '/images/subscription/tvingLogo.png',
    wavve_logo: '/images/subscription/wavveLogo.png',
    title: '디즈니+ 티빙 웨이브 번들',
    price: '21,500',
    year_price: '215,000',
    des1: '디즈니+ 티빙 웨이브 스탠다드 멤버십 번들 (개별 구독 대비 37% 절약)',
    des2: '디즈니+ & 웨이브: 최대 1080p Full HD 화질 / 티빙: 고화질',
    des3: '2대 기기 동시 스트리밍 / 광고 없는 스트리밍',
  },
  {
    key: '티빙 번들',
    logo: '/images/logo.svg',
    tving_logo: '/images/subscription/tvingLogo.png',
    title: '디즈니+ 티빙 번들',
    price: '18,000',
    year_price: '180,000',
    des1: '디즈니+ 티빙 스탠다드 멤버십 번들 (개별 구독 대비 23% 절약)',
    des2: '디즈니+: 최대 1080p Full HD 화질 / 티빙: 고화질',
    des3: '2대 기기 동시 스트리밍 / 광고 없는 스트리밍',
  },
];

export const payErrorMsg = {
  owner: '성명을 정확히 입력해주세요.',
  cardNo: '올바른 카드번호 형식을 입력해주세요.',
  exp: '유효한 만료일을 입력해주세요.',
  pw2: '카드 비밀번호가 올바르지 않습니다.',
  birth: '유효한 생년월일을 입력하세요',
};
