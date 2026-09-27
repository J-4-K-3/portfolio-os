/**
 * Shared Gemini client for Telvin.
 *
 * Used by both the chat surface and the voice assistant so
 * the same streaming logic, system prompt, and error handling
 * apply everywhere.
 */

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const SYSTEM_PROMPT = `
You are Telvin, the AI assistant created by Innoxation.

Your name is Telvin.

You are helpful, intelligent, calm, creative,
conversational, and thoughtful.

You can discuss software engineering, AI, robotics,
business, products, creative ideas, and general knowledge.

You are presented to users as Telvin, not as Gemini.

Respond naturally and directly.
`.trim();

export function getApiKey() {
  try {
    return import.meta.env.VITE_GEMINI_API_KEY || "";
  } catch {
    return "";
  }
}

export function isConfigured() {
  return Boolean(getApiKey());
}

/**
 * Stream a Gemini response, calling onDelta for each chunk.
 * Falls back to a demo response when no API key is configured.
 */
export async function streamChat({
  message,
  history = [],
  model = "Smart",
  onDelta,
  signal,
}) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return generateDemoResponse(message, model);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gemini-3.8-flash",
      stream: true,
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\nSelected Telvin mode: ${model}`,
        },
        ...history,
        { role: "user", content: message },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      /* ignore */
    }
    throw new Error(
      errorData?.error?.message ||
        errorData?.[0]?.error?.message ||
        `Gemini returned HTTP ${response.status}`
    );
  }

  if (!response.body) {
    throw new Error("Gemini returned no response stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf8");
  let buffer = "";
  let fullResponse = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const lines = event.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const jsonString = line.slice(5).trim();
        if (!jsonString || jsonString === "[DONE]") continue;
        try {
          const data = JSON.parse(jsonString);
          const delta = data?.choices?.[0]?.delta?.content;
          if (!delta) continue;
          fullResponse += delta;
          onDelta?.(fullResponse);
        } catch {
          /* partial chunk - keep buffering */
        }
      }
    }
  }

  buffer += decoder.decode();
  return fullResponse || generateDemoResponse(message, model);
}

export function generateDemoResponse(message, model) {
  const lower = (message || "").toLowerCase();

  if (lower.includes("auri")) {
    return `Auri is one of Innoxation's social products. In this ${model} demo, I'd normally use Telvin's connected ecosystem context to give you a deeper answer about its features, architecture and relationship with the rest of Innoxation.`;
  }

  if (lower.includes("pizza")) {
    return `Absolutely. You can make pizza by preparing a dough, letting it rise, adding sauce and toppings, then baking it at a high temperature until the crust is cooked and the cheese is melted. If you want, Telvin's Visual Film Director could turn this into a visual step-by-step experience.`;
  }

  return `I'm Telvin. I received your message and I'm currently running in portfolio demonstration mode. In the full version, this conversation would be handled by the Telvin intelligence layer using the selected ${model} model and the context you've permitted.`;
}

export default {
  streamChat,
  generateDemoResponse,
  isConfigured,
  getApiKey,
};