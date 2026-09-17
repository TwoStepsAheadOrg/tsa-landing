import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../anim/Reveal';
import { Eyebrow } from '../Eyebrow';
import { OFFERINGS } from '../../content';

export function OfferingsSection() {
  return (
    <section
      id="services"
      className="scroll-mt-24 bg-[color:var(--lt-bg)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow index="02" label="제공 서비스" />
        </Reveal>
        <div className="mt-6 max-w-[820px]">
          <Reveal delay={0.06}>
            <h2 className="whitespace-pre-line break-keep font-dc-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.16] tracking-[-0.03em] text-[color:var(--lt-ink)]">
              {OFFERINGS.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[720px] font-dc-body text-[15px] leading-[1.8] text-[color:var(--lt-mute)]">
              {OFFERINGS.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 border-y border-[color:var(--lt-line)] sm:grid-cols-2 lg:grid-cols-5">
          {OFFERINGS.items.map((item, i) => (
            <Reveal key={item.num} delay={0.05 * i} className="h-full">
              <article className="h-full border-b border-[color:var(--lt-line)] px-0 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <span className="font-dc-mono text-[11px] text-[color:var(--lt-purple)]">{item.num}</span>
                <h3 className="mt-5 font-dc-display text-[1.2rem] font-bold tracking-[-0.02em] text-[color:var(--lt-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 font-dc-body text-[13.5px] leading-[1.75] text-[color:var(--lt-mute)]">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <a href="#contact" className="group mt-8 inline-flex items-center gap-1.5 font-dc-body text-[14px] font-semibold text-[color:var(--lt-ink)] hover:text-[color:var(--lt-purple)]">
            프로젝트 상담하기
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
