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
};

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
  if (oppref) conversion.oppref = oppref;
  if (obref) conversion.obref = obref;
  return conversion;
}

/**
 * 문의 전송 성공 뒤 한 번만 호출합니다(구글 광고 전환과 같은 시점).
 * 무료 진단 신청 = lead_created, 문의 폼 제출 = 맞춤 이벤트 contact_form_submit. 서버와 같은 event_id.
 */
export function trackOpenAiConversion(conversion: InquiryConversion) {
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
