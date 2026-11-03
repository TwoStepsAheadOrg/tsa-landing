import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, BadgeCheck, Menu, Plus, RotateCcw, X } from "lucide-react";
import { BRAND_NAV } from "./brand";
import { HERO, OWNERS, FLOW, MARKETS, FAQ, FACTS, STORY } from "./global";
import type { Owner } from "./global";
import { SiteFooter } from "./components/SiteFooter";
import { BrandLogo } from "./components/BrandMark";
import { BrandContact } from "./components/BrandContact";
import { PartnerMarquee } from "./components/PartnerMarquee";
import { HeroGlobe } from "./components/HeroGlobe";
import { StoryOverlay } from "./components/StoryOverlay";
import { trackEvent } from "@/lib/gtag";

function OwnerTag({ owner }: { owner: Owner }) {
  return <span className={`gx-owner is-${owner}`}>{OWNERS[owner].name}</span>;
}

function StoryFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [still, setStill] = useState(false);
  const { film } = STORY;
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    if (reduce) {
      el.pause();
      return;
    }
    // 영상 길이를 자막 수로 나눠 장면을 정한다(길이를 모르면 film.seconds). 컷 0.35초 전에 위 글자를 먼저 내린다
    const n = film.captions.length;
    let frame = 0;
    const tick = () => {
      const part = Number.isFinite(el.duration) && el.duration > 0 ? el.duration / n : film.seconds;
      const beat = Math.min(n - 1, Math.floor(el.currentTime / part));
      setActive(beat);
      setLeaving(el.currentTime - beat * part > part - 0.35);
      frame = requestAnimationFrame(tick);
    };
    // 영상을 못 불러오면 첫 장면 그림과 자막만 보여 준다
    const fail = () => setStill(true);
    el.addEventListener("error", fail, true);
    frame = requestAnimationFrame(tick);
    el.play().catch(() => undefined);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("error", fail, true);
    };
  }, [film]);
  return (
    <figure className={`gx-film${still ? " is-still" : ""}`}>
      <div className="gx-film-stage">
        <video
          ref={video}
          muted
          loop
          playsInline
          autoPlay={!still}
          preload="metadata"
          poster={film.poster}
          aria-label="가상의 화장품 회사가 해외 진출을 준비하는 과정을 보여 주는 애니메이션. 아래 글과 같은 내용입니다."
        >
          <source src={film.src} type="video/mp4" />
        </video>
        <StoryOverlay beat={still ? 0 : active} leaving={!still && leaving} />
      </div>
      <ol className="gx-film-steps">
        {film.captions.map((c, i) => (
          <li key={c.text} className={!still && i === active ? "is-active" : undefined}>
            <span className="gx-film-no">{i + 1}</span>
            <span className="gx-film-text">{c.text}</span>
            {c.owner && <OwnerTag owner={c.owner} />}
          </li>
        ))}
      </ol>
    </figure>
  );
}

function GxNav() {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  // 첫 화면(어두운 지구본)을 지나면 머리글을 밝은 색으로 바꾼다
  useEffect(() => {
    const hero = document.getElementById("gx-hero");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setLight(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={`gx-header${light || open ? " is-light" : ""}`}>
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>
      <div className="gx-nav gx-wrap">
        <a className="gx-home" href="#top" aria-label="TwoStepsAhead 홈">
          <BrandLogo />
        </a>
        <nav className="gx-nav-links" aria-label="주요 메뉴">
          {BRAND_NAV.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="gx-nav-actions">
          <a className="gx-nav-cta" href="#contact">
            문의하기
          </a>
          <button
            className="gx-menu"
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="gx-mobile-nav"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="gx-mobile-nav" className="gx-mobile-nav gx-wrap" aria-label="모바일 메뉴">
          {BRAND_NAV.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="/careers/">채용</a>
        </nav>
      )}
    </header>
  );
}

export function HomePage() {
  const [interest, setInterest] = useState({ value: "", revision: 0 });
  const ask = (value: string, location: string) => {
    setInterest((previous) => ({ value, revision: previous.revision + 1 }));
    trackEvent("service_interest_select", { interest: value, location });
  };

  return (
    <div className="gx" id="top">
      <GxNav />
      <main id="main-content">
        <section className="gx-hero" id="gx-hero" aria-labelledby="gx-hero-title">
          <HeroGlobe />
          <div className="gx-hero-copy gx-wrap">
            <ul className="gx-hero-badges" aria-label="인증">
              {HERO.badges.map((badge) => (
                <li key={badge}>
                  <BadgeCheck size={15} aria-hidden="true" />
                  {badge}
                </li>
              ))}
            </ul>
            <h1 id="gx-hero-title">
              <span className="gx-hero-main" lang="en">{HERO.title}</span>
              <span className="gx-hero-sub">{HERO.sub}</span>
            </h1>
            <p className="gx-hero-lead">{HERO.lead}</p>
            <div className="gx-hero-actions">
              <a className="gx-button is-primary" href="#contact" onClick={() => ask("global", "hero")}>
                무료 진단 받기
              </a>
              <a className="gx-button is-quiet" href="#story">
                서비스 보기
              </a>
            </div>
          </div>
        </section>

        <section className="gx-section gx-story" id="story" aria-labelledby="gx-story-title">
          <div className="gx-wrap">
            <h2 id="gx-story-title">{STORY.title}</h2>
            <p className="gx-intro">
              <strong>{STORY.company}</strong>
              <span className="gx-story-tag">가상의 회사</span>
              {STORY.intro}
            </p>
            <StoryFilm />
            <div className="gx-story-grid">
              <ol className="gx-story-questions" aria-hidden="true">
                {STORY.steps.map((step, i) => (
                  <li key={step.q}>
                    <span>{i + 1}</span>
                    {step.q}
                  </li>
                ))}
              </ol>
              <div className="gx-story-answers">
                {STORY.steps.map((step, i) => (
                  <article key={step.q}>
                    <h3>
                      <span>{i + 1}</span>
                      {step.q}
                    </h3>
                    {step.beats.map((beat) => (
                      <p key={beat.text}>
                        {beat.owner && <OwnerTag owner={beat.owner} />}
                        {beat.text}
                      </p>
                    ))}
                    {step.proof && (
                      <div className="gx-story-proof">
                        <span>실제 사례</span>
                        <p>{step.proof}</p>
                      </div>
                    )}
                    {step.link && (
                      <a className="gx-story-link" href={step.link.href}>
                        {step.link.label}
                        <ArrowDown size={15} aria-hidden="true" />
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <p className="gx-story-closing">{STORY.closing}</p>
            <div className="gx-industries">
              <p>
                <strong>{STORY.industries.title}</strong> {STORY.industries.line}
              </p>
              <ul>
                {STORY.industries.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="gx-section gx-how" id="how" aria-labelledby="gx-how-title">
          <div className="gx-wrap">
            <h2 id="gx-how-title">분석은 Plurank, 실행은 MICROWAVE.</h2>
            <p className="gx-intro">해외 마케팅 전문기업 투스텝스어헤드는 두 브랜드로 나눠 맡고, 한 팀이 끝까지 봅니다.</p>

            <div className="gx-flow-wrap">
              <span className="gx-flow-loop" aria-hidden="true">
                <span>반복</span>
              </span>
              <ol className="gx-flow">
                {FLOW.map((step, i) => (
                  <li key={step.title} className={`is-${step.owner}`}>
                    <span className="gx-flow-dot" aria-hidden="true">{i + 1}</span>
                    <h3>{step.title}</h3>
                    <p className="gx-flow-line">{step.line}</p>
                    <OwnerTag owner={step.owner} />
                    <ul className="gx-chips" aria-label={`${step.title} 서비스`}>
                      {step.chips.map((chip) => (
                        <li key={chip.name}>
                          {chip.href ? (
                            <a href={chip.href} target="_blank" rel="noopener">
                              {chip.name}
                              <ArrowUpRight size={12} aria-hidden="true" />
                            </a>
                          ) : (
                            chip.name
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <p className="gx-flow-again">
                <RotateCcw size={15} aria-hidden="true" />
                실행한 결과를 다시 재서 다음 실행에 반영합니다.
              </p>
            </div>

            <p className="gx-how-more">
              자세한 내용은{" "}
              <a href="https://plurank.com" target="_blank" rel="noopener" onClick={() => trackEvent("brand_site_open", { brand: "plurank" })}>
                plurank.com
              </a>
              과{" "}
              <a href="https://microwave.ai.kr" target="_blank" rel="noopener" onClick={() => trackEvent("brand_site_open", { brand: "microwave" })}>
                microwave.ai.kr
              </a>
              에 있습니다.
            </p>
          </div>
        </section>

        <section className="gx-section gx-markets" id="markets" aria-labelledby="gx-markets-title">
          <div className="gx-wrap">
            <h2 id="gx-markets-title">시장마다 채널이 다릅니다.</h2>
            <div className="gx-table-wrap">
              <table className="gx-table">
                <thead>
                  <tr>
                    <th scope="col">시장</th>
                    <th scope="col">채널</th>
                    <th scope="col">하는 일</th>
                    <th scope="col">담당</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKETS.map((row) => (
                    <tr key={row.market}>
                      <th scope="row">{row.market}</th>
                      <td>{row.channel}</td>
                      <td>{row.what}</td>
                      <td><OwnerTag owner={row.owner} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <PartnerMarquee />

        <section className="gx-section gx-faq" id="faq" aria-labelledby="gx-faq-title">
          <div className="gx-wrap gx-faq-grid">
            <div>
              <h2 id="gx-faq-title">자주 묻는 질문</h2>
              <ul className="gx-facts">
                {FACTS.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
            <div className="gx-faq-list">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>
                    <span>{item.q}</span>
                    <Plus size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <BrandContact interest={interest} />
      </main>
      <SiteFooter />
    </div>
  );
}
