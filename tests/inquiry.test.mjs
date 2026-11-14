import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

// Compile the real handler. Vite owns the pinned esbuild dependency, so this does
// not add a second toolchain or import a live Vercel environment.
const require = createRequire(import.meta.url);
const viteRequire = createRequire(require.resolve('vite/package.json'));
const esbuild = viteRequire('esbuild');
let compiled;
try {
  compiled = esbuild.transformSync(
    readFileSync(new URL('../api/inquiry.ts', import.meta.url), 'utf8'),
    { loader: 'ts', format: 'cjs', target: 'es2022' },
  ).code;
} finally {
  esbuild.stop();
}

const FAKE_WEBHOOK = 'https://slack.invalid/test-only';
const valid = {
  name: '테스트 담당자', company: '테스트 회사', email: 'tester@example.invalid',
  interest: 'content', message: 'AI 브랜드 콘텐츠 제작 범위를 상담하고 싶습니다.', _hp: '',
};

function request(payload = valid) {
  return new Request('https://website.invalid/api/inquiry', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// Enforce Slack's documented Block Kit limits in the fake upstream. This catches
// forms that pass local validation but would fail when forwarded to Slack.
function acceptsBlockKit(payload) {
  if (!Array.isArray(payload.blocks) || payload.blocks.length > 50) return false;
  return payload.blocks.every((block) => {
    if (block.type === 'header') return block.text.text.length <= 150;
    if (block.type !== 'section') return true;
    return (!block.text || block.text.text.length <= 3000)
      && (!block.fields || block.fields.every((field) => field.text.length <= 2000));
  });
}

const FAKE_CAPI_KEY = 'test-only-capi-key';
const CAPI_URL = 'https://bzr.openai.com/v1/events?pid=BMU1Eiybza32Ah9GTVBq4Z';

function harness({ configured = true, upstream = 'ok', capiKey, capi = 'ok' } = {}) {
  const calls = [];
  const capiCalls = [];
  const errors = [];
  const module = { exports: {} };
  const env = configured ? { SLACK_WEBHOOK_URL: FAKE_WEBHOOK } : {};
  if (capiKey) env.OPENAI_ADS_CAPI_KEY = capiKey;
  // The VM receives a fake environment and only this mock fetch. It cannot read
  // the host webhook or call host fetch; there is no require in the VM either.
  // Timer, abort and URL globals are passed so the conversion path cannot fail
  // with a ReferenceError that a catch block would hide.
  const context = {
    module, exports: module.exports, Request, Response, Headers, URL,
    AbortController, setTimeout, clearTimeout, crypto: globalThis.crypto, TextEncoder,
    process: { env },
    console: { error: (...args) => errors.push(args) },
    fetch: async (url, init) => {
      if (String(url).startsWith('https://bzr.openai.com/')) {
        capiCalls.push({ url: String(url), headers: init.headers, payload: JSON.parse(init.body) });
        if (capi === 'throw') throw new Error('synthetic capi failure');
        if (capi === 'reject') return new Response('{"error":"synthetic"}', { status: 400 });
        if (capi === 'hang') {
          return new Promise((_resolve, reject) => {
            init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
          });
        }
        return new Response('{}', { status: 202 });
      }
      assert.equal(url, FAKE_WEBHOOK, 'only a test webhook may be requested');
      assert.equal(init.method, 'POST');
      assert.equal(init.headers['content-type'], 'application/json');
      const payload = JSON.parse(init.body);
      calls.push(payload);
      if (upstream === 'throw') throw new Error('synthetic transport failure');
      if (upstream === 'reject') return new Response('synthetic upstream failure', { status: 503 });
      if (!acceptsBlockKit(payload)) return new Response('invalid_blocks', { status: 400 });
      return new Response('ok');
    },
  };
  runInNewContext(compiled, context, { filename: 'inquiry.test-isolated.cjs' });
  return { handler: module.exports.default, calls, capiCalls, errors };
}

async function assertResponse(response, status, body) {
  assert.equal(response.status, status);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await response.json(), body);
}

function messageText(payload) {
  return payload.blocks.filter((b) => b.type === 'section' && b.text)
    .map((b) => b.text.text.replace(/^\*Message(?: \(continued\))?\*\n/, '')).join('');
}

function escapeExpected(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

test('rejects non-POST before trying to send', async () => {
  const h = harness();
  await assertResponse(await h.handler(new Request('https://website.invalid/api/inquiry')), 405, { error: 'method_not_allowed' });
  assert.equal(h.calls.length, 0);
});

test('rejects malformed JSON without sending', async () => {
  const h = harness();
  const req = new Request('https://website.invalid/api/inquiry', { method: 'POST', body: '{broken' });
  await assertResponse(await h.handler(req), 400, { error: 'invalid_json' });
  assert.equal(h.calls.length, 0);
});

for (const [label, payload] of [['null', null], ['array', []], ['string', 'invalid']]) {
  test(`rejects a ${label} JSON payload without sending`, async () => {
    const h = harness();
    await assertResponse(await h.handler(request(payload)), 400, { error: 'invalid_json' });
    assert.equal(h.calls.length, 0);
  });
}

for (const field of ['name', 'company', 'email', 'message']) {
  test(`rejects missing ${field} without sending`, async () => {
    const h = harness();
    await assertResponse(await h.handler(request({ ...valid, [field]: '  ' })), 400, { error: 'missing_fields' });
    assert.equal(h.calls.length, 0);
  });
}

test('rejects invalid email and short message without sending', async () => {
  const h = harness();
  await assertResponse(await h.handler(request({ ...valid, email: 'invalid' })), 400, { error: 'invalid_email' });
  await assertResponse(await h.handler(request({ ...valid, message: '짧은 내용' })), 400, { error: 'message_too_short' });
  assert.equal(h.calls.length, 0);
});

test('honeypot returns a neutral success with zero sends, even without webhook config', async () => {
  const h = harness({ configured: false });
  await assertResponse(await h.handler(request({ _hp: 'bot' })), 200, { ok: true });
  assert.equal(h.calls.length, 0);
});

for (const [interest, label] of [
  ['content', 'AI 콘텐츠·모델 제작'],
  ['geo', 'AI 답변 측정·GEO (Plurank)'],
  ['global', '레딧·해외 마케팅 (MICROWAVE)'],
  ['influencer', '해외 인플루언서·방한 체험단 (MICROWAVE)'],
  ['creator', '크리에이터 사업 · OWNNEXT'],
]) {
  test(`new ${interest} interest reaches the notification with its readable label`, async () => {
    const h = harness();
    await assertResponse(await h.handler(request({ ...valid, interest })), 200, { ok: true });
    assert.equal(h.calls.length, 1);
    assert.ok(h.calls[0].blocks.flatMap((b) => b.fields || []).some((f) => f.text === `*Interest*\n${label}`));
  });
}

test('escapes mention and link syntax in user fields without losing content', async () => {
  const h = harness();
  const payload = {
    ...valid, name: '<!channel> & name', company: '<https://bad.invalid|name>',
    interest: '<!here>&', message: '고객 메시지: <!channel> & <https://bad.invalid|클릭>',
  };
  await assertResponse(await h.handler(request(payload)), 200, { ok: true });
  const fields = h.calls[0].blocks.flatMap((b) => b.fields || []);
  assert.ok(fields.some((f) => f.text === `*Name*\n${escapeExpected(payload.name)}`));
  assert.ok(fields.some((f) => f.text === `*Company*\n${escapeExpected(payload.company)}`));
  assert.ok(fields.some((f) => f.text === `*Interest*\n${escapeExpected(payload.interest)}`));
  assert.equal(messageText(h.calls[0]), escapeExpected(payload.message));
});

test('a normal accepted inquiry sends once and returns success', async () => {
  const h = harness();
  await assertResponse(await h.handler(request()), 200, { ok: true });
  assert.equal(h.calls.length, 1);
  assert.equal(messageText(h.calls[0]), valid.message);
});

test('missing configuration returns failure without a send', async () => {
  const h = harness({ configured: false });
  await assertResponse(await h.handler(request()), 500, { error: 'webhook_not_configured' });
  assert.equal(h.calls.length, 0);
});

test('upstream rejection is not reported as a successful lead', async () => {
  const h = harness({ upstream: 'reject' });
  await assertResponse(await h.handler(request()), 502, { error: 'slack_failed' });
  assert.equal(h.calls.length, 1);
});

test('transport failure is not reported as a successful lead', async () => {
  const h = harness({ upstream: 'throw' });
  await assertResponse(await h.handler(request()), 502, { error: 'slack_unreachable' });
  assert.equal(h.calls.length, 1);
});

for (const [label, extra] of [
  ['4000-character message', { message: '가'.repeat(4000) }],
  ['200-character company', { company: '가'.repeat(200) }],
  ['200-character company with escape expansion', { company: '&'.repeat(200) }],
  ['700 ampersands', { message: '&'.repeat(700) }],
  ['4000 ampersands', { message: '&'.repeat(4000) }],
  ['mixed emoji and escaped text', { message: '🙂<&>'.repeat(800) }],
  ['emoji at the text chunk boundary', { message: '가'.repeat(399) + '🙂<&>'.repeat(720) }],
]) {
  test(`${label} remains valid for Slack and preserves the accepted message`, async () => {
    const h = harness();
    const payload = { ...valid, ...extra };
    await assertResponse(await h.handler(request(payload)), 200, { ok: true });
    assert.equal(h.calls.length, 1);
    assert.ok(acceptsBlockKit(h.calls[0]));
    assert.equal(messageText(h.calls[0]), escapeExpected(payload.message));
    for (const block of h.calls[0].blocks.filter((b) => b.type === 'section' && b.text)) {
      assert.ok(block.text.text.isWellFormed(), 'each block keeps complete Unicode characters');
      assert.doesNotMatch(block.text.text, /&(?!amp;|lt;|gt;)/, 'each block keeps complete escape entities');
    }
  });
}

test('oversized input is clipped to the existing server limit and still delivered safely', async () => {
  const h = harness();
  await assertResponse(await h.handler(request({ ...valid, message: '&'.repeat(5000) })), 200, { ok: true });
  assert.equal(h.calls.length, 1);
  assert.ok(acceptsBlockKit(h.calls[0]));
  assert.equal(messageText(h.calls[0]), '&amp;'.repeat(4000) + '…');
});

// ChatGPT 광고 전환 API(서버 이벤트)
const VISITOR_SHA256 = createHash('sha256').update('test-visitor-id').digest('hex');
// 문서 규칙: 앞뒤 공백 제거, 소문자, UTF-8, SHA-256 소문자 16진수 64자
const EMAIL_SHA256 = createHash('sha256').update(valid.email.trim().toLowerCase(), 'utf8').digest('hex');
const oai = { event_id: '3f0c9f5e-1b2a-4c3d-9e8f-0a1b2c3d4e5f', kind: 'diagnosis', source_url: 'https://twostepsahead.co.kr/', oppref: 'gAAAAAtest_oppref', obref: 'obref-test-1', external_id_sha256: VISITOR_SHA256 };
function requestWith(extra, headers = {}) {
  return new Request('https://website.invalid/api/inquiry', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': 'TestAgent/1.0', 'x-forwarded-for': '203.0.113.7, 10.0.0.1', ...headers },
    body: JSON.stringify({ ...valid, ...extra }),
  });
}

test('without a conversion key, an accepted inquiry sends no server conversion', async () => {
  const h = harness();
  await assertResponse(await h.handler(requestWith({ _oai: oai })), 200, { ok: true });
  assert.equal(h.calls.length, 1);
  assert.equal(h.capiCalls.length, 0);
});

test('a diagnosis inquiry sends exactly one lead_created with the browser event id', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await assertResponse(await h.handler(requestWith({ _oai: oai })), 200, { ok: true });
  assert.equal(h.capiCalls.length, 1);
  const call = h.capiCalls[0];
  assert.equal(call.url, CAPI_URL);
  assert.equal(call.headers.authorization, `Bearer ${FAKE_CAPI_KEY}`);
  assert.equal(call.payload.integration_source, 'tsa-landing');
  assert.equal(call.payload.events.length, 1);
  const e = call.payload.events[0];
  assert.equal(e.id, oai.event_id);
  assert.equal(e.type, 'lead_created');
  assert.deepEqual(e.data, { type: 'customer_action' });
  assert.equal(e.action_source, 'web');
  assert.equal(e.source_url, 'https://twostepsahead.co.kr/');
  assert.equal(e.oppref, oai.oppref);
  assert.deepEqual(e.user, {
    emails_sha256: [EMAIL_SHA256], external_ids_sha256: [oai.external_id_sha256],
    ip_address: '203.0.113.7', user_agent: 'TestAgent/1.0', obref: oai.obref,
  });
  assert.ok(Number.isInteger(e.timestamp_ms) && Math.abs(Date.now() - e.timestamp_ms) < 60_000);
  assert.ok(!JSON.stringify(call.payload).includes(valid.email), 'email must not be sent');
  assert.ok(!JSON.stringify(h.errors).includes(FAKE_CAPI_KEY), 'key must not be logged');
});

test('a contact inquiry sends the custom contact_form_submit event', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await assertResponse(await h.handler(requestWith({ _oai: { ...oai, kind: 'contact', oppref: undefined, obref: undefined } })), 200, { ok: true });
  const e = h.capiCalls[0].payload.events[0];
  assert.equal(e.type, 'custom');
  assert.equal(e.custom_event_name, 'contact_form_submit');
  assert.deepEqual(e.data, { type: 'custom' });
  assert.equal('oppref' in e, false);
  assert.equal('obref' in e.user, false);
});

test('no event id (old cached page) means no server conversion, to avoid double counting', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await assertResponse(await h.handler(requestWith({})), 200, { ok: true });
  await assertResponse(await h.handler(requestWith({ _oai: { ...oai, event_id: 'x' } })), 200, { ok: true });
  assert.equal(h.calls.length, 2);
  assert.equal(h.capiCalls.length, 0);
});

test('a failed Slack delivery sends no server conversion', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY, upstream: 'reject' });
  await assertResponse(await h.handler(requestWith({ _oai: oai })), 502, { error: 'slack_failed' });
  assert.equal(h.capiCalls.length, 0);
});

test('honeypot submissions send no server conversion', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await assertResponse(await h.handler(requestWith({ _hp: 'bot', _oai: oai })), 200, { ok: true });
  assert.equal(h.capiCalls.length, 0);
});

for (const mode of ['reject', 'throw', 'hang']) {
  test(`a ${mode} conversion call still returns the inquiry success`, async () => {
    const h = harness({ capiKey: FAKE_CAPI_KEY, capi: mode });
    await assertResponse(await h.handler(requestWith({ _oai: oai })), 200, { ok: true });
    assert.equal(h.capiCalls.length, 1);
    assert.equal(h.errors.length, 1);
    assert.ok(!JSON.stringify(h.errors).includes(FAKE_CAPI_KEY));
  });
}

test('untrusted attribution values are dropped or normalised', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await h.handler(requestWith(
    { _oai: { ...oai, source_url: 'https://evil.example/landing?x=1', oppref: 'has space', obref: 'x'.repeat(600), external_id_sha256: 'raw-visitor-id' } },
    { 'x-forwarded-for': 'not-an-ip' },
  ));
  const e = h.capiCalls[0].payload.events[0];
  assert.equal(e.source_url, 'https://twostepsahead.co.kr/');
  assert.equal('oppref' in e, false);
  assert.deepEqual(e.user, { emails_sha256: [EMAIL_SHA256], user_agent: 'TestAgent/1.0' });
});

test('the source page path is kept without its query string', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await h.handler(requestWith({ _oai: { ...oai, source_url: 'https://twostepsahead.co.kr/ownnext/?oppref=abc' } }));
  assert.equal(h.capiCalls[0].payload.events[0].source_url, 'https://twostepsahead.co.kr/ownnext/');
});

test('the email hash follows the trim and lowercase rule, and the raw email never leaves', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  await h.handler(requestWith({ email: '  Tester@Example.INVALID ', _oai: oai }));
  const sent = JSON.stringify(h.capiCalls[0].payload);
  assert.deepEqual(h.capiCalls[0].payload.events[0].user.emails_sha256, [EMAIL_SHA256]);
  assert.match(EMAIL_SHA256, /^[0-9a-f]{64}$/);
  assert.equal(sent.toLowerCase().includes('example.invalid'), false);
});

test('an old cached page without a visitor id still sends the email hash only', async () => {
  const h = harness({ capiKey: FAKE_CAPI_KEY });
  const { external_id_sha256, ...withoutVisitor } = oai;
  await h.handler(requestWith({ _oai: withoutVisitor }));
  const user = h.capiCalls[0].payload.events[0].user;
  assert.equal('external_ids_sha256' in user, false);
  assert.deepEqual(user.emails_sha256, [EMAIL_SHA256]);
});
