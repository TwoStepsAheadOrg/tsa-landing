import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, BadgeCheck, Menu, Plus, RotateCcw, X } from "lucide-react";
import { BRAND_NAV } from "./brand";
import { HERO, OWNERS, FLOW, MARKETS, FAQ, FACTS, STORIES, STORY_INDUSTRIES } from "./global";
import type { Owner, Story } from "./global";
import { SiteFooter } from "./components/SiteFooter";
import { BrandLogo } from "./components/BrandMark";
import { BrandContact } from "./components/BrandContact";
import { PartnerMarquee } from "./components/PartnerMarquee";
import { HeroGlobe } from "./components/HeroGlobe";
import { StoryOverlay } from "./components/StoryOverlay";
import { trackEvent } from "@/lib/gtag";
import { isSectionSent, setInquiryIntentFromLink, trackOpenAiSection } from "@/lib/oaiq";
import type { SectionKey } from "@/lib/oaiq";

function OwnerTag({ owner }: { owner: Owner }) {
  return <span className={`gx-owner is-${owner}`}>{OWNERS[owner].name}</span>;
}

/** 영상 길이를 자막 수로 나눈 한 장면 길이(길이를 모르면 film.seconds) */
function partOf(el: HTMLVideoElement, film: Story["film"]) {
  return Number.isFinite(el.duration) && el.duration > 0 ? el.duration / film.captions.length : film.seconds;
}

function StoryFilm({ story }: { story: Story }) {
  const video = useRef<HTMLVideoElement>(null);
  const steps = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [still, setStill] = useState(false);
  // 카드를 누를 때마다 바꿔 위 글자 애니메이션을 처음부터 다시 그린다
  const [take, setTake] = useState(0);
  const { film } = story;
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    if (reduce) {
      el.pause();
      return;
    }
    // 장면을 정하고, 컷 0.35초 전에 위 글자를 먼저 내린다. 지금 카드 밑줄(--p)은 장면 안에서 지난 비율
    const n = film.captions.length;
    let frame = 0;
    const tick = () => {
      const part = partOf(el, film);
      const beat = Math.min(n - 1, Math.floor(el.currentTime / part));
      setActive(beat);
      setLeaving(el.currentTime - beat * part > part - 0.35);
      steps.current?.style.setProperty("--p", String(Math.min(1, (el.currentTime - beat * part) / part)));
      frame = requestAnimationFrame(tick);
    };
    // 영상을 못 불러오면 첫 장면 그림과 자막만 보여 준다. 카드를 누르면 위 글자만 그 장면으로 바뀐다
    const fail = () => {
      cancelAnimationFrame(frame);
      setStill(true);
    };
    el.addEventListener("error", fail, true);
    frame = requestAnimationFrame(tick);
    el.play().catch(() => undefined);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("error", fail, true);
    };
  }, [film]);
  // 아래 카드를 누르면 그 장면 처음으로 넘겨 재생한다. 동작 줄이기 설정이면 그 장면 가운데 그림에서 멈춘다
  const show = (i: number) => {
    const el = video.current;
    if (el) {
      const part = partOf(el, film);
      el.currentTime = i * part + (still ? part / 2 : 0.05);
      if (!still) el.play().catch(() => undefined);
    }
    setActive(i);
    setLeaving(false);
    setTake((t) => t + 1);
    trackEvent("story_film_step", { step: i + 1, story: story.id });
  };
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
          aria-label={film.label}
        >
          <source src={film.src} type="video/mp4" />
        </video>
        <StoryOverlay key={take} overlay={film.overlay} beat={active} leaving={!still && leaving} />
      </div>
      <ol ref={steps} className="gx-film-steps">
        {film.captions.map((c, i) => (
          <li key={c.text} className={i === active && (!still || take > 0) ? "is-active" : undefined}>
            <button type="button" onClick={() => show(i)} aria-current={i === active ? "step" : undefined} aria-label={`${i + 1}번 장면부터 보기: ${c.text}`}>
              <span className="gx-film-no">{i + 1}</span>
              <span className="gx-film-text">{c.text}</span>
              {c.owner && <OwnerTag owner={c.owner} />}
            </button>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** 업종 탭(대표 11/5). 화살표 키로 옮기고, 고르면 그 업종 이야기와 영상으로 바뀐다 */
function StoryTabs({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const move = (i: number) => {
    const n = (i + STORIES.length) % STORIES.length;
    onChange(n);
    list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[n]?.focus();
  };
  return (
    <div ref={list} className="gx-story-tabs" role="tablist" aria-label="업종별 이야기">
      {STORIES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="tab"
          id={`gx-story-tab-${s.id}`}
          aria-selected={i === value}
          aria-controls="gx-story-panel"
          tabIndex={i === value ? 0 : -1}
          className={i === value ? "is-on" : undefined}
          onClick={() => onChange(i)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") move(i + 1);
            else if (e.key === "ArrowLeft") move(i - 1);
            else if (e.key === "Home") move(0);
            else if (e.key === "End") move(STORIES.length - 1);
            else return;
            e.preventDefault();
          }}
        >
          {s.tab}
        </button>
      ))}
    </div>
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
  const [storyTab, setStoryTab] = useState(0);
  const story = STORIES[storyTab];
  const pickStory = (i: number) => {
    if (i === storyTab) return;
    setStoryTab(i);
    trackEvent("story_tab", { story: STORIES[i].id });
  };
  const ask = (value: string, location: string) => {
    setInterest((previous) => ({ value, revision: previous.revision + 1 }));
    trackEvent("service_interest_select", { interest: value, location });
  };
  // ChatGPT 광고 전환: 문의 폼으로 오게 한 링크가 「무료 진단 받기」인지 「문의하기」인지 기억한다
  useEffect(() => {
    const remember = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href="#contact"]');
      if (link) setInquiryIntentFromLink(link.textContent ?? "");
    };
    document.addEventListener("click", remember, true);
    return () => document.removeEventListener("click", remember, true);
  }, []);
  // ChatGPT 광고 전환: 서비스 소개(#story), 시장(#markets), 실제 사례 블록이
  // 화면 가운데까지 올라오면 페이지마다 한 번씩 보낸다(긴 섹션도 같은 기준)
  useEffect(() => {
    const targets: [SectionKey, Element | null][] = [
      ["story", document.getElementById("story")],
      ["markets", document.getElementById("markets")],
      ["cases", document.querySelector("#story .gx-story-proof")],
    ];
    const keyOf = new Map<Element, SectionKey>();
    for (const [key, el] of targets) if (el && !isSectionSent(key)) keyOf.set(el, key);
    if (!keyOf.size || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = keyOf.get(entry.target);
          if (!key || !entry.isIntersecting) continue;
          trackOpenAiSection(key);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0 },
    );
    keyOf.forEach((_key, el) => io.observe(el));
    return () => io.disconnect();
  }, [storyTab]);

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
            {STORIES.length > 1 && <StoryTabs value={storyTab} onChange={pickStory} />}
            <div id="gx-story-panel" role={STORIES.length > 1 ? "tabpanel" : undefined} aria-labelledby={STORIES.length > 1 ? `gx-story-tab-${story.id}` : undefined}>
            <h2 id="gx-story-title">{story.title}</h2>
            <p className="gx-intro">
              <strong>{story.company}</strong>
              <span className="gx-story-tag">가상의 회사</span>
              {story.intro}
            </p>
            <StoryFilm key={story.id} story={story} />
            <div className="gx-story-grid">
              <ol className="gx-story-questions" aria-hidden="true">
                {story.steps.map((step, i) => (
                  <li key={step.q}>
                    <span>{i + 1}</span>
                    {step.q}
                  </li>
                ))}
              </ol>
              <div className="gx-story-answers">
                {story.steps.map((step, i) => (
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
            <p className="gx-story-closing">{story.closing}</p>
            </div>
            <div className="gx-industries">
              <p>
                <strong>{STORY_INDUSTRIES.title}</strong> {STORY_INDUSTRIES.line}
              </p>
              <ul>
                {STORY_INDUSTRIES.items.map((item) => (
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
