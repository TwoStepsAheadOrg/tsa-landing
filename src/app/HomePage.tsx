import { useState } from "react";
import {
  ArrowDown, ArrowUpRight, Plus, Download, Heart, MessageCircle,
  Send, Bookmark, MoreHorizontal,
} from "lucide-react";
import { BRAND, SERVICE_ITEMS, WORKS, CHANNELS, PROCESS, INSTAGRAM_CASE, COLLABORATIONS } from "./brand";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { BrandMark } from "./components/BrandMark";
import { BrandContact } from "./components/BrandContact";
import { PartnerMarquee } from "./components/PartnerMarquee";
import { trackEvent } from "@/lib/gtag";
function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="데이터에서 콘텐츠로: 인스타그램 스타일의 화면에 담은 AI 모델 RIN"
    >
      <figure className="hero-data-artwork">
        <img
          src="/brand/data-to-creative.webp"
          alt="질문과 데이터를 콘텐츠로 연결하는 과정을 표현한 파란 유리 구조물"
          width="1374"
          height="1145"
        />
        <figcaption>데이터가 콘텐츠로.</figcaption>
      </figure>
      <figure className="hero-phone">
        <div className="phone-shell">
          <div className="phone-speaker" aria-hidden="true"></div>
          <div className="phone-feed">
            <div className="phone-feed-top">
              <span>Instagram</span>
              <small>콘텐츠 시안</small>
            </div>
            <div className="phone-post-author">
              <span className="phone-avatar" aria-hidden="true">R</span>
              <div><strong>RIN</strong><span>AI model & character</span></div>
              <MoreHorizontal size={19} aria-hidden="true" />
            </div>
            <img
              className="phone-post-image"
              src="/brand/rin-portrait.webp"
              alt="TSA가 만든 AI 가상 뷰티 캐릭터 RIN의 미러 포트레이트"
              width="800"
              height="1200"
            />
            <div className="phone-post-actions" aria-hidden="true">
              <Heart /><MessageCircle /><Send /><Bookmark />
            </div>
            <div className="phone-post-caption">
              <strong>RIN</strong><span>하나의 인물, 이어지는 이야기.</span>
            </div>
          </div>
          <div className="phone-home-indicator" aria-hidden="true"></div>
        </div>
        <figcaption>RIN · AI 가상 모델</figcaption>
      </figure>
    </div>
  );
}
function WorkVisual({ work }: { work: (typeof WORKS)[number] }) {
  if (work.theme === "microwave")
    return (
      <div className="work-visual microwave-visual" aria-hidden="true">
        <span className="mw-word">MICROWAVE</span>
        <div className="conversation">
          <span>고객은 무엇을 묻고 있을까?</span>
          <span>우리 브랜드가 답할 차례.</span>
        </div>
        <span className="visual-caption">
          글로벌 인사이트를 현지의 콘텐츠로
        </span>
      </div>
    );
  if (work.theme === "nextep")
    return (
      <div className="work-visual nextep-visual">
        <div>
          <span>다음화</span>
          <p>
            이야기의
            <br />
            다음이 있는 곳.
          </p>
          <small>AI drama platform</small>
        </div>
        <img
          src={work.image!}
          alt={work.alt}
          width="360"
          height="480"
          loading="lazy"
        />
      </div>
    );
  if (work.theme === "telling")
    return (
      <div className="work-visual telling-visual">
        <span>
          Telling<small>나의 이야기가 되는 콘텐츠</small>
        </span>
        <img
          src={work.image!}
          alt={work.alt}
          width="720"
          height="960"
          loading="lazy"
        />
      </div>
    );
  return (
    <div className={`work-visual ${work.theme}-visual`}>
      <img
        src={work.image!}
        alt={work.alt}
        width={work.theme === "rin" ? 1000 : 754}
        height={work.theme === "rin" ? 667 : 753}
        loading="lazy"
      />
      {work.theme === "plurank" && (
        <span className="visual-caption">
          서비스 화면 예시 · 개별 고객의 성과 수치가 아닙니다
        </span>
      )}
    </div>
  );
}
function InstagramCase() {
  return (
    <article className="instagram-case" id="jeonseolirae">
      <div className="instagram-reels">
        {INSTAGRAM_CASE.reels.map((reel) => (
          <a key={reel.href} href={reel.href} target="_blank" rel="noopener noreferrer"
            aria-label={`${reel.title} 릴스 보기 (새 탭)`}>
            <figure>
              <img src={reel.image} alt={`전설이래 AI 애니메이션: ${reel.title}`}
                width="1080" height="1920" loading="lazy" />
              <figcaption><span>표시 조회수 {reel.views}</span><ArrowUpRight size={17} /></figcaption>
            </figure>
          </a>
        ))}
      </div>
      <div className="instagram-case-copy">
        <span className="section-label">AI 콘텐츠 제작·운영 사례</span>
        <h3>{INSTAGRAM_CASE.name}</h3>
        <h4>{INSTAGRAM_CASE.periodHighlight}<br />릴스 조회수 약 10.1만.</h4>
        <p className="instagram-case-description">{INSTAGRAM_CASE.description}</p>
        <dl className="instagram-case-metrics">
          {INSTAGRAM_CASE.metrics.map((metric) => (
            <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>
          ))}
        </dl>
        <p className="source-note">{INSTAGRAM_CASE.sourceNote}</p>
        <a className="inline-link" href={INSTAGRAM_CASE.href} target="_blank" rel="noopener noreferrer">
          {INSTAGRAM_CASE.handle}에서 보기<ArrowUpRight size={17} />
        </a>
      </div>
    </article>
  );
}
export function HomePage() {
  const [filter, setFilter] = useState("전체");
  const [interest, setInterest] = useState({ value: "", revision: 0 });
  const visible = WORKS.filter(
    (work) => filter === "전체" || work.category === filter,
  );
  const showInstagramCase = filter !== "데이터·마케팅";
  return (
    <div className="brand-site" id="top">
      <SiteNav />
      <main id="main-content">
        <section className="hero-section wrap">
          <div className="hero-copy">
            <p className="hero-kicker">데이터로 읽고, 콘텐츠로 움직입니다.</p>
            <h1>
              데이터 기반으로
              <br />
              AI 콘텐츠를 만들고,
              <br />
              AI가 좋아하는
              <br />
              광고를 만듭니다.
            </h1>
            <p className="hero-description">{BRAND.description}</p>
            <div className="hero-actions">
              <a href="#work" className="brand-button primary">
                실제 작업 보기
                <ArrowDown size={18} />
              </a>
              <a
                href={BRAND.pdf}
                download
                className="brand-button text-button"
                onClick={() =>
                  trackEvent("company_profile_download", { location: "hero" })
                }
              >
                회사 소개서
                <Download size={17} />
              </a>
            </div>
          </div>
          <HeroArt />
        </section>
        <PartnerMarquee />
        <section className="promise-section wrap" id="studio">
          <div className="section-heading">
            <span className="section-label">우리가 보는 브랜드의 다음</span>
            <h2>
              사람의 관심과
              <br />
              AI의 선택을 함께 설계합니다.
            </h2>
          </div>
          <div className="promise-grid">
            <div>
              <span className="step-name">사람에게는</span>
              <h3>보고 싶은 이야기.</h3>
              <p>
                브랜드의 장점을 설명하는 데서 한 걸음 더.
                <br />
                멈춰 보고, 기억하고, 대화하게 만드는
                <br />
                콘텐츠를 만듭니다.
              </p>
            </div>
            <Plus className="promise-plus" size={38} aria-hidden="true" />
            <div>
              <span className="step-name">AI에게는</span>
              <h3>참고할 수 있는 근거.</h3>
              <p>
                고객의 질문에 답하는 정보와 분명한 출처.
                <br />
                AI가 브랜드를 이해하고 인용할 수 있도록
                <br />
                콘텐츠의 구조를 설계합니다.
              </p>
            </div>
          </div>
          <p className="promise-definition">
            우리가 말하는 ‘AI가 좋아하는 광고’는 고객에게 유용하고, AI가
            이해하기 쉬운 브랜드 콘텐츠입니다.
          </p>
        </section>
        <section className="services-section" id="services">
          <div className="wrap">
            <div className="section-heading split-heading">
              <div>
                <span className="section-label">우리가 하는 일</span>
                <h2>
                  브랜드의 목표에 맞춰
                  <br />
                  만들고, 연결합니다.
                </h2>
              </div>
              <p>
                콘텐츠 제작부터 AI 검색과 글로벌 커뮤니티까지.
                <br />
                필요한 지점에서 시작해 하나의 흐름으로 연결합니다.
              </p>
            </div>
            <div className="services-list">
              {SERVICE_ITEMS.map((service) => (
                <article key={service.title} className="service-row">
                  <div>
                    <h3>{service.title}</h3>
                    <p className="service-subtitle">{service.subtitle}</p>
                  </div>
                  <div>
                    <p className="service-description">{service.text}</p>
                    <ul>
                      {service.outputs.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <p className="service-note">{service.note}</p>
                  </div>
                  <a
                    href="#contact"
                    className="service-link"
                    aria-label={`${service.title} 문의`}
                    onClick={() =>
                      setInterest((previous) => ({
                        value: service.interest,
                        revision: previous.revision + 1,
                      }))
                    }
                  >
                    <ArrowUpRight size={26} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="work-section wrap" id="work">
          <div className="section-heading split-heading">
            <div>
              <span className="section-label">실제 작업</span>
              <h2>
                직접 만들고,
                <br />
                세상에 내놓습니다.
              </h2>
            </div>
            <div
              className="work-filters"
              role="group"
              aria-label="작업 분야 필터"
            >
              {["전체", "콘텐츠", "데이터·마케팅"].map((x) => (
                <button
                  type="button"
                  aria-pressed={filter === x}
                  key={x}
                  onClick={() => setFilter(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <p className="sr-only" role="status">
            {visible.length + (showInstagramCase ? 1 : 0)}개의 작업이 표시됩니다.
          </p>
          <div className="work-grid">
            {visible.map((work) => (
              <article key={work.id} className={`work-item work-${work.theme}`}>
                <a
                  className="work-image-link"
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${work.cta} (새 탭)`}
                >
                  <WorkVisual work={work} />
                  <span className="work-open">
                    <ArrowUpRight size={24} />
                  </span>
                </a>
                <div className="work-meta">
                  <h3>{work.name}</h3>
                  <span>{work.kind}</span>
                </div>
                <h4>{work.title}</h4>
                <p>{work.description}</p>
                <a
                  className="inline-link"
                  href={work.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {work.cta}
                  <ArrowUpRight size={15} />
                </a>
              </article>
            ))}
          </div>
          {showInstagramCase && <InstagramCase />}
          <div className="channels-area">
            <div>
              <h3>세 개의 채널, 서로 다른 이야기.</h3>
              <p>
                한국어·일본어 드라마와 SF·미스터리 콘텐츠를 직접 운영합니다.
              </p>
            </div>
            <div className="channels-grid">
              {CHANNELS.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={channel.image}
                    alt={`${channel.name} 채널 화면, 2026년 10월 8일 캡처`}
                    width="1280"
                    height="720"
                    loading="lazy"
                  />
                  <span>
                    <strong>{channel.name}</strong>
                    <ArrowUpRight size={18} />
                  </span>
                  <small>{channel.lang}</small>
                  <strong className="channel-subscribers">현재 구독자 {channel.subscribers}명</strong>
                  {channel.periodHighlight && (
                    <strong className="channel-period">{channel.periodHighlight}</strong>
                  )}
                </a>
              ))}
            </div>
            <p className="source-note">현재 구독자: 2026.10.11 YouTube 공개 표시값 · 채널 화면과 1주일 성과: 2026.10.08 캡처</p>
          </div>
        </section>
        <section className="data-section" id="approach">
          <div className="wrap data-grid">
            <div className="section-heading">
              <span className="section-label">데이터가 만드는 차이</span>
              <h2>
                만들기 전에 묻고,
                <br />
                발행한 뒤에
                <br />
                다시 확인합니다.
              </h2>
              <p>
                Plurank로 AI 답변 속 브랜드 언급과 인용 출처를 관측합니다.
                데이터를 ‘얼마나 모았는가’에서 멈추지 않고, ‘다음에 무엇을 만들
                것인가’로 연결합니다.
              </p>
              <a
                href="https://plurank.com/"
                className="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plurank 알아보기
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="data-evidence">
              <div className="data-stats">
                <div>
                  <strong>
                    14<span>개국</span>
                  </strong>
                  <p>국가·언어별 질문과 답변</p>
                </div>
                <div>
                  <strong>
                    7<span>개 AI 플랫폼</span>
                  </strong>
                  <p>브랜드 언급과 인용 출처</p>
                </div>
              </div>
              <p className="source-note">2026.09 자체 운영자료 기준</p>
              <details className="pluora-note">
                <summary>
                  Pluora는 무엇인가요?
                  <Plus size={17} />
                </summary>
                <p>
                  관측 데이터를 바탕으로 발행 전 콘텐츠의 인용 가능성을 예측하기
                  위해 학습·개발 중인 모델입니다. 현재 운영하는 Plurank의 관측
                  기능과 구분됩니다.
                </p>
              </details>
            </div>
          </div>
        </section>
        <section className="collaboration-section wrap" id="collaborations" aria-labelledby="collaboration-heading">
          <div className="section-heading split-heading">
            <div>
              <span className="section-label">협업 이력</span>
              <h2 id="collaboration-heading">함께한 브랜드와<br />파트너.</h2>
            </div>
            <p>브랜드와 에이전시의 과제를<br />함께 풀어갑니다.</p>
          </div>
          <div className="collaboration-grid">
            {COLLABORATIONS.map((company) => (
              <article className="collaboration-card" key={company.name}>
                <div className="collaboration-status">
                  {company.recent && <span>최근 협업</span>}
                </div>
                <div className="collaboration-logo">
                  {company.logo ? (
                    <img src={company.logo} alt={`${company.name} 로고`} width={company.width} height={company.height} loading="lazy" />
                  ) : <strong>{company.name}</strong>}
                </div>
                <h3>{company.name}</h3>
                {company.scope && <p>{company.scope}</p>}
              </article>
            ))}
          </div>
          <p className="source-note">협업 이력: 2026.10 회사 제공 자료 기준. 삼성 Galaxy S26 관련 데이터 공급·분석은 어센트AI 협업으로 수행했습니다.</p>
        </section>
        <section className="process-section wrap" id="journey">
          <div className="section-heading">
            <span className="section-label">함께 일하는 방식</span>
            <h2>
              한 번의 제작이
              <br />
              다음 실행의 근거가 되도록.
            </h2>
          </div>
          <ol className="process-list">
            {PROCESS.map((step, index) => (
              <li key={step.title}>
                <span className="process-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <span className="process-output">{step.output}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="team-section" id="team">
          <div className="wrap">
            <div className="team-heading">
              <div className="section-heading">
                <span className="section-label">투스텝스어헤드 팀</span>
                <h2>
                  데이터를 읽는 사람과
                  <br />
                  만드는 사람이
                  <br />한 팀에 있습니다.
                </h2>
              </div>
              <div className="team-type">
                <span>기획</span>
                <span>디자인</span>
                <span>개발</span>
                <span>운영</span>
                <BrandMark />
              </div>
            </div>
            <div className="team-details">
              <p>
                기획부터 콘텐츠 제작, 서비스 개발과 운영까지.
                <br />
                서로 다른 전문성을 가진 8명이 한 흐름으로 일합니다.
                <small>팀 구성: 2026.10 회사 소개서 기준</small>
              </p>
              <div>
                <h3>
                  김건희 <span>Founder / CEO</span>
                </h3>
                <p>
                  연쇄 창업·엑시트 경험
                  <br />
                  AI·백엔드 개발, 제품 기획
                </p>
              </div>
              <div>
                <h3>
                  김지현 <span>Founder / COO</span>
                </h3>
                <p>
                  B2B 운영 8년
                  <br />
                  Series A·B 투자 유치, 조직 운영 경험
                </p>
              </div>
            </div>
            <div className="capability-block" id="solutions">
              <div>
                <h3>콘텐츠를 실제 서비스로 만드는 기술.</h3>
                <p>
                  AI 에이전트와 업무 자동화, 웹·앱·CRM 구축, 기업 AI 교육까지
                  함께합니다.
                </p>
              </div>
              <details>
                <summary>
                  기술·운영 역량 살펴보기
                  <Plus size={20} />
                </summary>
                <div className="capability-grid">
                  <div>
                    <h4>시스템 구축</h4>
                    <p>
                      ChargeFLOW 전기차 충전 관제, K-Trip ONE 관광 앱 등 실제
                      업무와 서비스를 개발해 왔습니다.
                    </p>
                  </div>
                  <div>
                    <h4>직접 운영하는 제품</h4>
                    <p>
                      <a
                        href="https://www.woojoocall.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        우주콜
                      </a>{" "}
                      AI 전화 응대
                      <br />
                      <a
                        href="https://boim.twostepsahead.co.kr"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        보임
                      </a>{" "}
                      AI 브리핑·플레이스 모니터링
                      <br />
                      <a
                        href="https://awayedition.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        어웨이에디션
                      </a>{" "}
                      도시 가이드
                    </p>
                  </div>
                  <div id="education">
                    <h4>기업 AI 교육</h4>
                    <p>
                      리더 특강, 부서별 실무 워크숍, 개발자 교육. 실제 제품을
                      만든 경험을 업무에 연결합니다.
                    </p>
                    <a
                      className="inline-link"
                      href="#contact"
                      onClick={() =>
                        setInterest((previous) => ({
                          value: "edu",
                          revision: previous.revision + 1,
                        }))
                      }
                    >
                      교육 문의
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              </details>
            </div>
            <a className="inline-link team-careers" href="/careers/">
              함께할 동료를 찾습니다
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="creator-business-section" id="creator-business">
          <div className="wrap creator-business-grid">
            <div className="creator-business-copy">
              <span className="section-label">크리에이터 사업</span>
              <h2>콘텐츠를 만들고,<br />발견되게 하고,<br />사업으로 이어갑니다.</h2>
              <p>크리에이터의 콘텐츠와 팬의 신뢰가 오래 이어지는 사업이 되도록.<br /> 사업모델 설계부터 SaaS 제공·구축, 공동 운영까지 함께합니다.</p>
              <a className="brand-button creator-business-cta" href="/ownnext/" onClick={() => trackEvent("creator_business_visit", { location: "company" })}>OWNNEXT 알아보기<ArrowUpRight size={18} /></a>
            </div>
            <a className="creator-business-brand" href="/ownnext/" aria-label="OWNNEXT 크리에이터 비즈니스 스튜디오">
              <img src="/ownnext/mark.svg" width="88" height="88" alt="" loading="lazy" />
              <strong>OWNNEXT</strong><span>오운넥스트 · by TwoStepsAhead</span>
              <p>콘텐츠 다음은,<br />당신의 사업.</p>
              <div><span>사업모델 설계</span><span>SaaS 제공·구축</span><span>공동 운영</span></div>
            </a>
          </div>
        </section>
        <BrandContact interest={interest} />
      </main>
      <SiteFooter />
    </div>
  );
}
