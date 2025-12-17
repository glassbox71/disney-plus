//TODO 메인 데이터

export type MainScreenItem = {
  alt: string;
  title: string;
  age: string;
  release_date: string;
  overview: string;
  genre_title: string;
};

//TODO 메인 베너
export const MainScreenData: MainScreenItem[] = [
  {
    alt: 'movie',
    title: '소울',
    age: 'All',
    release_date: '2020',
    overview:
      '음악 교사 조는 오랜 꿈이던 재즈 공연 기회를 얻게 되지만 사고로 영혼 세계로 가게 된다. 그곳에서 새로운 영혼 ‘22’를 만나게 되고, 함께 현실로 돌아가기 위해 여정을 시작한다. ‘22’와 함께 한 여정 속에서 조는 삶의 의미를 깨닫게 되며, 진짜로 살아간다는 것이 무엇인지 다시 생각해보게 된다.',
    genre_title: '애니에이션, 모험, 가족, SF, 판타지, 코미디',
  },
  {
    alt: 'series',
    title: '호크아이',
    age: '12',
    release_date: '2021',
    overview:
      '클린트 바튼(호크아이)는 은퇴를 앞두고 가족과 조용한 크리스마스를 보내려 했지만, 과거 ‘로닌’으로서의 흔적이 다시 그를 쫓아온다. 그 과정에서 케이트 비숍이라는 젊은 궁수와 얽히게 되고, 이들은 함께 이 문제를 끝내기 위해 싸우게 된다. 이번에는 가족에게 돌아가기 위해, 그리고 과거의 자신과 완전히 결별하기 위해.',
    genre_title: '액션, 모험, 범죄, TV드라마',
  },
  {
    alt: 'original',
    title: '조각도시',
    age: '18',
    release_date: '2025',
    overview:
      '평범하게 살아가던 태중은 어느 날 이유도 모른 채 흉악한 범죄에 휘말려 감옥에 가게 되고, 그의 삶은 송두리째 망가진다.  자신의 삶을 망친 인물 요한을 향해 복수를 결심한 태중은 누명을 벗고 진실을 밝히기 위해 위험한 도시의 어두운 이면 속으로 뛰어들게 된다.',
    genre_title: '범죄, 스릴러, TV드라마',
  },
];

//TODO 지금 시청 중
export const NowWatchListData = [
  {
    adult: false,
    backdrop_path: '/5h2EsPKNDdB3MAtOk9MB9Ycg9Rz.jpg',
    genre_ids: [16, 35, 12, 10751, 9648],
    id: 1084242,
    original_language: 'en',
    original_title: 'Zootopia 2',
    overview:
      '미스터리한 뱀 게리가 나타난 순간, 주토피아가 다시 흔들리기 시작했다! 혼란에 빠진 도시를 구하기 위해 환상의 콤비 주디와 닉이 잠입 수사에 나서고 상상 그 이상의 진실과 위협을 마주하게 되는데...!',
    popularity: 474.7074,
    poster_path: '/ib6v6qUXzez1x2qIOLN7C0yJNPQ.jpg',
    release_date: '2025-11-26',
    title: '주토피아 2',
    video: false,
    vote_average: 7.731,
    vote_count: 391,
    genre_title: ['애니메이션', '코미디', '어드벤처', '가족', '미스터리'],
    age: 7,
    WatchBar: 52,
  },
  {
    adult: false,
    backdrop_path: '/uKb22E0nlzr914bA9KyA5CVCOlV.jpg',
    genre_ids: [18, 10749, 14],
    id: 402431,
    original_language: 'en',
    original_title: 'Wicked',
    overview:
      '자신의 진정한 힘을 미처 발견하지 못한 엘파바, 자신의 진정한 본성을 아직 발견하지 못한 글린다. 전혀 다른 두 사람은 마법 같은 우정을 쌓아간다. 그러던 어느 날, 마법사의 초대를 받아 에메랄드 시티로 가게 되고 운명은 예상치 못한 위기와 모험으로 두 사람을 이끄는데...',
    popularity: 46.4858,
    poster_path: '/mHozMgx7w29qC9gLzUQDQEP7AEM.jpg',
    release_date: '2024-11-20',
    title: '위키드',
    video: false,
    vote_average: 6.923,
    vote_count: 2657,
    genre_title: ['드라마', '로맨스', '판타지'],
    age: 15,
    WatchBar: 89,
  },
  {
    adult: false,
    backdrop_path: '/w3Bi0wygeFQctn6AqFTwhGNXRwL.jpg',
    genre_ids: [14, 10402, 35, 16],
    id: 803796,
    original_language: 'en',
    original_title: 'KPop Demon Hunters',
    overview:
      '케이팝 슈퍼스타 루미, 미라, 조이. 매진을 기록하는 대형 스타디움 공연이 없을 때면 이들은 또 다른 활동에 나선다. 바로 비밀 능력을 이용해 팬들을 초자연적 위협으로부터 보호하는 것.',
    popularity: 83.4441,
    poster_path: '/91sO99VNo1IxzI1NcOhPRaWBE5N.jpg',
    release_date: '2025-06-20',
    title: '케이팝 데몬 헌터스',
    video: false,
    vote_average: 8.2,
    vote_count: 1994,
    genre_title: ['판타지', '음악', '코미디', '애니메이션'],
    age: 7,
    WatchBar: 22,
  },
  {
    adult: false,
    backdrop_path: '/bvATKuxz9Wu53caHUJ7SP38gFQ3.jpg',
    genre_ids: [10751, 35, 12, 16, 878],
    id: 1022787,
    original_language: 'en',
    original_title: 'Elio',
    overview:
      '세상 그 어디에서도 소속감을 느끼지 못한 채, 외계인의 납치를 꿈꾸는 외톨이 소년 엘리오. 그러던 어느 날 작은 오해로 인해 지구 대표로 우주에 소환되고, 그곳에서 자신과는 너무도 다른 특별한 존재 글로든을 만나 처음으로 마음을 나눌 친구를 갖게 된다.  낯설지만 따뜻한 우주에서 꿈같은 나날들을 보내던 엘리오 앞에 온 우주를 위험에 빠뜨릴 크나큰 위기가 닥쳐오는데...',
    popularity: 26.966,
    poster_path: '/ymd7E8ZRXOfOpJ418rgGtEdVmEN.jpg',
    release_date: '2025-06-18',
    title: '엘리오',
    video: false,
    vote_average: 6.983,
    vote_count: 692,
    genre_title: ['가족', '코미디', '어드벤처', '애니메이션', 'SF'],
    age: 12,
    WatchBar: 68,
  },
  {
    adult: false,
    backdrop_path: '/5lWIYxYEqWi8j3ZloxXntw3ImBo.jpg',
    genre_ids: [10751, 35, 16],
    id: 360920,
    original_language: 'en',
    original_title: 'The Grinch',
    overview:
      '모두가 행복한 크리스마스를 참을 수 없는 그린치는 크리스마스를 훔치기 위해 산타가 되기로 결심한다. 그린치는 만능집사 맥스, 덩치만 큰 소심 루돌프 프레드와 함께 슈퍼배드한 크리스마스 훔치기 대작전에 돌입하는데…',
    popularity: 25.4128,
    poster_path: '/clJYtRBUhDtvKhPk2HNfXouviKF.jpg',
    release_date: '2018-11-08',
    title: '그린치',
    video: false,
    vote_average: 6.871,
    vote_count: 4282,
    genre_title: ['가족', '코미디', '애니메이션'],
    age: 7,
    WatchBar: 2,
  },
];

//TODO 취향 저격
export const RecommendedForYouData = [
  {
    adult: false,
    backdrop_path: '/pU9cz8mZjzwyPAcJDPXBlK99BoR.jpg',
    genre_ids: [16, 10751, 35, 12, 14],
    id: 1117857,
    original_language: 'en',
    original_title: 'In Your Dreams',
    overview:
      '상상을 뛰어넘는 꿈속 세계로 여행을 떠난 스티비와 남동생 엘리엇. 두 사람은 샌드맨에게 완벽한 가족을 갖게 해달라고 소원을 빈다.',
    popularity: 18.96,
    poster_path: '/isV5uJui24hbIfGLC7RqZFn8g3y.jpg',
    release_date: '2025-11-07',
    title: '인 유어 드림',
    video: false,
    vote_average: 7.0,
    vote_count: 124,
    genre_title: ['애니메이션', '가족', '코미디', '어드벤처', '판타지'],
    age: 12,
  },
  {
    adult: false,
    backdrop_path: '/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg',
    genre_ids: [10751, 35, 12, 16, 14],
    id: 502356,
    original_language: 'en',
    original_title: 'The Super Mario Bros. Movie',
    overview:
      "따단-딴-따단-딴 ♫ 전 세계를 열광시킬 올 타임 슈퍼 어드벤처의 등장! 뉴욕의 평범한 배관공 형제 '마리오'와 ‘루이지’는 배수관 고장으로 위기에 빠진 도시를 구하려다 미스터리한 초록색 파이프 안으로 빨려 들어가게 된다. 파이프를 통해 새로운 세상으로 차원 이동하게 된 형제. 형 '마리오'는 뛰어난 리더십을 지닌 '피치'가 통치하는 버섯왕국에 도착하지만 동생 '루이지'는 빌런 '쿠파'가 있는 다크랜드로 떨어지며 납치를 당하고 ‘마리오’는 동생을 구하기 위해 ‘피치’와 ‘키노피오’의 도움을 받아 '쿠파'에 맞서기로 결심한다. 그러나 슈퍼스타로 세상을 지배하려는 그의 강력한 힘 앞에 이들은 예기치 못한 위험에 빠지게 되는데...!",
    popularity: 18.8844,
    poster_path: '/jt1GlLLvkWL2m83VX8I1qsDR187.jpg',
    release_date: '2023-04-05',
    title: '슈퍼 마리오 브라더스',
    video: false,
    vote_average: 7.603,
    vote_count: 10103,
    genre_title: ['가족', '코미디', '어드벤처', '애니메이션', '판타지'],
    age: 12,
  },
  {
    adult: false,
    backdrop_path: '/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg',
    genre_ids: [10751, 35, 16, 12],
    id: 862,
    original_language: 'en',
    original_title: 'Toy Story',
    overview:
      '카우보이 인형 우디는 꼬마 주인인 앤디의 가장 사랑받는 장난감이다. 그러나 어느날 버즈라는 새로운 장난감이 등장한다.  버즈는 최신형 장난감으로 레이저 빔 등의 첨단장비를 갖추고 있으나, 버즈는 자신이 장난감임을 인식하지 못하고 자신이 우주에서 온 전사이며 자신이 갖춘 장비로 하늘을 날 수 있다고 믿고 있다. 버즈의 허상을 상처받지 않고 인식시켜 주려는 우디와 친구들. 그러나 뜻밖의 사고가 일어난다. 옆집 개에게 버즈가 납치당하고 이런 버즈를 구하기 위해 우디와 친구들은 구조대를 조직해 버즈를 구하러 가는데...',
    popularity: 18.554,
    poster_path: '/iJbm78MxPjLutWUYixbeege8EVe.jpg',
    release_date: '1995-11-22',
    title: '토이 스토리',
    video: false,
    vote_average: 7.971,
    vote_count: 19332,
    genre_title: ['가족', '코미디', '애니메이션', '어드벤처'],
    age: 12,
  },
  {
    adult: false,
    backdrop_path: '/twsxsfao6ZOVvT8LfudH603MMi6.jpg',
    genre_ids: [10751, 35, 16, 878],
    id: 519182,
    original_language: 'en',
    original_title: 'Despicable Me 4',
    overview:
      '슈트-업 하고 악당 전담 처리반 AVL이 된 에이전트 미니언즈와 미니언즈 만큼 귀여운 그루 주니어가 태어나면서 더욱 완벽해진 그루 패밀리. 이들 앞에 과거 그루의 고등학교 동창이자 그에게 체포당했던 빌런 맥심이 등장하고, 오직 그루를 향한 복수심에 불타올라 탈옥까지 감행한 맥심은 그루 패밀리의 뒤를 바짝 추격하며 위협을 가하기 시작하는데... 과연 에이전트 미니언즈와 그루 패밀리는 맥심을 막아낼 수 있을까?',
    popularity: 18.4667,
    poster_path: '/vZmCFVff9JySHTUp9zbYUIAcxzc.jpg',
    release_date: '2024-06-20',
    title: '슈퍼배드 4',
    video: false,
    vote_average: 7.012,
    vote_count: 2983,
    genre_title: ['가족', '코미디', '애니메이션', 'SF'],
    age: 12,
  },
  {
    adult: false,
    backdrop_path: '/P82NAcEsLIYgQtrtn36tYsj41m.jpg',
    genre_ids: [10751, 35, 12, 16],
    id: 748783,
    original_language: 'en',
    original_title: 'The Garfield Movie',
    overview:
      '세상귀찮 집냥이, 바쁘고 험난한 세상에 던져졌다! 집사 ‘존’과 반려견 ‘오디’를 기르며 평화로운 나날을 보내던 집냥이 ‘가필드’. 어느 날, 험악한 길냥이 무리에게 납치당해 냉혹한 거리로 던져진다. 돌봐주는 집사가 없는 집 밖 세상은 너무나도 정신없게 돌아가고 길에서 우연히 다시 만난 아빠 길냥이 ‘빅’은 오히려 ‘가필드’를 위기에 빠지게 하는데… 험난한 세상, 살아남아야 한다!',
    popularity: 13.3754,
    poster_path: '/8tmtj4WIJEYVXxlrDcO6SqQN0Vz.jpg',
    release_date: '2024-04-30',
    title: '가필드 더 무비',
    video: false,
    vote_average: 7.0,
    vote_count: 1355,
    genre_title: ['가족', '코미디', '어드벤처', '애니메이션'],
    age: 12,
  },
  {
    adult: false,
    backdrop_path: '/kVSUUWiXoNwq2wVCZ4Mcqkniqvr.jpg',
    genre_ids: [10751, 35, 12, 16],
    id: 991494,
    original_language: 'en',
    original_title: 'The SpongeBob Movie: Search for SquarePants',
    overview:
      '비키니시티에 사는 스폰지밥은 무시무시한 롤러코스터를 탈 수 있는 용감한 ‘빅 가이’가 꿈이다. 그러던 어느 날, 미지의 세계 ‘언더월드’에 사는 유령선장을 만나 ‘용감무쌍짱 증명서’를 받으면 진정한 ‘빅 가이’가 될 수 있다는 말을 들은 스폰지밥은 절친 뚱이와 함께 해적선을 찾아 위험천만한 모험을 떠난다. 그 사실을 안 집게사장과 징징이, 핑핑이는 스폰지밥을 구하기 위해 따라나서는데…',
    popularity: 12.922,
    poster_path: '/2QCGC4toQXYuIsWKj5vJQRAdPjd.jpg',
    release_date: '2025-12-18',
    title: '스폰지밥 무비: 네모바지를 찾아서',
    video: false,
    vote_average: 0.0,
    vote_count: 0,
    genre_title: ['가족', '코미디', '어드벤처', '애니메이션'],
    age: 12,
  },
  {
    adult: false,

    backdrop_path: '/qdthf9WrRDSaIkGVQGhhJ9pz1hn.jpg',
    genre_ids: [16, 10751, 35, 28, 12],
    id: 9502,
    original_language: 'en',
    original_title: 'Kung Fu Panda',
    overview:
      '평화의 계곡에서 아버지의 국수 가게를 돕고 있는 팬더 포. 아버지는 국수의 비법을 알려주어 가업을 잇게 하고 싶지만, 포의 관심사는 오로지 쿵푸 마스터. 가게 일은 뒷전으로 하고 쿵푸의 비법이 적힌 용문서의 전수자를 정하는 무적의 5인방 대결을 보러 시합장을 찾은 포. 그런데 마을의 현인 우그웨이 대사부가 포를 용문서의 전수자로 점지하는 이변이 일어난다. 무적의 5인방은 물론 시푸 사부 역시 이 사태를 받아들이지 못하는 가운데, 용문서를 노리고 어둠의 감옥에서 탈출한 타이 렁이 마을을 습격해오자 그를 막아야 하는 미션이 포에게 떨어지는데...',
    popularity: 12.7032,
    poster_path: '/c3Dzd3A3QE0LkKb5HMOHTzs2Fyg.jpg',
    release_date: '2008-06-04',
    title: '쿵푸팬더',
    video: false,
    vote_average: 7.3,
    vote_count: 12219,
    genre_title: ['애니메이션', '가족', '코미디', '액션', '어드벤처'],
    age: 15,
  },
  {
    adult: false,
    backdrop_path: '/8ohobj5lAIbl5XWw11FywS3IRrS.jpg',
    genre_ids: [16, 10751, 35, 14, 12, 10749],
    id: 809,
    original_language: 'en',
    original_title: 'Shrek 2',
    overview:
      '더 크고 신나는 세상! "겁나먼" 왕국에서 펼쳐지는 끝없는 상상!  꿈결같은 허니문에서 돌아온 슈렉과 피오나. 이 행복한 녹색 커플은 "겁나먼" 왕국의 왕과 왕비인 피오나의 부모님으로부터 초청장을 받는다. 드디어 도착한 왕국에는 모든 시민들이 기대에 부풀어 그들을 기다리고 있는데... 덜리는 맘으로 슈렉이 모습을 드러내는 순간, 멋진 왕자를 기대했던 모든 이들은 기절초풍! 초록색이 되어버린 공주는 말할 것도 없이 말이다. 발칵 뒤집힌 "겁나먼" 왕국. 이제 이 충격적인 사건을 해결하기 위해 만만치 않은 강적들이 속속 등장한다. 업계 1위의 괴물 전문 킬러 \'장화신은 고양이\', 퍼펙트한 외모의 왕자 \'프린스 챠밍\', 신비한 힘을 가진 요정 대모까지. 성가신 건 질색인 슈렉에게 터져버린 대형 사고! 또 다시 의도하지 않은 사건에 휘말린 슈렉 패밀리 앞에 상상할 수 없는 예측 불허의 모험들이 펼쳐지는데...',
    popularity: 11.7708,
    poster_path: '/2yYP0PQjG8zVqturh1BAqu2Tixl.jpg',
    release_date: '2004-05-19',
    title: '슈렉 2',
    video: false,
    vote_average: 7.305,
    vote_count: 13038,
    genre_title: ['애니메이션', '가족', '코미디', '판타지', '어드벤처', '로맨스'],
    age: 12,
  },
  {
    adult: false,
    backdrop_path: '/gklkxY0veMajdCiGe6ggsh07VG2.jpg',
    genre_ids: [10751, 35, 12, 16],
    id: 940551,
    original_language: 'en',
    original_title: 'Migration',
    overview:
      '가족을 과잉보호하는 아빠 ‘맥’ 때문에 평생을 작은 연못에서 안전하게 살아온 말러드 가족. 하지만 호기심 가득한 남매 ‘댁스’와 ‘그웬’을 위해 새로운 세상을 모험하고 싶은 엄마 ‘팸’의 설득으로 가족들은 항상 꿈꿔온 자메이카로 생애 첫 가족 모험을 떠나기로 한다! 설렘 넘치는 시작과 달리 태풍을 만나 길을 잃고, 낯선 친구들을 만나고, 위험 가득한 뉴욕에 불시착하게 된다. 인생 처음으로 모든 계획이 틀어지고 위기에 빠진 말러드 가족은 서툴지만 서로를 의지하며 모험을 계속한다. 새로운 세상, 함께라면 두려울 것 없어!',
    popularity: 11.6108,
    poster_path: '/2xE3NI6zElWhwN9WJ92fqbZKmzZ.jpg',
    release_date: '2023-12-06',
    title: '인투 더 월드',
    video: false,
    vote_average: 7.378,
    vote_count: 2135,
    genre_title: ['가족', '코미디', '어드벤처', '애니메이션'],
    age: 12,
  },
];

//TODO 테마별 영화
export const ThemeListNavData = [
  { title: 'disney', text: '디즈니의 마법을 경험해 보세요', companyId: '337' },
  { title: 'pixar', text: '픽사의 다채로운 이야기를 만나보세요', companyId: '3' },
  { title: 'marvel', text: '마블 유니버스로 떠나보세요', companyId: '7505' },
  { title: 'starwars', text: '멀고 먼 은하계의 놀라운 이야기를 만나보세요', companyId: '1' },
  { title: 'NGC', text: '다큐멘터리 시리즈와 영화 어워드 수상작을 만나보세요', companyId: '7521' },
  { title: 'hulu', text: '넓고 깊은 이야기가 여기에', companyId: '43' },
  { title: 'fx', text: '한계를 뛰어넘는 이야기의 세계', companyId: '711' },
];

//TODO 시즌별 영화
export const SeasonNavData = [
  // 1. 겨울 1
  {
    title: 'winter',
    h2Title: '와 함께 맞는 연말',
    text: '따뜻한 집콕, 겨울 힐링 무비',
    genreId: '18',
    startDate: '12-01',
    endDate: '12-14',
  },
  // 2. 연말연시
  {
    title: 'holiday',
    h2Title: '와 함께 하는 크리스마스',
    text: '마법처럼 시작되는 크리스마스 이야기',
    genreId: '10751',
    startDate: '12-15',
    endDate: '12-31',
  },
  // 3. 새해/도전
  {
    title: 'newYear',
    h2Title: '와 시작하는 새로운 한 해',
    text: '새해 다짐! 새로운 도전과 모험을 시작하는 이야기',
    genreId: '28',
    startDate: '01-01',
    endDate: '01-10',
  },
  // 4. 겨울 2
  {
    title: 'winter',
    h2Title: '와 지새우는 겨울밤',
    text: '긴 겨울밤 정주행 하기 좋은 이야기',
    genreId: '10402',
    startDate: '01-11',
    endDate: '01-31',
  },
  // 5. 발렌타인
  {
    title: 'valentine',
    h2Title: '가 전하는 로맨틱한 2월',
    text: '초콜릿처럼 달콤한 로맨스',
    genreId: '10749',
    startDate: '02-01',
    endDate: '02-28',
  },
  // 6. 졸업/입학
  {
    title: 'spring',
    h2Title: '와 함께 하는 설레는 새출발 ',
    text: '설렘 가득한 청춘의 성장',
    genreId: '10749',
    startDate: '03-01',
    endDate: '03-31',
  },
  // 7. 봄/청춘
  {
    title: 'spring',
    h2Title: '가 다시 불러온 봄날의 순간 ',
    text: '벚꽃처럼 찬란한 우리의 시절',
    genreId: '18',
    startDate: '04-01',
    endDate: '04-30',
  },
  // 8. 가정의 달 (가족은 장르 ID를 사용)
  {
    title: 'family',
    h2Title: '와 함께 전하는 마음',
    text: '가족의 소중함을 그린 따뜻한 영화',
    genreId: '10751', // Family (장르 ID)
    startDate: '05-01',
    endDate: '05-31',
    type: 'genre', // 키워드와 장르 동시 활용 가능
  },
  // 9. 전쟁/독립
  {
    title: 'classic',
    h2Title: '와 함께 기억하는 역사의 순간',
    text: '역사가 된 숨 막히는 전투에 대한 기록',
    genreId: '10752',
    startDate: '06-01',
    endDate: '06-30',
  },
  // 10. 여름 1
  {
    title: 'vacation',
    h2Title: '와 함께 떠나는 휴가',
    text: '바캉스에 필수! 더위를 날려줄 영화',
    genreId: '53',
    startDate: '07-01',
    endDate: '07-31',
  },
  // 11. 호러/미스터리 (장르 ID를 사용)
  {
    title: 'horror',
    h2Title: '가 식혀주는 한 여름의 무더위',
    text: '더위도 잊게 할 등골이 서늘해지는 영화',
    genreId: '27', // Horror, Mystery (장르 ID)
    startDate: '08-01',
    endDate: '08-31',
    type: 'genre',
  },
  // 12. 가족/명절/가을
  {
    title: 'romance',
    h2Title: '와 함께 하는 풍요로운 명절',
    text: '온 가족이 둘러앉아 보기 좋은 영화',
    genreId: '10751',
    startDate: '09-01',
    endDate: '09-30',
  },
  // 13. 가을 로맨스
  {
    title: 'romance',
    h2Title: '로 물들이는 가을',
    text: '가을의 쓸쓸함을 달래줄 감성 로맨스',
    genreId: '10749',
    startDate: '10-01',
    endDate: '10-20',
  },
  // 14. 할로윈
  {
    title: 'horror',
    h2Title: '와 함께 즐기는 할로윈 밤',
    text: '트릭 오어 트릿! 오싹하고 신비로운 이야기',
    genreId: '27',
    startDate: '10-21',
    endDate: '11-05',
  },
  // 15. 고전 영화 (장르/시대 기준으로 추출)
  {
    title: 'classic',
    h2Title: '와 같이 보는 명작 시리즈',
    text: '시간을 초월한 고전 명작',
    genreId: '10751',
    startDate: '11-06',
    endDate: '11-30',
  },
];
