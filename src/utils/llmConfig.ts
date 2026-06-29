import type { LLMConfig } from "../types/agent";

const LLM_CONFIG_KEY = "earthguide-llm-config";

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  enabled: false, mockMode: true, providerName: "Custom", baseUrl: "", apiKey: "", model: "",
};

export function loadLLMConfig(): LLMConfig {
  try {
    const raw = localStorage.getItem(LLM_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_LLM_CONFIG };
    return { ...DEFAULT_LLM_CONFIG, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_LLM_CONFIG }; }
}

export function saveLLMConfig(config: LLMConfig): void {
  localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(config));
}

export function clearLLMConfig(): void { localStorage.removeItem(LLM_CONFIG_KEY); }
