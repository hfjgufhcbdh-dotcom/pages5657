const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const resp = await fetch('https://navasan.net/api/free-api/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'dehdehban-baha/1.0',
      },
    });
