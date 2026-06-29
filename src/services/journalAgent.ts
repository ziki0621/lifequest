import type { JournalAgentResult } from "../types/agent";

export function getNiaReply(content: string): JournalAgentResult {
  if (/累|疲惫|困|撑不住/.test(content)) return { npcReply: "我会把这句话保存下来。疲惫的时候还能留下一点记录，本身就已经是一种努力。", mood: "tired", energy: "low", tags: ["疲惫", "记录"] };
  if (/开心|高兴|满足|不错/.test(content)) return { npcReply: "这是一条明亮的记录。我会把它放进今天的日志里。", mood: "happy", energy: "normal", tags: ["积极", "记录"] };
  return { npcReply: "我会把这句话保存下来。很多生活痕迹，一开始都只是这样的一句话。", mood: "calm", energy: "normal", tags: ["日记"] };
}
