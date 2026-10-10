# TwoStepsAhead identity · 2026-10-10

## Message

데이터 기반으로 AI 콘텐츠를 만들고, AI가 좋아하는 광고를 만듭니다.

사람의 관심과 AI의 선택을 함께 설계합니다. 고객의 질문과 AI의 인용 출처를 분석하고, 콘텐츠 제작·발행 이후의 반응을 다음 실행에 반영합니다.

The phrase “AI가 좋아하는 광고” means useful content for people and information that makes a brand easier for AI systems to understand and cite. Describe the work performed; do not promise ranking, citations, or conversion outcomes.

## Identity

- Step blue `#244CE9`
- Deep ink `#161B32`
- Paper `#FFFFFF`
- Mist `#E9EFF9`
- Signal yellow `#F5F36A`
- Typeface: self-hosted Pretendard Regular and SemiBold. License in `public/fonts/`.
- Symbol: a 64 × 64 viewBox containing two blue rectangles, `(x:4,y:28,w:30,h:30)` and `(x:30,y:2,w:30,h:30)`. The same geometry is used in the website, icons and social card.

## Asset generation

`scripts/make-icons.py` is the geometry and rendering source. It writes the established icon paths and the 1200 × 630 social preview. It uses the fonts already included in `public/fonts/`; no font download is needed.

```sh
python3 -m pip install Pillow 'fonttools[woff]'
python3 scripts/make-icons.py public
```

Outputs: favicon SVG/ICO/32px/48px, Apple touch icon, 192px/512px icons, 512px organization logo, `og-image.png`. The ICO includes 16px, 32px and 48px. The website's existing public paths remain stable. The manifest uses `purpose: any`; the full-viewBox symbol is not advertised as maskable.

## Copy surfaces

Keep visible copy, home metadata and JSON-LD, no-JavaScript content, `public/llms.txt`, webmanifest and the company PDF aligned. The company PDF has the stable public path `/TwoStepsAhead-Company.pdf`.

Preserve the home/careers Naver verification, GA4 configuration, home Google Ads configuration, canonical URLs and contact details. The careers page uses its own metadata and canonical URL. Font preloads use only the self-hosted SemiBold font; body CSS supplies the font faces.

## Facts and stages

- Plurank's 14-country / 7-platform scope is from September 2026 company operations records; show that date near the claim.
- The Galaxy S26 data-supply/analysis project was performed through Ascent AI collaboration; do not describe it as a direct Samsung contract or official partnership.
- NextEp, Telling and RIN are own content/platform examples. RIN is an AI virtual character.
- Enterprise brand video and AI-model content production is an expansion with scope agreed per project.
- Pluora is in learning/development, not an available prediction product.
- Community marketing follows the relevant community rules and includes required advertising relationship disclosures.
- Revenue/growth figures from the removed financial slide are not reused.

## Validation boundary

Metadata JSON was parsed; Naver and analytics identifiers were compared with the prior revision; icon sizes and image decoding were checked; the OG card was visually inspected. Browser UI, lead receipt and production deployment are separate checks handled in the release workflow.
