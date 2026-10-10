import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronDown, Download, Paperclip } from 'lucide-react';
import { CAREERS } from '../content';
import { SiteFooter } from '../components/SiteFooter';
import { SiteNav } from '../components/SiteNav';
import { Reveal } from '../components/anim/Reveal';
import { trackEvent } from '@/lib/gtag';
import {
  fetchCareerJobs,
  submitCareerApplication,
  uploadCareerFile,
  type CareerJob,
} from './api';

type LoadState = 'loading' | 'ready' | 'error';
type SubmitState = 'idle' | 'uploading' | 'submitting' | 'success' | 'error';

const PUBLIC_JOB_SLUGS = new Set(['engineer']);
const APPLICATION_FORM_URL = '/TwoStepsAhead-Application-Form.docx';
const APPLICATION_FORM_NAME = '투스텝스어헤드_입사_지원서.docx';

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  jobId: string;
  link: string;
  privacyConsent: boolean;
}

const initialForm: ApplicationForm = {
  name: '',
  email: '',
  phone: '',
  jobId: '',
  link: '',
  privacyConsent: false,
};

const fieldClass =
  'w-full rounded-none border-0 border-b border-[color:var(--lt-line)] bg-transparent px-0 py-3.5 font-dc-body text-[15px] text-[color:var(--lt-ink)] outline-none transition-[border-color] placeholder:text-[color:var(--lt-mute-2)] focus:border-[color:var(--lt-purple)]';

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-dc-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--lt-purple)]">
      {children}
    </p>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="font-dc-display text-[15px] font-semibold text-[color:var(--lt-ink)]">{title}</h4>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[10px_1fr] gap-3 font-dc-body text-[13.5px] leading-[1.7] text-[color:var(--lt-mute)]">
            <span aria-hidden="true" className="mt-[0.65em] h-1 w-1 rounded-full bg-[color:var(--lt-purple)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OpenRoles({ jobs, state, onApply }: { jobs: CareerJob[]; state: LoadState; onApply: (job: CareerJob) => void }) {
  if (state === 'loading') {
    return <p className="border-y border-[color:var(--lt-line)] py-10 text-[14px] text-[color:var(--lt-mute)]">채용 포지션을 불러오는 중입니다.</p>;
  }
  if (state === 'error') {
    return (
      <div className="border-y border-[color:var(--lt-line)] py-10">
        <p className="text-[14px] text-[color:var(--lt-mute)]">채용 포지션을 불러오지 못했습니다.</p>
        <a className="mt-3 inline-block text-[13px] font-semibold text-[color:var(--lt-purple)]" href="mailto:glenn.kim@twostepsahead.co.kr">
          이메일로 문의하기
        </a>
      </div>
    );
  }
  if (!jobs.length) {
    return (
      <div className="border-y border-[color:var(--lt-line)] py-10">
        <p className="text-[14px] text-[color:var(--lt-mute)]">현재 공개된 포지션은 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-[color:var(--lt-line)]">
      {jobs.map((job, index) => (
        <details key={job.id} className="group border-b border-[color:var(--lt-line)]">
          <summary className="grid cursor-pointer list-none gap-5 py-7 sm:grid-cols-[48px_1fr_auto] sm:items-center sm:py-8 [&::-webkit-details-marker]:hidden">
            <span className="font-dc-mono text-[11px] text-[color:var(--lt-purple)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="font-dc-display text-[clamp(1.25rem,2vw,1.7rem)] font-semibold tracking-[-0.02em] text-[color:var(--lt-ink)]">
                {job.title}
              </h3>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-dc-mono text-[10.5px] tracking-[0.04em] text-[color:var(--lt-mute-2)]">
                {[job.team, job.employmentType, job.location].filter(Boolean).map((meta) => (
                  <span key={meta}>[{meta}]</span>
                ))}
              </p>
            </div>
            <ChevronDown className="hidden h-5 w-5 text-[color:var(--lt-mute-2)] transition-transform duration-300 group-open:rotate-180 sm:block" />
          </summary>

          <div className="pb-10 pl-0 sm:pl-[68px]">
            {job.summary && (
              <p className="max-w-[760px] break-keep font-dc-body text-[15px] leading-[1.8] text-[color:var(--lt-mute)]">
                {job.summary}
              </p>
            )}
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <DetailList title="주요 업무" items={job.responsibilities} />
              <DetailList title="자격 요건" items={job.requirements} />
              <DetailList title="우대 사항" items={job.preferred} />
            </div>
            {job.techStack && (
              <p className="mt-8 font-dc-mono text-[11px] leading-[1.8] text-[color:var(--lt-mute-2)]">
                사용 기술과 도구: {job.techStack}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onApply(job)}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--lt-purple)] px-6 py-3 font-dc-label text-[13px] font-semibold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#5c22d6]"
              >
                이 포지션 지원하기 <ArrowRight className="h-4 w-4" />
              </button>
              {job.formTemplateUrl && (
                <a
                  href={job.formTemplateUrl}
                  download={job.formTemplateName || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--lt-line)] px-6 py-3 font-dc-label text-[13px] font-semibold text-[color:var(--lt-ink)] transition-[border-color,background-color] duration-300 hover:border-[color:var(--lt-purple-line)] hover:bg-[color:var(--lt-purple-soft)]"
                >
                  지원서 양식 <Download className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

export function CareersPage() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchCareerJobs(controller.signal)
      .then((data) => {
        setJobs(data
          .filter((job) => PUBLIC_JOB_SLUGS.has(job.slug))
          .map((job) => ({
            ...job,
            formTemplateUrl: APPLICATION_FORM_URL,
            formTemplateName: APPLICATION_FORM_NAME,
          })));
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadState('error');
      });
    return () => controller.abort();
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((job) => String(job.id) === form.jobId) || null,
    [form.jobId, jobs],
  );
  const fallbackTemplate = useMemo(
    () => jobs.find((job) => job.formTemplateUrl) || null,
    [jobs],
  );
  const templateJob = selectedJob?.formTemplateUrl ? selectedJob : fallbackTemplate;

  const update =
    <K extends keyof ApplicationForm>(key: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : event.target.value;
      setForm((current) => ({ ...current, [key]: value }));
    };

  const chooseJob = (job: CareerJob) => {
    setForm((current) => ({ ...current, jobId: String(job.id) }));
    requestAnimationFrame(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }));
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] || null;
    setFile(next);
    setSubmitState('idle');
    setMessage('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitState === 'uploading' || submitState === 'submitting') return;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (!form.name.trim() || !emailOk || phoneDigits.length < 9 || !form.jobId || !form.privacyConsent) {
      setSubmitState('error');
      setMessage('이름, 이메일, 연락처, 지원 직무와 개인정보 동의를 확인해 주세요.');
      return;
    }
    if (!file) {
      setSubmitState('error');
      setMessage('지원서와 이력서를 하나의 ZIP 파일로 첨부해 주세요.');
      return;
    }
    if (!/\.zip$/i.test(file.name)) {
      setSubmitState('error');
      setMessage('첨부 파일은 ZIP 형식만 가능합니다.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setSubmitState('error');
      setMessage('첨부 파일은 20MB 이하로 올려 주세요.');
      return;
    }

    trackEvent('careers_apply_submit', { job: form.jobId });
    try {
      setSubmitState('uploading');
      setMessage('지원서 파일을 올리고 있습니다.');
      const uploaded = await uploadCareerFile(file, { name: form.name.trim(), phone: form.phone.trim() });

      setSubmitState('submitting');
      setMessage('지원 정보를 접수하고 있습니다.');
      await submitCareerApplication({
        jobId: form.jobId === 'other' ? null : Number(form.jobId),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        link: form.link.trim(),
        fileUrl: uploaded.url,
        fileName: uploaded.name || file.name,
        privacyConsent: true,
        privacyConsentAt: new Date().toISOString(),
        source: 'tsa-careers',
      });

      setSubmitState('success');
      setMessage('지원이 접수되었습니다. 검토 후 입력하신 연락처로 안내드리겠습니다.');
      setForm(initialForm);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setSubmitState('error');
      setMessage(error instanceof Error ? error.message : '지원 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const busy = submitState === 'uploading' || submitState === 'submitting';

  return (
    <div className="min-h-screen bg-[color:var(--lt-bg)] font-dc-body text-[color:var(--lt-ink)] antialiased">
      <SiteNav variant="careers" />

      <main id="main-content">
        <section id="top" className="relative isolate overflow-hidden border-b border-[color:var(--lt-line)] bg-[color:var(--lt-bg-2)] px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
          <div className="relative z-10 mx-auto grid min-h-[620px] max-w-[1200px] items-center gap-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <div>
              <Reveal>
                <p className="font-dc-body text-[14px] font-semibold text-[color:var(--lt-purple)]">채용 · 서울</p>
              </Reveal>
              <Reveal delay={0.08} y={30}>
                <h1 className="mt-6 max-w-[820px] whitespace-pre-line break-keep font-dc-display text-[clamp(3rem,7vw,6.4rem)] font-semibold leading-[1.01] tracking-[-0.045em] text-[color:var(--lt-ink)]">
                  {CAREERS.hero.title}
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-8 max-w-[680px] break-keep font-dc-body text-[16px] leading-[1.85] text-[color:var(--lt-mute)]">
                  {CAREERS.hero.lead}
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="#open-roles"
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--lt-purple)] px-7 py-3.5 font-dc-label text-[14px] font-semibold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#5c22d6]"
                  >
                    채용 포지션 보기 <ArrowDown className="h-4 w-4" />
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--lt-line)] px-7 py-3.5 font-dc-label text-[14px] font-semibold text-[color:var(--lt-ink)] transition-[border-color,background-color] duration-300 hover:border-[color:var(--lt-purple-line)] hover:bg-[color:var(--lt-purple-soft)]"
                  >
                    <ArrowLeft className="h-4 w-4" /> 회사 알아보기
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.24}>
              <div className="border-t border-[color:var(--lt-line)]">
                {CAREERS.reasons.map((reason, index) => (
                  <div key={reason} className="grid grid-cols-[42px_1fr] gap-4 border-b border-[color:var(--lt-line)] py-5">
                    <span className="font-dc-mono text-[10px] text-[color:var(--lt-purple)]">0{index + 1}</span>
                    <p className="break-keep font-dc-body text-[13.5px] leading-[1.7] text-[color:var(--lt-mute)]">{reason}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="culture" className="scroll-mt-24 border-t border-[color:var(--lt-line)] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1200px]">
            <Reveal><SectionLabel>Culture</SectionLabel></Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-5 max-w-[760px] break-keep font-dc-display text-[clamp(2.1rem,4.8vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
                함께 일할 때 중요하게 생각하는 것
              </h2>
            </Reveal>
            <div className="mt-14 border-t border-[color:var(--lt-line)]">
              {CAREERS.culture.map((item, index) => (
                <Reveal key={item.title} delay={0.04 * index}>
                  <article className="grid gap-4 border-b border-[color:var(--lt-line)] py-8 md:grid-cols-[64px_minmax(260px,0.8fr)_minmax(0,1.2fr)] md:gap-8 md:py-10">
                    <span className="font-dc-mono text-[11px] text-[color:var(--lt-purple)]">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="break-keep font-dc-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]">{item.title}</h3>
                    <p className="max-w-[620px] break-keep font-dc-body text-[14px] leading-[1.8] text-[color:var(--lt-mute)]">{item.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="how-we-work" className="scroll-mt-24 border-t border-[color:var(--lt-line)] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1.3fr)] lg:gap-24">
            <div>
              <Reveal><SectionLabel>How we work</SectionLabel></Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-5 break-keep font-dc-display text-[clamp(2.1rem,4.5vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
                  만드는 사람과 운영하는 사람이 나뉘지 않습니다.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-[480px] break-keep font-dc-body text-[14px] leading-[1.85] text-[color:var(--lt-mute)]">
                  직접 만든 서비스를 운영하고, 기업 고객의 현장을 가까이에서 봅니다. 그래서 출시 이후에 드러나는 문제까지 제품의 일부로 다룹니다.
                </p>
              </Reveal>
            </div>
            <div className="border-t border-[color:var(--lt-line)]">
              {CAREERS.ways.map((item, index) => (
                <Reveal key={item.title} delay={0.06 * index}>
                  <article className="border-b border-[color:var(--lt-line)] py-8">
                    <div className="flex items-baseline gap-5">
                      <span className="font-dc-mono text-[10px] text-[color:var(--lt-purple)]">0{index + 1}</span>
                      <h3 className="font-dc-display text-[1.25rem] font-semibold tracking-[-0.015em]">{item.title}</h3>
                    </div>
                    <p className="mt-4 max-w-[680px] break-keep pl-[42px] font-dc-body text-[14px] leading-[1.8] text-[color:var(--lt-mute)]">{item.desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="open-roles" className="scroll-mt-24 border-t border-[color:var(--lt-line)] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-[1200px]">
            <Reveal><SectionLabel>Open roles</SectionLabel></Reveal>
            <Reveal delay={0.06}>
              <div className="mt-5 mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <h2 className="break-keep font-dc-display text-[clamp(2.1rem,4.8vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
                  지금 함께할 동료
                </h2>
                <p className="max-w-[420px] break-keep font-dc-body text-[13.5px] leading-[1.75] text-[color:var(--lt-mute)]">
                  제목을 누르면 상세 업무와 자격 요건을 확인할 수 있습니다.
                </p>
              </div>
            </Reveal>
            <OpenRoles jobs={jobs} state={loadState} onApply={chooseJob} />
          </div>
        </section>

        <section id="apply" className="scroll-mt-24 border-t border-[color:var(--lt-line)] px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] lg:gap-24">
            <div>
              <Reveal><SectionLabel>Apply</SectionLabel></Reveal>
              <Reveal delay={0.06}>
                <h2 className="mt-5 break-keep font-dc-display text-[clamp(2.1rem,4.5vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
                  함께 만들고 싶은 일을 들려주세요.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-7 max-w-[470px] break-keep font-dc-body text-[14px] leading-[1.85] text-[color:var(--lt-mute)]">
                  지원 직무를 선택해 지원서 양식을 내려받으세요. 작성한 지원서와 이력서를 하나의 ZIP 파일로 묶어 보내주시면 됩니다.
                </p>
              </Reveal>
              {templateJob?.formTemplateUrl && (
                <Reveal delay={0.16}>
                  <a
                    href={templateJob.formTemplateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 border-b border-[color:var(--lt-purple-line)] pb-1 font-dc-label text-[13px] font-semibold text-[color:var(--lt-purple)]"
                  >
                    <Download className="h-4 w-4" />
                    지원서 양식 다운로드
                  </a>
                </Reveal>
              )}
            </div>

            <Reveal delay={0.12}>
              {submitState === 'success' ? (
                <div className="border-y border-[color:var(--lt-line)] py-14">
                  <Check className="h-7 w-7 text-[color:var(--lt-purple)]" />
                  <h3 className="mt-6 font-dc-display text-[1.6rem] font-semibold">지원이 접수되었습니다.</h3>
                  <p className="mt-3 max-w-[520px] text-[14px] leading-[1.8] text-[color:var(--lt-mute)]">{message}</p>
                  <button
                    type="button"
                    onClick={() => { setSubmitState('idle'); setMessage(''); }}
                    className="mt-7 text-[13px] font-semibold text-[color:var(--lt-purple)]"
                  >
                    다른 지원서 작성하기
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="border-t border-[color:var(--lt-line)]" noValidate>
                  <div className="grid gap-x-8 sm:grid-cols-2">
                    <label className="border-b border-[color:var(--lt-line)] py-5 sm:border-b-0">
                      <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--lt-mute-2)]">Name *</span>
                      <input className={fieldClass} value={form.name} onChange={update('name')} autoComplete="name" placeholder="이름" />
                    </label>
                    <label className="border-b border-[color:var(--lt-line)] py-5 sm:border-b-0">
                      <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--lt-mute-2)]">Email *</span>
                      <input className={fieldClass} type="email" value={form.email} onChange={update('email')} autoComplete="email" placeholder="name@example.com" />
                    </label>
                  </div>
                  <div className="grid gap-x-8 border-t border-[color:var(--lt-line)] sm:grid-cols-2">
                    <label className="border-b border-[color:var(--lt-line)] py-5 sm:border-b-0">
                      <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--lt-mute-2)]">Phone *</span>
                      <input className={fieldClass} type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="010-0000-0000" />
                    </label>
                    <label className="border-b border-[color:var(--lt-line)] py-5 sm:border-b-0">
                      <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--lt-mute-2)]">Role *</span>
                      <select className={fieldClass} value={form.jobId} onChange={update('jobId')}>
                        <option value="">지원 직무를 선택하세요</option>
                        {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                      </select>
                    </label>
                  </div>
                  <label className="block border-t border-[color:var(--lt-line)] py-5">
                    <span className="font-dc-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--lt-mute-2)]">Portfolio</span>
                    <input className={fieldClass} type="url" value={form.link} onChange={update('link')} placeholder="포트폴리오, GitHub 또는 LinkedIn 링크 (선택)" />
                  </label>
                  <div className="border-t border-[color:var(--lt-line)] py-6">
                    <input ref={fileInputRef} id="career-file" className="sr-only" type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={onFile} />
                    <label
                      htmlFor="career-file"
                      className="flex cursor-pointer items-center justify-between gap-5 border border-[color:var(--lt-line)] px-5 py-5 transition-[border-color,background-color] hover:border-[color:var(--lt-purple-line)] hover:bg-[color:var(--lt-purple-soft)]"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Paperclip className="h-4 w-4 shrink-0 text-[color:var(--lt-purple)]" />
                        <span className="truncate text-[13.5px] text-[color:var(--lt-mute)]">
                          {file ? file.name : '지원서와 이력서 ZIP 파일 선택'}
                        </span>
                      </span>
                      <span className="shrink-0 font-dc-mono text-[10px] text-[color:var(--lt-mute-2)]">최대 20MB</span>
                    </label>
                  </div>
                  <div className="border-t border-[color:var(--lt-line)] py-6">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input className="mt-1 h-4 w-4 accent-[color:var(--lt-purple)]" type="checkbox" checked={form.privacyConsent} onChange={update('privacyConsent')} />
                      <span className="break-keep text-[12.5px] leading-[1.7] text-[color:var(--lt-mute)]">
                        채용 전형을 위해 이름, 이메일, 연락처, 지원서, 이력서와 포트폴리오 링크를 수집하고 채용 종료 후 1년간 보관하는 데 동의합니다. (필수)
                      </span>
                    </label>
                  </div>

                  {message && (
                    <p role="status" className={`border-t border-[color:var(--lt-line)] py-4 text-[13px] ${submitState === 'error' ? 'text-[#b42318]' : 'text-[color:var(--lt-mute)]'}`}>
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--lt-purple)] px-7 py-3.5 font-dc-label text-[14px] font-semibold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#5c22d6] disabled:cursor-wait disabled:opacity-60"
                  >
                    {busy ? '접수 중입니다' : '지원서 제출'} <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-4 text-[11.5px] leading-[1.7] text-[color:var(--lt-mute-2)]">
                    제출에 문제가 있으면 glenn.kim@twostepsahead.co.kr로 보내주세요.
                  </p>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
