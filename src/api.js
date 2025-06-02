// src/api.js

import mockData from "./mock-data";

/**
 * Takes an array of event objects and extracts a de-duplicated list of locations.
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  // Use Set to remove duplicates, then spread back into an array
  return [...new Set(extractedLocations)];
};

/**
 * This helper removes any query-string parameters from the URL:
 *   e.g. if the browser is at https://myapp.com/oauth2callback?code=XYZ&state=foobar
 *   after calling removeQuery(), the URL in the address bar becomes just https://myapp.com/oauth2callback
 *
 * That way, once we finish handling the OAuth2 code, the user sees a clean URL.
 */
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};

/**
 * Given a Google access token, call Google's tokeninfo endpoint to see if it's still valid.
 * If invalid, Google returns { error: "..."}; if valid, it returns info such as audience, expires_in, etc.
 */
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const result = await response.json();
    return result; // If there is an "error" key, token is invalid/expired.
  } catch (err) {
    return { error: "Network error when verifying token." };
  }
};

/**
 * Called when Google redirects back to your app with ?code=XXXXX
 * Exchanges that ‘code’ for a real access_token + refresh_token via your Lambda endpoint.
 * The Lambda endpoint is:   POST https://<YOUR_LAMBDA_DOMAIN>/api/token/{code}
 *
 * Once we get the tokens JSON, we store access_token in localStorage and return it to the caller.
 */
const getToken = async (code) => {
  try {
    const encodedCode = encodeURIComponent(code);
    // Change this URL to exactly your deployed "getAccessToken" Lambda API endpoint:
    // In serverless.yml, that function is exposed at .../api/token/{code} (POST).
    const TOKEN_URL =
      "https://oo8j9y6bg6.execute-api.us-east-2.amazonaws.com/dev/api/token";

    const response = await fetch(`${TOKEN_URL}/${encodedCode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error getting token: ${response.status}`);
    }
    const { tokens } = await response.json();
    if (tokens && tokens.access_token) {
      localStorage.setItem("access_token", tokens.access_token);
      return tokens.access_token;
    } else {
      throw new Error("No access_token returned from token endpoint");
    }
  } catch (error) {
    console.error("❌ getToken() error:", error);
    return null;
  }
};

/**
 * 1) Check localStorage for “access_token”.
 * 2) If no token or tokenCheck.error, remove it from localStorage,
 *    then see if the URL has ?code=xxxx.  If no code → redirect to Google-auth-url Lambda.
 *    If code present → exchange it (via getToken) and return new token.
 * 3) If token is present and checkToken(access_token) is OK → return the token immediately.
 */
export const getAccessToken = async () => {
  // 1) Do we already have something in localStorage?
  const accessToken = localStorage.getItem("access_token");
  // 2) If we do, call checkToken() to see if it's still valid
  const tokenCheck = accessToken && (await checkToken(accessToken));

  // 3) If no token, or the tokenCheck returned an “error” field → need to re‐authenticate
  if (!accessToken || (tokenCheck && tokenCheck.error)) {
    // Remove any invalid token
    localStorage.removeItem("access_token");

    // See if Google just appended ?code=XXXX to our URL
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    // 3.a) No “code” in URL → redirect user to your getAuthURL Lambda
    if (!code) {
      // Your Lambda function “getAuthURL” is exposed as GET https://<LAMBDA_DOMAIN>/api/get-auth-url
      // That endpoint will return { authUrl: "https://accounts.google.com/o/oauth2/..." }
      try {
        const AUTH_URL_LAMBDA =
          "https://oo8j9y6bg6.execute-api.us-east-2.amazonaws.com/dev/api/get-auth-url";
        const response = await fetch(AUTH_URL_LAMBDA);
        if (!response.ok) {
          throw new Error(`HTTP error getting auth URL: ${response.status}`);
        }
        const { authUrl } = await response.json();
        // Redirect the browser to Google's OAuth consent screen:
        window.location.href = authUrl;
      } catch (err) {
        console.error("❌ Error fetching getAuthURL:", err);
      }
      // Nothing else to do here – once the user completes Google consent, they come back with ?code=xxxxx
      return null;
    }

    // 3.b) We do have a code from Google in the URL → exchange it for a token
    const newToken = await getToken(code);
    // Remove ?code from the URL so it’s not visible in the address bar anymore
    removeQuery();
    return newToken;
  }

  // 4) If we already have a valid accessToken in localStorage → return it
  return accessToken;
};

/**
 * Fetches calendar events.
 * - If running on http://localhost... → return mockData immediately
 * - Otherwise: call getAccessToken() to ensure we have a Google token.  If we do, call
 *   your Lambda endpoint “POST https://<LAMBDA_DOMAIN>/api/get-events” with { access_token } in the JSON body.
 */
export const getEvents = async () => {
  // 1) On localhost, just return the mock data so you can work offline:
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  // 2) Otherwise, ensure we have a valid accessToken (getAccessToken() may redirect)
  const token = await getAccessToken();
  if (!token) {
    // Either getAccessToken() redirected us away to Google, or something failed
    return [];
  }
  // 3) We do have a token → remove any “?code” fragment from the URL (already done above in getAccessToken),
  //    then call your Lambda “get-events” endpoint to grab real events from Google Calendar
  try {
    // In serverless.yml, getCalendarEvents is exposed at POST /api/get-events
    const GET_EVENTS_LAMBDA =
      "https://oo8j9y6bg6.execute-api.us-east-2.amazonaws.com/dev/api/get-events";

    // POST { access_token: "ya29..." }
    const response = await fetch(GET_EVENTS_LAMBDA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error fetching events: ${response.status}`);
    }
    const { events } = await response.json();
    return events || [];
  } catch (err) {
    console.error("❌ getEvents() error:", err);
    return [];
  }
};
