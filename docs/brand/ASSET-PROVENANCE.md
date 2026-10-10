# 브랜드 자산 출처와 표기 · 2026-10-10

## 회사 제공 작업 이미지

아래 이미지는 사용자가 제공한 `투스텝스어헤드_회사소개_콜라주표지_20261008.pdf`에서 추출한 작업 예시를 웹용 WebP로 변환한 것입니다. 이미지의 서비스·캐릭터·작품 맥락을 유지합니다. 제공 자료의 재사용은 해당 이미지에 별도의 공개 재배포 라이선스를 부여한다는 의미가 아닙니다.

| 웹 자산 | 원본 회사소개서 | 내용 |
|---|---|---|
| `public/brand/plurank.webp` | 1쪽 | Plurank 서비스 화면 |
| `public/brand/rin-portrait.webp` | 1쪽 | RIN 미러 포트레이트 |
| `public/brand/nextep-poster.webp` | 1·6쪽 | NextEp 「오른손의 반지」 포스터 |
| `public/brand/telling.webp` | 1·6쪽 | Telling 견생사주 콘텐츠 포스터 |
| `public/brand/channel-ko.webp` | 7쪽 | 한국어 드라마 채널 화면 |
| `public/brand/channel-ja.webp` | 7쪽 | 일본어 드라마 채널 화면 |
| `public/brand/channel-orbit.webp` | 7쪽 | ORBIT MINUTE 채널 화면 |
| `public/brand/rin-beauty.webp` | 8쪽 | RIN 메이크업 전후 표현 |
| `public/brand/rin-life.webp` | 8쪽 | RIN 일상 장면 |
| `public/brand/rin-fashion.webp` | 8쪽 | RIN 패션 장면 |

RIN은 AI 가상 인물이며 메이크업 전후 이미지는 AI 캐릭터의 표현 사례입니다. 특정 실제 사람이나 화장품의 임상 효과를 나타내는 자료로 설명하지 않습니다. 원본에 공개되지 않은 협업 브랜드명은 새로 공개하지 않습니다.

채널 이미지는 원본에 명시된 **2026-10-08 캡처**입니다. 이미지 안의 수치를 실시간 채널 성과로 소개하지 않습니다. Plurank 화면도 제품 사용 예시이며 전체 고객이나 현재 결과를 나타내는 통계로 쓰지 않습니다.

원본 PDF SHA-256: `e11a6f8acf2de6091234dd8e4c70c1b3ebb8047444837a6a1e056327099c941e`.

## 자체 브랜드 그래픽

새 두 사각형 심벌은 이번 리브랜딩의 절차적 벡터 디자인입니다. `src/app/components/BrandMark.tsx`와 `scripts/make-icons.py`가 동일한 좌표를 사용합니다. 로고·아이콘·OG는 이 도형, 색상, 로컬 서체로 구성하며 외부 스톡 이미지가 들어가지 않습니다.

### 후속 히어로 개편

- `public/brand/data-to-creative.webp`: 내장 image_gen으로 새로 생성한 데이터→콘텐츠 개념 시각화입니다. 실제 제품 화면이나 측정 성과 그래프가 아닙니다. 투명 PNG 원본(1374×1145)을 같은 크기의 WebP로 인코딩했으며 내용·색·구성을 편집하지 않았습니다.
- 생성 원본과 요청문 기록: 작업 원장의 `outputs/tsa-rebrand-20261010/revision-v2/assets/data-to-creative.png` 및 `IMAGE-PROMPT.md`. 요청문 사본은 [IMAGE-PROMPT-20261010.md](IMAGE-PROMPT-20261010.md)에 보존합니다.
- RIN 히어로는 기존 `rin-portrait.webp`를 그대로 인스타그램 스타일의 휴대폰 화면 안에 표시합니다. 화면은 HTML/CSS로 만든 콘텐츠 시안이며 실제 계정 화면 캡처가 아닙니다. RIN의 AI 가상 모델 표기를 유지하고, 가짜 계정 handle·좋아요·팔로워·인증 배지를 넣지 않습니다.

### 전설이래 Instagram 사례

사용자가 지정한 [@jeonseolirae](https://www.instagram.com/jeonseolirae/)의 실제 공개 릴스 썸네일을 재사용합니다. 두 1080×1920 원본을 크기·구성 변경 없이 WebP로 인코딩했으며 웹에서도 9:16 전체 프레임을 표시합니다.

| 자산 | 공개 원본 |
|---|---|
| `public/brand/jeonseolirae-sokcho.webp` | [속초 이름의 유래 릴스](https://www.instagram.com/jeonseolirae/reel/DeK6_C9RRSo/) |
| `public/brand/jeonseolirae-ulsan.webp` | [울산바위 릴스](https://www.instagram.com/jeonseolirae/reel/DeJz1gexUdQ/) |

실관측 원장: `outputs/tsa-rebrand-20261010/revision-v2/research/INSTAGRAM-LIVE-DOM.json`. 2026-10-10 공개 화면에서 팔로워 699명, 릴스 10편을 확인했습니다. 대표 릴스 표시 조회수는 각각 6.4만·1.2만입니다. 10편의 표시 조회수 합은 101,359로 계산되며, 일부 표시값이 반올림되어 있어 공개 카피에는 **약 10.1만**으로 씁니다. 합계는 고유 시청자 수가 아니며 광고 집행 여부, 전환 실적을 입증하지 않습니다.

### 성과 기간 — 2026-10-10 회사 제공 정정

회사 담당자가 이번 대화에서 직접 제공한 기간을 반영했습니다. 전설이래는 **제작 2일 만의 성과**, 한국어 채널 **이게 진짜라고?는 1주일간의 성과**입니다. 기간은 회사 제공 정보이며 공개 수치만으로 역산한 것이 아닙니다. 기존 수치·캡처 기준일은 유지하고 일본어 채널이나 ORBIT의 운영 기간까지 확대하지 않습니다.

## 서체

Pretendard Regular/SemiBold는 SIL Open Font License 1.1로 제공됩니다. 실제 포함된 저작권 고지와 라이선스 전문은 [`public/fonts/OFL-Pretendard.txt`](../../public/fonts/OFL-Pretendard.txt)에 보존되어 있습니다. 웹에서는 자체 호스팅한 WOFF2를 사용하고, 아이콘·OG 생성기는 같은 WOFF2를 읽습니다. 배포할 때 이 라이선스 파일도 함께 유지합니다.

## 지표와 사업 단계

- **14개국·7개 AI 플랫폼:** 2026년 9월 자체 운영자료의 관측 범위. 현재 실시간 운영 규모나 고객 성과로 바꿔 쓰지 않습니다.
- **192편·12개 업체:** 회사소개서에 사용하는 경우 2026년 9월 자료의 콘텐츠 제작·발행 사례 수라는 범위와 시점을 유지합니다. 웹의 핵심 설명은 필요한 관측 범위 중심으로 구성합니다.
- **삼성 Galaxy S26:** 어센트AI 협업을 통한 데이터 공급·분석 범위입니다. 직접 계약·공식 파트너 관계로 표현하지 않습니다.
- **Pluora:** 학습·개발 단계입니다. 제공 중인 상용 예측 엔진처럼 표시하지 않습니다.
- **기업 브랜드 영상·AI 모델 제작:** 자체 제작·운영 역량을 확장하는 단계이며 프로젝트별 범위를 협의합니다.
- **성장·재무 장표:** 제거한 원본 장표의 수치를 다른 위치의 성과 주장으로 옮기지 않습니다.

웹·회사소개서·OG·검색 메타는 같은 핵심 문장을 사용합니다. 자료를 갱신할 때 관측 시점, 납품 범위, 실제 운영과 개발 단계를 함께 확인합니다.
