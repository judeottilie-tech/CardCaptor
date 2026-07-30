// Always relative: Vercel proxies /api/* to the Render backend (see
// client/vercel.json), so requests stay same-origin from the browser's
// point of view. A direct cross-origin absolute URL here would make Safari's
// cross-site cookie blocking (ITP) silently drop the auth cookie after
// login/register - same-origin via the proxy sidesteps that entirely.
export const API_BASE = "/api";
