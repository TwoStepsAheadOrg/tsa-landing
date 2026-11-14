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
 * 홈 문의 폼은 「무료 진단 받기」와 「문의하기」가 같은 폼을 씁니다.
 * 마지막으로 누른 #contact 링크 글자에 「진단」이 있으면 무료 진단 신청, 아니면 문의로 셉니다.
 */
let inquiryIntent: 'diagnosis' | 'contact' = 'contact';

export function setInquiryIntentFromLink(label: string) {
  inquiryIntent = label.includes('진단') ? 'diagnosis' : 'contact';
}

/**
 * 홈 문의 폼 전송 성공 뒤 한 번만 호출합니다(구글 광고 전환과 같은 시점).
 * 무료 진단 신청 = lead_created, 문의 폼 제출 = 맞춤 이벤트 contact_form_submit.
 */
export function trackOpenAiInquiry() {
  if (inquiryIntent === 'diagnosis') {
    measure('lead_created', { type: 'customer_action' });
  } else {
    custom('contact_form_submit');
  }
}

/** 진단 버튼이 없는 문의 폼(OWNNEXT 크리에이터 문의)의 전송 성공 뒤. */
export function trackOpenAiContact() {
  custom('contact_form_submit');
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
