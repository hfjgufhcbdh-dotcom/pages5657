const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "public, max-age=60"
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }

  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Only GET is allowed"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...CORS_HEADERS
        }
      }
    );
  }

  if (!env.TINDEX) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "TINDEX token is not configured"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...CORS_HEADERS
        }
      }
    );
  }

  try {
    const resp = await fetch(
      "https://tindex.app/api/public/boards?lang=fa",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${env.TINDEX}`,
          "Accept": "application/json"
        }
      }
    );

    const data = await resp.text();

    return new Response(data, {
      status: resp.status,
      headers: {
        "Content-Type":
          resp.headers.get("Content-Type") ||
          "application/json; charset=utf-8",
        ...CORS_HEADERS
      }
    });

  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        error: e.message
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...CORS_HEADERS
        }
      }
    );
  }
}
