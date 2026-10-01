const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const ALLOWED = [
  'api.coingecko.com',
  'hacker-news.firebaseio.com',
  'api.coinbase.com',
  'min-api.cryptocompare.com'
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/api/navasan') {
      try {
        const r = await fetch('https://navasan.net/api/free-api/');
        return new Response(await r.text(), {
          status: r.status,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public,max-age=60',
            ...CORS
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS }
        });
      }
    }

    if (url.pathname === '/api/proxy') {
      const target = url.searchParams.get('url');

      if (!target) {
        return new Response(JSON.stringify({ error: 'Missing url' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS }
        });
      }

      try {
        const targetUrl = new URL(target);

        if (!ALLOWED.includes(targetUrl.hostname)) {
          return new Response(JSON.stringify({ error: 'Domain not allowed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...CORS }
          });
        }

        const r = await fetch(targetUrl);
        return new Response(await r.text(), {
          status: r.status,
          headers: {
            'Content-Type': r.headers.get('Content-Type') || 'application/json',
            'Cache-Control': 'public,max-age=30',
            ...CORS
          }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
