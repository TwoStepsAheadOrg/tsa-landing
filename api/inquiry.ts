/**
 * POST /api/inquiry
 *
 * Forwards a website inquiry to a Slack incoming webhook.
 * Set SLACK_WEBHOOK_URL in Vercel project env vars (Production + Preview).
 *
 * Body: { name, company, email, interest?, message, _hp? }
 */

export const config = { runtime: 'edge' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 4000;

const INTEREST_LABEL: Record<string, string> = {
  content: 'AI 콘텐츠·모델 제작',
  geo: 'AI 답변 측정·GEO (Plurank)',
  global: '레딧·해외 마케팅 (MICROWAVE)',
  influencer: '해외 인플루언서·방한 체험단 (MICROWAVE)',
  creator: '크리에이터 사업 · OWNNEXT',
  ax: 'AX 도입 · AI 상담/자동화/에이전트',
  dx: 'DX 구축 · SaaS/관제/CRM 개발',
  aicx: 'AICX · AI 전화/채팅 응대',
  edu: '기업교육 · 강의/워크숍',
  studio: '스튜디오 협업 · 제휴',
  other: '기타',
};

/**
 * ChatGPT 광고 전환 API(서버 이벤트). https://developers.openai.com/ads/conversions-api
 * 브라우저 픽셀과 같은 event_id로 보내 오픈에이아이가 하나로 셉니다.
 * OPENAI_ADS_CAPI_KEY(운영 환경 변수, 광고 관리자 전환 탭에서 발급)가 없으면 보내지 않습니다.
 * 문의 폼에 동의 문구가 없어 이메일 해시는 보내지 않습니다(IP, 브라우저 정보, obref, oppref만).
 */
const OAI_EVENTS_URL = 'https://bzr.openai.com/v1/events';
const OAI_DEFAULT_PIXEL_ID = 'BMU1Eiybza32Ah9GTVBq4Z';
const OAI_TOKEN_RE = /^[\x21-\x7e]{1,512}$/;
const OAI_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const OAI_SITE_HOSTS = new Set(['twostepsahead.co.kr']);
const OAI_TIMEOUT_MS = 3000;

function clientIp(req: Request): string | undefined {
  const raw =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    '';
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(raw)) return raw;
  if (raw.includes(':') && /^[0-9a-fA-F:.]{2,45}$/.test(raw)) return raw;
  return undefined;
}

/** 클라이언트가 보낸 _oai 값으로 전환 API 이벤트 하나를 만든다. event_id가 없으면 보내지 않는다(중복 집계 방지). */
function openAiConversionEvent(raw: unknown, req: Request, now: number) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const c = raw as Record<string, unknown>;
  const id = typeof c.event_id === 'string' ? c.event_id : '';
  if (!OAI_ID_RE.test(id)) return null;

  let sourceUrl = 'https://twostepsahead.co.kr/';
  if (typeof c.source_url === 'string') {
    try {
      const u = new URL(c.source_url);
      if (u.protocol === 'https:' && OAI_SITE_HOSTS.has(u.hostname)) sourceUrl = u.origin + u.pathname;
    } catch {
      // 잘못된 주소는 기본 주소로
    }
  }

  const user: Record<string, string> = {};
  const ip = clientIp(req);
  if (ip) user.ip_address = ip;
  const ua = req.headers.get('user-agent')?.trim();
  if (ua) user.user_agent = ua.slice(0, 1024);
  if (typeof c.obref === 'string' && OAI_TOKEN_RE.test(c.obref)) user.obref = c.obref;

  const event: Record<string, unknown> =
    c.kind === 'diagnosis'
      ? { id, type: 'lead_created', data: { type: 'customer_action' } }
      : { id, type: 'custom', custom_event_name: 'contact_form_submit', data: { type: 'custom' } };
  event.timestamp_ms = now;
  event.action_source = 'web';
  event.source_url = sourceUrl;
  if (typeof c.oppref === 'string' && OAI_TOKEN_RE.test(c.oppref)) event.oppref = c.oppref;
  if (Object.keys(user).length) event.user = user;
  return event;
}

/** 실패해도 문의 응답에는 영향을 주지 않는다. 키는 기록하지 않는다. */
async function sendOpenAiConversion(event: Record<string, unknown>, env: Record<string, string | undefined>) {
  const key = env.OPENAI_ADS_CAPI_KEY?.trim();
  if (!key) return;
  const pixelId = env.OPENAI_ADS_PIXEL_ID?.trim() || OAI_DEFAULT_PIXEL_ID;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OAI_TIMEOUT_MS);
  try {
    const r = await fetch(`${OAI_EVENTS_URL}?pid=${encodeURIComponent(pixelId)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
      body: JSON.stringify({ integration_source: 'tsa-landing', events: [event] }),
      signal: controller.signal,
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      console.error('openai conversion failed', r.status, txt.slice(0, 300));
    }
  } catch (e) {
    console.error('openai conversion error', e instanceof Error ? e.name : 'unknown');
  } finally {
    clearTimeout(timer);
  }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function clip(s: unknown, n = MAX_LEN): string {
  const str = typeof s === 'string' ? s : '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

/**
 * Slack mrkdwn 주입 방어 — 인증 없는 공개 엔드포인트이므로 사용자 입력의
 * &, <, > 를 이스케이프해 <!channel> 멘션·위장 링크 삽입을 차단한다.
 * https://api.slack.com/reference/surfaces/formatting#escaping
 */
function escapeMrkdwn(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Slack section text is limited to 3,000 characters after escaping. Split the
 * original text first, keeping Unicode code points and escape entities intact.
 * A 400-code-point chunk expands to at most 2,000 characters, plus its label.
 * https://docs.slack.dev/reference/block-kit/blocks/section-block/
 */
function messageSections(rawMessage: string) {
  const characters = Array.from(rawMessage);
  const sections = [];
  for (let offset = 0; offset < characters.length; offset += 400) {
    const label = offset === 0 ? 'Message' : 'Message (continued)';
    const text = escapeMrkdwn(characters.slice(offset, offset + 400).join(''));
    sections.push({ type: 'section', text: { type: 'mrkdwn', text: `*${label}*\n${text}` } });
  }
  return sections;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  // Honeypot — silently drop bot traffic so they think it worked.
  if (body._hp) return jsonResponse({ ok: true });

  const rawName = clip(body.name, 200).trim();
  const rawCompany = clip(body.company, 200).trim();
  const rawEmail = clip(body.email, 200).trim();
  const interestKey = clip(body.interest, 40).trim() || 'other';
  const rawMessage = clip(body.message).trim();

  if (!rawName || !rawCompany || !rawEmail || !rawMessage) {
    return jsonResponse({ error: 'missing_fields' }, 400);
  }
  if (!EMAIL_RE.test(rawEmail)) {
    return jsonResponse({ error: 'invalid_email' }, 400);
  }
  if (rawMessage.length < 10) {
    return jsonResponse({ error: 'message_too_short' }, 400);
  }

  // 검증은 원본 기준, Slack 표시용은 전부 이스케이프.
  const name = escapeMrkdwn(rawName);
  const company = escapeMrkdwn(rawCompany);
  const email = escapeMrkdwn(rawEmail);
  const interest = INTEREST_LABEL[interestKey] ?? escapeMrkdwn(interestKey);

  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const webhookUrl = env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL not configured');
    return jsonResponse({ error: 'webhook_not_configured' }, 500);
  }

  const ua = req.headers.get('user-agent') ?? 'unknown';
  const referer = req.headers.get('referer') ?? '';
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const slackMessage = {
    text: `📬 New inquiry · ${company} (${name})`,
    blocks: [
      {
        type: 'header',
        // A fixed heading stays within Slack's 150-character header limit;
        // the full accepted company name is preserved in the field below.
        text: { type: 'plain_text', text: '📬 New website inquiry', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name*\n${name}` },
          { type: 'mrkdwn', text: `*Company*\n${company}` },
          { type: 'mrkdwn', text: `*Email*\n<mailto:${email}|${email}>` },
          { type: 'mrkdwn', text: `*Interest*\n${interest}` },
        ],
      },
      ...messageSections(rawMessage),
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `via twostepsahead.co.kr · ${new Date().toISOString()} · ip ${ip} · ${referer || 'direct'}`,
          },
        ],
      },
    ],
  };

  try {
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(slackMessage),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      console.error('slack webhook failed', r.status, txt);
      return jsonResponse({ error: 'slack_failed' }, 502);
    }
  } catch (e) {
    console.error('slack fetch error', e);
    return jsonResponse({ error: 'slack_unreachable' }, 502);
  }

  void ua; // reserved for future logging

  // 접수된 문의만 ChatGPT 광고 전환 API로 보낸다(실패해도 문의는 성공).
  const conversion = openAiConversionEvent(body._oai, req, Date.now());
  if (conversion) await sendOpenAiConversion(conversion, env);

  return jsonResponse({ ok: true });
}
