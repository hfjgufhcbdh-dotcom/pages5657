export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "public, max-age=60"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    // API requests
    if (url.pathname.startsWith("/api/")) {
      return handleAPI(request, env, cors);
    }

    // Static files
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response(
      "فایل‌های سایت به Worker متصل نشده‌اند. بخش Assets را تنظیم کنید.",
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      }
    );
  }
};

async function handleAPI(request, env, cors) {
  const url = new URL(request.url);

  /*
   * API فعلاً عمداً از منبع قیمت حدسی استفاده نمی‌کند.
   * وقتی منبع واقعی پروژه مشخص شود، این قسمت را وصل می‌کنیم.
   */

  if (url.pathname === "/api/health") {
    return new Response(
      JSON.stringify({
        ok: true,
        service: "Didaban Worker",
        time: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...cors
        }
      }
    );
  }

  return new Response(
    JSON.stringify({
      error: "API endpoint not configured yet"
    }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...cors
      }
    }
  );
        }
