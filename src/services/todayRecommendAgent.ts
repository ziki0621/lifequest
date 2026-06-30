import type { AppState } from "../types";
import type { TodayRecommendation, LLMConfig } from "../types/agent";
import { today, isDailyTaskDue } from "../utils/date";
import { callLLM, extractJsonObject } from "./llmClient";

export function getTodayRecommendation(state: AppState): TodayRecommendation {
  const t = today();
  const daily = state.dailyTasks.find((dt) => !dt.archived && isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay));
  if (daily) return { npcReply: `今天可以先从「${daily.title}」开始。`, taskType: "daily", taskId: daily.id, title: daily.title, reason: "优先推荐到期的日常。" };
  const side = state.sideQuests.find((sq) => !sq.completed && !sq.archived);
  if (side) return { npcReply: `也许可以试试支线「${side.title}」`, taskType: "sideQuest", taskId: side.id, title: side.title, reason: "推荐未完成支线。" };
  // Check quest books
  for (const qb of state.questBooks) {
    if (qb.status !== "active" || qb.archived) continue;
    for (const ql of qb.questLines) {
      const stage = ql.stages.find((s) => !s.completed);
      if (stage) return { npcReply: `可以推进「${qb.title}」→「${ql.title}」→「${stage.title}」`, taskType: "questStage", taskId: stage.id, title: stage.title, reason: "推荐当前任务书阶段。" };
    }
    const task = qb.directTasks.find((t) => !t.completed);
    if (task) return { npcReply: `可以完成「${qb.title}」的直接任务「${task.title}」`, taskType: "questBookTask", taskId: task.id, title: task.title, reason: "推荐任务书直接任务。" };
  }
  return { npcReply: "今天的任务地图很安静。", taskType: "none", reason: "暂无推荐。" };
}

export async function getLLMTodayRecommendation(state: AppState, config: LLMConfig): Promise<TodayRecommendation> {
  if (!config.enabled || config.mockMode) return getTodayRecommendation(state);
  const t = today();
  const lines: string[] = [];
  state.questBooks.filter((q) => q.status === "active" && !q.archived).forEach((qb) => {
    qb.questLines.forEach((ql) => { const s = ql.stages.find((st) => !st.completed); if (s) lines.push(`任务书「${qb.title}」任务线「${ql.title}」阶段「${s.title}」`); });
    qb.directTasks.forEach((dt) => { if (!dt.completed) lines.push(`任务书「${qb.title}」直接任务「${dt.title}」`); });
  });
  const dueDailies = state.dailyTasks.filter((dt) => !dt.archived && isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay)).map((dt) => `日常「${dt.title}」`);
  const system = `你是 Lumi。推荐一个任务。JSON: { "npcReply":"","taskType":"questStage|questBookTask|daily|sideQuest|none","title":"","reason":"" }`;
  const user = `今日任务：${[...lines, ...dueDailies].join("\n") || "无"}`;
  try { const res = await callLLM(config, { system, user, temperature: 0.5 }); return { ...getTodayRecommendation(state), ...extractJsonObject<TodayRecommendation>(res.content) }; }
  catch { return getTodayRecommendation(state); }
}
