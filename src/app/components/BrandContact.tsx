import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { BRAND, INTEREST_OPTIONS } from "../brand";
import { trackAdsConversion, trackEvent } from "@/lib/gtag";
const initial = {
  name: "",
  company: "",
  email: "",
  interest: "content",
  message: "",
  _hp: "",
};
export function BrandContact({
  interest,
}: {
  interest: { value: string; revision: number };
}) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    if (interest.value)
      setForm((old) => ({ ...old, interest: interest.value }));
  }, [interest]);
  const field = (name: keyof typeof initial, value: string) =>
    setForm((old) => ({ ...old, [name]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.email.trim() ||
      form.message.trim().length < 10
    ) {
      setError("이름, 회사명, 이메일과 10자 이상의 문의 내용을 입력해 주세요.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    trackEvent("inquiry_submit", { interest: form.interest });
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true)
        throw new Error("inquiry_failed");
      trackEvent("generate_lead", { interest: form.interest });
      trackAdsConversion("lead");
      setStatus("success");
    } catch {
      setStatus("error");
      setError(
        "문의가 접수되지 않았습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.",
      );
    }
  };
  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <span className="section-label">함께 만들 다음</span>
          <h2>
            우리 브랜드의
            <br />
            다음 한 걸음,
            <br />
            같이 찾을까요?
          </h2>
          <p>
            브랜드와 목표, 궁금한 점을 알려주세요.
            <br />
            데이터 진단부터 콘텐츠 제작과 운영까지
            <br />
            필요한 시작점을 함께 정리합니다.
          </p>
          <a className="contact-email" href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>
          <a
            className="pdf-link"
            href={BRAND.pdf}
            download
            onClick={() =>
              trackEvent("company_profile_download", { location: "contact" })
            }
          >
            회사 소개서 PDF 받기
          </a>
        </div>
        <div className="contact-form-panel">
          {status === "success" ? (
            <div className="contact-success" role="status">
              <Check size={44} />
              <h3>문의가 접수되었습니다.</h3>
              <p>남겨주신 {form.email}로 회신드리겠습니다.</p>
              <button
                type="button"
                className="brand-button secondary"
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
              <h3>프로젝트에 대해 들려주세요.</h3>
              <p className="required-note">* 필수 입력 항목</p>
              <div className="form-row">
                <label>
                  이름 *
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    maxLength={200}
                    value={form.name}
                    onChange={(e) => field("name", e.target.value)}
                    placeholder="이름을 입력해 주세요"
                  />
                </label>
                <label>
                  회사명 *
                  <input
                    required
                    name="company"
                    autoComplete="organization"
                    maxLength={200}
                    value={form.company}
                    onChange={(e) => field("company", e.target.value)}
                    placeholder="회사 또는 팀 이름"
                  />
                </label>
              </div>
              <label>
                이메일 *
                <input
                  type="email"
                  required
                  name="email"
                  autoComplete="email"
                  maxLength={200}
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  placeholder="hello@company.com"
                />
              </label>
              <label>
                관심 분야
                <select
                  name="interest"
                  value={form.interest}
                  onChange={(e) => field("interest", e.target.value)}
                >
                  {INTEREST_OPTIONS.map((o) => (
                    <option value={o.value} key={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                문의 내용 *
                <textarea
                  required
                  minLength={10}
                  maxLength={4000}
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => field("message", e.target.value)}
                  placeholder="브랜드, 프로젝트 목표, 일정 등 편하게 남겨주세요. (10자 이상)"
                />
              </label>
              <div className="form-trap" aria-hidden="true">
                <label>
                  Leave empty
                  <input
                    name="_hp"
                    autoComplete="off"
                    tabIndex={-1}
                    value={form._hp}
                    onChange={(e) => field("_hp", e.target.value)}
                  />
                </label>
              </div>
              {status === "error" && (
                <p className="form-error" role="alert">
                  {error} <a href={`mailto:${BRAND.email}`}>이메일 문의</a>
                </p>
              )}
              <button
                className="brand-button primary send-button"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "보내는 중…" : "문의 보내기"}
                <Send size={17} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
