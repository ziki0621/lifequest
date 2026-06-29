import type { AppState } from "../types";
import type { TodayRecommendation } from "../types/agent";
import { today, isDailyTaskDue } from "../utils/date";

export function getTodayRecommendation(state: AppState): TodayRecommendation {
  const t = today();
  const daily = state.dailyTasks.find((dt) => isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay));
  if (daily) return { npcReply: `今天可以先从「${daily.title}」开始。它不需要太多准备，是一个适合启动生活节奏的小行动。`, taskType: "daily", taskId: daily.id, title: daily.title, reason: "优先推荐今天到期的日常任务。" };

  const side = state.sideQuests.find((sq) => !sq.completed);
  if (side) return { npcReply: `今天没有必须完成的日常。也许可以试试支线「${side.title}」，给今天增加一点探索感。`, taskType: "sideQuest", taskId: side.id, title: side.title, reason: "没有日常时推荐未完成支线。" };

  const main = state.mainQuests.filter((mq) => mq.status === "active").map((mq) => {
    const stage = mq.stages.find((s) => !s.completed);
    return stage ? { mq, stage } : null;
  }).filter(Boolean)[0] as any;

  if (main) return { npcReply: `如果你愿意，可以推进主线阶段「${main.stage.title}」。不用一次做很多，只要完成当前节点就好。`, taskType: "mainStage", taskId: main.stage.id, title: main.stage.title, reason: "推荐当前主线阶段。" };
  return { npcReply: "今天的任务地图很安静。你可以为自己添加一个很小的新行动。", taskType: "none", reason: "当前没有可推荐任务。" };
}
