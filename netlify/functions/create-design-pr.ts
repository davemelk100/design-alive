const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const REPO = "davemelk100/dm-2025";
const FILE_PATH = "src/globals.css";
const API = "https://api.github.com";

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
  // Find the @layer base block, then the first :root inside it
  const layerBaseRegex = /(@layer\s+base\s*\{[\s\S]*?:root\s*\{)([\s\S]*?)(\})/;
  const match = fileContent.match(layerBaseRegex);
  if (!match) throw new Error("Could not find @layer base :root block in globals.css");

  const existingBlock = match[2];
  const updatedLines: string[] = [];

  for (const line of existingBlock.split("\n")) {
    const varLineMatch = line.match(/^(\s*)(--[\w-]+)\s*:\s*.+;$/);
    if (varLineMatch && newVars[varLineMatch[2]] !== undefined) {
      updatedLines.push(`${varLineMatch[1]}${varLineMatch[2]}: ${newVars[varLineMatch[2]]};`);
    } else {
      updatedLines.push(line);
    }
  }

  return fileContent.replace(layerBaseRegex, `${match[1]}${updatedLines.join("\n")}${match[3]}`);
}

export const handler = async (event: any) => {
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

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "GITHUB_TOKEN not configured" }),
    };
  }

  try {
    const { css } = JSON.parse(event.body || "{}");
    if (!css) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing css field" }),
      };
    }

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
        message: "Update design system color tokens",
        content: Buffer.from(updatedContent).toString("base64"),
        sha: fileData.sha,
        branch: branchName,
      }),
    });

    // 6. Return GitHub compare URL so the user can review and submit the PR
    const compareUrl = `https://github.com/${REPO}/compare/main...${branchName}?expand=1&title=${encodeURIComponent("Update design system color tokens")}&body=${encodeURIComponent("Updates light-mode CSS custom properties in `globals.css` from the live Design System color picker.")}`;

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
