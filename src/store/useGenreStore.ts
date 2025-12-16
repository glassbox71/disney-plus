import { create } from 'zustand';

export const useGenreStore = create(() => ({
  genreList: [
    // ===== 지역 / 개념 =====
    {
      type: 'normal',
      title: '한국콘텐츠',
      filter: { type: 'country', value: 'KR' },
    },
    {
      type: 'normal',
      title: '미국 콘텐츠',
      filter: { type: 'country', value: 'US' },
    },
    {
      type: 'normal',
      title: '영국 콘텐츠',
      filter: { type: 'country', value: 'GB' },
    },
    {
      type: 'normal',
      title: '아시아 콘텐츠',
      filter: { type: 'region', value: ['KR', 'JP', 'CN', 'TH'] },
    },

    // ===== TMDb 공식 장르 =====
    {
      type: 'normal',
      title: '코미디',
      filter: { type: 'genre', value: '코미디', genreId: 35 },
    },
    {
      type: 'normal',
      title: 'SF & 판타지',
      filter: { type: 'genre', value: 'SF & 판타지', genreId: [878, 14] },
    },
    {
      type: 'normal',
      title: '로맨스',
      filter: { type: 'genre', value: '로맨스', genreId: 10749 },
    },
    {
      type: 'normal',
      title: '스릴러 & 호러',
      filter: { type: 'genre', value: '스릴러 & 호러', genreId: [53, 27] },
    },
    {
      type: 'normal',
      title: '드라마',
      filter: { type: 'genre', value: '드라마', genreId: 18 },
    },
    {
      type: 'normal',
      title: '다큐멘터리',
      filter: { type: 'genre', value: '다큐멘터리', genreId: 99 },
    },
    {
      type: 'normal',
      title: '액션',
      filter: { type: 'genre', value: '액션', genreId: 28 },
    },
    {
      type: 'normal',
      title: '애니메이션',
      filter: { type: 'genre', value: '애니메이션', genreId: 16 },
    },

    // ===== 키즈 =====
    {
      type: 'kids',
      title: '히어로',
      filter: { type: 'genre', value: '히어로', genreId: [28, 12] }, // 액션 + 모험
    },
    {
      type: 'kids',
      title: '공주 & 요정',
      filter: { type: 'genre', value: '판타지', genreId: 14 },
    },
    {
      type: 'kids',
      title: '동물 친구들',
      filter: { type: 'genre', value: '가족', genreId: 10751 },
    },
    {
      type: 'kids',
      title: '코미디',
      filter: { type: 'genre', value: '코미디', genreId: 35 },
    },
    {
      type: 'kids',
      title: '또 다른 세계',
      filter: { type: 'genre', value: '판타지', genreId: 14 },
    },
    {
      type: 'kids',
      title: '어드벤쳐',
      filter: { type: 'genre', value: '모험', genreId: 12 },
    },
    {
      type: 'kids',
      title: '애니메이션',
      filter: { type: 'genre', value: '애니메이션', genreId: 16 },
    },
    {
      type: 'kids',
      title: '가족',
      filter: { type: 'genre', value: '가족', genreId: 10751 },
    },
    {
      type: 'kids',
      title: '음악 / 뮤지컬',
      filter: { type: 'genre', value: '음악', genreId: 10402 },
    },
  ],
}));
