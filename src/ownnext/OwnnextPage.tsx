import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Check,
  Send,
  Layers,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { trackEvent, trackAdsConversion } from "../lib/gtag";

const EMAIL = "glenn.kim@twostepsahead.co.kr";
const EXAMPLES = [
  {
    id: "knowledge",
    label: "지식·교육",
    title: "쌓아온 노하우를, 배우고 싶은 경험으로.",
    question: "“어떻게 하는지 더 자세히 알려주세요.”",
    offer: "작은 실습 클래스",
    offerText:
      "가장 많이 받은 질문 하나로 첫 커리큘럼을 만듭니다. 수강자의 결과와 후기를 바탕으로 다음 과정을 정합니다.",
    system: ["클래스 소개·신청", "학습 자료·회원 공간", "수강생 문의·안내"],
    operation:
      "신청부터 수강 완료까지 어디에서 막히는지 보고, 내용과 이용 흐름을 개선합니다.",
    outputs: "워크북 / 온라인 클래스 / 멤버십",
    stamp: "Know-how",
    symbol: "Aa",
  },
  {
    id: "lifestyle",
    label: "취향·라이프스타일",
    title: "사람들이 믿는 취향을, 선택하고 싶은 브랜드로.",
    question: "“직접 골라준 걸 구매할 수 있나요?”",
    offer: "취향이 담긴 큐레이션",
    offerText:
      "팬이 찾는 주제와 상품을 좁혀 첫 제안을 만듭니다. 상품 소싱과 고객 안내, 재구매까지 한 흐름으로 설계합니다.",
    system: [
      "브랜드·상품 페이지",
      "주문·고객 관리 연동",
      "구매 후 안내·피드백",
    ],
    operation:
      "콘텐츠에서 상품 탐색과 구매로 이어지는 경로를 보고, 제안과 운영 방식을 다듬습니다.",
    outputs: "큐레이션 숍 / 자체 상품 / 취향 커뮤니티",
    stamp: "Good taste",
    symbol: "&",
  },
  {
    id: "ip",
    label: "창작·캐릭터",
    title: "나만의 세계관을, 계속 만나고 싶은 서비스로.",
    question: "“이 캐릭터를 다른 방식으로 만나고 싶어요.”",
    offer: "팬이 참여하는 콘텐츠",
    offerText:
      "이야기와 캐릭터의 매력을 디지털 상품과 참여 경험으로 확장합니다. 어떤 경험에 기꺼이 참여하는지 작게 확인합니다.",
    system: ["작품·캐릭터 공간", "콘텐츠 열람·이용 관리", "참여·피드백 수집"],
    operation:
      "어떤 콘텐츠를 다시 찾고 어디까지 사용하는지 살펴, 다음 작품과 경험에 반영합니다.",
    outputs: "디지털 콘텐츠 / 캐릭터 경험 / 팬 멤버십",
    stamp: "Your universe",
    symbol: "✳",
  },
];
const FAQS = [
  [
    "아이디어만 있어도 시작할 수 있나요?",
    "네. 지금 만드는 콘텐츠와 팬에게 자주 받는 질문을 알려주세요. 이미 운영하는 사업이 있다면 상품과 고객의 이용 흐름부터 함께 살펴봅니다. 채널 규모에 따른 일률적인 기준보다 주제와 고객의 필요, 함께 실행할 수 있는 범위를 봅니다.",
  ],
  [
    "SaaS는 어떤 방식으로 제공하나요?",
    "사업에 필요한 기능을 먼저 정합니다. 검증된 외부 도구를 연결하거나 전용 웹 서비스와 운영 기능을 구축합니다. 회원·결제·고객 관리 등 포함할 기능과 외부 서비스 이용료, 유지·운영 범위는 제안 단계에서 구체화합니다.",
  ],
  [
    "프로젝트 의뢰와 사업 파트너십은 어떻게 다른가요?",
    "프로젝트는 합의한 기획·구축 범위를 중심으로 진행합니다. 사업 파트너십은 목표가 맞는 경우 출시 이후 운영과 성장까지 역할을 나누어 함께합니다. 비용과 업무 범위, 수익 배분이 필요한 경우의 조건은 사업별로 협의합니다.",
  ],
  [
    "콘텐츠와 브랜드의 권리는 어떻게 정하나요?",
    "기존 콘텐츠·브랜드와 새로 만드는 결과물을 구분하고, 이용 범위와 소유 관계를 시작 전에 합의합니다. 계정 권한, 고객 데이터 관리, 운영 종료 시 인계 방식도 계약에 함께 정리합니다.",
  ],
];

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`on-logo${footer ? " on-logo-footer" : ""}`}
      href="/ownnext/"
      aria-label="OWNNEXT 홈"
    >
      <img src="/ownnext/mark.svg" width="40" height="40" alt="" />
      <span>
        OWNNEXT<small>by TwoStepsAhead</small>
      </span>
    </a>
  );
}

function CreatorContact() {
  const initial = {
    name: "",
    company: "",
    email: "",
    message: "",
    _hp: "",
    topic: "사업모델을 함께 찾고 싶어요",
  };
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const field = (key: keyof typeof initial, value: string) =>
    setForm((old) => ({ ...old, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.email.trim() ||
      form.message.trim().length < 10
    ) {
      setError(
        "이름, 채널·브랜드명, 이메일과 10자 이상의 내용을 입력해 주세요.",
      );
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    trackEvent("inquiry_submit", { interest: "creator", location: "ownnext" });
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          interest: "creator",
          message: `관심 분야: ${form.topic}\n\n${form.message}`,
          _hp: form._hp,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true)
        throw new Error("inquiry_failed");
      setStatus("success");
      trackEvent("generate_lead", { interest: "creator", location: "ownnext" });
      trackAdsConversion("lead");
    } catch {
      setStatus("error");
      setError(
        "문의가 접수되지 않았습니다. 다시 시도하거나 아래 이메일로 보내주세요.",
      );
    }
  }
  return (
    <section className="on-contact" id="contact">
      <div className="on-wrap on-contact-grid">
        <div>
          <p className="on-eyebrow">다음 사업, 같이 만들어볼까요?</p>
          <h2>
            당신의 이야기에서
            <br /> 시작하겠습니다.
          </h2>
          <p className="on-contact-copy">
            어떤 콘텐츠를 만드는지,
            <br /> 팬들이 무엇을 물어보는지 들려주세요.
            <br /> 사업의 첫 가설부터 함께 정리합니다.
          </p>
          <a className="on-email" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <ArrowUpRight size={18} />
          </a>
          <div className="on-contact-mark" aria-hidden="true">
            own
            <br /> what’s
            <br /> next.
          </div>
        </div>
        <div className="on-form-panel">
          {status === "success" ? (
            <div className="on-success" role="status">
              <Check size={42} />
              <h3>이야기가 잘 도착했습니다.</h3>
              <p>남겨주신 {form.email}로 회신드리겠습니다.</p>
              <button
                className="on-button on-button-green"
                onClick={() => {
                  setForm(initial);
                  setStatus("idle");
                }}
              >
                새 문의 작성
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3>크리에이터 사업 상담</h3>
              <p className="on-form-note">* 필수 입력 항목</p>
              <div className="on-form-row">
                <label>
                  이름 *
                  <input
                    disabled={status === "sending"}
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={200}
                    value={form.name}
                    onChange={(e) => field("name", e.target.value)}
                    placeholder="담당자 이름"
                  />
                </label>
                <label>
                  채널·브랜드명 *
                  <input
                    disabled={status === "sending"}
                    name="company"
                    autoComplete="organization"
                    required
                    maxLength={200}
                    value={form.company}
                    onChange={(e) => field("company", e.target.value)}
                    placeholder="준비 중이라면 활동명"
                  />
                </label>
              </div>
              <label>
                이메일 *
                <input
                  disabled={status === "sending"}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  placeholder="회신받을 이메일"
                />
              </label>
              <label>
                지금 가장 필요한 것
                <select
                  disabled={status === "sending"}
                  name="topic"
                  value={form.topic}
                  onChange={(e) => field("topic", e.target.value)}
                >
                  <option>사업모델을 함께 찾고 싶어요</option>
                  <option>SaaS·서비스를 만들고 싶어요</option>
                  <option>함께 운영할 파트너를 찾고 있어요</option>
                  <option>어디서 시작할지 상담하고 싶어요</option>
                </select>
              </label>
              <label>
                만들고 싶은 다음 *
                <textarea
                  disabled={status === "sending"}
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  maxLength={3700}
                  value={form.message}
                  onChange={(e) => field("message", e.target.value)}
                  placeholder="콘텐츠 주제, 채널 링크, 해보고 싶은 사업을 편하게 남겨주세요. (10자 이상)"
                />
              </label>
              <div className="on-trap" aria-hidden="true">
                <label>
                  Leave empty
                  <input
                    disabled={status === "sending"}
                    name="_hp"
                    autoComplete="off"
                    tabIndex={-1}
                    value={form._hp}
                    onChange={(e) => field("_hp", e.target.value)}
                  />
                </label>
              </div>
              <p className="on-privacy">
                주식회사 투스텝스어헤드가 상담 접수와 회신을 위해 입력한 정보를
                확인합니다. 민감한 개인정보나 비공개 고객 정보는 적지 않아도
                됩니다.
              </p>
              {status === "error" && (
                <p className="on-error" role="alert">
                  {error} <a href={`mailto:${EMAIL}`}>이메일 문의</a>
                </p>
              )}
              <button
                className="on-button on-button-green on-submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "보내는 중…" : "사업 상담 보내기"}
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function OwnnextPage() {
  const [selected, setSelected] = useState(0);
  const example = EXAMPLES[selected];
  return (
    <div className="ownnext-site">
      <a className="on-skip" href="#main">
        본문으로 건너뛰기
      </a>
      <header className="on-header">
        <div className="on-wrap on-header-inner">
          <Logo />
          <nav aria-label="주요 메뉴">
            <a href="#approach">함께하는 일</a>
            <a href="#possibilities">사업의 가능성</a>
            <a href="#studio">우리가 만드는 이유</a>
          </nav>
          <a className="on-nav-cta" href="#contact">
            사업 상담
            <ArrowUpRight size={16} />
          </a>
        </div>
      </header>
      <main id="main">
        <section className="on-hero">
          <div className="on-wrap on-hero-grid">
            <div className="on-hero-copy">
              <p className="on-eyebrow">크리에이터 비즈니스 스튜디오</p>
              <h1>
                콘텐츠 다음은,
                <br /> 당신의 사업.
              </h1>
              <p className="on-hero-description">
                팬이 사랑하는 당신의 콘텐츠.
                <br /> 이제 오래 이어갈 수 있는 사업으로 만듭니다.
              </p>
              <p className="on-hero-detail">
                사업모델을 찾고, SaaS를 만들고, 운영을 함께합니다.
                <br /> 크리에이터의 다음을 만드는 파트너, 오운넥스트.
              </p>
              <div className="on-hero-actions">
                <a className="on-button on-button-yellow" href="#contact">
                  내 사업 이야기하기
                  <ArrowUpRight size={19} />
                </a>
                <a className="on-text-link" href="#possibilities">
                  어떤 사업이 가능할까?
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <div
              className="on-hero-art"
              aria-label="나의 콘텐츠와 팬의 신뢰가 나의 사업으로 이어지는 브랜드 그래픽"
            >
              <div className="on-content-sheet">
                <span>From your content</span>
                <div className="on-art-symbol" aria-hidden="true">
                  <span></span>
                  <span></span>
                </div>
                <strong>
                  나의 시선.
                  <br /> 나의 이야기.
                </strong>
                <p>사람들이 당신을 찾는 이유</p>
              </div>
              <div className="on-business-sheet">
                <div className="on-slip-top">
                  <span>To your business</span>
                  <ArrowUpRight size={27} />
                </div>
                <strong>
                  당신의 이름으로
                  <br /> 계속되는 일.
                </strong>
                <div className="on-slip-list">
                  <span>사업모델</span>
                  <span>SaaS</span>
                  <span>함께 운영</span>
                </div>
                <span className="on-slip-brand">OWNNEXT</span>
              </div>
              <div className="on-art-caption">
                <span className="on-small-star" aria-hidden="true">
                  ✳
                </span>
                Own your next business.
              </div>
            </div>
          </div>
          <div className="on-wrap on-hero-bottom">
            <span>좋은 콘텐츠에서, 나다운 사업까지.</span>
            <span>
              오운넥스트 <span aria-hidden="true">↗</span> by TwoStepsAhead
            </span>
          </div>
        </section>

        <section className="on-section on-approach" id="approach">
          <div className="on-wrap">
            <div className="on-section-heading">
              <p className="on-eyebrow">함께하는 일</p>
              <h2>
                만드는 힘에,
                <br /> 사업이 되는 구조를 더합니다.
              </h2>
              <p>
                크리에이터의 강점과 팬의 필요에서 출발합니다.
                <br /> 첫 상품부터 서비스를 만들고 운영하는 일까지 연결합니다.
              </p>
            </div>
            <div className="on-service-rows">
              <article>
                <div className="on-service-icon">
                  <Sparkles aria-hidden="true" />
                </div>
                <div>
                  <p>사업모델 설계</p>
                  <h3>
                    무엇을 팔지보다,
                    <br /> 왜 필요할지부터.
                  </h3>
                </div>
                <div className="on-service-detail">
                  <p>
                    콘텐츠의 반응과 팬이 반복해서 묻는 질문을 살핍니다. 누구에게
                    어떤 가치를 제공할지 정하고, 작게 검증할 첫 상품을
                    설계합니다.
                  </p>
                  <ul>
                    <li>고객·수요 리서치</li>
                    <li>상품·가격 가설</li>
                    <li>첫 출시 계획</li>
                  </ul>
                </div>
              </article>
              <article>
                <div className="on-service-icon">
                  <Layers aria-hidden="true" />
                </div>
                <div>
                  <p>SaaS 제공·구축</p>
                  <h3>
                    좋은 아이디어를,
                    <br /> 사용하는 서비스로.
                  </h3>
                </div>
                <div className="on-service-detail">
                  <p>
                    콘텐츠와 상품을 만나는 웹사이트, 회원 공간, 고객 관리 등
                    사업에 필요한 기능을 구성합니다. 기존 도구의 연결부터 전용
                    서비스 개발까지 함께합니다.
                  </p>
                  <ul>
                    <li>브랜드·상품 경험</li>
                    <li>회원·고객 관리</li>
                    <li>운영 도구·자동화</li>
                  </ul>
                </div>
              </article>
              <article>
                <div className="on-service-icon">
                  <MousePointer2 aria-hidden="true" />
                </div>
                <div>
                  <p>사업 파트너십</p>
                  <h3>
                    출시한 다음에도,
                    <br /> 함께 판단하고 실행합니다.
                  </h3>
                </div>
                <div className="on-service-detail">
                  <p>
                    콘텐츠 발행과 고객의 이용 흐름, 실제 운영을 함께 봅니다.
                    목표와 역할이 맞는 사업은 출시 이후의 개선과 성장까지
                    공동으로 운영합니다.
                  </p>
                  <ul>
                    <li>콘텐츠·마케팅 실행</li>
                    <li>서비스 운영·개선</li>
                    <li>사업별 역할·조건 합의</li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="on-section on-possibilities" id="possibilities">
          <div className="on-wrap">
            <div className="on-section-heading">
              <p className="on-eyebrow">사업의 가능성</p>
              <h2>
                당신이 잘하는 일에서
                <br /> 다음 사업을 찾습니다.
              </h2>
              <p>
                내 콘텐츠와 가까운 유형을 골라보세요.
                <br /> 아이디어가 상품과 서비스로 이어지는 모습을 보여드립니다.
              </p>
            </div>
            <div
              className="on-example-selector"
              role="group"
              aria-label="콘텐츠 유형 선택"
            >
              {EXAMPLES.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={selected === i}
                  aria-controls="business-example"
                  onClick={() => {
                    setSelected(i);
                    trackEvent("creator_model_select", { model: item.id });
                  }}
                >
                  {item.label}
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
            <div
              className="on-example"
              id="business-example"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className={`on-example-poster on-example-${example.id}`}>
                <span>{example.stamp}</span>
                <div className="on-example-symbol" aria-hidden="true">
                  {example.symbol}
                </div>
                <h3>{example.title}</h3>
                <p>{example.outputs}</p>
              </div>
              <div className="on-example-details">
                <div className="on-example-source">
                  <span>팬의 질문에서 출발</span>
                  <p>{example.question}</p>
                </div>
                <ol>
                  <li>
                    <span>첫 제안</span>
                    <div>
                      <h4>{example.offer}</h4>
                      <p>{example.offerText}</p>
                    </div>
                  </li>
                  <li>
                    <span>필요한 SaaS</span>
                    <div>
                      <h4>일할 수 있는 구조</h4>
                      <ul>
                        {example.system.map((item) => (
                          <li key={item}>
                            <Check size={16} aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li>
                    <span>함께 운영</span>
                    <div>
                      <h4>반응을 보고 다음을 결정</h4>
                      <p>{example.operation}</p>
                    </div>
                  </li>
                </ol>
                <p className="on-example-note">
                  이해를 돕기 위한 사업모델 예시입니다. 실제 상품과 기능은
                  콘텐츠·고객·운영 조건에 맞춰 설계합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="on-section on-systems" id="saas">
          <div className="on-wrap on-systems-grid">
            <div>
              <p className="on-eyebrow">사업을 움직이는 SaaS</p>
              <h2>
                크리에이터는
                <br /> 잘하는 일에.
                <br /> 운영은 구조 있게.
              </h2>
              <p>
                상품을 알리는 순간부터 고객을 다시 만나는 순간까지.
                <br /> 필요한 기능을 고르고, 연결하고, 만듭니다.
              </p>
              <a className="on-text-link" href="#contact">
                내 사업에 필요한 기능 상담
                <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="on-system-map">
              <p className="on-system-caption">
                내 브랜드를 중심으로 연결되는 운영
              </p>
              <div className="on-system-center">
                <img src="/ownnext/mark.svg" alt="" width="48" height="48" />
                <strong>나의 브랜드</strong>
                <span>콘텐츠와 고객이 만나는 곳</span>
              </div>
              <div className="on-system-functions">
                <div>
                  <span>고객이 만나는 화면</span>
                  <strong>소개·상품·콘텐츠</strong>
                  <p>
                    브랜드 사이트와 상품 탐색,
                    <br /> 콘텐츠를 이용하는 경험
                  </p>
                </div>
                <div>
                  <span>사업을 관리하는 도구</span>
                  <strong>회원·신청·고객 관리</strong>
                  <p>
                    사업에 맞는 외부 도구 연동과
                    <br /> 필요한 운영 기능의 구축
                  </p>
                </div>
                <div>
                  <span>다음을 결정하는 근거</span>
                  <strong>반응·이용·전환</strong>
                  <p>
                    어디에서 관심을 갖고
                    <br /> 이용을 이어가는지 확인
                  </p>
                </div>
              </div>
              <p className="on-system-note">
                기능·연동·운영 범위는 프로젝트별로 설계합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="on-section on-studio" id="studio">
          <div className="on-wrap">
            <div className="on-studio-heading">
              <div>
                <p className="on-eyebrow">OWNNEXT by TwoStepsAhead</p>
                <h2>
                  콘텐츠도, 제품도.
                  <br /> 직접 만드는 팀이 함께합니다.
                </h2>
              </div>
              <p>
                투스텝스어헤드는 데이터를 분석하고,
                <br /> 콘텐츠를 제작하며, 서비스를 개발·운영합니다.
                <br /> 그 경험을 크리에이터의 사업에 연결합니다.
              </p>
            </div>
            <div className="on-work-grid">
              <a
                href="https://plurank.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="on-work-image on-work-plurank">
                  <img
                    src="/brand/plurank.webp"
                    alt="Plurank의 AI 브랜드 가시성 분석 화면"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </div>
                <div className="on-work-title">
                  <h3>Plurank</h3>
                  <ArrowUpRight size={24} />
                </div>
                <p>
                  고객 질문과 AI 답변에서
                  <br /> 브랜드가 발견되는 경로를 읽습니다.
                </p>
                <span>데이터·고객 이해</span>
              </a>
              <a
                href="https://nextep.ai.kr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="on-work-image on-work-nextep">
                  <img
                    src="/brand/nextep-poster.webp"
                    alt="NextEp 자체 AI 드라마 작품 포스터"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                  <strong>NextEp</strong>
                </div>
                <div className="on-work-title">
                  <h3>다음화</h3>
                  <ArrowUpRight size={24} />
                </div>
                <p>
                  AI 드라마를 만들고
                  <br /> 작품과 회차를 연결하는 플랫폼을 운영합니다.
                </p>
                <span>콘텐츠·플랫폼 운영</span>
              </a>
              <a
                href="https://telling.ai.kr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="on-work-image on-work-telling">
                  <img
                    src="/brand/telling.webp"
                    alt="Telling 개인화 콘텐츠 견생사주 사례"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </div>
                <div className="on-work-title">
                  <h3>Telling</h3>
                  <ArrowUpRight size={24} />
                </div>
                <p>
                  AI 캐릭터와 개인화 콘텐츠를
                  <br /> 사람들이 사용하는 서비스로 만듭니다.
                </p>
                <span>제품 개발·사용 경험</span>
              </a>
            </div>
            <p className="on-work-note">
              투스텝스어헤드가 직접 만든 제품·콘텐츠입니다. 크리에이터 고객의
              사업 성과 사례와는 구분됩니다.
            </p>
            <a className="on-text-link" href="/">
              투스텝스어헤드의 더 많은 작업
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>

        <section className="on-section on-partnership" id="partnership">
          <div className="on-wrap">
            <div className="on-section-heading">
              <p className="on-eyebrow">함께 시작하는 방법</p>
              <h2>
                당신의 다음에 맞게,
                <br /> 우리의 역할도 정합니다.
              </h2>
            </div>
            <div className="on-partner-modes">
              <article>
                <span>필요한 만큼, 분명하게</span>
                <h3>기획·구축 프로젝트</h3>
                <p>
                  사업의 시작점과 필요한 결과물이 정해져 있다면.
                  <br /> 리서치, 사업모델 설계, 서비스 구축의 범위를 정해
                  함께합니다.
                </p>
              </article>
              <article>
                <span>같은 목표로, 더 길게</span>
                <h3>공동 사업 파트너</h3>
                <p>
                  함께 만들고 운영할 팀이 필요하다면.
                  <br /> 목표와 역할을 맞추고 출시 이후의 운영과 개선까지
                  함께합니다.
                </p>
              </article>
            </div>
            <ol className="on-steps">
              <li>
                <span>01</span>
                <h3>이야기 나누기</h3>
                <p>
                  콘텐츠와 팬, 만들고 싶은
                  <br /> 사업의 방향을 듣습니다.
                </p>
              </li>
              <li>
                <span>02</span>
                <h3>실험 설계하기</h3>
                <p>
                  고객에게 제안할 가치와
                  <br /> 첫 실험의 범위를 정합니다.
                </p>
              </li>
              <li>
                <span>03</span>
                <h3>구조 합의하기</h3>
                <p>
                  역할·비용·권리와
                  <br /> 운영 조건을 구체화합니다.
                </p>
              </li>
              <li>
                <span>04</span>
                <h3>만들고 개선하기</h3>
                <p>
                  상품과 서비스를 출시하고
                  <br /> 실제 반응으로 다듬습니다.
                </p>
              </li>
            </ol>
            <p className="on-partner-note">
              협업 방식과 비용, 필요한 경우 수익 배분은 사업별로 협의합니다.
              콘텐츠·브랜드 권리와 계정·데이터 관리 범위도 시작 전에 함께
              정리합니다.
            </p>
          </div>
        </section>

        <section className="on-section on-faq">
          <div className="on-wrap on-faq-grid">
            <h2>
              궁금한 점부터
              <br /> 풀어볼까요?
            </h2>
            <div>
              {FAQS.map(([question, answer]) => (
                <details key={question}>
                  <summary>
                    {question}
                    <Plus size={20} aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <CreatorContact />
      </main>
      <footer className="on-footer">
        <div className="on-wrap">
          <div className="on-footer-top">
            <Logo footer />
            <p>콘텐츠 다음은, 당신의 사업.</p>
            <a href="/">
              투스텝스어헤드
              <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="on-footer-bottom">
            <p>
              <strong>주식회사 투스텝스어헤드</strong>
              <br /> 대표 김건희 · 사업자등록번호 319-87-03770
              <br /> 서울특별시 마포구 양화로 186, 6층 607호
              <br /> 통신판매업신고 2025-서울강남-05963
            </p>
            <p>
              OWNNEXT는 투스텝스어헤드의 크리에이터 사업 브랜드입니다.
              <br /> © 2026 TwoStepsAhead Co., Ltd.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
