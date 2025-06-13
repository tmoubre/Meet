// src/api.js

/* istanbul ignore file */
import mockData from "./mock-data";
import NProgress from "nprogress";

/**
 * Takes an array of event objects and extracts a de-duplicated list of locations.
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  return [...new Set(extractedLocations)];
};

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

const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const result = await response.json();
    return result;
  } catch (err) {
    return { error: "Network error when verifying token." };
  }
};

const getToken = async (code) => {
  try {
    const encodedCode = encodeURIComponent(code);
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

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || (tokenCheck && tokenCheck.error)) {
    localStorage.removeItem("access_token");

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (!code) {
      try {
        const AUTH_URL_LAMBDA =
          "https://oo8j9y6bg6.execute-api.us-east-2.amazonaws.com/dev/api/get-auth-url";
        const response = await fetch(AUTH_URL_LAMBDA);
        if (!response.ok) {
          throw new Error(`HTTP error getting auth URL: ${response.status}`);
        }
        const { authUrl } = await response.json();
        window.location.href = authUrl;
      } catch (err) {
        console.error("❌ Error fetching getAuthURL:", err);
      }
      return null;
    }

    const newToken = await getToken(code);
    removeQuery();
    return newToken;
  }

  return accessToken;
};

export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData;
  }

  if (!navigator.onLine) {
    const events = localStorage.getItem("lastEvents");
    NProgress.done();
    return events ? JSON.parse(events) : [];
  }

  const token = await getAccessToken();
  if (!token) return [];

  try {
    const GET_EVENTS_LAMBDA =
      "https://oo8j9y6bg6.execute-api.us-east-2.amazonaws.com/dev/api/get-events";

    const response = await fetch(GET_EVENTS_LAMBDA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error fetching events: ${response.status}`);
    }
    const result = await response.json();
    if (result) {
      NProgress.done();
      localStorage.setItem("lastEvents", JSON.stringify(result.events));
      return result.events;
    } else return null;
  } catch (err) {
    console.error("❌ getEvents() error:", err);
    return [];
  }
};
