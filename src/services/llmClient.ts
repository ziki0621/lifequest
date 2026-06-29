import type { LLMConfig } from "../types/agent";

export interface LLMChatRequest { system: string; user: string; temperature?: number; }
export interface LLMChatResponse { content: string; }

export async function callLLM(config: LLMConfig, request: LLMChatRequest): Promise<LLMChatResponse> {
  if (!config.enabled || config.mockMode) throw new Error("LLM is disabled or mock mode is enabled.");
  if (!config.baseUrl.trim()) throw new Error("API Base URL is missing.");
  if (!config.apiKey.trim()) throw new Error("API Key is missing.");
  if (!config.model.trim()) throw new Error("Model is missing.");

  const baseUrl = config.baseUrl.replace(/\/$/, "");
  const endpoint = `${baseUrl}/chat/completions`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({ model: config.model, temperature: request.temperature ?? 0.4, messages: [{ role: "system", content: request.system }, { role: "user", content: request.user }] }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";
  if (!content) throw new Error("LLM returned empty content.");
  return { content };
}

export function extractJsonObject<T>(text: string): T {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(cleaned) as T; } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(cleaned.slice(first, last + 1)) as T;
    throw new Error("Failed to parse JSON from LLM output.");
  }
}
