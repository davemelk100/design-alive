import { SiteConfigService } from "../../src/services/siteConfigService";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET",
};

export const handler = async (event: any) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Only allow GET operations (read-only)
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          error: "Method not allowed. Only GET is supported.",
        }),
      };
    }

    return await handleGet(event);
  } catch (error) {
    console.error("Error in site-config function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

async function handleGet(event: any) {
  const { key } = event.queryStringParameters || {};

  if (key) {
    // Get specific config
    const config = await SiteConfigService.getConfig(key);
    if (!config) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Configuration not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: config }),
    };
  } else {
    // Get all public configs
    const configs = await SiteConfigService.getPublicConfigs();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configs }),
    };
  }
}
