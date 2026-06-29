import type { AppState } from "../types";
import type { TodayRecommendation, LLMConfig } from "../types/agent";
import { today, isDailyTaskDue } from "../utils/date";
import { callLLM, extractJsonObject } from "./llmClient";

/** 本地规则推荐（同步，始终可用） */
export function getTodayRecommendation(state: AppState): TodayRecommendation {
  const t = today();
  const daily = state.dailyTasks.find((dt) =>
    isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay)
  );
  if (daily) return { npcReply: `今天可以先从「${daily.title}」开始。它不需要太多准备，是一个适合启动生活节奏的小行动。`, taskType: "daily", taskId: daily.id, title: daily.title, reason: "优先推荐今天到期的日常任务。" };

  const side = state.sideQuests.find((sq) => !sq.completed && !sq.archived);
  if (side) return { npcReply: `今天没有必须完成的日常。也许可以试试支线「${side.title}」，给今天增加一点探索感。`, taskType: "sideQuest", taskId: side.id, title: side.title, reason: "没有日常时推荐未完成支线。" };

  const main = state.mainQuests
    .filter((mq) => mq.status === "active" && !mq.archived)
    .map((mq) => { const stage = mq.stages.find((s) => !s.completed); return stage ? { mq, stage } : null; })
    .filter(Boolean)[0] as any;

  if (main) return { npcReply: `如果你愿意，可以推进主线阶段「${main.stage.title}」。不用一次做很多，只要完成当前节点就好。`, taskType: "mainStage", taskId: main.stage.id, title: main.stage.title, reason: "推荐当前主线阶段。" };
  return { npcReply: "今天的任务地图很安静。你可以为自己添加一个很小的新行动。", taskType: "none", reason: "当前没有可推荐任务。" };
}

/** LLM 增强推荐（异步，需要配置 API） */
export async function getLLMTodayRecommendation(state: AppState, config: LLMConfig): Promise<TodayRecommendation> {
  if (!config.enabled || config.mockMode) return getTodayRecommendation(state);

  const t = today();
  const activeMain = state.mainQuests.filter((q) => q.status === "active" && !q.archived).map((q) => {
    const s = q.stages.find((st) => !st.completed);
    return s ? `主线「${q.title}」当前阶段「${s.title}」` : null;
  }).filter(Boolean);
  const dueDailies = state.dailyTasks.filter((dt) =>
    isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay)
  ).map((dt) => `日常「${dt.title}」（${dt.period === "daily" ? "今天" : dt.period === "weekly" ? "本周" : "本月"} ${dt.completions.filter((c) => c === t).length}/${dt.period === "daily" ? (dt.timesPerDay || 1) : dt.targetCount} 次）`);
  const pendingSides = state.sideQuests.filter((sq) => !sq.completed && !sq.archived).map((sq) => `支线「${sq.title}」`);

  const system = `你是 LifeQuest / 地球生活指南 中的 NPC：Lumi，营地向导。
你的任务是帮助用户从今天的任务列表里选出一个最适合开始的任务。
你必须只输出 JSON，不要输出 Markdown，不要解释。
风格：温柔、鼓励、生活化，不压迫。
JSON 格式：{ "npcReply": "Lumi 对用户说的话", "taskType": "daily|sideQuest|mainStage|none", "title": "推荐的任务名", "reason": "简短理由" }`;

  const user = `今天是 ${t}。
当前活跃任务：
${activeMain.length > 0 ? activeMain.join("\n") : "无活跃主线阶段。"}
${dueDailies.length > 0 ? `今日日常：\n${dueDailies.join("\n")}` : "今日无到期日常。"}
${pendingSides.length > 0 ? `待完成支线：\n${pendingSides.join("\n")}` : "无待完成支线。"}

请推荐一个今天最适合开始的任务，说一句鼓励的话。`;

  try {
    const res = await callLLM(config, { system, user, temperature: 0.5 });
    const parsed = extractJsonObject<TodayRecommendation>(res.content);
    return {
      npcReply: parsed.npcReply || getTodayRecommendation(state).npcReply,
      taskType: parsed.taskType || "none",
      title: parsed.title,
      reason: parsed.reason || "LLM 推荐",
    };
  } catch {
    return { ...getTodayRecommendation(state), npcReply: "模型连接不太稳定，我按感觉帮你挑了一个。" };
  }
}
