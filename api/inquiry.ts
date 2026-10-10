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
  geo: 'AI 검색·브랜드 콘텐츠 (AEO/GEO)',
  global: '글로벌·Reddit 마케팅',
  ax: 'AX 도입 · AI 상담/자동화/에이전트',
  dx: 'DX 구축 · SaaS/관제/CRM 개발',
  aicx: 'AICX · AI 전화/채팅 응대',
  edu: '기업교육 · 강의/워크숍',
  studio: '스튜디오 협업 · 제휴',
  other: '기타',
};

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

  const webhookUrl = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env?.SLACK_WEBHOOK_URL;
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
  return jsonResponse({ ok: true });
}
