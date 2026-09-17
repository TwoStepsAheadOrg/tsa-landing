import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../anim/Reveal';
import { Eyebrow } from '../Eyebrow';
import { CREDENTIALS, PROFILES, SERVICES, STATS, STUDIO } from '../../content';

export function StudioServicesSection() {
  return (
    <section
      id="studio"
      className="scroll-mt-24 border-t border-[color:var(--lt-line)] bg-[color:var(--lt-bg)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow index="01" label="회사와 운영 경험" />
        </Reveal>
        <div className="mt-6 max-w-[820px]">
          <Reveal delay={0.06}>
            <h2 className="whitespace-pre-line break-keep font-dc-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.16] tracking-[-0.03em] text-[color:var(--lt-ink)]">
              {STUDIO.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[720px] font-dc-body text-[15px] leading-[1.8] text-[color:var(--lt-mute)]">
              {STUDIO.lead}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <h3 className="mt-14 font-dc-display text-[1.35rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">
            핵심 인력
          </h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STUDIO.team.map((person, i) => (
            <Reveal key={person.name} delay={0.06 * i}>
              <article className="rounded-2xl border border-[color:var(--lt-line)] bg-[color:var(--lt-card)] p-7">
                <span className="font-dc-mono text-[10.5px] tracking-[0.14em] text-[color:var(--lt-purple)]">{person.role}</span>
                <h3 className="mt-3 font-dc-display text-[1.35rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">{person.name}</h3>
                <p className="mt-3 max-w-lg font-dc-body text-[13.5px] leading-[1.75] text-[color:var(--lt-mute)]">{person.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.14}>
          <h3 className="mt-16 font-dc-display text-[1.35rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">
            프로젝트와 운영 실적
          </h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 border-y border-[color:var(--lt-line)] md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.k} className="border-b border-r border-[color:var(--lt-line)] px-4 py-6 last:border-r-0 md:border-b-0 md:px-6 md:first:pl-0">
              <strong className="block font-dc-display text-[1.65rem] font-semibold tracking-[-0.02em] text-[color:var(--lt-ink)]">{stat.v}</strong>
              <span className="mt-1 block font-dc-body text-[12px] leading-snug text-[color:var(--lt-mute-2)]">{stat.k}</span>
            </div>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-16 max-w-[820px]">
            <div>
              <span className="font-dc-mono text-[10.5px] tracking-[0.14em] text-[color:var(--lt-purple)]">인증·선정</span>
              <h3 className="mt-2 font-dc-display text-[1.5rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">
                공식적으로 검증된 기업입니다
              </h3>
            </div>
            <p className="mt-4 max-w-[720px] font-dc-body text-[13px] leading-[1.7] text-[color:var(--lt-mute)]">
              기술력과 사업 수행 역량을 정부기관과 전문기관에서 인정받았습니다.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-7 rounded-2xl border border-[color:var(--lt-line)] bg-[color:var(--lt-card)] px-6 md:px-8">
            <div className="grid sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
              {CREDENTIALS.map((item) => (
                <div key={item.title} className="flex min-h-[96px] flex-col justify-center border-b border-[color:var(--lt-line)] py-4 lg:[&:nth-last-child(-n+3)]:border-b-0">
                  <time className="font-dc-mono text-[10.5px] tracking-[0.08em] text-[color:var(--lt-purple)]">
                    {item.date}
                  </time>
                  <p className="mt-1.5 break-keep font-dc-body text-[13.5px] font-semibold leading-[1.55] text-[color:var(--lt-ink)]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {PROFILES.map((profile) => (
          <a
            key={profile.name}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex items-center gap-1.5 font-dc-body text-[12px] text-[color:var(--lt-mute-2)] transition-colors hover:text-[color:var(--lt-ink)]"
          >
            {profile.name}
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ))}

        <Reveal delay={0.12}>
          <h3 className="mt-20 font-dc-display text-[1.5rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">직접 운영하는 서비스</h3>
        </Reveal>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name} delay={0.06 * i} className="h-full">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full min-h-[170px] flex-col justify-between rounded-2xl border border-[color:var(--lt-line)] bg-[color:var(--lt-card)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--lt-purple-line)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--lt-mute-2)]">
                    {String(i + 1).padStart(2, '0')} — Live
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[color:var(--lt-mute-2)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--lt-purple)]" />
                </div>
                <div>
                  <div className="whitespace-nowrap font-dc-display text-[1.15rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">
                    {s.name}
                  </div>
                  <p className="mt-1.5 font-dc-body text-[12.5px] leading-relaxed text-[color:var(--lt-mute)]">
                    {s.tagline}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.24}>
          <div className="mt-4 flex min-h-[60px] items-center justify-between rounded-2xl border border-dashed border-[color:var(--lt-line)] px-6 py-4">
            <span className="font-dc-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--lt-mute-2)]">
              06 — Next
            </span>
            <span className="font-dc-body text-[13px] text-[color:var(--lt-mute-2)]">
              다음 서비스를 준비하고 있습니다.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
