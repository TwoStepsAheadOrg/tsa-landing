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

/** 이야기 한 편(업종 탭 하나). 대표 11/5: 업종 탭(화장품, F&B, 생활 제품, 엔터테인먼트)마다 고민과 우리가 돕는 방식을 영상으로 */
export type StoryStep = { q: string; beats: { owner?: Owner; text: string }[]; link?: { label: string; href: string }; proof?: string };
export type OverlayKind = "questions" | "scan" | "prep" | "run" | "funnel" | "industries";
export type StoryOverlayData = {
  questions: string[];
  scan: { figure: number; unit: string; line: string; engines: string[]; tag: string };
  /** 법률 검토와 인증 준비(대표 11/5: 변호사 팀원이 먼저 보고, 인증과 등록은 고객 회사 이름으로, 준비를 돕는다) */
  prep?: { title: string; items: string[]; tag: string };
  run: { title: string; note?: string; pins: { label: string; lat: number; lon: number; on?: boolean; dir?: "up" | "down" | "left" }[] };
  funnel: { steps: string[]; check: string; tag: string };
  industries?: string[];
  /** 장면 순서(영상 장면과 같은 순서). 없으면 questions, scan, run, funnel, industries */
  order?: OverlayKind[];
  /** 영상 속 사람이 왼쪽에 있어 글자를 오른쪽에 두는 장면 */
  right?: OverlayKind[];
};
export type Story = {
  id: string;
  tab: string;
  title: string;
  company: string;
  intro: string;
  steps: StoryStep[];
  closing: string;
  film: { src: string; poster: string; captions: { text: string; owner?: Owner }[]; seconds: number; label: string; overlay: StoryOverlayData };
};

/** 첫 화면 다음 이야기. 가상의 화장품 회사가 해외 진출 앞에서 묻는 세 가지에 답하며 두 브랜드를 소개한다. (페이블 제안 11/2 23:5x를 줄여 씀) */
const BEAUTY: Story = {
  id: "beauty",
  tab: "뷰티",
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
        { text: "진단은 무료입니다. 미국 MoCRA 등록이나 EU CPNP 신고가 필요한지도 체크리스트로 먼저 확인합니다." },
        { owner: "plurank", text: "필요하면 변호사 팀원이 등록과 신고 서류 준비를 돕습니다. 그다음엔 필요한 단계만 고릅니다." },
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
  ],
  closing: "투스텝 코스메틱이 밟은 순서가 곧 우리가 일하는 순서입니다. 법률 검토와 인증 준비부터 해외 판매까지, 처음부터 끝까지 함께합니다.",
  /**
   * 첫 화면 바로 다음 애니메이션(페이블 콘티 11/3). 영상(fal Seedream 장면 + Seedance 5초 4컷 + 업종 세 칸)은 사람과 병만 보여 주고,
   * 글자와 숫자와 기호는 영상 위에 코드로 그린다(overlay). 영상 길이를 자막 수로 나눠 장면과 자막이 함께 바뀐다.
   * 투스텝 코스메틱은 가상의 회사라 성과 숫자를 붙이지 않는다.
   */
  film: {
    src: "/video/story-beauty.mp4",
    poster: "/video/story-beauty-poster.jpg",
    captions: [
      { text: "해외는 처음입니다" },
      { text: "어디서 묻는지부터 봅니다", owner: "plurank" },
      { text: "등록과 신고 준비를 돕습니다", owner: "plurank" },
      { text: "필요한 단계만 실행합니다", owner: "microwave" },
      { text: "숫자로 보고 다음을 정합니다", owner: "plurank" },
    ],
    seconds: 4.8,
    label: "가상의 화장품 회사가 해외 진출을 준비하는 과정을 보여 주는 애니메이션. 아래 글과 같은 내용입니다.",
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
      prep: { title: "법률 검토와 인증 준비", items: ["미국 MoCRA 시설 등록과 제품 목록", "EU CPNP 신고와 책임자 지정", "성분 표시 검토"], tag: "변호사 팀원이 먼저 봅니다" },
      funnel: { steps: ["노출", "클릭", "가입", "결제"], check: "AI 답변에 등장", tag: "매달 리포트" },
      order: ["questions", "scan", "prep", "run", "funnel"],
      right: ["prep"],
    },
  },

};

/** 이야기 끝. 화장품 말고도 같은 순서로 돕는 업종(대표 11/3). 병의원은 「병의원 해외 마케팅」으로 쓴다(「해외환자 유치」는 유치업 등록 표현이라 쓰지 않음, 대표 11/3 17:22). */
export const STORY_INDUSTRIES = {
  title: "다른 업종도 같습니다.",
  line: "업종이 달라도 해외 고객을 모으는 순서는 같습니다.",
  items: ["뷰티", "병의원 해외 마케팅", "F&B", "관광", "IT 서비스"],
};


/** 업종 탭(대표 11/5, 페이블 콘티 industry-tabs/FABLE-STORYBOARD.md). 회사는 모두 가상이라 성과 숫자를 붙이지 않는다. 영상은 사람과 제품만, 글자는 코드로 */
const FNB: Story = {
  id: "fnb",
  tab: "F&B",
  title: "해외로 나가고 싶은 소스 회사가 있습니다.",
  company: "투스텝 푸드",
  intro: "국내 마트에서는 자리를 잡았는데, 미국 바이어가 시설 등록을 물었을 때 답을 못 했습니다. 세 가지를 모릅니다.",
  steps: [
    {
      q: "해외에서 한국 소스를 찾는 사람은 어디서 묻나요?",
      beats: [
        { owner: "plurank", text: "14개국 AI 답변에 한국 소스와 간편식을 물었을 때 어떤 브랜드와 출처가 나오는지 찾습니다. 여기까지가 무료 진단입니다." },
        { owner: "microwave", text: "그 결과로 채널을 고릅니다. 미국은 레딧 요리 게시판, 일본은 인스타그램, 한국을 찾은 외국인은 방한 체험단. 레딧 글은 소속을 밝히고 사람이 직접 답합니다." },
      ],
      link: { label: "시장별 채널 보기", href: "#markets" },
    },
    {
      q: "미국에 보내려면 시설 등록과 표시 기준은 어떻게 준비하나요?",
      beats: [
        { owner: "plurank", text: "FDA 식품시설 등록, 영양성분표와 알레르기 표시 같은 미국 표시 기준을 체크리스트로 만들고 변호사 팀원이 먼저 봅니다." },
        { owner: "plurank", text: "서류와 라벨 시안 준비를 돕습니다. 등록은 회사 이름으로 하고, 통관과 물류는 필요시 협의를 거칩니다." },
      ],
      link: { label: "무료 진단 받기", href: "#contact" },
    },
    {
      q: "현지 매장도 없는데 어떻게 팔고, 반응은 어떻게 보나요?",
      beats: [
        { owner: "microwave", text: "쇼피파이 스토어를 만들고 틱톡샵에 입점해 운영합니다. 체험단 후기는 협찬 표시를 달고 올립니다." },
        { owner: "plurank", text: "노출, 클릭, 주문, 재구매를 매달 리포트로 보고 다음 채널을 정합니다." },
      ],
      proof: "한 테크 스타트업의 레딧 광고는 3주 남짓 동안 노출 약 260만 회, 클릭 약 1만 6,400회를 냈습니다. 업종마다 결과는 다르지만, 이런 숫자를 매달 보고 다음을 정합니다.",
    },
  ],
  closing: "투스텝 푸드가 밟은 순서가 곧 우리가 일하는 순서입니다. 법률 검토와 인증 준비부터 해외 판매까지, 처음부터 끝까지 함께합니다.",
  film: {
    src: "/video/story-fnb.mp4",
    poster: "/video/story-fnb-poster.jpg",
    captions: [
      { text: "소스는 팔리는데 해외는 처음입니다" },
      { text: "누가 어디서 묻는지 봅니다", owner: "plurank" },
      { text: "등록과 표시 준비를 돕습니다", owner: "plurank" },
      { text: "채널 하나부터 실행합니다", owner: "microwave" },
      { text: "주문까지 숫자로 봅니다", owner: "plurank" },
    ],
    seconds: 4.8,
    label: "가상의 소스 회사가 해외 진출을 준비하는 과정을 보여 주는 애니메이션. 아래 글과 같은 내용입니다.",
    overlay: {
      questions: ["어디서?", "등록은?", "판매는?"],
      scan: { figure: 14, unit: "개국", line: "AI 답변에 한국 소스를 묻고 비교합니다", engines: ["ChatGPT", "Perplexity", "네이버 AI 브리핑"], tag: "무료 진단" },
      prep: { title: "법률 검토와 인증 준비", items: ["FDA 식품시설 등록", "영양성분표와 알레르기 표시", "라벨 시안 검토"], tag: "변호사 팀원이 먼저 봅니다" },
      run: {
        title: "레딧 요리 게시판부터",
        pins: [
          { label: "미국 레딧", lat: 39, lon: -98, on: true, dir: "up" },
          { label: "일본 인스타그램", lat: 36, lon: 139, dir: "up" },
          { label: "방한 체험단", lat: 37.5, lon: 127, dir: "down" },
        ],
      },
      funnel: { steps: ["노출", "클릭", "주문", "재구매"], check: "AI 답변에 등장", tag: "매달 리포트" },
      order: ["questions", "scan", "prep", "run", "funnel"],
      right: ["prep", "run", "funnel"],
    },
  },
};

const MED: Story = {
  id: "med",
  tab: "병의원 해외 마케팅",
  title: "해외에 알리고 싶은 피부과 의원이 있습니다.",
  company: "투스텝 클리닉",
  intro: "서울의 피부과 의원입니다. 외국인 문의가 가끔 들어오는데, 다국어 안내도 없고 광고를 어디까지 해도 되는지도 모릅니다. 세 가지를 모릅니다.",
  steps: [
    {
      q: "해외에서 한국 피부과를 찾는 사람은 어디서 묻나요?",
      beats: [
        { owner: "plurank", text: "14개국 AI 답변에 한국 피부과 진료를 물었을 때 어떤 병원과 출처가 나오는지 찾습니다. 여기까지가 무료 진단입니다." },
        { owner: "microwave", text: "그 결과로 채널을 고릅니다. 미국은 레딧 스킨케어 게시판, 중국은 샤오홍슈, 일본은 인스타그램. 레딧 글은 병원 소속을 밝히고 사람이 직접 답합니다." },
      ],
      link: { label: "시장별 채널 보기", href: "#markets" },
    },
    {
      q: "해외에 병원을 알리려면 의료광고는 어디까지 할 수 있나요?",
      beats: [
        { owner: "plurank", text: "의료광고 기준과 사전 심의 대상 여부, 현지 광고 규정, 전후 사진과 치료 후기 표현 기준을 체크리스트로 만들고 변호사 팀원이 먼저 봅니다." },
        { owner: "plurank", text: "다국어 안내 페이지와 소개 문안 준비를 돕습니다. 심의 신청과 등록은 병원 이름으로 하고, 문의와 예약은 병원이 직접 받고 답합니다." },
      ],
      link: { label: "무료 진단 받기", href: "#contact" },
    },
    {
      q: "글은 올렸는데 문의가 정말 늘었는지 어떻게 보나요?",
      beats: [
        { owner: "microwave", text: "레딧에는 병원 소속을 밝히고 사람이 직접 답합니다. 샤오홍슈와 인스타그램 병원 계정에는 검토를 거친 문안만 올리고 다국어 문의 창구로 연결합니다." },
        { owner: "plurank", text: "노출, 클릭, 문의, 예약을 매달 리포트로 보고 다음 채널을 정합니다." },
      ],
      proof: "한 테크 스타트업의 레딧 광고는 3주 남짓 동안 노출 약 260만 회, 클릭 약 1만 6,400회를 냈습니다. 업종마다 결과는 다르지만, 이런 숫자를 매달 보고 다음을 정합니다.",
    },
  ],
  closing: "투스텝 클리닉이 밟은 순서가 곧 우리가 일하는 순서입니다. 법률 검토와 광고 기준 준비부터 해외 문의까지, 처음부터 끝까지 함께합니다.",
  film: {
    src: "/video/story-med.mp4",
    poster: "/video/story-med-poster.jpg",
    captions: [
      { text: "진료는 자신 있는데 해외는 처음입니다" },
      { text: "어디서 병원을 찾는지 봅니다", owner: "plurank" },
      { text: "광고 심의 준비를 돕습니다", owner: "plurank" },
      { text: "레딧 답변부터 실행합니다", owner: "microwave" },
      { text: "예약까지 숫자로 봅니다", owner: "plurank" },
    ],
    seconds: 4.8,
    label: "가상의 피부과 의원이 해외 마케팅을 준비하는 과정을 보여 주는 애니메이션. 아래 글과 같은 내용입니다.",
    overlay: {
      questions: ["어디서?", "광고는?", "문의는?"],
      scan: { figure: 14, unit: "개국", line: "AI 답변에 한국 피부과를 묻고 비교합니다", engines: ["ChatGPT", "Perplexity", "네이버 AI 브리핑"], tag: "무료 진단" },
      prep: { title: "법률 검토와 광고 기준 준비", items: ["의료광고 기준과 사전 심의 대상", "현지 광고 규정과 전후 사진 표현", "치료 후기 표현 기준"], tag: "변호사 팀원이 먼저 봅니다" },
      run: {
        title: "레딧 스킨케어 게시판부터",
        pins: [
          { label: "미국 레딧", lat: 39, lon: -98, on: true, dir: "up" },
          { label: "중국 샤오홍슈", lat: 34, lon: 108, dir: "down" },
          { label: "일본 인스타그램", lat: 36, lon: 139, dir: "up" },
        ],
      },
      funnel: { steps: ["노출", "클릭", "문의", "예약"], check: "AI 답변에 등장", tag: "매달 리포트" },
      order: ["questions", "scan", "prep", "run", "funnel"],
      right: ["prep", "run", "funnel"],
    },
  },
};

const TOUR: Story = {
  id: "tour",
  tab: "관광",
  title: "해외 손님을 더 모으고 싶은 체험 투어 회사가 있습니다.",
  company: "투스텝 투어",
  intro: "서울 한옥에서 다도와 골목 걷기 체험을 여는 작은 회사입니다. 지나다 들어온 외국인은 좋아하는데, 여행을 준비하며 미리 찾아 예약하는 손님은 드뭅니다. 세 가지를 모릅니다.",
  steps: [
    {
      q: "한국에서 체험할 곳을 찾는 여행자는 어디서 묻나요?",
      beats: [
        { owner: "plurank", text: "14개국 AI 답변에 서울 전통 체험과 소규모 투어를 물었을 때 어떤 업체와 출처가 나오는지 찾습니다. 여기까지가 무료 진단입니다." },
        { owner: "microwave", text: "그 결과로 채널을 고릅니다. 미국은 레딧 여행 게시판, 일본은 인스타그램, 이미 한국에 온 외국인은 방한 체험단. 레딧 글은 소속을 밝히고 사람이 직접 답합니다." },
      ],
      link: { label: "시장별 채널 보기", href: "#markets" },
    },
    {
      q: "외국인 손님을 받으려면 등록과 환불 규정은 어떻게 준비하나요?",
      beats: [
        { owner: "plurank", text: "여행업 등록 범위, 환불 규정과 가격 표시, 해외 예약 플랫폼의 입점 정책과 손님 개인정보 처리를 체크리스트로 만들고 변호사 팀원이 먼저 봅니다." },
        { owner: "plurank", text: "다국어 안내문과 약관 문안 준비를 돕습니다. 등록과 플랫폼 계정은 회사 이름으로 합니다." },
      ],
      link: { label: "무료 진단 받기", href: "#contact" },
    },
    {
      q: "예약은 어디서 받고, 손님이 늘었는지 어떻게 보나요?",
      beats: [
        { owner: "microwave", text: "해외 예약 플랫폼에 입점하고 다국어 예약 페이지를 운영합니다. 방한 체험단 후기는 협찬 표시를 달고 올립니다." },
        { owner: "plurank", text: "노출, 클릭, 예약, 후기를 매달 리포트로 보고 다음 채널을 정합니다." },
      ],
      proof: "한 테크 스타트업의 레딧 광고는 3주 남짓 동안 노출 약 260만 회, 클릭 약 1만 6,400회를 냈습니다. 업종마다 결과는 다르지만, 이런 숫자를 매달 보고 다음을 정합니다.",
    },
  ],
  closing: "투스텝 투어가 밟은 순서가 곧 우리가 일하는 순서입니다. 법률 검토와 등록 준비부터 해외 예약까지, 처음부터 끝까지 함께합니다.",
  film: {
    src: "/video/story-tour.mp4",
    poster: "/video/story-tour-poster.jpg",
    captions: [
      { text: "체험은 좋은데 해외에선 아직 모릅니다" },
      { text: "여행자가 어디서 찾는지 봅니다", owner: "plurank" },
      { text: "등록과 환불 규정 준비를 돕습니다", owner: "plurank" },
      { text: "예약 플랫폼부터 실행합니다", owner: "microwave" },
      { text: "후기까지 숫자로 봅니다", owner: "plurank" },
    ],
    seconds: 4.8,
    label: "가상의 체험 투어 회사가 해외 손님 모으기를 준비하는 과정을 보여 주는 애니메이션. 아래 글과 같은 내용입니다.",
    overlay: {
      questions: ["어디서?", "등록은?", "예약은?"],
      scan: { figure: 14, unit: "개국", line: "AI 답변에 서울 전통 체험을 묻고 비교합니다", engines: ["ChatGPT", "Perplexity", "네이버 AI 브리핑"], tag: "무료 진단" },
      prep: { title: "법률 검토와 등록 준비", items: ["여행업 등록 범위 확인", "환불 규정과 가격 표시", "예약 플랫폼 정책과 개인정보"], tag: "변호사 팀원이 먼저 봅니다" },
      run: {
        title: "해외 예약 플랫폼 입점부터",
        pins: [
          { label: "미국 레딧", lat: 39, lon: -98, on: true, dir: "up" },
          { label: "일본 인스타그램", lat: 36, lon: 139, dir: "up" },
          { label: "방한 체험단", lat: 37.5, lon: 127, dir: "down" },
        ],
      },
      funnel: { steps: ["노출", "클릭", "예약", "후기"], check: "AI 답변에 등장", tag: "매달 리포트" },
      order: ["questions", "scan", "prep", "run", "funnel"],
      right: ["prep", "run", "funnel"],
    },
  },
};

const IT: Story = {
  id: "it",
  tab: "IT 서비스",
  title: "해외로 나가고 싶은 소프트웨어 회사가 있습니다.",
  company: "투스텝 소프트",
  intro: "작은 매장의 예약과 재고를 관리하는 앱을 만듭니다. 국내 가입자는 느는데, 영어판을 열기 전에 세 가지를 모릅니다.",
  steps: [
    {
      q: "해외 사용자는 우리 같은 도구를 어디서 찾나요?",
      beats: [
        { owner: "plurank", text: "14개국 AI 답변에 소규모 매장용 예약과 재고 관리 도구를 물었을 때 어떤 서비스와 출처가 나오는지 찾습니다. 여기까지가 무료 진단입니다." },
        { owner: "microwave", text: "그 결과로 채널을 고릅니다. 미국은 레딧 소상공인 게시판과 크리에이터 리뷰, 유럽은 링크드인, 일본은 X. 레딧 글은 개발팀 소속을 밝히고 사람이 직접 답합니다." },
      ],
      link: { label: "시장별 채널 보기", href: "#markets" },
    },
    {
      q: "해외에 열면 개인정보와 약관은 어떻게 준비하나요?",
      beats: [
        { owner: "plurank", text: "개인정보 처리방침(EU GDPR, 미국 CCPA), 이용약관, 앱 마켓 정책, 데이터 보관 위치를 체크리스트로 만들고 변호사 팀원이 먼저 봅니다." },
        { owner: "plurank", text: "영어 약관과 동의 화면 문안 준비를 돕습니다. 앱 마켓 등록과 계약은 회사 이름으로 합니다." },
      ],
      link: { label: "무료 진단 받기", href: "#contact" },
    },
    {
      q: "가입은 늘어도 돈을 내는지, 계속 쓰는지는 어떻게 보나요?",
      beats: [
        { owner: "microwave", text: "레딧에는 개발팀 소속을 밝히고 사람이 직접 답합니다. 크리에이터 리뷰는 협찬 표시를 달아 올리고, 링크드인 광고는 작게 시작합니다." },
        { owner: "plurank", text: "노출, 가입, 유료 전환, 유지를 매달 리포트로 보고 다음 채널을 정합니다." },
      ],
      proof: "한 테크 스타트업의 레딧 광고는 3주 남짓 동안 노출 약 260만 회, 클릭 약 1만 6,400회를 냈습니다. 업종마다 결과는 다르지만, 이런 숫자를 매달 보고 다음을 정합니다.",
    },
  ],
  closing: "투스텝 소프트가 밟은 순서가 곧 우리가 일하는 순서입니다. 법률 검토와 약관 준비부터 해외 유료 전환까지, 처음부터 끝까지 함께합니다.",
  film: {
    src: "/video/story-it.mp4",
    poster: "/video/story-it-poster.jpg",
    captions: [
      { text: "국내 가입자는 느는데 해외는 처음입니다" },
      { text: "사용자가 어디서 찾는지 봅니다", owner: "plurank" },
      { text: "약관과 개인정보 준비를 돕습니다", owner: "plurank" },
      { text: "게시판 답변부터 실행합니다", owner: "microwave" },
      { text: "유료 전환까지 숫자로 봅니다", owner: "plurank" },
    ],
    seconds: 4.8,
    label: "가상의 소프트웨어 회사가 해외 진출을 준비하는 과정을 보여 주는 애니메이션. 아래 글과 같은 내용입니다.",
    overlay: {
      questions: ["어디서?", "약관은?", "전환은?"],
      scan: { figure: 14, unit: "개국", line: "AI 답변에 매장 관리 도구를 묻고 비교합니다", engines: ["ChatGPT", "Perplexity", "네이버 AI 브리핑"], tag: "무료 진단" },
      prep: { title: "법률 검토와 약관 준비", items: ["개인정보 처리방침(GDPR, CCPA)", "이용약관과 앱 마켓 정책", "데이터 보관 위치"], tag: "변호사 팀원이 먼저 봅니다" },
      run: {
        title: "레딧 소상공인 게시판부터",
        pins: [
          { label: "미국 레딧, 크리에이터 리뷰", lat: 39, lon: -98, on: true, dir: "up" },
          { label: "유럽 링크드인", lat: 50, lon: 10, dir: "down" },
          { label: "일본 X", lat: 36, lon: 139, dir: "up" },
        ],
      },
      funnel: { steps: ["노출", "가입", "유료 전환", "유지"], check: "AI 답변에 등장", tag: "매달 리포트" },
      order: ["questions", "scan", "prep", "run", "funnel"],
      right: ["prep", "run", "funnel"],
    },
  },
};

/** 업종 탭 순서. 첫 탭이 처음 보이는 이야기 */
export const STORIES: Story[] = [BEAUTY, MED, FNB, TOUR, IT];

export const OWNERS: Record<Owner, { name: string; role: string; url: string }> = {
  plurank: { name: "Plurank 에이전트", role: "분석과 개선", url: "https://plurank.com" },
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
    a: "업종을 가리지 않습니다. 뷰티뿐 아니라 병의원 해외 마케팅, F&B, 관광, IT 서비스까지 해외 진출과 해외 고객 모으기를 돕습니다.",
  },
  {
    q: "어디까지 맡나요?",
    a: "해외 마케팅과 판매 채널 운영을 함께 맡습니다. 진출국 인증과 등록은 변호사 팀원이 먼저 보고, 체크리스트와 서류 준비까지 돕습니다. 법인 설립, 통관, 물류, 현지 유통은 필요시 협의를 거쳐 진행합니다.",
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
