import { FOOTER } from "../content";
import { BrandLogo } from "./BrandMark";
export function SiteFooter() {
  return (
    <footer className="brand-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <a href="/" aria-label="TwoStepsAhead 홈">
              <BrandLogo />
            </a>
          </div>
          <div className="footer-links">
            <a href="https://plurank.com" target="_blank" rel="noopener">
              Plurank
            </a>
            <a href="https://microwave.ai.kr" target="_blank" rel="noopener">
              MICROWAVE
            </a>
            <a href="/careers/">채용</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>
            <strong>{FOOTER.corp}</strong>
            {FOOTER.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p>{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
