import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { BRAND_NAV, BRAND } from "../brand";
import { CAREERS_NAV_LINKS } from "../content";
import { BrandLogo } from "./BrandMark";
export function SiteNav({
  variant = "home",
}: {
  variant?: "home" | "careers";
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const careers = variant === "careers";
  const links = careers ? CAREERS_NAV_LINKS : BRAND_NAV;
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
    <header className="brand-header">
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>
      <div className="brand-nav wrap">
        <a
          className="brand-home"
          href={careers ? "/" : "#top"}
          aria-label="TwoStepsAhead 홈"
        >
          <BrandLogo />
        </a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-contact" href={careers ? "#apply" : "#contact"}>
            {careers ? "지원하기" : "프로젝트 문의"}
          </a>
          <button
            className="menu-toggle"
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav wrap"
          aria-label="모바일 메뉴"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href={BRAND.pdf} download onClick={() => setOpen(false)}>
            회사 소개서 PDF
          </a>
          <a href="/careers/">채용</a>
        </nav>
      )}
    </header>
  );
}
