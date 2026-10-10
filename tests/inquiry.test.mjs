import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
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

function harness({ configured = true, upstream = 'ok' } = {}) {
  const calls = [];
  const errors = [];
  const module = { exports: {} };
  // The VM receives a fake environment and only this mock fetch. It cannot read
  // the host webhook or call host fetch; there is no require in the VM either.
  const context = {
    module, exports: module.exports, Request, Response, Headers,
    process: { env: configured ? { SLACK_WEBHOOK_URL: FAKE_WEBHOOK } : {} },
    console: { error: (...args) => errors.push(args) },
    fetch: async (url, init) => {
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
  return { handler: module.exports.default, calls, errors };
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
  ['geo', 'AI 검색·브랜드 콘텐츠 (AEO/GEO)'],
  ['global', '글로벌·Reddit 마케팅'],
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
