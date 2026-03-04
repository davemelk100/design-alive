const ALLOWED_ORIGINS = [
  "https://themal.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

function corsHeaders(origin?: string) {
  const allowed = ALLOWED_ORIGINS.includes(origin || "") ? origin! : ALLOWED_ORIGINS[0];
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const REPO = "davemelk100/design-alive";
const FILE_PATH = "src/globals.css";
const API = "https://api.github.com";

// In-memory rate limiting: max 1 request per IP per 60 seconds
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateMap = new Map<string, number>();

async function ghFetch(path: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

const SECTION_LABELS: Record<string, string> = {
  colors: "Colors",
  card: "Card Style",
  typography: "Typography",
  alerts: "Alerts",
};

function replaceRootBlock(fileContent: string, newCssVars: string): string {
  // Extract variable assignments from the incoming :root { ... } block
  const varMatch = newCssVars.match(/:root\s*\{([^}]+)\}/s);
  if (!varMatch) throw new Error("Could not parse CSS variables from input");

  const newVars: Record<string, string> = {};
  for (const line of varMatch[1].split("\n")) {
    const m = line.match(/--([\w-]+)\s*:\s*(.+?)\s*;/);
    if (m) newVars[`--${m[1]}`] = m[2];
  }

  // Replace variables inside `@layer base { :root { ... } }` (light mode only)
  const layerBaseRegex = /(@layer\s+base\s*\{[\s\S]*?:root\s*\{)([\s\S]*?)(\})/;
  const match = fileContent.match(layerBaseRegex);
  if (!match) throw new Error("Could not find @layer base :root block in globals.css");

  const existingBlock = match[2];
  const updatedLines: string[] = [];
  const matched = new Set<string>();

  for (const line of existingBlock.split("\n")) {
    const varLineMatch = line.match(/^(\s*)(--[\w-]+)\s*:\s*.+;$/);
    if (varLineMatch && newVars[varLineMatch[2]] !== undefined) {
      updatedLines.push(`${varLineMatch[1]}${varLineMatch[2]}: ${newVars[varLineMatch[2]]};`);
      matched.add(varLineMatch[2]);
    } else {
      updatedLines.push(line);
    }
  }

  // Append any new vars that don't exist yet in the file
  const newEntries = Object.entries(newVars).filter(([k]) => !matched.has(k));
  if (newEntries.length > 0) {
    // Find the last non-empty line to insert before closing
    let insertIdx = updatedLines.length - 1;
    while (insertIdx > 0 && updatedLines[insertIdx].trim() === "") insertIdx--;
    const indent = "    "; // match existing indentation
    const newLines = newEntries.map(([k, v]) => `${indent}${k}: ${v};`);
    updatedLines.splice(insertIdx + 1, 0, ...newLines);
  }

  return fileContent.replace(layerBaseRegex, `${match[1]}${updatedLines.join("\n")}${match[3]}`);
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

  // Rate limit by IP
  const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown";
  const now = Date.now();
  const lastRequest = rateMap.get(ip);
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequest)) / 1000);
    return {
      statusCode: 429,
      headers: { ...headers, "Retry-After": String(retryAfter) },
      body: JSON.stringify({ error: `Rate limited. Try again in ${retryAfter} seconds.` }),
    };
  }
  rateMap.set(ip, now);

  // Clean up old entries
  for (const [key, ts] of rateMap) {
    if (now - ts > RATE_LIMIT_WINDOW_MS) rateMap.delete(key);
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "GITHUB_TOKEN not configured" }),
    };
  }

  try {
    const { css, sections } = JSON.parse(event.body || "{}");
    if (!css) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing css field" }),
      };
    }

    // Build human-readable label from sections
    const sectionList: string[] = Array.isArray(sections) && sections.length > 0
      ? sections
      : ["colors", "card", "typography", "alerts"];
    const sectionLabel = sectionList
      .map((s: string) => SECTION_LABELS[s] || s)
      .join(", ");

    // 1. Get current file from main
    const fileData = await ghFetch(
      `/repos/${REPO}/contents/${FILE_PATH}?ref=main`,
      token,
    );
    const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");

    // 2. Replace :root variables in the file
    const updatedContent = replaceRootBlock(currentContent, css);

    // 3. Get main branch SHA for creating new branch
    const mainRef = await ghFetch(`/repos/${REPO}/git/ref/heads/main`, token);
    const mainSha = mainRef.object.sha;

    // 4. Create branch
    const branchName = `design-system/update-${Date.now()}`;
    await ghFetch(`/repos/${REPO}/git/refs`, token, {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: mainSha,
      }),
    });

    // 5. Update file on new branch
    await ghFetch(`/repos/${REPO}/contents/${FILE_PATH}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `Update design system: ${sectionLabel}`,
        content: Buffer.from(updatedContent).toString("base64"),
        sha: fileData.sha,
        branch: branchName,
      }),
    });

    // 6. Return GitHub compare URL so the user can review and submit the PR
    const compareUrl = `https://github.com/${REPO}/compare/main...${branchName}?expand=1&title=${encodeURIComponent(`Update design system: ${sectionLabel}`)}&body=${encodeURIComponent(`Updates CSS custom properties in \`globals.css\` from the live Design System editor.\n\nSections: ${sectionLabel}`)}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: compareUrl }),
    };
  } catch (error) {
    console.error("create-design-pr error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
