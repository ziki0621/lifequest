import type { AppState } from "../types";
import { createInitialAttributes } from "../utils/exp";
import { today } from "../utils/date";
import { genId } from "../utils/id";

export function createDefaultAppState(): AppState {
  const now = today();

  const questLine1Id = genId();
  const questLine2Id = genId();
  const questLine3Id = genId();

  return {
    player: {
      name: "地球玩家",
      level: 1,
      totalExp: 0,
      title: "初到地球",
      attributes: createInitialAttributes(),
      unlockedAchievements: [],
      startDate: now,
    },

    questLines: [
      {
        id: questLine1Id,
        title: "找回稳定生活节奏",
        description:
          "通过睡眠、整理、饮食和轻量行动，让生活重新有节奏。",
        domain: "mind",
        status: "active",
        createdAt: now,
      },
      {
        id: questLine2Id,
        title: "探索我的城市",
        description:
          "用轻量小冒险重新认识附近的生活空间。",
        domain: "exploration",
        status: "active",
        createdAt: now,
      },
      {
        id: questLine3Id,
        title: "重新连接重要的人",
        description:
          "通过小而真实的行动，维系和朋友、家人的关系。",
        domain: "relationship",
        status: "active",
        createdAt: now,
      },
    ],

    tasks: [
      // 主线1的支线
      {
        id: genId(),
        title: "睡前写三句话日记",
        description: "睡前用三句话记下今天的小事。",
        questLineId: questLine1Id,
        type: "selfCare",
        domain: "mind",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [{ attribute: "mind", exp: 10 }],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "整理桌面 10 分钟",
        description: "花10分钟把桌面收拾干净。",
        questLineId: questLine1Id,
        type: "home",
        domain: "home",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [{ attribute: "order", exp: 10 }],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "出门晒 15 分钟太阳",
        description: "走到户外晒晒太阳，呼吸新鲜空气。",
        questLineId: questLine1Id,
        type: "daily",
        domain: "body",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [
          { attribute: "stamina", exp: 5 },
          { attribute: "perception", exp: 5 },
        ],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "做一顿认真吃的饭",
        description: "为自己准备一顿饭，认真地吃。",
        questLineId: questLine1Id,
        type: "selfCare",
        domain: "body",
        difficulty: "normal",
        expReward: 20,
        attributeRewards: [
          { attribute: "stamina", exp: 10 },
          { attribute: "mind", exp: 10 },
        ],
        completed: false,
        createdAt: now,
      },
      // 主线2的支线
      {
        id: genId(),
        title: "走一条没走过的路",
        description: "发现一条新的街道或小巷。",
        questLineId: questLine2Id,
        type: "exploration",
        domain: "exploration",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [{ attribute: "perception", exp: 10 }],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "去一家没去过的咖啡店",
        description: "找一家没去过的咖啡店坐坐。",
        questLineId: questLine2Id,
        type: "exploration",
        domain: "exploration",
        difficulty: "normal",
        expReward: 20,
        attributeRewards: [
          { attribute: "perception", exp: 15 },
          { attribute: "mind", exp: 5 },
        ],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "拍一张今天觉得好看的东西",
        description: "用手机拍下生活中觉得好看的一瞬间。",
        questLineId: questLine2Id,
        type: "exploration",
        domain: "exploration",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [
          { attribute: "perception", exp: 5 },
          { attribute: "creativity", exp: 5 },
        ],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "记录一个新发现的地点",
        description: "在手机地图上标记一个想再去的地方。",
        questLineId: questLine2Id,
        type: "exploration",
        domain: "exploration",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [
          { attribute: "perception", exp: 5 },
          { attribute: "order", exp: 5 },
        ],
        completed: false,
        createdAt: now,
      },
      // 主线3的支线
      {
        id: genId(),
        title: "给一位朋友发一句近况",
        description: "给朋友发一条消息，问问ta最近怎么样。",
        questLineId: questLine3Id,
        type: "relationship",
        domain: "relationship",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [{ attribute: "connection", exp: 10 }],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "给家人打一个电话",
        description: "给家人打个电话，聊几句家常。",
        questLineId: questLine3Id,
        type: "relationship",
        domain: "relationship",
        difficulty: "normal",
        expReward: 20,
        attributeRewards: [{ attribute: "connection", exp: 20 }],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "记下一位朋友最近在忙什么",
        description: "留意朋友最近的动态，记在心里。",
        questLineId: questLine3Id,
        type: "relationship",
        domain: "relationship",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [
          { attribute: "connection", exp: 5 },
          { attribute: "perception", exp: 5 },
        ],
        completed: false,
        createdAt: now,
      },
      {
        id: genId(),
        title: "主动表达一次感谢",
        description: "对身边的人真诚地说一声谢谢。",
        questLineId: questLine3Id,
        type: "relationship",
        domain: "relationship",
        difficulty: "easy",
        expReward: 10,
        attributeRewards: [
          { attribute: "connection", exp: 5 },
          { attribute: "mind", exp: 5 },
        ],
        completed: false,
        createdAt: now,
      },
    ],

    journalEntries: [],

    achievements: [
      {
        id: "first-task",
        title: "第一次生活任务",
        description: "你迈出了在地球上认真生活的第一步。",
        conditionText: "完成第一个任务",
        unlocked: false,
      },
      {
        id: "explorer-1",
        title: "城市漫游者 I",
        description: "你开始用新的眼光看待周围的城市。",
        conditionText: "完成 3 个探索任务",
        unlocked: false,
      },
      {
        id: "balanced-day",
        title: "认真生活的一天",
        description: "你在同一天里照顾了生活的不同方面。",
        conditionText: "同一天完成 3 个不同领域任务",
        unlocked: false,
      },
      {
        id: "organizer",
        title: "小小整理家",
        description: "你开始一点点整理自己的生活空间。",
        conditionText: "完成 3 个居住任务",
        unlocked: false,
      },
      {
        id: "reconnect",
        title: "连接重新开始",
        description: "你重新开始关心身边的人。",
        conditionText: "完成 2 个关系任务",
        unlocked: false,
      },
      {
        id: "first-journal",
        title: "写下今天",
        description: "你在生活日志里留下了第一笔痕迹。",
        conditionText: "写下第一篇日记",
        unlocked: false,
      },
      {
        id: "gentle-restart",
        title: "温和重启",
        description: "即使暂停了也没关系，你又重新开始了。",
        conditionText: "在连续 3 天没有完成任务后重新完成一个任务",
        unlocked: false,
      },
    ],
  };
}
