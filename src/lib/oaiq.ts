/**
 * ChatGPT 광고 측정 픽셀(OpenAI).
 * 각 HTML 머리말에서 init과 page_viewed(사이트 방문)를 보내고, 나머지 전환은 여기서 보냅니다.
 * 광고 관리자 전환 8개(11/14 생성)와 이벤트 이름을 맞춰야 합니다.
 */
export const OAIQ_PIXEL_ID = 'BMU1Eiybza32Ah9GTVBq4Z';

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

function measure(...args: unknown[]) {
  if (typeof window.oaiq === 'function') {
    window.oaiq('measure', ...args);
  }
}

/** 각 HTML 머리말과 같은 조건. 다시 init할 때도 debug 값을 그대로 둡니다. */
function oaiqDebug() {
  return window.location.hostname !== 'twostepsahead.co.kr' || /[?&]oaiq_debug=1/.test(window.location.search);
}

function custom(name: string) {
  measure('custom', { type: 'custom' }, { custom_event_name: name });
}

/**
 * 문의 전환은 브라우저 픽셀과 서버(api/inquiry → 전환 API) 양쪽에서 같은 event_id로 보냅니다.
 * 오픈에이아이가 픽셀 ID, 이벤트 이름, event_id가 같으면 하나로 셉니다.
 * 픽셀이 광고 차단기에 막혀도 서버 쪽이 들어가도록, 아래 값은 픽셀 SDK 없이도 만듭니다.
 */
export type InquiryConversion = {
  event_id: string;
  kind: 'diagnosis' | 'contact';
  source_url: string;
  oppref?: string;
  obref?: string;
  external_id_sha256?: string;
};

/**
 * 사용자 데이터(https://developers.openai.com/ads/measurement-pixel#send-user-data)
 * 외부 ID: 각 HTML 머리말이 방문자마다 무작위 ID를 만들어 그 SHA-256 값만 tsa_vid에 저장하고 init에 넣습니다.
 *         개인정보가 아닌 무작위 값이라 모든 이벤트에 붙고, 서버 이벤트에도 같은 값을 보냅니다.
 * 이메일: 문의를 보낼 때만, 앞뒤 공백을 지우고 소문자로 바꾼 뒤 SHA-256 값으로 보냅니다(원문 전송 0). 폼에 안내 문구가 있습니다.
 */
const HASH_RE = /^[0-9a-f]{64}$/;
const VISITOR_KEY = 'tsa_vid';

function visitorIdHash() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(VISITOR_KEY) ?? 'null');
    if (saved && typeof saved.h === 'string' && HASH_RE.test(saved.h)) return saved.h as string;
  } catch {
    // 저장소를 못 쓰면 외부 ID 없이 보냅니다.
  }
  return undefined;
}

async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** 문의 전송과 동시에 시작해 두고, 접수 성공 뒤 trackOpenAiConversion에 넘깁니다. 실패하면 이메일 없이 보냅니다. */
export async function hashInquiryEmail(email: string): Promise<string | undefined> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  try {
    return await sha256Hex(normalized);
  } catch {
    return undefined;
  }
}

const TOKEN_RE = /^[\x21-\x7e]{1,512}$/;
const OPPREF_KEY = 'tsa_oppref';
const OPPREF_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 픽셀의 __oppref 쿠키와 같은 30일

/** ChatGPT 광고 클릭으로 들어오면 주소에 붙는 ?oppref= 를 우리 쪽에도 저장(픽셀이 막힌 경우 대비). */
function rememberOppref() {
  try {
    const value = new URLSearchParams(window.location.search).get('oppref');
    if (value && TOKEN_RE.test(value)) {
      window.localStorage.setItem(OPPREF_KEY, JSON.stringify({ v: value, t: Date.now() }));
    }
  } catch {
    // 저장소를 못 쓰는 브라우저는 픽셀 쿠키만 씁니다.
  }
}
if (typeof window !== 'undefined') rememberOppref();

function readCookie(name: string) {
  try {
    for (const part of document.cookie.split(';')) {
      const [k, ...rest] = part.trim().split('=');
      if (k === name) {
        const value = decodeURIComponent(rest.join('='));
        return TOKEN_RE.test(value) ? value : undefined;
      }
    }
  } catch {
    // 쿠키를 못 읽으면 비워 둡니다.
  }
  return undefined;
}

function storedOppref() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(OPPREF_KEY) ?? 'null');
    if (saved && typeof saved.v === 'string' && TOKEN_RE.test(saved.v) && Date.now() - saved.t < OPPREF_TTL_MS) {
      return saved.v as string;
    }
  } catch {
    // 저장값이 없거나 깨졌으면 비워 둡니다.
  }
  return undefined;
}

function newEventId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch {
    // 아래 방식으로 만듭니다.
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
}

/**
 * 홈 문의 폼은 「무료 진단 받기」와 「문의하기」가 같은 폼을 씁니다.
 * 마지막으로 누른 #contact 링크 글자에 「진단」이 있으면 무료 진단 신청, 아니면 문의로 셉니다.
 */
let inquiryIntent: 'diagnosis' | 'contact' = 'contact';

export function setInquiryIntentFromLink(label: string) {
  inquiryIntent = label.includes('진단') ? 'diagnosis' : 'contact';
}

/** 문의 전송 직전에 만들어 서버 요청 본문(_oai)에 함께 보냅니다. OWNNEXT는 진단 버튼이 없어 contactOnly. */
export function prepareInquiryConversion(contactOnly = false): InquiryConversion {
  const conversion: InquiryConversion = {
    event_id: newEventId(),
    kind: contactOnly ? 'contact' : inquiryIntent,
    source_url: `${window.location.origin}${window.location.pathname}`,
  };
  const oppref = readCookie('__oppref') ?? storedOppref();
  const obref = readCookie('__obref');
  const externalId = visitorIdHash();
  if (oppref) conversion.oppref = oppref;
  if (obref) conversion.obref = obref;
  if (externalId) conversion.external_id_sha256 = externalId;
  return conversion;
}

/**
 * 문의 전송 성공 뒤 한 번만 호출합니다(구글 광고 전환과 같은 시점).
 * 무료 진단 신청 = lead_created, 문의 폼 제출 = 맞춤 이벤트 contact_form_submit. 서버와 같은 event_id.
 * 사용자 데이터는 init에만 들어가므로, 전환 직전에 외부 ID와 이메일 해시를 함께 넣어 다시 init합니다.
 */
export function trackOpenAiConversion(conversion: InquiryConversion, emailSha256?: string) {
  const user: Record<string, string> = {};
  if (conversion.external_id_sha256 && HASH_RE.test(conversion.external_id_sha256)) {
    user.external_id_sha256 = conversion.external_id_sha256;
  }
  if (emailSha256 && HASH_RE.test(emailSha256)) user.email_sha256 = emailSha256;
  if (Object.keys(user).length && typeof window.oaiq === 'function') {
    window.oaiq('init', { pixelId: OAIQ_PIXEL_ID, debug: oaiqDebug(), user });
  }
  if (conversion.kind === 'diagnosis') {
    measure('lead_created', { type: 'customer_action' }, { event_id: conversion.event_id });
  } else {
    measure('custom', { type: 'custom' }, { custom_event_name: 'contact_form_submit', event_id: conversion.event_id });
  }
}

/** 상담 미팅 예약 완료 뒤. 지금 사이트에는 예약 기능이 없어 아직 부르는 곳이 없습니다. */
export function trackOpenAiAppointment() {
  measure('appointment_scheduled', { type: 'customer_action' });
}

/** 뉴스레터·리포트 신청 폼 전송 성공 뒤. 지금 사이트에는 해당 폼이 없어 아직 부르는 곳이 없습니다. */
export function trackOpenAiRegistration() {
  measure('registration_completed', { type: 'customer_action' });
}

/** 섹션 조회 3종: 페이지마다 한 번씩만 보냅니다. */
export type SectionKey = 'story' | 'markets' | 'cases';
const sentSections = new Set<SectionKey>();

export function trackOpenAiSection(key: SectionKey) {
  if (sentSections.has(key)) return;
  sentSections.add(key);
  if (key === 'story') {
    measure('contents_viewed', {
      type: 'contents',
      contents: [{ id: 'story', name: '서비스 소개', content_type: 'page' }],
    });
  } else if (key === 'markets') {
    custom('market_section_view');
  } else {
    custom('case_study_view');
  }
}

export function isSectionSent(key: SectionKey) {
  return sentSections.has(key);
}
