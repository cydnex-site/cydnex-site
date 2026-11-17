// Serves the Academy site (training/) on training.cydnex.com from this same
// Pages project, and sends old cydnex.com/training links there.
const ACADEMY_HOST = "training.cydnex.com";
const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};
const secure = (res) => {
  const r = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) r.headers.set(k, v);
  return r;
};

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);

  if (url.hostname === ACADEMY_HOST) {
    // Only the Academy files are reachable on this host.
    if (url.pathname === "/training" || url.pathname.startsWith("/training/")) {
      return Response.redirect(`https://${ACADEMY_HOST}${url.pathname.slice(9) || "/"}${url.search}`, 301);
    }
    const target = new URL(url);
    target.pathname = "/training" + url.pathname;
    let res = await env.ASSETS.fetch(new Request(target, request));
    if (res.status >= 300 && res.status < 400) {
      // Keep pretty-URL redirects on the academy host, without the /training prefix.
      const loc = res.headers.get("Location");
      if (loc) {
        const l = new URL(loc, target);
        const path = l.pathname.startsWith("/training") ? l.pathname.slice(9) || "/" : l.pathname;
        return secure(new Response(null, { status: res.status, headers: { Location: path + l.search } }));
      }
    }
    if (res.status === 404) {
      const nf = await env.ASSETS.fetch(new Request(new URL("/training/404", url), request));
      res = new Response(nf.body, { status: 404, headers: nf.headers });
    }
    return secure(res);
  }

  // Main site: the Academy now lives on its own subdomain.
  if (url.pathname === "/training" || url.pathname === "/training.html" || url.pathname.startsWith("/training/")) {
    const rest = url.pathname.startsWith("/training/") ? url.pathname.slice(9) : "/";
    return Response.redirect(`https://${ACADEMY_HOST}${rest}${url.search}`, 301);
  }

  return secure(await next());
}
