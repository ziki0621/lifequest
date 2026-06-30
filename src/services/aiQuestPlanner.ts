import type { QuestPlannerInput, QuestPlanDraft } from "../types/agent";
import type { LifeDomain } from "../types";

export async function generateQuestPlan(input: QuestPlannerInput): Promise<QuestPlanDraft> {
  await sleep(600);
  return buildMockPlan(input);
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function buildMockPlan(input: QuestPlannerInput): QuestPlanDraft {
  const domain: LifeDomain = (input.preferredDomains && input.preferredDomains.length > 0) ? input.preferredDomains[0] : "mind";
  return {
    npcReply: "我为你整理了一版温和的任务线。",
    rationale: "目标被拆为小步骤。",
    mainQuest: {
      title: input.goal.length <= 16 ? input.goal : `重新整理：${input.goal.slice(0, 16)}…`,
      description: input.currentSituation || "从小行动开始。",
      domain,
      stages: [
        { title: "确认当前状态", description: "写下最困扰你的事。" },
        { title: "完成第一个微小行动", description: "10分钟内可完成的行动。" },
        { title: "连续三天保持一个小习惯", description: "追求可持续。" },
        { title: "回顾并调整节奏", description: "记录什么有效。" },
      ],
    },
    dailyTasks: [
      { title: "写一句今日状态", description: "一句话记录今天的自己。", domain: "mind", difficulty: "easy", period: "daily", targetCount: 1, timesPerDay: 1 },
      { title: "做一个 10 分钟生活行动", description: "整理桌面、出门走走、喝水都可以。", domain, difficulty: "easy", period: "daily", targetCount: 1, timesPerDay: 1 },
    ],
    sideQuests: [
      { title: "给未来三天的自己留一张便签", description: "写下一个不会让你有压力的小提醒。", domain: "mind", difficulty: "normal" },
    ],
  };
}
