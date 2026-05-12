import { birthInfoToFourPillars } from '../../src/saju.js';
import { buildClaudeRequest } from '../../src/reading-prompt.js';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}

function validateInput(input) {
  const required = ['year', 'month', 'day', 'hour'];
  for (const k of required) {
    if (typeof input[k] !== 'number') return `missing or non-numeric: ${k}`;
  }
  const { year, month, day, hour } = input;
  if (year < 1900 || year > 2100) return 'year out of range (1900–2100)';
  if (month < 1 || month > 12) return 'month out of range (1–12)';
  if (day < 1 || day > 31) return 'day out of range (1–31)';
  if (hour < 0 || hour > 23) return 'hour out of range (0–23)';
  return null;
}

async function callClaude(env, request) {
  const body = {
    model: env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
    max_tokens: Number(env.MAX_TOKENS) || 1024,
    system: request.system,
    messages: request.messages,
  };
  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${text}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { text, usage: data.usage };
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return json({ ok: true, ts: Date.now() }, 200, env);
    }

    if (request.method !== 'POST' || url.pathname !== '/reading') {
      return json({ error: 'POST /reading or GET /health' }, 404, env);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'server misconfigured: no API key' }, 500, env);
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return json({ error: 'invalid JSON body' }, 400, env);
    }

    const validationError = validateInput(input);
    if (validationError) return json({ error: validationError }, 400, env);

    const language = ['en', 'ko', 'ja', 'zh'].includes(input.language) ? input.language : 'en';

    let saju;
    try {
      saju = birthInfoToFourPillars({
        year: input.year,
        month: input.month,
        day: input.day,
        hour: input.hour,
        minute: input.minute || 0,
      });
    } catch (e) {
      return json({ error: `saju calc failed: ${e.message}` }, 500, env);
    }

    const claudeReq = buildClaudeRequest(saju, { language });

    let reading;
    try {
      reading = await callClaude(env, claudeReq);
    } catch (e) {
      return json({ error: e.message }, 502, env);
    }

    return json(
      {
        saju: {
          pillars: saju.pillars,
          dayMaster: saju.dayMaster,
          dayMasterElement: saju.dayMasterElement,
          elements: saju.elements,
          tenGods: saju.tenGods,
        },
        reading: reading.text,
        language,
        usage: reading.usage,
      },
      200,
      env
    );
  },
};
