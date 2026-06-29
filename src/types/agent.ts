import type { LifeDomain, Difficulty, Mood, EnergyLevel } from "../types";

export type AgentId = "lumi" | "maro" | "nia";
export type AgentRole = "today_guide" | "quest_planner" | "journal_keeper";

export interface NpcProfile {
  id: AgentId; name: string; title: string; role: AgentRole;
  avatar: string; description: string; tone: "gentle" | "formal" | "quiet";
}

export interface ChatMessage {
  id: string; role: "npc" | "user" | "system"; content: string; createdAt: string;
}

export interface LLMConfig {
  enabled: boolean; mockMode: boolean; providerName: string;
  baseUrl: string; apiKey: string; model: string;
}

export interface QuestPlannerInput {
  goal: string; currentSituation?: string;
  timeRange: "3days" | "1week" | "2weeks" | "1month";
  intensity: "gentle" | "normal" | "challenge"; preferredDomains?: LifeDomain[];
}

export interface QuestPlanStageDraft { title: string; description?: string; anchorDate?: string; }

export interface QuestPlanMainQuestDraft {
  title: string; description: string; domain: LifeDomain; stages: QuestPlanStageDraft[];
}

export interface QuestPlanDailyTaskDraft {
  title: string; description?: string; domain: LifeDomain; difficulty: Difficulty;
  period: "daily" | "weekly" | "monthly"; targetCount: number;
  timesPerDay?: number; daysOfWeek?: number[];
}

export interface QuestPlanSideQuestDraft {
  title: string; description?: string; domain: LifeDomain; difficulty: Difficulty; dueDate?: string;
}

export interface QuestPlanDraft {
  npcReply: string; rationale: string;
  mainQuest: QuestPlanMainQuestDraft;
  dailyTasks: QuestPlanDailyTaskDraft[];
  sideQuests: QuestPlanSideQuestDraft[];
}

export interface TodayRecommendation {
  npcReply: string; taskType: "mainStage" | "daily" | "sideQuest" | "none";
  taskId?: string; title?: string; reason: string;
}

export interface JournalAgentResult {
  npcReply: string; mood?: Mood; energy?: EnergyLevel; tags?: string[];
}
