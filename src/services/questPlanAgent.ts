import type { LLMConfig, QuestPlannerInput, QuestPlanDraft } from "../types/agent";
import type { LifeDomain, Difficulty } from "../types";
import { callLLM, extractJsonObject } from "./llmClient";

const DOMAINS: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];
const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

export type QuestGenType = "main" | "daily" | "side" | "all";

export async function generateQuestPlan(input: QuestPlannerInput, config: LLMConfig, genType: QuestGenType = "all"): Promise<QuestPlanDraft> {
  if (!config.enabled || config.mockMode) return mockQuestPlan(input, genType);
  const system = buildMaroSystemPrompt(genType);
  const user = buildMaroUserPrompt(input, genType);
  try {
    const res = await callLLM(config, { system, user, temperature: 0.35 });
    const parsed = extractJsonObject<QuestPlanDraft>(res.content);
    return normalizeQuestPlanDraft(parsed, input, genType);
  } catch (err) {
    console.error(err);
    return { ...mockQuestPlan(input, genType), npcReply: "模型连接失败了。我先用公会的备用方案，为你整理一条温和的任务线。" };
  }
}

function buildMaroSystemPrompt(genType: QuestGenType): string {
  const typeGuidance = genType === "main"
    ? "用户只需要主线任务（mainQuest），不需要 dailyTasks 和 sideQuests（返回空数组）。"
    : genType === "daily"
    ? "用户只需要日常任务（dailyTasks），不需要 mainQuest（返回 null）和 sideQuests（返回空数组）。"
    : genType === "side"
    ? "用户只需要支线任务（sideQuests），不需要 mainQuest（返回 null）和 dailyTasks（返回空数组）。"
    : "用户需要完整的任务线（mainQuest + dailyTasks + sideQuests）。";

  return `你是 LifeQuest / 地球生活指南 中的 NPC：Maro，冒险公会管理员。
你的任务是把用户的真实生活目标拆解成生活 RPG 任务。
${typeGuidance}

你必须只输出 JSON，不要输出 Markdown，不要解释。不要使用代码块。不要添加 JSON 外的任何文字。

${genType !== "daily" && genType !== "side" ? `主线 mainQuest：
- title 标题，description 描述，domain 领域（body/mind/relationship/home/exploration/interest/learning/career/finance）
- stages 3 到 5 个阶段，每个有 title 和 description` : ""}

${genType !== "main" && genType !== "side" ? `日常 dailyTasks 2 到 4 个：
- title, description, domain, difficulty(easy/normal/hard)
- period(daily/weekly/monthly), targetCount, timesPerDay(默认1)` : ""}

${genType !== "main" && genType !== "daily" ? `支线 sideQuests 1 到 3 个：
- title, description, domain, difficulty(easy/normal/hard)` : ""}

风格：温和不压迫、生活化具体可执行、不要像 KPI、不要产生医疗法律金融等高风险建议。

输出 JSON 格式：
{
 "npcReply": "Maro 对用户说的话",
 "rationale": "为什么这样拆解",
 ${genType !== "daily" && genType !== "side" ? `"mainQuest": { "title": "主线标题", "description": "主线描述", "domain": "mind", "stages": [{ "title": "阶段标题", "description": "阶段描述" }] },` : ""}
 "${genType === "daily" || genType === "all" ? `"dailyTasks": [{ "title": "日常标题", "description": "", "domain": "body", "difficulty": "easy", "period": "daily", "targetCount": 1, "timesPerDay": 1 }],` : ""}
 "${genType === "side" || genType === "all" ? `"sideQuests": [{ "title": "支线标题", "description": "", "domain": "exploration", "difficulty": "normal" }]` : ""}
}`;
}

function buildMaroUserPrompt(input: QuestPlannerInput, genType: QuestGenType): string {
  const typeHint = genType === "main" ? "用户只需要生成主线任务。" : genType === "daily" ? "用户只需要生成日常任务。" : genType === "side" ? "用户只需要生成支线任务。" : "用户需要完整任务线。";
  return `用户目标：${input.goal}\n当前状态：${input.currentSituation || "未提供"}\n时间范围：${input.timeRange}\n强度偏好：${input.intensity}\n${typeHint}\n\n请生成适合 LifeQuest 的任务。`;
}

function normalizeQuestPlanDraft(draft: any, input: QuestPlannerInput, genType: QuestGenType): QuestPlanDraft {
  const fallback = mockQuestPlan(input, genType);
  const safeDomain = (domain: any): LifeDomain => DOMAINS.includes(domain) ? domain : "mind";
  const safeDifficulty = (difficulty: any): Difficulty => DIFFICULTIES.includes(difficulty) ? difficulty : "easy";

  const mainQuest = (genType === "daily" || genType === "side") ? null : (draft.mainQuest || fallback.mainQuest);
  const result: QuestPlanDraft = {
    npcReply: draft.npcReply || fallback.npcReply,
    rationale: draft.rationale || fallback.rationale,
    mainQuest: mainQuest ? {
      title: mainQuest.title || fallback.mainQuest!.title,
      description: mainQuest.description || fallback.mainQuest!.description,
      domain: safeDomain(mainQuest.domain),
      stages: (mainQuest.stages?.length ? mainQuest.stages : fallback.mainQuest!.stages)
        .slice(0, 5).map((s: any) => ({ title: s.title || "未命名阶段", description: s.description || "" })),
    } : undefined as any,
    dailyTasks: (draft.dailyTasks?.length ? draft.dailyTasks : fallback.dailyTasks).slice(0, 4).map((t: any) => ({
      title: t.title || "未命名日常", description: t.description || "",
      domain: safeDomain(t.domain), difficulty: safeDifficulty(t.difficulty),
      period: ["daily", "weekly", "monthly"].includes(t.period) ? t.period : "daily",
      targetCount: Math.max(1, Number(t.targetCount || 1)),
      timesPerDay: Math.max(1, Number(t.timesPerDay || 1)), daysOfWeek: t.daysOfWeek,
    })),
    sideQuests: (draft.sideQuests?.length ? draft.sideQuests : fallback.sideQuests).slice(0, 3).map((q: any) => ({
      title: q.title || "未命名支线", description: q.description || "",
      domain: safeDomain(q.domain), difficulty: safeDifficulty(q.difficulty), dueDate: q.dueDate,
    })),
  };
  return result;
}

function mockQuestPlan(input: QuestPlannerInput, genType: QuestGenType): QuestPlanDraft {
  const domain = inferDomain(input.goal);

  const main: any = (genType !== "daily" && genType !== "side") ? {
    title: buildMainQuestTitle(input.goal),
    description: input.currentSituation || "从一个很小的行动开始，慢慢找回生活节奏。",
    domain,
    stages: [
      { title: "观察当前状态", description: "先记录现在的状态，不急着解决。" },
      { title: "完成一个 10 分钟行动", description: "选择一个很小、低阻力的行动。" },
      { title: "连续三天保持一个小习惯", description: "不用追求完美，只要保持连续性。" },
      { title: "回顾并调整节奏", description: "看看哪些行动有效，哪些需要降低难度。" },
    ],
  } : undefined;

  const dailies = (genType !== "main" && genType !== "side") ? [
    { title: "写一句今日状态", description: "只写一句话，记录今天的自己。", domain: "mind", difficulty: "easy", period: "daily", targetCount: 1, timesPerDay: 1 },
    { title: "完成一个 10 分钟生活行动", description: "整理桌面、出门走走、喝水、晒太阳都可以。", domain, difficulty: "easy", period: "daily", targetCount: 1, timesPerDay: 1 },
  ] as any : [];

  const sides = (genType !== "main" && genType !== "daily") ? [
    { title: "给未来三天的自己留一张便签", description: "写下一个不会让你有压力的小提醒。", domain: "mind", difficulty: "normal" },
  ] as any : [];

  const msgs: Record<QuestGenType, string> = {
    main: "这条主线可以帮你慢慢推进。每天只需要完成一个小阶段。",
    daily: "这里有一些低门槛的日常行动，适合放进每天的生活里。",
    side: "我挑了一个不会太难的支线，给生活增加一点探索感。",
    all: "这听起来不止一个待办，而更像一条可以慢慢推进的主线。我先为你整理一版温和的任务线。",
  };

  return { npcReply: msgs[genType], rationale: "目标被拆成可执行的小步骤。", mainQuest: main as any, dailyTasks: dailies, sideQuests: sides };
}

function inferDomain(goal: string): LifeDomain {
  if (/作息|睡|运动|身体|健康|饮食/.test(goal)) return "body";
  if (/情绪|焦虑|压力|内耗|心情/.test(goal)) return "mind";
  if (/朋友|家人|关系|社交/.test(goal)) return "relationship";
  if (/房间|整理|桌面|家/.test(goal)) return "home";
  if (/学习|阅读|研究|考试/.test(goal)) return "learning";
  if (/工作|实习|申请|职业/.test(goal)) return "career";
  if (/钱|消费|预算|财务/.test(goal)) return "finance";
  if (/兴趣|画|写作|创作|音乐/.test(goal)) return "interest";
  if (/城市|探索|散步|旅行/.test(goal)) return "exploration";
  return "mind";
}
function buildMainQuestTitle(goal: string): string {
  const g = goal.trim(); return g.length <= 16 ? g : `重新整理：${g.slice(0, 16)}…`;
}
