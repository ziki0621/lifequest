import type { NpcProfile } from "../types/agent";

export const NPCS: Record<string, NpcProfile> = {
  lumi: { id: "lumi", name: "Lumi", title: "营地向导", role: "today_guide", avatar: "✨", description: "每天陪你开始生活冒险的向导。", tone: "gentle" },
  maro: { id: "maro", name: "Maro", title: "公会管理员", role: "quest_planner", avatar: "🗺️", description: "帮你把模糊目标整理成主线、日常和支线。", tone: "formal" },
  nia: { id: "nia", name: "Nia", title: "档案员", role: "journal_keeper", avatar: "📝", description: "保存生活记录与心情痕迹。", tone: "quiet" },
};
