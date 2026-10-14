# tsa-landing

투스텝스어헤드 회사 웹사이트 — https://twostepsahead.co.kr

**데이터 기반으로 AI 콘텐츠를 만들고, AI가 좋아하는 광고를 만듭니다.**

2026-10-10 브랜드 개편: AI 콘텐츠, AI 검색·브랜드 콘텐츠, 글로벌 커뮤니티 마케팅을 실제 작업과 데이터 근거로 소개합니다. 회사소개서와 웹사이트가 같은 메시지·색·심벌을 사용합니다.

## 스택과 개발

React 18 · Vite 6 · Tailwind 4 · motion/react · pnpm. Vercel Node.js 24.x.

```sh
pnpm install --frozen-lockfile
pnpm dev             # 프런트 개발 서버, 채용 API는 기존 백엔드로 프록시
pnpm test:inquiry    # 외부 전송 없는 실제 문의 handler 테스트
pnpm build          # 홈/채용 멀티 페이지 빌드 → dist/
pnpm exec vite preview
```

Vite 개발 서버 자체는 Vercel `/api/inquiry` 함수를 실행하지 않습니다. 문의 검증은 `test:inquiry`로 실제 handler를 독립 실행하며, 브라우저 UI 검증은 요청을 mock해서 수행할 수 있습니다. 프리뷰 서버는 작업이 끝나면 종료합니다.

## 현재 구조

```text
src/app/
  App.tsx                  # /careers 경로 분기
  HomePage.tsx             # 홈 섹션·문의 연결
  brand.ts                 # 현행 브랜드, 서비스, 작업, 채널, 문의 분야
  content.ts               # 채용·법인 정보 (이전 홈 자료 제거)
  components/
    ServiceShowcase.tsx    # 서비스 탭·대표 이미지·제작 범위·문의 분야 연결
    WorkShowcase.tsx       # 실제 작업 갤러리·필터·상세 패널·채널 성장 기록
    BrandMark.tsx          # 심벌과 워드마크
    BrandContact.tsx       # 문의 폼과 성공 시 전환 측정
    SiteNav.tsx            # 홈/채용 내비게이션·모바일 메뉴
    SiteFooter.tsx         # 법인 정보·소개서·문의 연결
  careers/
    CareersPage.tsx        # 문화·공고·지원서 업로드/접수
    api.ts                 # 기존 채용 API 계약
src/styles/brand.css       # 현행 컬러·레이아웃·반응형·로컬 폰트
src/styles/service-showcase.css # 서비스 탭 반응형 디자인
src/styles/work-showcase.css    # 포트폴리오·상세 패널 반응형 디자인
index.html                 # 홈 메타·JSON-LD·no-JS 소개
careers/index.html         # 채용 메타·별도 canonical
api/inquiry.ts             # 문의 → Slack webhook (edge runtime)
tests/inquiry.test.mjs     # 네트워크 격리·입력/전송/Block Kit 경계 검증
public/brand/              # 제공 회사소개서의 실제 작업 이미지
public/fonts/              # Pretendard WOFF2 + OFL 라이선스
public/TwoStepsAhead-Company.pdf  # 최신 회사소개서의 고정 다운로드 경로
scripts/make-icons.py      # 기존 경로의 favicon/앱 아이콘/OG 생성
```

홈 카피는 `brand.ts`와 `HomePage.tsx`, 문의 문구는 `BrandContact.tsx`에서 관리합니다. `content.ts`는 현재 채용·법인 정보를 제공하므로 이전 홈 자료와 혼동하지 않습니다. 카피 변경 시 `index.html`의 메타·JSON-LD·no-JS 본문, `public/llms.txt`, PDF도 함께 확인합니다. 문의 분야를 바꾸면 `brand.ts`와 `api/inquiry.ts`의 라벨을 맞춥니다.

브랜드 규격과 사실 표기는 [브랜드 가이드](docs/brand/README.md), 이미지 출처와 폰트 라이선스는 [자산 기록](docs/brand/ASSET-PROVENANCE.md)을 참조합니다. 이전 설계 이력은 `docs/superpowers/`에 보존되어 있습니다.

## 문의·채용·측정

| 설정 | 용도 |
|---|---|
| `SLACK_WEBHOOK_URL` | Vercel 문의 알림 endpoint. 서버에서만 사용 |
| `VITE_CAREERS_API_BASE` | 필요할 때 채용 API base URL override. 기본은 같은 origin |

문의 API는 `{name, company, email, interest, message, _hp}` 계약을 유지합니다. 입력 검증, honeypot, mrkdwn escape를 적용하고 긴 본문은 Slack section 제한에 맞춰 나눕니다. 설정 누락은 500, upstream 실패는 502이며 성공으로 표시하지 않습니다.

`test:inquiry`는 실제 TypeScript handler를 컴파일해 VM에서 실행합니다. VM에 가짜 `.invalid` URL과 mock fetch만 제공하므로 실제 webhook 환경변수를 읽거나 외부로 문의를 보내지 않습니다. 필수 항목·이메일·JSON·honeypot·새 문의 분야·escaping·최대 길이·upstream 실패를 검증합니다.

채용은 `/careers/`와 `/api/careers/*`를 사용하며 Vercel rewrite 및 Vite proxy가 기존 `api.plurank.com` 백엔드로 연결합니다. 지원서 업로드·개인정보 동의·지원 접수 계약과 기존 공개 지원서 경로는 유지합니다.

GA4와 Google Ads 설정을 보존합니다. `inquiry_submit`은 시도, `generate_lead`와 Ads conversion은 API 성공 이후의 접수입니다. 검증 실패·전송 실패를 전환으로 기록하지 않습니다.

## 브랜드 아이콘

```sh
python3 -m pip install Pillow 'fonttools[woff]'
python3 scripts/make-icons.py public
```

저장소의 로컬 Pretendard 폰트를 사용해 SVG/ICO/PNG 아이콘과 1200×630 `og-image.png`를 생성합니다. favicon·Apple touch·앱 아이콘·`logo-square.png`의 기존 URL을 유지합니다. 심벌을 바꾸면 `BrandMark.tsx`와 생성 스크립트의 64-unit 좌표를 함께 맞춥니다. 검색 재수집을 고려해 favicon 경로는 안정적으로 유지합니다.

## 배포

`main` 브랜치에 push하면 **Vercel이 프로덕션 배포**합니다. 수동 배포는 `vercel deploy --prod`입니다. 빌드와 검증을 마친 뒤 기존 프로젝트에 배포합니다.

- Vercel 프로젝트: `tsa-landing`, scope `gunheekim90s-projects`
- 도메인: `twostepsahead.co.kr` + `www` (AWS Route53 관리)
- www 요청은 apex 도메인으로 영구 이동
- production root는 저장소 루트, build는 Vite

배포 후 홈·채용·공개 공고 조회·PDF·아이콘·`app-ads.txt`와 새 메타/번들을 확인합니다. 실제 문의 수신·지원 접수는 mock 검증과 별도입니다.

## 보존 원칙

- 회사 제공자료의 관측 범위·사례에는 시점과 수행 범위를 표시합니다. 인용·상위노출·매출·전환 결과를 보장하지 않습니다.
- 기업 영상 제작 확장, Pluora 학습·개발, 자체 플랫폼 운영을 각각의 실제 단계로 설명합니다.
- `naver-site-verification`, canonical, GA4/Ads, 법인·연락처, 채용 API, 기존 공개 문서, AdMob `app-ads.txt`를 보존합니다.
- 키보드 내비게이션, 충분한 대비, 모바일 가독성과 `prefers-reduced-motion`을 지원합니다.
- API 키·webhook 값·지원자 개인정보를 클라이언트나 저장소에 포함하지 않습니다.
