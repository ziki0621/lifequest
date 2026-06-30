import {
  Dumbbell, Brain, Heart, Home, Compass, Palette, GraduationCap,
  Briefcase, Wallet, Eye, ClipboardList, Sparkles, Lightbulb, type LucideIcon,
} from "lucide-react";

// ====== Enums ======
export type LifeDomain = "body" | "mind" | "relationship" | "home" | "exploration" | "interest" | "learning" | "career" | "finance";
export type LifeAttribute = "stamina" | "mind" | "perception" | "connection" | "order" | "creativity" | "knowledge";
export type Mood = "calm" | "happy" | "tired" | "anxious" | "sad" | "satisfied" | "blank" | "motivated";
export type EnergyLevel = "low" | "normal" | "high";
export type RecurrencePeriod = "daily" | "weekly" | "monthly";
export type Difficulty = "easy" | "normal" | "hard";
export type QuestBookStatus = "active" | "paused" | "completed";

// ====== Core Models ======
export interface AttributeState { level: number; exp: number; }
export interface AttributeReward { attribute: LifeAttribute; exp: number; }

export interface Player {
  name: string; level: number; totalExp: number; title: string;
  attributes: Record<LifeAttribute, AttributeState>; unlockedAchievements: string[];
  startDate: string;
}

// ── 任务书（代替原来的主线任务） ──

export interface QuestStage {
  id: string; title: string; description?: string;
  anchorDate?: string;
  completed: boolean; completedAt?: string;
  order: number;
}

/** 任务书内的单条任务线 */
export interface QuestLine {
  id: string; title: string; description?: string;
  stages: QuestStage[];
}

/** 任务书内的直接子任务（不归属任何任务线） */
export interface QuestBookTask {
  id: string; title: string; description?: string;
  completed: boolean; completedAt?: string;
}

/** 任务书：包含多条并行任务线 + 直接子任务 */
export interface QuestBook {
  id: string; title: string; description: string; domain: LifeDomain;
  status: QuestBookStatus;
  questLines: QuestLine[];
  directTasks: QuestBookTask[];
  createdAt: string;
  archived?: boolean; archivedAt?: string;
}

// ── 日常任务 ──
export interface DailyTask {
  id: string; title: string; description?: string; domain: LifeDomain;
  difficulty: Difficulty; expReward: number; attributeRewards: AttributeReward[];
  period: RecurrencePeriod; targetCount: number; completions: string[];
  daysOfWeek?: number[];   // 0=Sun..6=Sat, only for period="daily". undefined = every day
  timesPerDay?: number;    // only for period="daily". target completions per active day. default 1
  active: boolean; createdAt: string;
  archived?: boolean; archivedAt?: string;
}

// ── 支线任务 ──
export interface SideQuest {
  id: string; title: string; description?: string;
  domain: LifeDomain; difficulty: Difficulty; expReward: number;
  attributeRewards: AttributeReward[]; dueDate?: string;
  completed: boolean; completedAt?: string; createdAt: string;
  archived?: boolean; archivedAt?: string;
}

// ── 日志 & 成就 ──
export interface JournalEntry {
  id: string; date: string; taskId?: string;  // 可关联任何任务类型的 id
  mood: Mood; energy: EnergyLevel; content: string; tags: string[]; createdAt: string;
}

export interface Achievement {
  id: string; title: string; description: string; conditionText: string;
  unlocked: boolean; unlockedAt?: string;
}

// ====== App State ======
export interface AppState {
  player: Player;
  questBooks: QuestBook[];
  dailyTasks: DailyTask[];
  sideQuests: SideQuest[];
  journalEntries: JournalEntry[];
  achievements: Achievement[];
}

// ====== Linked item for JournalCard ======
export interface LinkedTask {
  type: "questStage" | "questBookTask" | "daily" | "sideQuest";
  title: string;
  attributeRewards: AttributeReward[];
}

// ====== Completion context for modals ======
export interface CompletionContext {
  itemType: "questStage" | "questBookTask" | "daily" | "sideQuest";
  itemId: string;
  title: string;
  expReward: number;
  attributeRewards: AttributeReward[];
}

// ====== Icon / Label / Color Mappings ======
export const DOMAIN_ICONS: Record<LifeDomain, LucideIcon> = {
  body: Dumbbell, mind: Brain, relationship: Heart, home: Home,
  exploration: Compass, interest: Palette, learning: GraduationCap,
  career: Briefcase, finance: Wallet,
};
export const DOMAIN_LABELS: Record<LifeDomain, string> = {
  body: "身体", mind: "心情", relationship: "关系", home: "居住",
  exploration: "探索", interest: "兴趣", learning: "学习", career: "事业", finance: "财务",
};

export const ATTRIBUTE_ICONS: Record<LifeAttribute, LucideIcon> = {
  stamina: Dumbbell, mind: Brain, perception: Eye, connection: Heart,
  order: ClipboardList, creativity: Sparkles, knowledge: Lightbulb,
};
export const ATTRIBUTE_LABELS: Record<LifeAttribute, string> = {
  stamina: "体力", mind: "心力", perception: "感知", connection: "连接",
  order: "秩序", creativity: "创造", knowledge: "智识",
};
export const ATTR_COLOR: Record<LifeAttribute, string> = {
  stamina: "#0B192C", mind: "#FF4D6D", perception: "#4A90E2",
  connection: "#FF4D6D", order: "#0B192C", creativity: "#0B192C", knowledge: "#4A90E2",
};
export const ATTRIBUTE_DESCRIPTIONS: Record<LifeAttribute, string> = {
  stamina: "运动、睡眠、饮食相关任务",
  mind: "日记、情绪、自我照顾相关任务",
  perception: "探索、散步、拍照、观察生活相关任务",
  connection: "朋友、家人、社交、表达关心相关任务",
  order: "整理、计划、财务、生活环境相关任务",
  creativity: "写作、画画、做产品、兴趣创作相关任务",
  knowledge: "阅读、学习、研究相关任务",
};

export const MOOD_LABELS: Record<Mood, string> = {
  calm: "平静", happy: "开心", tired: "疲惫", anxious: "焦虑",
  sad: "低落", satisfied: "满足", blank: "空白", motivated: "有动力",
};
export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  low: "低能量", normal: "普通", high: "高能量",
};

export const PERIOD_LABELS: Record<RecurrencePeriod, string> = {
  daily: "每天", weekly: "每周", monthly: "每月",
};

export const WEEKDAY_LABELS: Record<number, string> = {
  0: "日", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六",
};

export const WEEKDAY_FULL: Record<number, string> = {
  0: "周日", 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六",
};
