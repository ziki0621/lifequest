import type { LLMConfig } from "../types/agent";
import { callLLM, extractJsonObject } from "./llmClient";

interface CompletenessResult {
  needsMore: boolean;
  sufficient: boolean;
  question?: string;
}

export async function assessCompleteness(userGoal: string, config: LLMConfig): Promise<CompletenessResult> {
  // Local heuristic: if goal is long & specific enough, skip the LLM call
  if (userGoal.length > 40 && /(\d+[天周月]|[每第]\d+|强度|节奏|早起|睡觉|运动|学习|工作|关系|探索)/.test(userGoal)) {
    return { needsMore: false, sufficient: true };
  }

  if (!config.enabled || config.mockMode) {
    // Local fallback
    if (userGoal.length < 15) {
      return { needsMore: true, sufficient: false, question: "能多说一点吗？比如你希望大概多长时间完成，或者你有什么特别想调整的方面？" };
    }
    return { needsMore: false, sufficient: true };
  }

  const system = `你是一个友善的助手。判断用户描述是否足够清晰来生成任务。只输出JSON。
如果描述模糊（少于一句话、没提到任何具体领域或时间），返回 { "needsMore": true, "sufficient": false, "question": "一个温和的追问" }。
如果描述足够清晰，返回 { "needsMore": false, "sufficient": true }。`;

  try {
    const res = await callLLM(config, { system, user: userGoal, temperature: 0.1 });
    const parsed = extractJsonObject<CompletenessResult>(res.content);
    return parsed.needsMore !== undefined ? parsed : { needsMore: false, sufficient: true };
  } catch {
    return { needsMore: false, sufficient: true };
  }
}
