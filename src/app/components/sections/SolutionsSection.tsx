import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../anim/Reveal';
import { Eyebrow } from '../Eyebrow';
import { SOLUTIONS } from '../../content';

/**
 * 자체 솔루션 — 라이트 페이지에서 유일한 다크 반전 카드(joshua 문법).
 * 우주콜 메인 피처: 이미지 대신 CSS 전화 응대 대화 목업.
 */
export function SolutionsSection() {
  const { main, sub } = SOLUTIONS;

  return (
    <section
      id="solutions"
      className="scroll-mt-24 border-t border-[color:var(--lt-line)] bg-[color:var(--lt-bg)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow index="05" label="자체 솔루션" />
        </Reveal>
        <div className="mt-6 max-w-[820px]">
          <Reveal delay={0.06}>
            <h2 className="whitespace-pre-line break-keep font-dc-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.16] tracking-[-0.03em] text-[color:var(--lt-ink)]">
              {SOLUTIONS.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[720px] font-dc-body text-[15px] leading-[1.8] text-[color:var(--lt-mute)]">
              {SOLUTIONS.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* 메인 — 우주콜 다크 카드 */}
          <Reveal delay={0.06} className="h-full">
            <a
              href={main.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-8 rounded-2xl bg-[color:var(--lt-dark)] p-9 transition-transform duration-300 hover:-translate-y-0.5 md:p-11"
            >
              <div className="flex-1">
                <h3 className="whitespace-nowrap font-dc-display text-[2rem] font-bold tracking-[-0.02em] text-[color:var(--lt-dark-ink)]">
                  {main.name}
                </h3>
                <p className="mt-1 font-dc-body text-[15px] font-medium text-[rgba(245,243,251,0.85)]">
                  {main.tagline}
                </p>
                <p className="mt-4 max-w-sm font-dc-body text-[13.5px] leading-[1.8] text-[rgba(245,243,251,0.6)]">
                  {main.desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-dc-mono text-[12px] uppercase tracking-[0.08em] text-[rgba(245,243,251,0.85)]">
                  woojoocall.com
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
              {/* CSS 대화 목업 */}
              <div
                className="mt-auto w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] p-4"
                role="img"
                aria-label="우주콜 AI 전화 응대 예시 대화"
              >
                <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] pb-3">
                  <span className="h-2 w-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
                  <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[rgba(245,243,251,0.55)]">
                    통화 중 · AI 응대
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2.5">
                  {main.dialogue.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-lg px-3 py-2 font-dc-body text-[11.5px] leading-[1.6] ${
                        m.role === 'ai'
                          ? 'self-start bg-[rgba(139,92,246,0.22)] text-[rgba(245,243,251,0.92)]'
                          : 'self-end bg-[rgba(255,255,255,0.08)] text-[rgba(245,243,251,0.75)]'
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </Reveal>

          {/* 서브 — 보임 */}
          <Reveal delay={0.14} className="h-full">
            <a
              href={sub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--lt-purple-line)] bg-[linear-gradient(145deg,var(--lt-card)_0%,rgba(109,46,240,0.07)_100%)] p-9 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(109,46,240,0.12)] md:p-11"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[rgba(109,46,240,0.09)] blur-2xl" aria-hidden="true" />
              <h3 className="whitespace-nowrap font-dc-display text-[1.5rem] font-bold tracking-[-0.02em] text-[#241b59]">
                {sub.name}
              </h3>
              <p className="mt-1 font-dc-body text-[14px] font-medium text-[color:var(--lt-mute)]">
                {sub.tagline}
              </p>
              <p className="mt-4 font-dc-body text-[13.5px] leading-[1.8] text-[color:var(--lt-mute)]">
                {sub.desc}
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-[rgba(78,61,216,0.18)] bg-white shadow-[0_8px_24px_rgba(36,27,89,0.08)]">
                <img
                  src={sub.preview.src}
                  alt={sub.preview.alt}
                  className="block h-auto w-full"
                />
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-dc-mono text-[12px] uppercase tracking-[0.08em] text-[color:var(--lt-ink)]">
                {sub.host}
                <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--lt-mute-2)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.2}>
          <a href="#contact" className="group mt-8 inline-flex items-center gap-1.5 font-dc-body text-[14px] font-semibold text-[color:var(--lt-ink)] hover:text-[color:var(--lt-purple)]">
            솔루션 도입 문의하기
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
