"use strict";

const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const { CLIENT_ID, CLIENT_SECRET, CALENDAR_ID, REDIRECT_URI } = process.env;

// Default fallback if REDIRECT_URI is not in env
const redirect_uri =
  REDIRECT_URI || "https://meet-rouge.vercel.app/oauth2callback";

// Create OAuth2 client per invocation
const createOAuthClient = () =>
  new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirect_uri);

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

// GET /api/get-auth-url
module.exports.getAuthURL = async () => {
  const oAuth2Client = createOAuthClient();

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ authUrl }),
  };
};

// POST /api/exchange-code
module.exports.exchangeCode = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  const oAuth2Client = createOAuthClient();

  try {
    const { code } = JSON.parse(event.body);
    if (!code) throw new Error("Code is missing in the request body.");

    const { tokens } = await oAuth2Client.getToken({ code, redirect_uri });
    oAuth2Client.setCredentials(tokens);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ tokens }),
    };
  } catch (error) {
    console.error("❌ exchangeCode error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};

// POST /api/token/{code}
module.exports.getAccessToken = async (event) => {
  const oAuth2Client = createOAuthClient();

  try {
    const code = decodeURIComponent(event.pathParameters.code);
    if (!code) throw new Error("Code parameter is missing.");

    const { tokens } = await oAuth2Client.getToken({ code, redirect_uri });
    oAuth2Client.setCredentials(tokens);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ tokens }),
    };
  } catch (error) {
    console.error("❌ getAccessToken error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// POST /api/get-events
module.exports.getCalendarEvents = async (event) => {
  try {
    const { access_token } = JSON.parse(event.body);
    if (!access_token)
      throw new Error("Access token missing from request body.");

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID || "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ events }),
    };
  } catch (error) {
    console.error("❌ getCalendarEvents error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
