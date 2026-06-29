import {
  Dumbbell, Brain, Heart, Home, Compass, Palette, GraduationCap,
  Briefcase, Wallet, Eye, ClipboardList, Sparkles, Lightbulb, type LucideIcon,
} from "lucide-react";

// ====== Domain Types ======
export type LifeDomain = "body" | "mind" | "relationship" | "home" | "exploration" | "interest" | "learning" | "career" | "finance";
export type TaskType = "main" | "side" | "daily" | "exploration" | "relationship" | "selfCare" | "home" | "interest";
export type LifeAttribute = "stamina" | "mind" | "perception" | "connection" | "order" | "creativity" | "knowledge";
export type Mood = "calm" | "happy" | "tired" | "anxious" | "sad" | "satisfied" | "blank" | "motivated";
export type EnergyLevel = "low" | "normal" | "high";

// ====== Data Models ======
export interface AttributeState { level: number; exp: number; }
export interface AttributeReward { attribute: LifeAttribute; exp: number; }
export interface Player {
  name: string; level: number; totalExp: number; title: string;
  attributes: Record<LifeAttribute, AttributeState>; unlockedAchievements: string[];
  startDate: string;
}
export interface QuestLine {
  id: string; title: string; description: string; domain: LifeDomain;
  status: "active" | "paused" | "completed"; createdAt: string;
}
export interface Task {
  id: string; title: string; description?: string; questLineId?: string;
  type: TaskType; domain: LifeDomain; difficulty: "easy" | "normal" | "hard";
  expReward: number; attributeRewards: AttributeReward[]; dueDate?: string;
  completed: boolean; completedAt?: string; createdAt: string;
}
export interface JournalEntry {
  id: string; date: string; taskId?: string; mood: Mood; energy: EnergyLevel;
  content: string; tags: string[]; createdAt: string;
}
export interface Achievement {
  id: string; title: string; description: string; conditionText: string;
  unlocked: boolean; unlockedAt?: string;
}
export interface AppState {
  player: Player; questLines: QuestLine[]; tasks: Task[];
  journalEntries: JournalEntry[]; achievements: Achievement[];
}

// ====== Icon / Label / Color mappings ======
// Palette: navy #0B192C, coral #FF4D6D, leaf #4A90E2

export const DOMAIN_ICONS: Record<LifeDomain, LucideIcon> = {
  body: Dumbbell, mind: Brain, relationship: Heart, home: Home,
  exploration: Compass, interest: Palette, learning: GraduationCap,
  career: Briefcase, finance: Wallet,
};
export const DOMAIN_LABELS: Record<LifeDomain, string> = {
  body: "身体", mind: "心情", relationship: "关系", home: "居住",
  exploration: "探索", interest: "兴趣", learning: "学习", career: "事业", finance: "财务",
};
export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  main: "主线任务", side: "支线任务", daily: "每日任务", exploration: "探索任务",
  relationship: "关系任务", selfCare: "自我照顾", home: "居住任务", interest: "兴趣任务",
};

export const ATTRIBUTE_ICONS: Record<LifeAttribute, LucideIcon> = {
  stamina: Dumbbell, mind: Brain, perception: Eye, connection: Heart,
  order: ClipboardList, creativity: Sparkles, knowledge: Lightbulb,
};
export const ATTRIBUTE_LABELS: Record<LifeAttribute, string> = {
  stamina: "体力", mind: "心力", perception: "感知", connection: "连接",
  order: "秩序", creativity: "创造", knowledge: "智识",
};
// Coral for mind/connection, Leaf for perception, Navy for order/creativity/knowledge, mixed for stamina
export const ATTR_COLOR: Record<LifeAttribute, string> = {
  stamina: "#0B192C", mind: "#FF4D6D", perception: "#4A90E2",
  connection: "#FF4D6D", order: "#0B192C", creativity: "#0B192C", knowledge: "#4A90E2",
};
export const ATTR_BG: Record<LifeAttribute, string> = {
  stamina: "rgba(11,25,44,0.06)", mind: "rgba(255,77,109,0.08)",
  perception: "rgba(74,144,226,0.08)", connection: "rgba(255,77,109,0.08)",
  order: "rgba(11,25,44,0.06)", creativity: "rgba(11,25,44,0.06)",
  knowledge: "rgba(74,144,226,0.08)",
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
