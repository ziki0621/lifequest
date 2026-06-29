import type { LLMConfig, QuestPlannerInput, QuestPlanDraft } from "../types/agent";
import type { LifeDomain, Difficulty } from "../types";
import { callLLM, extractJsonObject } from "./llmClient";

const DOMAINS: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];
const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];

export async function generateQuestPlan(input: QuestPlannerInput, config: LLMConfig): Promise<QuestPlanDraft> {
  if (!config.enabled || config.mockMode) return mockQuestPlan(input);
  const system = buildMaroSystemPrompt();
  const user = buildMaroUserPrompt(input);
  try {
    const res = await callLLM(config, { system, user, temperature: 0.35 });
    const parsed = extractJsonObject<QuestPlanDraft>(res.content);
    return normalizeQuestPlanDraft(parsed, input);
  } catch (err) {
    console.error(err);
    return { ...mockQuestPlan(input), npcReply: "模型连接失败了。我先用公会的备用方案，为你整理一条温和的任务线。" };
  }
}

function buildMaroSystemPrompt(): string {
  return `你是 LifeQuest / 地球生活指南 中的 NPC：Maro，冒险公会管理员。
你的任务是把用户的真实生活目标拆解成生活 RPG 任务。

你必须只输出 JSON，不要输出 Markdown，不要解释。不要使用代码块。不要添加 JSON 外的任何文字。

任务类型：
1. mainQuest：一个长期主线目标
2. stages：3 到 5 个阶段
3. dailyTasks：2 到 4 个日常任务
4. sideQuests：1 到 3 个支线任务

领域 domain 必须是以下之一：body, mind, relationship, home, exploration, interest, learning, career, finance
难度 difficulty 必须是：easy, normal, hard
period 必须是：daily, weekly, monthly

风格要求：温和不压迫、生活化具体可执行、不要像 KPI、不要产生医疗法律金融等高风险建议、如果用户目标过大会拆成小行动

输出 JSON 格式：
{
 "npcReply": "Maro 对用户说的话",
 "rationale": "为什么这样拆解",
 "mainQuest": { "title": "主线标题", "description": "主线描述", "domain": "mind", "stages": [{ "title": "阶段标题", "description": "阶段描述" }] },
 "dailyTasks": [{ "title": "日常任务标题", "description": "日常任务描述", "domain": "body", "difficulty": "easy", "period": "daily", "targetCount": 1, "timesPerDay": 1 }],
 "sideQuests": [{ "title": "支线任务标题", "description": "支线任务描述", "domain": "exploration", "difficulty": "normal" }]
}`;
}

function buildMaroUserPrompt(input: QuestPlannerInput): string {
  return `用户目标：${input.goal}\n当前状态：${input.currentSituation || "未提供"}\n时间范围：${input.timeRange}\n强度偏好：${input.intensity}\n偏好领域：${input.preferredDomains?.join(", ") || "未指定"}\n\n请生成一套适合 LifeQuest 的任务线。`;
}

function normalizeQuestPlanDraft(draft: QuestPlanDraft, input: QuestPlannerInput): QuestPlanDraft {
  const fallback = mockQuestPlan(input);
  const mainQuest = draft.mainQuest || fallback.mainQuest;
  const safeDomain = (domain: any): LifeDomain => DOMAINS.includes(domain) ? domain : "mind";
  const safeDifficulty = (difficulty: any): Difficulty => DIFFICULTIES.includes(difficulty) ? difficulty : "easy";
  return {
    npcReply: draft.npcReply || fallback.npcReply,
    rationale: draft.rationale || fallback.rationale,
    mainQuest: {
      title: mainQuest.title || fallback.mainQuest.title,
      description: mainQuest.description || fallback.mainQuest.description,
      domain: safeDomain(mainQuest.domain),
      stages: (mainQuest.stages?.length ? mainQuest.stages : fallback.mainQuest.stages).slice(0, 5).map((s) => ({ title: s.title || "未命名阶段", description: s.description || "" })),
    },
    dailyTasks: (draft.dailyTasks?.length ? draft.dailyTasks : fallback.dailyTasks).slice(0, 4).map((t) => ({
      title: t.title || "未命名日常", description: t.description || "", domain: safeDomain(t.domain),
      difficulty: safeDifficulty(t.difficulty), period: ["daily", "weekly", "monthly"].includes(t.period) ? t.period : "daily",
      targetCount: Math.max(1, Number(t.targetCount || 1)), timesPerDay: Math.max(1, Number(t.timesPerDay || 1)), daysOfWeek: t.daysOfWeek,
    })),
    sideQuests: (draft.sideQuests?.length ? draft.sideQuests : fallback.sideQuests).slice(0, 3).map((q) => ({
      title: q.title || "未命名支线", description: q.description || "", domain: safeDomain(q.domain), difficulty: safeDifficulty(q.difficulty), dueDate: q.dueDate,
    })),
  };
}

function mockQuestPlan(input: QuestPlannerInput): QuestPlanDraft {
  const domain = inferDomain(input.goal);
  return {
    npcReply: "这听起来不像一个普通待办，而更像一条可以慢慢推进的主线。我先为你整理一版温和的任务线。",
    rationale: "目标被拆成主线阶段、低压力日常和少量支线，方便用户在不增加压力的情况下开始行动。",
    mainQuest: {
      title: buildMainQuestTitle(input.goal),
      description: input.currentSituation || "从一个很小的行动开始，慢慢找回生活节奏。",
      domain,
      stages: [
        { title: "观察当前状态", description: "先记录现在的状态，不急着解决。" },
        { title: "完成一个 10 分钟行动", description: "选择一个很小、低阻力的行动，重新启动节奏。" },
        { title: "连续三天保持一个小习惯", description: "不用追求完美，只要保持一点点连续性。" },
        { title: "回顾并调整节奏", description: "看看哪些行动有效，哪些需要降低难度。" },
      ],
    },
    dailyTasks: [
      { title: "写一句今日状态", description: "只写一句话，记录今天的自己。", domain: "mind", difficulty: "easy", period: "daily", targetCount: 1, timesPerDay: 1 },
      { title: "完成一个 10 分钟生活行动", description: "整理桌面、出门走走、喝水、晒太阳都可以。", domain: domain, difficulty: "easy", period: "daily", targetCount: 1, timesPerDay: 1 },
    ],
    sideQuests: [{ title: "给未来三天的自己留一张便签", description: "写下一个不会让你有压力的小提醒。", domain: "mind", difficulty: "normal" }],
  };
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
