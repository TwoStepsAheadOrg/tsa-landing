/** ChatGPT 광고 측정 픽셀(OpenAI) — 각 HTML 머리말에서 init과 page_viewed를 보냅니다. */
export const OAIQ_PIXEL_ID = 'BMU1Eiybza32Ah9GTVBq4Z';

declare global {
  interface Window {
    oaiq?: (...args: unknown[]) => void;
  }
}

/**
 * ChatGPT 광고 전환(lead_created) 전송.
 * ⚠ 문의 전송 성공 응답을 받은 뒤에만 호출할 것(구글 광고 전환과 같은 시점).
 */
export function trackOpenAiLead() {
  if (typeof window.oaiq === 'function') {
    window.oaiq('measure', 'lead_created', { type: 'customer_action' });
  }
}
