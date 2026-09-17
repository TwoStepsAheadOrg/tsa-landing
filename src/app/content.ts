/**
 * 랜딩 전체 카피 단일 소스.
 * 스펙: docs/superpowers/specs/2026-08-10-light-editorial-redesign.md
 * 수치·클라이언트명·플랫폼명은 공개 검증된 사실만 — 임의 수정·창작 금지.
 */

export const NAV_LINKS = [
  { label: '회사', href: '#studio' },
  { label: '서비스', href: '#services' },
  { label: '사례', href: '#work' },
  { label: '도입 과정', href: '#journey' },
  { label: '솔루션', href: '#solutions' },
  { label: '교육', href: '#education' },
  { label: '채용', href: '/careers/' },
];

export const CAREERS_NAV_LINKS = [
  { label: '조직문화', href: '#culture' },
  { label: '일하는 방식', href: '#how-we-work' },
  { label: '채용 포지션', href: '#open-roles' },
];

export const HERO = {
  /** headline: highlight=true 세그먼트에 형광 마크 */
  headline: [
    { text: '생성형 AI가 가장 좋아하는\n', highlight: false },
    { text: '콘텐츠를 만듭니다', highlight: true },
  ],
  sub: '14개국 생성형 AI 플랫폼의 질의 데이터를 수집·분석하는 유일한 회사입니다.\nAI가 인용하고 추천하는 콘텐츠 제작부터 AI 상담·업무 자동화, SaaS·관제·CRM 구축, 교육까지 한 팀이 맡습니다.',
  primaryCta: { label: '무료 상담받기', href: '#contact' },
  secondaryCta: { label: '사례 보기', href: '#work' },
  /** CTA 아래 신뢰 뱃지 — 대표 확인 사실(2026-08-10) */
  badges: ['한국관광공사 관광벤처 선정', 'AI 바우처 공급기업', '벤처기업 인증'],
};

/** 첫 화면에서 회사의 규모와 운영 경험을 바로 이해할 수 있는 핵심 지표. */
export const STATS = [
  { v: '15+', k: '국내외 프로젝트 수행' },
  { v: '14개국', k: '생성형 AI 플랫폼 질의 데이터 수집·분석' },
  { v: '5개', k: '직접 운영하는 자체 서비스' },
  { v: '24시간', k: 'AI 고객 응대 시스템 운영' },
];

export const OFFERINGS = {
  title: '생성형 AI에 발견되는 콘텐츠부터\n현장에서 돌아가는 AI까지.',
  lead: '14개국 생성형 AI 플랫폼의 질의 데이터를 기반으로 콘텐츠를 만들고, 기술 시연에 그치지 않는 시스템을 구축합니다.',
  items: [
    {
      num: '01',
      title: '생성형 AI 검색 콘텐츠',
      desc: 'ChatGPT·Gemini·네이버 AI 브리핑 등이 인용하고 추천하는 콘텐츠를 질의 데이터 기반으로 제작합니다.',
    },
    {
      num: '02',
      title: 'AI 업무 자동화',
      desc: '반복 상담, 문서 처리와 데이터 업무를 AI 에이전트로 자동화합니다.',
    },
    {
      num: '03',
      title: 'SaaS·업무 시스템',
      desc: '관제, 예약, CRM 등 현장 업무에 맞는 웹과 앱을 개발합니다.',
    },
    {
      num: '04',
      title: 'AI 고객 응대',
      desc: '전화와 채팅 문의를 24시간 처리하고 필요한 내용을 담당자에게 연결합니다.',
    },
    {
      num: '05',
      title: '기업 AI 교육',
      desc: '리더 특강부터 부서별 실무 워크숍과 개발자 교육까지 진행합니다.',
    },
  ],
};

/**
 * 포트폴리오·파트너 전체 — 무한 횡스크롤 마퀴용.
 * 전부 위시켓·크몽에 공개된 실명(의료기관 등 익명 건 제외).
 */
export const CLIENTS = [
  '한솔엠에스',
  '어센트코리아',
  '토쿠야마상사',
  'BridgeLeaf',
  'Kozy.care',
  '올댓아너스클럽',
  '레비타로',
  '아워컨설팅',
  '한인텔',
  '더블유디자인호텔',
  '한국관광공사',
];

export const JOURNEY = {
  title: 'AI 도입은 구축으로\n끝나지 않습니다.',
  lead: '진단에서 운영까지, 도입의 전 구간을 한 팀이 맡습니다.',
  steps: [
    {
      num: '01',
      name: '진단',
      title: '업무에서 AI가 들어갈 지점을 찾습니다',
      items: ['현장 인터뷰·업무 분해', '적용 지점과 우선순위 정리', '도입 범위·비용 설계'],
    },
    {
      num: '02',
      name: '구축',
      title: 'AX·DX 시스템을 만듭니다',
      items: ['AI 에이전트·업무 자동화', 'SaaS·관제·예약·CRM 개발', '기존 시스템 연동'],
    },
    {
      num: '03',
      name: '운영',
      title: '운영까지 책임집니다',
      items: ['24시간 AI 고객 응대(AICX)', '모니터링·개선', '임직원 교육'],
    },
  ],
};

export const CASES_FEATURED = [
  {
    client: '한솔엠에스 · ChargeFLOW',
    headline: '충전기 1,467기를 관리하는 전기차 충전 관제 시스템',
    detail: 'OCPP 기반 통합 관제 SaaS를 구축하고, Claude 기반 AI 상담이 24시간 문의를 받습니다.',
    tags: ['AX', 'DX'],
  },
  {
    client: '어센트코리아',
    headline: '글로벌 대기업 계열 신제품의 AI 검색 노출 검증',
    detail: '국가·플랫폼별 AI 검색 데이터를 공급하는 연간 계약으로 이어졌습니다.',
    tags: ['AI'],
  },
  {
    client: '올댓아너스클럽 · K-Trip ONE',
    headline: '외국인 관광객 앱, 기획부터 런칭까지',
    detail: '여행 패스 서비스 앱을 데이터 파이프라인부터 풀스택으로 만들었습니다.',
    tags: ['DX'],
  },
];

export const CASES_LIST = [
  { num: '04', client: '토쿠야마상사 · 일본', summary: '이커머스·CRM 디지털 전환' },
  { num: '05', client: 'BridgeLeaf · 미국', summary: '아마존 셀러 아웃리치 CRM 구축' },
  { num: '06', client: 'Kozy.care · 프랑스', summary: '유럽 시장 AI 검색 노출 분석 리포트' },
  { num: '07', client: '레비타로', summary: '모바일 앱 개발·운영' },
];

export const TECH_META = [
  'AI 에이전트 · 상담 구축',
  'SaaS·관제 인프라 — 서버 43모듈 · 관리자 87화면 · OCPP',
  '데이터 수집 · 크롤링 인프라',
  '글로벌 프로젝트 — 미국 · 일본 · 프랑스',
];

export const SOLUTIONS = {
  title: '바로 도입할 수 있는\n자체 솔루션',
  lead: '직접 운영 중인 자체 솔루션은 개발 없이 바로 도입할 수 있습니다.',
  main: {
    name: '우주콜',
    tagline: '전화를 대신 받는 AI 직원',
    desc: '바쁜 순간과 영업시간 밖에도 전화를 대신 받고, 반복 문의와 콜백 요청을 정리합니다. 매장·병원·사무실에 바로 붙습니다.',
    url: 'https://www.woojoocall.com',
    dialogue: [
      { role: 'caller', text: '지금 예약 가능한가요?' },
      { role: 'ai', text: '네, 오늘 오후 3시와 5시에 자리가 있습니다. 성함과 연락처를 남겨주시면 예약해 드릴게요.' },
      { role: 'caller', text: '김민수, 010-1234-5678이요.' },
      { role: 'ai', text: '오후 3시로 예약했습니다. 확인 문자를 보내드렸어요.' },
    ],
  },
  sub: {
    name: '보임',
    tagline: '네이버 AI 브리핑·플레이스 모니터링',
    desc: '브랜드와 검색어를 입력하면 네이버 AI 브리핑 속 브랜드 언급과 인용 출처, 지역 검색의 플레이스 순위를 매일 관측합니다.',
    url: 'https://boim.twostepsahead.co.kr',
    host: 'boim.twostepsahead.co.kr',
    preview: { src: '/product/boim-preview.webp', alt: '보임 네이버 AI 브리핑 무료 진단 화면' },
  },
};

export const EDUCATION = {
  title: '만든 사람이\n가르칩니다.',
  lead: '대표는 Class101 · 패스트캠퍼스 · 스파르타코딩클럽 · 코드잇에서 개발 강의와 콘텐츠를 만들어 왔습니다. 지금도 기업과 개인에게 AI와 개발을 가르칩니다.',
  platforms: ['Class101', '패스트캠퍼스', '스파르타코딩클럽', '코드잇'],
  programs: [
    {
      title: '임원·리더 AI 특강',
      desc: 'AI가 사업을 어떻게 바꾸는지, 의사결정자가 알아야 할 것만 압축합니다.',
    },
    {
      title: 'AX·DX 실무 워크숍',
      desc: '부서 단위로 실제 업무를 가져와, AI를 붙이는 실습까지 갑니다.',
    },
    {
      title: '개발 임직원 교육',
      desc: 'AI 도구·에이전트 개발을 현업 개발자 눈높이로 가르칩니다.',
    },
    {
      title: '개인 교육·코칭',
      desc: '커리어 전환부터 사이드 프로젝트까지, 1:1로 갑니다.',
    },
  ],
};

export const PEOPLE = {
  title: '작은 팀에서\n큰 문제를 끝까지 풉니다.',
  lead: '투스텝스어헤드는 문제를 발견한 사람이 직접 설계하고, 만들고, 운영합니다. 역할의 경계보다 고객에게 실제로 작동하는 결과를 중요하게 생각합니다.',
  principles: [
    {
      name: '주도적으로 결정합니다',
      desc: '해야 할 일을 기다리기보다 문제를 정의하고 우선순위를 제안합니다.',
    },
    {
      name: '빠르게 만들고 배웁니다',
      desc: '작은 단위로 출시하고, 실제 사용자의 반응을 다음 판단에 반영합니다.',
    },
    {
      name: '운영까지 책임집니다',
      desc: '납품에서 끝내지 않고 시스템이 현장에 자리 잡을 때까지 함께 봅니다.',
    },
  ],
};

export const CAREERS = {
  hero: {
    title: '문제를 발견하고,\n끝까지 해결하는 사람들.',
    lead: '우리는 AI로 기업의 반복 업무를 바꾸고 필요한 제품을 직접 만듭니다. 작은 팀에서 문제 정의부터 출시와 운영까지 함께할 동료를 찾습니다.',
  },
  culture: [
    {
      title: '자기 일의 책임자가 됩니다',
      desc: '시키는 일을 처리하는 데 머물지 않습니다. 무엇을 왜 만들어야 하는지 질문하고, 더 나은 방법을 직접 제안합니다.',
    },
    {
      title: '직무보다 문제를 먼저 봅니다',
      desc: '기획, 디자인, 개발의 경계를 넘나들며 고객의 문제가 해결될 때까지 필요한 일을 함께합니다.',
    },
    {
      title: '빠른 실행을 기록으로 남깁니다',
      desc: '작게 만들고 곧바로 검증합니다. 과정과 배움을 기록해 다음 실행의 속도를 높입니다.',
    },
    {
      title: '보여주기보다 작동하는 결과를 만듭니다',
      desc: '유행이나 포장보다 실제 사용자가 쓰고, 고객의 업무가 달라지는 결과에 집중합니다.',
    },
  ],
  ways: [
    {
      title: '한 사람이 처음부터 끝까지 봅니다',
      desc: '문제 정의, 구현, 검증, 운영이 여러 팀 사이에서 끊기지 않도록 담당자가 전체 맥락을 유지합니다.',
    },
    {
      title: 'AI를 일의 기본 도구로 씁니다',
      desc: '리서치와 기획부터 개발, QA, 문서화까지 AI를 적극 활용하고 더 나은 업무 방식을 계속 실험합니다.',
    },
    {
      title: '의견보다 고객과 데이터로 판단합니다',
      desc: '누가 말했는지보다 현장에서 무엇이 작동했는지를 확인하고 다음 결정을 내립니다.',
    },
  ],
  reasons: [
    'AI 서비스와 기업 시스템을 직접 만들고 운영하는 경험',
    '기획부터 개발과 사업 운영까지 가까이에서 배우는 환경',
    '새로운 제품과 일하는 방식을 함께 정의할 수 있는 작은 팀',
  ],
};

export const STUDIO = {
  heading: '생성형 AI가 무엇을 답하는지,\n데이터로 먼저 봅니다.',
  lead: '투스텝스어헤드는 14개국 생성형 AI 플랫폼의 질의 데이터를 수집·분석하는 유일한 회사입니다. 그 데이터로 AI가 인용하고 추천하는 콘텐츠를 만들고, 현장의 업무 흐름에 맞는 AI와 시스템을 구축합니다. 직접 서비스를 운영해 본 경험이 있기 때문에 구축 이후까지 함께 설계할 수 있습니다.',
  team: [
    {
      role: '대표',
      name: '김건희',
      bio: '세 번 창업해 세 번 매각했으며, 제품 기획과 AI·소프트웨어 개발을 이끌고 있습니다.',
    },
    {
      role: 'COO',
      name: '김지현',
      bio: 'B2B 스타트업에서 8년간 운영을 맡았으며, 시리즈 A와 B 투자 유치를 이끌었습니다.',
    },
    {
      role: 'CPO',
      name: '이성은',
      bio: '스마일게이트알피지에서 로스트아크 사업 PM을 맡았으며, 스타트업 비드유의 대표를 지냈습니다.',
    },
  ],
};

export const SERVICES = [
  { name: '우주콜', tagline: '전화를 대신 받는 AI 직원', url: 'https://www.woojoocall.com' },
  { name: '텔링사주', tagline: '캐릭터와 채팅으로 보는 AI 사주', url: 'https://telling.ai.kr' },
  { name: '마이크로웨이브', tagline: '글로벌 인플루언서 마케팅', url: 'https://microwave.ai.kr' },
  { name: '보임', tagline: '네이버 AI 브리핑·플레이스 모니터링', url: 'https://boim.twostepsahead.co.kr' },
  { name: '어웨이에디션', tagline: '외국인 방문객을 위한 도시 가이드', url: 'https://awayedition.com' },
];

export const STATEMENT = '납품하고 떠나지 않습니다.\n운영까지 함께합니다.';

/** 제3자 검증 — 발급기관이 있는 인증·선정만. 임의 추가 금지. */
export const CREDENTIALS = [
  { date: '2026.03', title: 'AI 바우처 공급기업 Pool 등록 및 공급기업 참여' },
  { date: '2026.06', title: '한국인공지능협회 회원사 가입' },
  { date: '2026.06', title: '연구개발전담부서 인정' },
  { date: '2026.06', title: '한국관광공사 제18회 관광벤처 지원사업 최종 선정' },
  { date: '2026.06', title: '중소벤처기업부 창업기업 확인' },
  { date: '2026.07', title: '벤처기업 인증 획득(혁신성장유형)' },
];

/**
 * 외부 파트너 프로필 — 클릭해서 검증 가능한 실적 페이지.
 * ⚠ 위시켓 파트너 페이지는 로그인 벽(auth 리다이렉트)이라 제외 (2026-08-09 실측).
 */
export const PROFILES = [
  { name: '크몽 전문가 프로필', url: 'https://kmong.com/@투스텝스어헤드' },
];

export const INTERESTS = [
  { value: 'ax', label: 'AX 도입 · AI 상담/자동화/에이전트' },
  { value: 'dx', label: 'DX 구축 · SaaS/관제/CRM 개발' },
  { value: 'aicx', label: 'AICX · AI 전화/채팅 응대' },
  { value: 'edu', label: '기업교육 · 강의/워크숍' },
  { value: 'studio', label: '스튜디오 협업 · 제휴' },
  { value: 'other', label: '기타' },
];

export const FOOTER = {
  corp: '주식회사 투스텝스어헤드',
  lines: [
    '대표 김건희 · 사업자등록번호 319-87-03770',
    '통신판매업신고 2025-서울강남-05963',
    '서울특별시 마포구 양화로 186, 6층 607호(동교동, LC TOWER 스파크플러스)',
    'glenn.kim@twostepsahead.co.kr · 010-9990-7868',
  ],
  copyright: '© 2026 TwoStepsAhead Co., Ltd. All rights reserved.',
};
