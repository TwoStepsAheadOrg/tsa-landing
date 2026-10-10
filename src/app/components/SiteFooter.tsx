import { BRAND } from "../brand";
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
            <p>데이터에서 시작해, 다음의 가능성으로.</p>
          </div>
          <div className="footer-links">
            <a href={BRAND.pdf} download>
              회사 소개서 PDF
            </a>
            <a href="/careers/">채용</a>
            <a href="/ownnext/">크리에이터 사업 · OWNNEXT</a>
            <a href={`mailto:${BRAND.email}`}>이메일 문의</a>
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
