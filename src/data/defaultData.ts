import type { AppState } from "../types";
import { createInitialAttributes } from "../utils/exp";
import { today } from "../utils/date";
import { genId } from "../utils/id";

export function createDefaultAppState(): AppState {
  const now = today();

  // ── QuestBooks ──
  const questBooks = [
    {
      id: genId(), title: "找回稳定生活节奏", description: "通过调整作息、运动和饮食，让生活重新有节奏。", domain: "mind" as const, status: "active" as const,
      questLines: [
        { id: genId(), title: "作息调整", stages: [
          { id: genId(), title: "每天固定时间入睡", anchorDate: now, completed: false, order: 0 },
          { id: genId(), title: "每天固定时间起床", completed: false, order: 1 },
        ]},
        { id: genId(), title: "运动习惯", stages: [
          { id: genId(), title: "每周运动 2 次", completed: false, order: 0 },
          { id: genId(), title: "每次至少 20 分钟", completed: false, order: 1 },
        ]},
      ],
      directTasks: [
        { id: genId(), title: "睡前写三句话日记", completed: false },
        { id: genId(), title: "整理桌面 10 分钟", completed: false },
      ],
      createdAt: now,
    },
    {
      id: genId(), title: "探索我的城市", description: "用轻量小冒险重新认识附近的生活空间。", domain: "exploration" as const, status: "active" as const,
      questLines: [
        { id: genId(), title: "步行探索", stages: [
          { id: genId(), title: "走一条没走过的路", completed: false, order: 0 },
          { id: genId(), title: "记录一个新发现的地点", completed: false, order: 1 },
        ]},
      ],
      directTasks: [
        { id: genId(), title: "去一家没去过的咖啡店", completed: false },
        { id: genId(), title: "拍一张今天觉得好看的东西", completed: false },
      ],
      createdAt: now,
    },
    {
      id: genId(), title: "重新连接重要的人", description: "通过小而真实的行动维系关系。", domain: "relationship" as const, status: "active" as const,
      questLines: [
        { id: genId(), title: "主动联系", stages: [
          { id: genId(), title: "给一位朋友发一句近况", completed: false, order: 0 },
          { id: genId(), title: "给家人打一个电话", completed: false, order: 1 },
        ]},
      ],
      directTasks: [
        { id: genId(), title: "主动表达一次感谢", completed: false },
      ],
      createdAt: now,
    },
  ];

  // ── Daily Tasks ──
  const dailyTasks = [
    { id: genId(), title: "出门晒 15 分钟太阳", description: "走到户外晒太阳", domain: "body" as const, difficulty: "easy" as const, expReward: 10, attributeRewards: [{ attribute: "stamina" as const, exp: 5 }, { attribute: "perception" as const, exp: 5 }], period: "daily" as const, targetCount: 1, completions: [] as string[], active: true, createdAt: now },
    { id: genId(), title: "每周运动 2 次", description: "跑步、散步、健身都算", domain: "body" as const, difficulty: "normal" as const, expReward: 20, attributeRewards: [{ attribute: "stamina" as const, exp: 15 }, { attribute: "mind" as const, exp: 5 }], period: "weekly" as const, targetCount: 2, completions: [] as string[], active: true, createdAt: now },
    { id: genId(), title: "做一顿认真吃的饭", description: "为自己准备一餐，认真吃", domain: "body" as const, difficulty: "normal" as const, expReward: 20, attributeRewards: [{ attribute: "stamina" as const, exp: 10 }, { attribute: "mind" as const, exp: 10 }], period: "daily" as const, targetCount: 1, timesPerDay: 2, completions: [] as string[], active: true, createdAt: now },
    { id: genId(), title: "整理桌面 10 分钟", description: "花10分钟收拾书桌", domain: "home" as const, difficulty: "easy" as const, expReward: 10, attributeRewards: [{ attribute: "order" as const, exp: 10 }], period: "daily" as const, targetCount: 1, daysOfWeek: [1, 2, 3, 4, 5], completions: [] as string[], active: true, createdAt: now },
  ];

  // ── Side Quests ──
  const sideQuests = [
    { id: genId(), title: "探索一个新的街区", description: "周末去一个没去过的区域走走", domain: "exploration" as const, difficulty: "normal" as const, expReward: 20, attributeRewards: [{ attribute: "perception" as const, exp: 15 }, { attribute: "creativity" as const, exp: 5 }], completed: false, createdAt: now },
    { id: genId(), title: "读完一本书", description: "选一本一直想读的书，读完它", domain: "learning" as const, difficulty: "hard" as const, expReward: 35, attributeRewards: [{ attribute: "knowledge" as const, exp: 35 }], completed: false, createdAt: now },
    { id: genId(), title: "和朋友约一次饭", description: "约一位很久没见的朋友吃顿饭", domain: "relationship" as const, difficulty: "normal" as const, expReward: 20, attributeRewards: [{ attribute: "connection" as const, exp: 20 }], completed: false, createdAt: now },
  ];

  const achievements = [
    { id: "first-task", title: "第一次生活任务", description: "你迈出了在地球上认真生活的第一步。", conditionText: "完成任意一个任务", unlocked: false },
    { id: "explorer-1", title: "城市漫游者 I", description: "你开始用新的眼光看待周围的城市。", conditionText: "完成 3 个探索任务", unlocked: false },
    { id: "balanced-day", title: "认真生活的一天", description: "你在同一天里照顾了生活的不同方面。", conditionText: "同一天完成 3 个不同领域任务", unlocked: false },
    { id: "organizer", title: "小小整理家", description: "你开始一点点整理自己的生活空间。", conditionText: "完成 3 个居住任务", unlocked: false },
    { id: "reconnect", title: "连接重新开始", description: "你重新开始关心身边的人。", conditionText: "完成 2 个关系任务", unlocked: false },
    { id: "first-journal", title: "写下今天", description: "你在生活日志里留下了第一笔痕迹。", conditionText: "写下第一篇日记", unlocked: false },
    { id: "gentle-restart", title: "温和重启", description: "即使暂停了也没关系，你又重新开始了。", conditionText: "间隔 3 天以上重新完成任务", unlocked: false },
  ];

  return {
    player: { name: "地球玩家", level: 1, totalExp: 0, title: "初到地球", attributes: createInitialAttributes(), unlockedAchievements: [], startDate: now },
    questBooks, dailyTasks, sideQuests, journalEntries: [], achievements,
  };
}
