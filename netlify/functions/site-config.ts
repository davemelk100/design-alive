import type { Handler } from "@netlify/functions";
import { SiteConfigService } from "../../src/services/siteConfigService";
import { verifyToken } from "../../src/lib/auth";

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Verify JWT for protected operations
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    switch (event.httpMethod) {
      case "GET":
        return await handleGet(event);
      case "POST":
        return await handlePost(event);
      case "PUT":
        return await handlePut(event);
      case "DELETE":
        return await handleDelete(event);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: "Method not allowed" }),
        };
    }
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

async function handlePost(event: any) {
  const body = JSON.parse(event.body || "{}");
  const { key, value, description, isPublic } = body;

  if (!key || value === undefined) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Key and value are required" }),
    };
  }

  const success = await SiteConfigService.setConfig(
    key,
    value,
    description,
    isPublic
  );

  if (success) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Configuration saved successfully" }),
    };
  } else {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to save configuration" }),
    };
  }
}

async function handlePut(event: any) {
  const body = JSON.parse(event.body || "{}");
  const { key, value, description, isPublic } = body;

  if (!key || value === undefined) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Key and value are required" }),
    };
  }

  const success = await SiteConfigService.setConfig(
    key,
    value,
    description,
    isPublic
  );

  if (success) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Configuration updated successfully" }),
    };
  } else {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to update configuration" }),
    };
  }
}

async function handleDelete(event: any) {
  const { key } = event.queryStringParameters || {};

  if (!key) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Key is required" }),
    };
  }

  const success = await SiteConfigService.deleteConfig(key);

  if (success) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Configuration deleted successfully" }),
    };
  } else {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to delete configuration" }),
    };
  }
}
