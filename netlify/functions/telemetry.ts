import { getStore } from "@netlify/blobs";

const ALLOWED_ORIGINS = [
  "https://themalive.com",
  "http://localhost:5173",
  "http://localhost:5174",
];

function corsHeaders(origin?: string) {
  const allowed = ALLOWED_ORIGINS.includes(origin || "")
    ? origin!
    : ALLOWED_ORIGINS[0];
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

interface DayRecord {
  sessions: number;
  versions: Record<string, number>;
}

export const handler = async (event: any) => {
  const headers = corsHeaders(event.headers.origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const version: string = body.version || "unknown";
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const store = getStore("telemetry");
    const existing = await store.get(today, { type: "json" }).catch(() => null) as DayRecord | null;

    const record: DayRecord = existing || { sessions: 0, versions: {} };
    record.sessions += 1;
    record.versions[version] = (record.versions[version] || 0) + 1;

    await store.setJSON(today, record);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal error" }),
    };
  }
};
