import { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: { users } });

export const handler: Handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      } as Record<string, string>,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      } as Record<string, string>,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { code } = event.queryStringParameters || {};

    if (!code) {
      // Redirect to Google OAuth
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri =
        process.env.GOOGLE_REDIRECT_URI ||
        `${
          event.headers.host ? `https://${event.headers.host}` : process.env.URL
        }/.netlify/functions/auth-login`;
      const scope = "openid email profile";
      const responseType = "code";

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=${responseType}&scope=${encodeURIComponent(
        scope
      )}&access_type=offline&prompt=consent`;

      return {
        statusCode: 302,
        headers: {
          Location: googleAuthUrl,
          "Access-Control-Allow-Origin": "*",
        } as Record<string, string>,
        body: "",
      };
    }

    // Exchange code for token
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      `${
        event.headers.host ? `https://${event.headers.host}` : process.env.URL
      }/.netlify/functions/auth-login`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info");
    }

    const userInfo = await userInfoResponse.json();
    const { id: providerId, email, name, picture } = userInfo;

    // Find or create user
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          email,
          name: name || null,
          provider: "google",
          providerId,
          image: picture || null,
          emailVerified: true,
        })
        .returning()
        .then((rows) => rows[0]);
      user = newUser;
    } else {
      // Update existing user with OAuth info if needed
      if (!user.provider || user.provider !== "google") {
        await db
          .update(users)
          .set({
            provider: "google",
            providerId,
            image: picture || user.image,
            name: name || user.name,
            emailVerified: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
        user = {
          ...user,
          provider: "google",
          providerId,
          image: picture || user.image,
          name: name || user.name,
          emailVerified: true,
        };
      }
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Redirect to store with token
    const frontendUrl = process.env.URL || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/store/auth/callback?token=${token}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl,
        "Access-Control-Allow-Origin": "*",
      } as Record<string, string>,
      body: "",
    };
  } catch (error: any) {
    console.error("Auth error:", error);
    const frontendUrl = process.env.URL || "http://localhost:5173";
    return {
      statusCode: 302,
      headers: {
        Location: `${frontendUrl}/store/login?error=${encodeURIComponent(
          error.message || "Authentication failed"
        )}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: "",
    };
  }
};
