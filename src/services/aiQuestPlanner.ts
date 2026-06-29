import type { QuestPlannerInput, QuestPlanDraft, LifeDomain, LifeAttribute, AttributeReward } from "../types";
import { difficultyExp } from "../utils/exp";

export async function generateQuestPlan(input: QuestPlannerInput): Promise<QuestPlanDraft> {
  await sleep(600);
  return buildMockQuestPlan(input);
}

function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function buildMockQuestPlan(input: QuestPlannerInput): QuestPlanDraft {
  const domain = input.focusDomains[0] || inferDomainFromGoal(input.goal);
  const expEasy = difficultyExp("easy");
  const expNormal = difficultyExp("normal");

  return {
    rationale: "根据你的目标，系统将它拆成一个温和推进的主线任务，并配套一些低压力的日常与支线行动。",
    mainQuest: {
      title: buildMainTitle(input.goal),
      description: input.currentSituation || "从一个很小的行动开始，逐步恢复生活节奏。",
      domain,
      status: "active",
      stages: [
        { id: "draft-stage-1", title: "确认当前状态", description: "写下现在最困扰你的生活状态，不需要解决，只需要看见它。", completed: false, order: 0 },
        { id: "draft-stage-2", title: "完成第一个微小行动", description: "选择一个 10 分钟内可以完成的行动，让生活重新开始流动。", completed: false, order: 1 },
        { id: "draft-stage-3", title: "连续三天保持一个小习惯", description: "不追求完美，只追求可持续。", completed: false, order: 2 },
        { id: "draft-stage-4", title: "回顾并调整节奏", description: "记录这几天什么有效、什么太难，然后降低阻力。", completed: false, order: 3 },
      ],
    },
    dailyTasks: [
      { title: "写一句今日状态", description: "只写一句话：今天的我是什么状态？", domain: "mind", difficulty: "easy", expReward: expEasy, attributeRewards: getDefaultRewards("mind", expEasy), period: "daily", targetCount: 1, timesPerDay: 1, active: true },
      { title: "做一个 10 分钟生活行动", description: "整理桌面、出门走走、喝水、洗澡都可以。", domain, difficulty: "easy", expReward: expEasy, attributeRewards: getDefaultRewards(domain, expEasy), period: "daily", targetCount: 1, timesPerDay: 1, active: true },
    ],
    sideQuests: [
      { title: "给未来三天的自己留一张便签", description: "写下一个很小、很具体、不会让你有压力的提醒。", domain: "mind", difficulty: "normal", expReward: expNormal, attributeRewards: getDefaultRewards("mind", expNormal) },
    ],
  };
}

function inferDomainFromGoal(goal: string): LifeDomain {
  if (/运动|睡眠|作息|身体|健康/.test(goal)) return "body";
  if (/朋友|家人|关系|社交/.test(goal)) return "relationship";
  if (/学习|阅读|研究|考试/.test(goal)) return "learning";
  if (/房间|整理|家|桌面/.test(goal)) return "home";
  if (/钱|财务|预算|消费/.test(goal)) return "finance";
  if (/工作|实习|职业|申请/.test(goal)) return "career";
  if (/兴趣|画|写|音乐|创作/.test(goal)) return "interest";
  if (/城市|探索|散步|旅行/.test(goal)) return "exploration";
  return "mind";
}

function buildMainTitle(goal: string): string {
  const trimmed = goal.trim();
  if (trimmed.length <= 18) return trimmed;
  return `重新整理：${trimmed.slice(0, 16)}…`;
}

function getDefaultRewards(domain: LifeDomain, totalExp: number): AttributeReward[] {
  const map: Partial<Record<LifeDomain, LifeAttribute[]>> = {
    body: ["stamina"], mind: ["mind"], relationship: ["connection"], home: ["order"],
    exploration: ["perception"], interest: ["creativity"], learning: ["knowledge"],
    career: ["order", "knowledge"], finance: ["order"],
  };
  const attrs = map[domain] || ["mind"];
  const per = Math.floor(totalExp / attrs.length);
  return attrs.map((attribute) => ({ attribute, exp: per }));
}
