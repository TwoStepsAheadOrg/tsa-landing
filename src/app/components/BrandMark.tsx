export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4 28h30v30H4zM30 2h30v30H30z" />
    </svg>
  );
}
export function BrandLogo() {
  return (
    <span className="brand-logo">
      <BrandMark />
      <span>TwoStepsAhead</span>
    </span>
  );
}
