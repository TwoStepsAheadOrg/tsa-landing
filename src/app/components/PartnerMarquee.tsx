import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { COLLABORATIONS } from "../brand";

export function PartnerMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="partner-marquee" aria-labelledby="partner-marquee-heading">
      <div className="wrap">
        <div className="partner-marquee-heading">
          <h2 id="partner-marquee-heading">함께한 브랜드와 파트너</h2>
          <button
            type="button"
            className="partner-marquee-toggle"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "로고 자동 스크롤 재생" : "로고 자동 스크롤 일시정지"}
            aria-controls="partner-marquee-logos"
          >
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused ? "재생" : "일시정지"}
          </button>
        </div>
        <div
          className="partner-marquee-viewport"
          id="partner-marquee-logos"
          role="region"
          aria-label="협업 업체 로고 목록"
          tabIndex={0}
        >
          <div className={`partner-marquee-track${paused ? " is-paused" : ""}`}>
            {[false, true].map((duplicate) => (
              <ul className="partner-marquee-group" aria-hidden={duplicate || undefined} key={String(duplicate)}>
                {COLLABORATIONS.map((company) => (
                  <li className="partner-marquee-item" key={company.name}>
                    <div className="partner-marquee-image">
                      <img
                        src={company.logo}
                        alt={duplicate ? "" : `${company.name} 로고`}
                        width={company.width}
                        height={company.height}
                        decoding="async"
                      />
                    </div>
                    <span>{company.name === "삼성 Galaxy S26 관련 프로젝트" ? "어센트AI 협업" : company.width === company.height ? company.name : ""}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
