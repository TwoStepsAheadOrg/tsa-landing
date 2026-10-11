/** Public brand copy. Evidence dates refer to the supplied 2026-10-08 company profile. */
export const BRAND = {
  name: "TwoStepsAhead",
  tagline: "데이터 기반으로 AI 콘텐츠를 만들고, AI가 좋아하는 광고를 만듭니다.",
  description:
    "고객이 무엇을 묻는지, AI가 어떤 출처를 참고하는지 분석합니다. 그 근거로 콘텐츠를 만들고, 브랜드가 발견되는 경로를 설계합니다.",
  email: "glenn.kim@twostepsahead.co.kr",
  pdf: "/TwoStepsAhead-Company.pdf",
};
export const BRAND_NAV = [
  { label: "우리가 하는 일", href: "#services" },
  { label: "실제 작업", href: "#work" },
  { label: "데이터와 방식", href: "#approach" },
  { label: "팀 소개", href: "#team" },
];
export const SERVICE_ITEMS = [
  {
    title: "AI 콘텐츠",
    subtitle: "브랜드를 보고, 기억하게 만드는 이야기",
    text: "드라마와 숏폼, AI 모델과 캐릭터를 기획·제작합니다. 자체 콘텐츠를 운영하며 쌓은 경험을 브랜드의 이야기로 연결합니다.",
    outputs: ["스토리·콘셉트 기획", "AI 영상·이미지 제작", "캐릭터·모델 설계"],
    note: "자체 제작·운영 경험을 바탕으로 기업용 제작 범위를 협의합니다.",
    interest: "content",
  },
  {
    title: "AI 검색·브랜드 콘텐츠",
    subtitle: "AI가 이해하고 인용할 수 있는 근거",
    text: "고객의 질문과 AI의 답변을 분석합니다. 브랜드의 강점을 설명하는 콘텐츠를 만들고, 발행 뒤 언급과 인용의 변화를 확인합니다.",
    outputs: ["AI 노출·경쟁 분석", "AEO·GEO 콘텐츠", "발행 후 재측정"],
    note: "AEO·GEO는 AI의 답변과 검색에서 브랜드가 발견되도록 돕는 작업입니다.",
    interest: "geo",
  },
  {
    title: "글로벌 커뮤니티 마케팅",
    subtitle: "해외 고객의 대화 속에 필요한 정보",
    text: "Plurank로 주제와 인용 출처를 살피고, MICROWAVE로 Reddit 콘텐츠와 채널을 운영합니다. 현지 맥락에 맞는 정보와 대화를 만듭니다.",
    outputs: ["국가·키워드 조사", "Reddit 콘텐츠·운영", "반응·유입 분석"],
    note: "커뮤니티 규칙과 필요한 광고 관계 공개를 반영해 운영합니다.",
    interest: "global",
  },
];
export const WORKS = [
  {
    id: "rin",
    category: "콘텐츠",
    name: "RIN",
    kind: "AI 뷰티 모델·캐릭터",
    title: "한 인물의 얼굴에서, 하나의 세계관으로.",
    description:
      "외모와 말투, 일상과 스타일을 함께 설계한 AI 가상 인물입니다. 같은 인물의 메이크업과 분위기를 확장합니다.",
    image: "/brand/rin-beauty.webp",
    alt: "AI 가상 인물 RIN의 메이크업 전후 표현 사례",
    href: "https://rin-beauty-book.vercel.app/",
    cta: "RIN 비주얼북",
    theme: "rin",
  },
  {
    id: "nextep",
    category: "콘텐츠",
    name: "NextEp",
    kind: "AI 드라마 제작·플랫폼",
    title: "이야기를 만들고, 다음 화까지 운영합니다.",
    description:
      "한국어·일본어 드라마와 SF·미스터리를 제작합니다. 작품과 회차를 연결하는 자체 플랫폼에서 공개합니다.",
    image: "/brand/nextep-poster.webp",
    alt: "NextEp AI 드라마 오른손의 반지 표지",
    href: "https://nextep.ai.kr/",
    cta: "다음화 작품 보기",
    theme: "nextep",
  },
  {
    id: "plurank",
    category: "데이터·마케팅",
    name: "Plurank",
    kind: "AI 가시성 데이터",
    title: "브랜드가 어디에서 발견되는지 읽습니다.",
    description:
      "국가·언어·AI별 답변에서 브랜드 언급과 인용 출처를 관측합니다. 공략할 질문과 콘텐츠의 우선순위를 정합니다.",
    image: "/brand/plurank.webp",
    alt: "브랜드 언급과 인용 출처를 보여주는 Plurank 서비스 화면 예시",
    href: "https://plurank.com/",
    cta: "Plurank 알아보기",
    theme: "plurank",
  },
  {
    id: "microwave",
    category: "데이터·마케팅",
    name: "MICROWAVE",
    kind: "글로벌 Reddit 마케팅",
    title: "데이터에서 찾은 기회를, 현지의 대화로.",
    description:
      "AI 인용 출처와 고객의 관심사를 분석해 주제를 정합니다. 콘텐츠 발행부터 댓글 응대, 반응 확인까지 연결합니다.",
    image: null,
    alt: "",
    href: "https://reddit.microwave.ai.kr/",
    cta: "Reddit 마케팅 알아보기",
    theme: "microwave",
  },
  {
    id: "telling",
    category: "콘텐츠",
    name: "Telling",
    kind: "AI 캐릭터·개인화 콘텐츠",
    title: "보는 콘텐츠에서, 대화하는 경험으로.",
    description:
      "AI 캐릭터 대화와 개인화 콘텐츠를 직접 서비스합니다. 콘텐츠를 만드는 일과 사람들이 사용하는 경험을 함께 설계합니다.",
    image: "/brand/telling.webp",
    alt: "Telling 개인화 콘텐츠 견생사주 포스터",
    href: "https://telling.ai.kr/",
    cta: "Telling 살펴보기",
    theme: "telling",
  },
];
export const CHANNELS = [
  {
    name: "이게 진짜라고?",
    lang: "한국어 드라마",
    subscribers: "403",
    periodHighlight: "1주일 이내 달성",
    image: "/brand/channel-ko.webp",
    href: "https://www.youtube.com/@isthisreal_drama/videos",
  },
  {
    name: "これ、本当？",
    lang: "일본어 드라마",
    subscribers: "1.57천",
    periodHighlight: "1주일 이내 달성",
    image: "/brand/channel-ja.webp",
    href: "https://www.youtube.com/@korehonto_drama/videos",
  },
  {
    name: "ORBIT MINUTE",
    lang: "SF·우주·미스터리",
    subscribers: "2.2천",
    periodHighlight: "1주일 이내 달성",
    image: "/brand/channel-orbit.webp",
    href: "https://www.youtube.com/@orbit.minute/videos",
  },
];
export const INSTAGRAM_CASE = {
  name: "전설이래",
  periodHighlight: "제작 2일 만에 릴스 조회수 약 10.1만.",
  handle: "@jeonseolirae",
  href: "https://www.instagram.com/jeonseolirae/",
  description:
    "지명에 담긴 지역 전설을 1분 AI 애니메이션으로 만듭니다. 캐릭터·장면·목소리를 AI로 제작하고, Instagram 릴스로 연재합니다.",
  metrics: [
    { value: "6.4만", label: "대표 릴스 표시 조회수" },
    { value: "약 10.1만", label: "공개 릴스 10편 조회수 합산" },
    { value: "1,013", label: "1주일 이내 모은 팔로워" },
  ],
  sourceNote:
    "조회수는 2026.10.10 릴스 화면, 현재 팔로워는 2026.10.11 공개 프로필 기준입니다. 합산 조회수는 릴스 10편의 표시값을 더한 수치이며 일부 반올림되어 있습니다.",
  reels: [
    {
      title: "속초라는 이름이 바위 세금 때문?",
      image: "/brand/jeonseolirae-sokcho.webp",
      href: "https://www.instagram.com/jeonseolirae/reel/DeK6_C9RRSo/",
      views: "6.4만",
    },
    {
      title: "울산바위가 원래 울산 바위?",
      image: "/brand/jeonseolirae-ulsan.webp",
      href: "https://www.instagram.com/jeonseolirae/reel/DeJz1gexUdQ/",
      views: "1.2만",
    },
  ],
};
/** Collaboration history supplied by the company; new entries confirmed 2026-10-10. */
export const COLLABORATIONS = [
  {
    name: "올리브영",
    logo: "/brand/partners/oliveyoung-official-header.svg",
    width: 153, height: 45, recent: true, scope: null,
  },
  {
    name: "MangoBoost · 망고부스트",
    logo: "/brand/partners/mangoboost-official-logo.svg",
    width: 480, height: 100, recent: true, scope: null,
  },
  {
    name: "삼성 Galaxy S26 관련 프로젝트",
    logo: "/brand/partners/samsung-official-blue.png",
    width: 1600, height: 425, recent: false,
    scope: "어센트AI 협업 · AI 검색 데이터 공급·분석",
  },
  {
    name: "어센트AI",
    logo: "/brand/partners/ascent-ai-logo.svg",
    width: 689, height: 100, recent: false,
    scope: "AI 검색 데이터 협업",
  },
  {
    name: "아워마케팅",
    logo: "/brand/partners/ourmarketing-logo.png",
    width: 788, height: 250, recent: false,
    scope: "AI 가시성 모니터링·분석 리포트",
  },
  {
    name: "셀라벤토",
    logo: "/brand/partners/selavento-logo.png",
    width: 697, height: 697, recent: false,
    scope: "AI 가시성 모니터링·분석 리포트",
  },
];
export const PROCESS = [
  {
    title: "질문을 찾습니다",
    text: "고객의 관심사, 경쟁 브랜드, AI 답변과 인용 출처를 분석합니다.",
    output: "질문·주제·채널 우선순위",
  },
  {
    title: "콘텐츠로 만듭니다",
    text: "브랜드의 근거와 이야기를 영상, 이미지, 글, 캐릭터로 구체화합니다.",
    output: "콘텐츠 기획안과 제작물",
  },
  {
    title: "발견되는 곳에 연결합니다",
    text: "자체 채널, 브랜드 페이지와 커뮤니티의 문맥에 맞춰 발행합니다.",
    output: "채널별 발행·운영",
  },
  {
    title: "반응을 다음 판단에 씁니다",
    text: "시청·반응·유입과 AI 언급·인용을 구분해 보고 개선점을 찾습니다.",
    output: "결과 리포트와 다음 실험",
  },
];
export const INTEREST_OPTIONS = [
  { value: "content", label: "AI 콘텐츠·모델 제작" },
  { value: "geo", label: "AI 검색·브랜드 콘텐츠 (AEO/GEO)" },
  { value: "global", label: "글로벌·Reddit 마케팅" },
  { value: "ax", label: "AI 시스템·자동화 구축" },
  { value: "edu", label: "기업 AI 교육" },
  { value: "studio", label: "사업·콘텐츠 협업" },
  { value: "creator", label: "크리에이터 사업 · OWNNEXT" },
  { value: "other", label: "기타" },
];
