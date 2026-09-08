import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Reveal } from '../anim/Reveal';
import { Eyebrow } from '../Eyebrow';
import { INTERESTS } from '../../content';
import { trackAdsConversion, trackEvent } from '@/lib/gtag';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  company: string;
  email: string;
  interest: string;
  message: string;
  _hp: string; // honeypot
}

const initial: FormState = {
  name: '',
  company: '',
  email: '',
  interest: 'ax',
  message: '',
  _hp: '',
};

/** 인풋 — 하단 헤어라인만, focus 시 퍼플 라인. */
const inputClass =
  'w-full bg-transparent border-0 border-b border-[color:var(--lt-line)] px-0 py-3 font-dc-body text-[15px] text-[color:var(--lt-ink)] placeholder:text-[color:var(--lt-mute-2)] focus:outline-none focus:border-[color:var(--lt-purple)] transition-colors rounded-none';

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <span className="font-dc-mono text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--lt-mute-2)]">
      {children}
      {required && <span className="text-[color:var(--lt-purple)]"> *</span>}
    </span>
  );
}

/**
 * 문의 — "지금 하시는 일부터 들려주세요." + 인라인 폼(라이트).
 * 좌측에 실행형 오퍼 + 인증·선정 + 크몽 프로필 링크.
 * 폼 계약은 api/inquiry.ts 그대로: {name, company, email, interest, message, _hp}
 */
export function ContactFormSection() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update =
    <K extends keyof FormState>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!form.name.trim() || !form.company.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('모든 필수 항목을 입력해 주세요.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setErrorMsg('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (form.message.trim().length < 10) {
      setStatus('error');
      setErrorMsg('내용을 10자 이상 입력해 주세요.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    // 제출 "시도" — GA4 퍼널 분석용. 전환으로 쓰지 않습니다(실패한 제출도 포함되므로).
    trackEvent('inquiry_submit', { interest: form.interest });

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `status_${res.status}`);
      }
      // 여기가 상담 신청이 실제로 접수된 시점 = 전환.
      trackEvent('generate_lead', { interest: form.interest });
      trackAdsConversion('lead');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? `전송에 실패했습니다 (${err.message}). glenn.kim@twostepsahead.co.kr로 직접 보내주셔도 됩니다.`
          : '전송에 실패했습니다.',
      );
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-[color:var(--lt-line)] bg-[color:var(--lt-bg)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <Eyebrow index="08" label="프로젝트 문의" />
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 break-keep font-dc-display text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[color:var(--lt-ink)]">
            지금 하시는 일부터
            <br />
            들려주세요<span className="text-[color:var(--lt-purple)]">.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
          {/* 좌: 오퍼 + 메타 + 검증 */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="flex flex-col gap-8">
              <p className="max-w-sm font-dc-body text-[15px] leading-[1.8] text-[color:var(--lt-mute)]">
                첫 미팅에서 데모가 아니라 귀사 업무의 AI 적용 지점을 짚어드립니다.
                어디서부터 시작할지는 저희가 같이 찾습니다.
                AI 바우처 공급기업이라, 정부 지원으로 도입 비용을 줄이는 방법도 함께 안내드립니다.
              </p>
              <dl className="flex flex-col gap-4 font-dc-mono text-[12px] tracking-[0.04em]">
                <div className="flex flex-col gap-1">
                  <dt className="uppercase tracking-[0.16em] text-[color:var(--lt-mute-2)]">Email</dt>
                  <dd>
                    <a
                      href="mailto:glenn.kim@twostepsahead.co.kr"
                      className="text-[color:var(--lt-ink)] transition-colors hover:text-[color:var(--lt-purple)]"
                    >
                      glenn.kim@twostepsahead.co.kr
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="uppercase tracking-[0.16em] text-[color:var(--lt-mute-2)]">Response</dt>
                  <dd className="text-[color:var(--lt-mute)]">평일 24시간 내 회신</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="uppercase tracking-[0.16em] text-[color:var(--lt-mute-2)]">Office</dt>
                  <dd className="text-[color:var(--lt-mute)]">서울 마포구 양화로 186</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          {/* 우: 인라인 폼 */}
          <Reveal delay={0.16} className="lg:col-span-7">
            {status === 'success' ? (
              <div className="flex flex-col items-start gap-5 rounded-2xl border border-[color:var(--lt-line)] bg-[color:var(--lt-card)] p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--lt-purple-line)] bg-[color:var(--lt-purple-soft)]">
                  <Check className="h-6 w-6 text-[color:var(--lt-purple)]" />
                </div>
                <h3 className="font-dc-display text-2xl font-semibold text-[color:var(--lt-ink)]">
                  보내드렸습니다.
                </h3>
                <p className="font-dc-body text-[14px] leading-relaxed text-[color:var(--lt-mute)]">
                  평일 24시간 내 <span className="font-semibold text-[color:var(--lt-ink)]">{form.email}</span>로
                  회신드립니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  name="_hp"
                  value={form._hp}
                  onChange={update('_hp')}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <FieldLabel required>Name</FieldLabel>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={update('name')}
                      autoComplete="name"
                      className={inputClass}
                      placeholder="이름"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <FieldLabel required>Company</FieldLabel>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={update('company')}
                      autoComplete="organization"
                      className={inputClass}
                      placeholder="회사명 (개인이시면 '개인')"
                    />
                  </label>
                </div>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <FieldLabel required>Email</FieldLabel>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={update('email')}
                      autoComplete="email"
                      className={inputClass}
                      placeholder="work@company.co.kr"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <FieldLabel>Interest</FieldLabel>
                    <select value={form.interest} onChange={update('interest')} className={inputClass}>
                      {INTERESTS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <FieldLabel required>Message</FieldLabel>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    className={`${inputClass} resize-none`}
                    placeholder="지금 하고 있는 업무, 반복되는 일, 바꾸고 싶은 것 — 편하게 적어주세요."
                  />
                </label>

                {status === 'error' && (
                  <p role="alert" className="font-dc-body text-[13px] text-[#c2410c]">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-2 inline-flex items-center justify-center gap-2 self-start rounded-full bg-[color:var(--lt-ink)] px-8 py-4 font-dc-label text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === 'submitting' ? '보내는 중…' : '문의 보내기'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
