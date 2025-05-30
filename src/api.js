// src/api.js

import mockData from "./mock-data";

// —————————————————————————————————————————————————————————————
//                      Configuration
// —————————————————————————————————————————————————————————————
const SERVERLESS_BASE_URL =
  "https://oo8j9y6bg6.execute-api.us-east-2.amazonaws.com/Dev";

// —————————————————————————————————————————————————————————————
//                      Helpers
// —————————————————————————————————————————————————————————————

// Strip any ?code=… or other query-params out of the URL
const removeQuery = () => {
  if (window.history.pushState) {
    const cleanUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState({}, "", cleanUrl);
  }
};

// Given an access token, ask Google if it’s still valid
const checkToken = async (accessToken) => {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  return await res.json();
};

// Exchange the OAuth “code” for a real access_token via your Lambda
const getToken = async (code) => {
  const encoded = encodeURIComponent(code);
  const res = await fetch(`${SERVERLESS_BASE_URL}/api/token/${encoded}`, {
    method: "POST",
  });
  const { access_token } = await res.json();
  if (access_token) {
    localStorage.setItem("access_token", access_token);
  }
  return access_token;
};

// —————————————————————————————————————————————————————————————
//                      Public API
// —————————————————————————————————————————————————————————————

/**
 * Reads (or fetches) a usable Google access token.
 *  - If we have one in localStorage *and* `checkToken` says it’s still good, return it.
 *  - Otherwise, remove any old token, look for ?code= in the URL:
 *     • if no code → hit your get-auth-url Lambda and redirect to Google
 *     • if there *is* a code → exchange it for an access_token (via your Lambda)
 */
export const getAccessToken = async () => {
  const stored = localStorage.getItem("access_token");
  const tokenInfo = stored && (await checkToken(stored));

  if (!stored || tokenInfo.error) {
    localStorage.removeItem("access_token");
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      // kick off the OAuth flow
      const resp = await fetch(`${SERVERLESS_BASE_URL}/api/get-auth-url`);
      const { authUrl } = await resp.json();
      window.location.href = authUrl;
      return; // we’re navigating away
    }

    // we *do* have a code → slam it into our /api/token endpoint
    return getToken(code);
  }

  return stored;
};

/**
 * Fetch the list of calendar events:
 *  - on localhost → just return mockData
 *  - otherwise → get a token (which may redirect/refresh), then call your get-events Lambda
 */
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  const token = await getAccessToken();
  if (token) {
    removeQuery();
    // note: tutorial concatenates token in path; if your Lambda expects POST-body instead, adjust accordingly
    const url = `${SERVERLESS_BASE_URL}/api/get-events/${token}`;
    const res = await fetch(url, { method: "GET" });
    const json = await res.json();
    return json.events || [];
  }

  return [];
};

/**
 * Helper used elsewhere in your app
 */
export const extractLocations = (events) => {
  const all = events.map((e) => e.location);
  return [...new Set(all)];
};
