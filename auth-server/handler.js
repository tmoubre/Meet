'use strict';

const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const { CLIENT_ID, CLIENT_SECRET, CALENDAR_ID } = process.env;

// Must match what's in your Google Cloud Console
const redirect_uri = "https://meet-rouge.vercel.app/oauth2callback";

// Factory to safely create OAuth2 client per invocation
const createOAuthClient = () =>
  new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, redirect_uri);

// Get OAuth URL
module.exports.getAuthURL = async () => {
  const oAuth2Client = createOAuthClient();

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // or your origin
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: JSON.stringify({ authUrl }),
  };
  
};

// Exchange code for tokens
module.exports.exchangeCode = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: '',
    };
  }

  const oAuth2Client = createOAuthClient();

  try {
    const { code } = JSON.parse(event.body);

    if (!code) {
      throw new Error("Code is missing in the request body.");
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ tokens }),
    };
  } catch (error) {
    console.error("Error exchanging code:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};

// Get access token from the path
module.exports.getAccessToken = async (event) => {
  const oAuth2Client = createOAuthClient();

  try {
    const code = decodeURIComponent(event.pathParameters.code); // ✅ decode ONCE

    console.log("Raw pathParameters.code:", event.pathParameters.code);
    console.log("Code from path param:", code);

    if (!code) {
      throw new Error("Code parameter is missing.");
    }

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ tokens }),
    };
  } catch (error) {
    console.error("Error getting access token:", error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};

// Get calendar events
module.exports.getCalendarEvents = async (event) => {
  return new Promise((resolve, reject) => {
    try {
      const access_token = decodeURIComponent(event.pathParameters.access_token);

      if (!access_token) {
        throw new Error("Access token is missing in path parameters.");
      }

      console.log("Access token:", access_token);

      const oAuth2Client = createOAuthClient();
      oAuth2Client.setCredentials({ access_token });

      const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

      calendar.events.list(
        {
          calendarId: CALENDAR_ID,
          auth: oAuth2Client,
          timeMin: new Date().toISOString(),
          singleEvents: true,
          orderBy: "startTime",
        },
        (error, response) => {
          if (error) {
            console.error("Calendar API error:", error);
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    } catch (err) {
      console.error("Handler-level error:", err);
      reject(err);
    }
  })
  .then(results => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ events: results.data.items }),
    };
  })
  .catch(error => {
    console.error("Error fetching calendar events:", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  });
};

