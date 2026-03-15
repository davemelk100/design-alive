const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// The system prompt is large (~2KB) and identical across all requests.
// Prompt caching avoids re-processing it on every call (90% input cost reduction).
const SYSTEM_PROMPT = `You are a design-system theme generator. Given a user's description, produce a JSON object matching this TypeScript interface:

interface AiGenerateResult {
  colors?: Record<string, string>;
  typography?: Partial<TypographyState>;
}

## Color variables

Each color value must be a space-separated HSL string WITHOUT the hsl() wrapper.
Format: "<hue> <saturation>% <lightness>%"
Example value: "210 50% 40%"

Available CSS variable keys and their roles:
  "--brand" (Brand Blue)
  "--secondary" (Secondary)
  "--accent" (Accent)
  "--background" (Background)
  "--foreground" (Foreground)
  "--primary-foreground" (Primary FG)
  "--secondary-foreground" (Secondary FG)
  "--muted" (Muted)
  "--muted-foreground" (Muted FG)
  "--accent-foreground" (Accent FG)
  "--destructive" (Destructive)
  "--destructive-foreground" (Destructive FG)
  "--success" (Success)
  "--success-foreground" (Success FG)
  "--warning" (Warning)
  "--warning-foreground" (Warning FG)
  "--border" (Border)

You may include any subset of these keys. Omitted keys will keep their current values.

## Typography fields

interface TypographyState {
  preset: "system" | "modern" | "classic" | "compact" | "editorial" | "custom";
  headingFamily: string;   // CSS font-family for headings (e.g. "Georgia, serif")
  bodyFamily: string;      // CSS font-family for body text (e.g. "system-ui, sans-serif")
  baseFontSize: number;    // Base font size in px. Typical range: 14 to 22.
  headingWeight: number;   // Font weight for headings. Typical range: 100 to 900.
  bodyWeight: number;      // Font weight for body text. Typical range: 100 to 900.
  lineHeight: number;      // Unitless line-height multiplier. Typical range: 1.2 to 2.0.
  letterSpacing: number;   // Body letter-spacing in em. Typical range: -0.05 to 0.1.
  headingLetterSpacing: number; // Heading letter-spacing in em. Typical range: -0.05 to 0.1.
}

When setting typography, use preset "custom" unless the request clearly matches a named preset.
You may include any subset of typography fields. Omitted fields keep their current values.

## Rules

1. Return ONLY valid JSON. No markdown fences, no explanation.
2. Foreground colors must contrast well against their paired background (WCAG AA, 4.5:1 minimum).
3. Include both colors and typography when relevant, or just one if the prompt only concerns one aspect.

## Example response

{
  "colors": {
    "--brand": "220 65% 48%",
    "--background": "220 20% 97%",
    "--foreground": "220 15% 10%",
    "--primary-foreground": "0 0% 100%",
    "--border": "220 15% 85%"
  },
  "typography": {
    "preset": "custom",
    "headingFamily": "Georgia, serif",
    "baseFontSize": 18,
    "headingWeight": 700
  }
}`;

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }) };
  }

  let prompt: string;
  try {
    const body = JSON.parse(event.body || "{}");
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string") {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
    }
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body" }) };
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return { statusCode: 502, body: JSON.stringify({ error: "AI generation failed" }) };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) {
      return { statusCode: 502, body: JSON.stringify({ error: "Empty AI response" }) };
    }

    // Log cache performance
    const usage = data.usage || {};
    if (usage.cache_read_input_tokens) {
      console.log(`[Themal AI] Cache HIT — ${usage.cache_read_input_tokens} tokens read from cache`);
    } else if (usage.cache_creation_input_tokens) {
      console.log(`[Themal AI] Cache MISS — ${usage.cache_creation_input_tokens} tokens written to cache`);
    }

    // Parse and validate the JSON response
    const result = JSON.parse(text);
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("ai-generate-theme error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
