process.env.NODE_ENV = "test";
import { app } from "../src/app.js";
import { db, initDatabase } from "../src/config/db.js";

let serverInstance = null;
let baseUrl = null;

export async function getTestServer() {
  if (baseUrl) {
    return { baseUrl, db };
  }

  // Start an isolated ephemeral test server
  await initDatabase();
  await new Promise((resolve) => {
    serverInstance = app.listen(0, () => {
      const port = serverInstance.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  return { baseUrl, db };
}

export async function closeTestServer() {
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
    serverInstance = null;
    baseUrl = null;
  }
  try {
    await db.end();
  } catch {}
}

/**
 * Cookie-aware fetch client for test requests
 */
export class TestClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.cookies = new Map();
  }

  setCookieFromHeader(setCookieHeader) {
    if (!setCookieHeader) return;
    const parts = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    for (const header of parts) {
      const match = header.match(/^([^=]+)=([^;]+)/);
      if (match) {
        this.cookies.set(match[1].trim(), match[2].trim());
      }
    }
  }

  getCookieHeader() {
    if (this.cookies.size === 0) return "";
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  getCookie(name) {
    return this.cookies.get(name);
  }

  async request(path, options = {}) {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const headers = { ...(options.headers || {}) };

    const cookieHeader = this.getCookieHeader();
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const csrfToken = this.cookies.get("csrf_token");
    if (csrfToken && ["POST", "PUT", "PATCH", "DELETE"].includes((options.method || "GET").toUpperCase())) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }

    const redirect = options.redirect || "manual";
    const res = await fetch(url, {
      ...options,
      headers,
      redirect,
    });

    // Capture set-cookie headers
    // In Node fetch, getSetCookie() returns all set-cookie headers
    if (typeof res.headers.getSetCookie === "function") {
      for (const sc of res.headers.getSetCookie()) {
        this.setCookieFromHeader(sc);
      }
    } else {
      const sc = res.headers.get("set-cookie");
      if (sc) this.setCookieFromHeader(sc);
    }

    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    return {
      status: res.status,
      ok: res.ok,
      headers: res.headers,
      data,
    };
  }
}
