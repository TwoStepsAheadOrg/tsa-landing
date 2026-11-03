/**
 * 2026-11-02 개편. 대표 키워드 Global Growth Partner(영어), 풀어 쓰는 말 해외 마케팅 전문기업.
 * 화면 문구에는 가운뎃점(·)을 쓰지 않는다. 짧고 말하듯이 쓴다.
 * 검색엔진용 회사 소개 문장(index.html Organization)은 보도자료 회사 소개 문단과 같게 둔다.
 */
export const COMPANY_SENTENCE =
  "투스텝스어헤드(TwoStepsAhead)는 검색·AI 답변 최적화(SEO·AEO·GEO)에서 출발해, 해외 진출 기업의 채널 조사와 레딧·해외 인플루언서·퍼포먼스 마케팅, 해외 커머스 운영, 성과 측정까지 맡는 글로벌 그로스 파트너입니다.";

export const HERO = {
  title: "Global Growth Partner",
  sub: "어디서 통할지 먼저 확인하고, 그 시장에서 키웁니다.",
  lead: "투스텝스어헤드는 진출 전략부터 레딧, 인플루언서, 광고, 해외 커머스 운영까지 직접 맡습니다.",
  /** 제목 바로 위 초록 배지(대표 11/3). 근거: 2026 한국관광공사 초기관광벤처, 벤처기업 인증(FACTS와 같은 사실) */
  badges: ["관광벤처 선정기업", "벤처인증기업"],
};

export type Owner = "plurank" | "microwave";

/** 첫 화면 다음 이야기. 가상의 화장품 회사가 해외 진출 앞에서 묻는 세 가지에 답하며 두 브랜드를 소개한다. (페이블 제안 11/2 23:5x를 줄여 씀) */
export const STORY = {
  title: "해외로 나가고 싶은 화장품 회사가 있습니다.",
  company: "투스텝 코스메틱",
  intro: "국내에서는 잘 팔리지만 해외는 처음입니다. 세 가지를 모릅니다.",
  steps: [
    {
      q: "어느 나라, 어느 채널부터 가야 할까요?",
      beats: [
        { owner: "plurank", text: "14개국 AI 답변에서 화장품을 물었을 때 어떤 브랜드와 출처가 나오는지 찾습니다. 여기까지가 무료 진단입니다." },
        { owner: "microwave", text: "그 결과로 채널을 고릅니다. 미국은 레딧, 중국은 샤오홍슈, 일본은 X와 인스타그램. 레딧은 K-뷰티 게시판 글 약 3만 5천 개를 이미 분석해 두었습니다." },
      ],
      link: { label: "시장별 채널 보기", href: "#markets" },
    },
    {
      q: "비용은 얼마나 들까요?",
      beats: [
        { text: "진단은 무료입니다. 그다음엔 필요한 단계만 고릅니다." },
        { owner: "microwave", text: "레딧 광고만, 체험단만 따로 시작해도 됩니다. 매달 리포트를 보고 늘리거나 줄입니다." },
      ],
      link: { label: "무료 진단 받기", href: "#contact" },
    },
    {
      q: "어떤 효과를 기대할 수 있을까요?",
      beats: [
        { owner: "microwave", text: "광고는 노출과 클릭, 가입과 결제까지 숫자로 봅니다." },
        { owner: "plurank", text: "AI 답변에 브랜드가 나오기 시작했는지는 매달 리포트로 보여 드립니다." },
      ],
      proof: "한 테크 스타트업의 레딧 광고는 3주 남짓 동안 노출 약 260만 회, 클릭 약 1만 6,400회를 냈습니다. 업종마다 결과는 다르지만, 이런 숫자를 매달 보고 다음을 정합니다.",
    },
  ] as { q: string; beats: { owner?: Owner; text: string }[]; link?: { label: string; href: string }; proof?: string }[],
  closing: "투스텝 코스메틱이 밟은 순서가 곧 우리가 일하는 순서입니다. 진출 전략부터 해외 판매까지, 처음부터 끝까지 함께합니다.",
  /**
   * 첫 화면 바로 다음 애니메이션(페이블 콘티 11/3). 영상(fal Seedream 장면 + Seedance 5초 4컷 + 업종 세 칸)은 사람과 병만 보여 주고,
   * 글자와 숫자와 기호는 영상 위에 코드로 그린다(overlay). 영상 길이를 자막 수로 나눠 장면과 자막이 함께 바뀐다.
   * 투스텝 코스메틱은 가상의 회사라 성과 숫자를 붙이지 않는다.
   */
  film: {
    src: "/video/story.mp4",
    poster: "/video/story-poster.jpg",
    captions: [
      { text: "해외는 처음입니다" },
      { text: "어디서 묻는지부터 봅니다", owner: "plurank" },
      { text: "필요한 단계만 실행합니다", owner: "microwave" },
      { text: "숫자로 보고 다음을 정합니다", owner: "plurank" },
      { text: "업종이 달라도 순서는 같습니다" },
    ] as { text: string; owner?: Owner }[],
    seconds: 4.8,
    overlay: {
      questions: ["어디서?", "비용은?", "결과는?"],
      scan: { figure: 14, unit: "개국", line: "AI 답변을 묻고 비교합니다", engines: ["ChatGPT", "Perplexity", "네이버 AI 브리핑"], tag: "무료 진단" },
      run: {
        title: "레딧 광고만 먼저",
        note: "레딧 K-뷰티 글 약 3만 5천 개 분석",
        pins: [
          { label: "미국 레딧", lat: 39, lon: -98, on: true },
          { label: "중국 샤오홍슈", lat: 34, lon: 108 },
          { label: "일본 X, 인스타그램", lat: 36, lon: 139 },
        ],
      },
      funnel: { steps: ["노출", "클릭", "가입", "결제"], check: "AI 답변에 등장", tag: "매달 리포트" },
      industries: ["병의원", "F&B", "뷰티"],
    },
  },
  /** 이야기 끝. 화장품 말고도 같은 순서로 돕는 업종(대표 11/3). 병의원은 '해외환자 유치 마케팅'으로 쓴다(유치업 등록 확인 전). */
  industries: {
    title: "화장품만이 아닙니다.",
    line: "업종이 달라도 해외 고객을 모으는 순서는 같습니다.",
    items: ["뷰티", "병의원 해외환자 유치 마케팅", "F&B", "관광", "IT 서비스"],
  },
};

export const OWNERS: Record<Owner, { name: string; role: string; url: string }> = {
  plurank: { name: "Plurank", role: "분석과 개선", url: "https://plurank.com" },
  microwave: { name: "MICROWAVE", role: "선택과 실행", url: "https://microwave.ai.kr" },
};

/** 일하는 흐름. 실제 순서라서 번호를 붙이고, 4 다음은 다시 1로 돈다. 서비스는 짧은 이름표로만 보여 준다. */
export const FLOW: { title: string; line: string; owner: Owner; chips: { name: string; href?: string }[] }[] = [
  {
    title: "분석",
    line: "해외 고객이 어디서 묻는지 확인",
    owner: "plurank",
    chips: [{ name: "AI 검색 분석" }, { name: "경쟁사 분석" }],
  },
  {
    title: "선택",
    line: "시장별 채널 고르기",
    owner: "microwave",
    chips: [{ name: "시장별 채널" }, { name: "레딧 레이더" }],
  },
  {
    title: "실행",
    line: "광고와 캠페인을 직접 운영",
    owner: "microwave",
    chips: [
      { name: "레딧 광고" },
      { name: "레딧 AMA" },
      { name: "레딧 계정 운영" },
      { name: "샤오홍슈" },
      { name: "일본 인플루언서" },
      { name: "방한 체험단" },
      { name: "크리에이터 네트워크", href: "https://console.microwave.ai.kr/creators/en/" },
      { name: "퍼포먼스 광고" },
      { name: "틱톡샵 운영" },
      { name: "쇼피파이 스토어" },
    ],
  },
  {
    title: "개선",
    line: "다시 보고 고치기",
    owner: "plurank",
    chips: [{ name: "GEO 최적화" }, { name: "다국어 SEO" }, { name: "월간 리포트" }],
  },
];

export const MARKETS: { market: string; channel: string; what: string; owner: Owner }[] = [
  { market: "미국과 영어권", channel: "레딧", what: "광고, AMA, 계정 운영", owner: "microwave" },
  { market: "중국", channel: "샤오홍슈", what: "크리에이터 방문 후기", owner: "microwave" },
  { market: "일본", channel: "X, 인스타그램", what: "현지 인플루언서 캠페인", owner: "microwave" },
  { market: "한국을 찾은 외국인", channel: "인플루언서 SNS", what: "방한 체험단", owner: "microwave" },
  { market: "해외 온라인 판매", channel: "틱톡샵, 쇼피파이", what: "입점, 스토어 구축과 운영", owner: "microwave" },
  { market: "14개국", channel: "ChatGPT, Perplexity, 네이버 AI 브리핑", what: "AI 검색 분석과 GEO", owner: "plurank" },
];

/** 화면에 보이는 질문과 index.html의 FAQPage가 같아야 한다. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "GEO가 뭔가요?",
    a: "ChatGPT 같은 AI가 답할 때 우리 브랜드를 언급하고 출처로 쓰게 만드는 일입니다. 검색 순위를 다루는 SEO의 AI 버전이라고 보면 됩니다. AEO도 비슷한 뜻으로 씁니다.",
  },
  {
    q: "Plurank와 MICROWAVE는 어떻게 다른가요?",
    a: "Plurank는 분석, MICROWAVE는 실행입니다. 두 브랜드 모두 투스텝스어헤드가 운영하고 한 팀이 함께 봅니다.",
  },
  {
    q: "어떤 업종을 맡나요?",
    a: "업종을 가리지 않습니다. 뷰티뿐 아니라 병의원의 해외환자 유치 마케팅, F&B, 관광, IT 서비스까지 해외 진출과 해외 고객 유치를 돕습니다.",
  },
  {
    q: "어디까지 맡나요?",
    a: "해외 마케팅과 판매 채널 운영을 함께 맡습니다. 법인 설립, 인허가, 통관, 물류, 현지 유통은 필요시 협의를 거쳐 진행합니다.",
  },
  {
    q: "왜 레딧인가요?",
    a: "ChatGPT가 가장 많이 인용하는 출처가 레딧입니다. 검색 분석 기업 Ahrefs에 따르면 2026년 9월 미국 기준 인용 출처의 약 17%로 1위였습니다.",
  },
  {
    q: "봇이나 추천 구매를 쓰나요?",
    a: "쓰지 않습니다. 글은 사람이 직접 쓰고, 브랜드를 대신해 답한다는 사실을 밝힙니다.",
  },
  {
    q: "방한 인플루언서 체험단은 뭔가요?",
    a: "한국에 살거나 여행 중인 해외 인플루언서가 매장을 방문하고 자기 나라 SNS에 후기를 올리는 캠페인입니다. 승인을 통과한 크리에이터만 참여하고, 지금은 계약 기업과만 진행합니다.",
  },
  {
    q: "틱톡샵이나 쇼피파이도 맡아 주나요?",
    a: "네. 틱톡샵, 쇼피파이 같은 해외 커머스 플랫폼의 입점과 스토어 구축, 운영을 맡습니다.",
  },
  {
    q: "일부만 맡겨도 되나요?",
    a: "됩니다. 분석만, 레딧만, 인플루언서만 따로 시작할 수 있습니다.",
  },
];

export const FACTS = ["2025년 설립", "벤처기업 인증", "2026 한국관광공사 초기관광벤처"];
