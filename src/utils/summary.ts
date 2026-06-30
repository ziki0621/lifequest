import type { AppState, AttributeReward, Mood } from "../types";

export interface TodaySummary {
  date: string;
  completedCount: number;
  expGained: number;
  attributeRewards: AttributeReward[];
  journalCount: number;
  mood?: Mood;
  level: number;
  title: string;
  text: string;
}

export function buildTodaySummary(state: AppState, date: string): TodaySummary {
  const rewards: AttributeReward[] = [];
  let expGained = 0;
  let completedCount = 0;

  state.dailyTasks.forEach((dt) => {
    const count = dt.completions.filter((d) => d === date).length;
    if (count > 0) {
      completedCount += count;
      expGained += dt.expReward * count;
      for (let i = 0; i < count; i++) rewards.push(...dt.attributeRewards);
    }
  });

  state.questBooks.forEach((qb) => {
    qb.questLines.forEach((ql) => {
      ql.stages.forEach((s, index) => {
        if (s.completedAt?.startsWith(date)) {
          completedCount += 1;
          expGained += index === 0 ? 15 : 25;
        }
      });
    });
    qb.directTasks.forEach((t) => {
      if (t.completedAt?.startsWith(date)) {
        completedCount += 1;
        expGained += 10;
      }
    });
  });

  state.sideQuests.forEach((sq) => {
    if (sq.completedAt?.startsWith(date)) {
      completedCount += 1;
      expGained += sq.expReward;
      rewards.push(...sq.attributeRewards);
    }
  });

  const journals = state.journalEntries.filter((j) => j.date === date);
  const mood = journals[journals.length - 1]?.mood;
  const text = `今天完成 ${completedCount} 个生活任务，获得 ${expGained} EXP。${journals.length > 0 ? `写下了 ${journals.length} 条生活记录。` : "没有写日志，但也留下了行动痕迹。"}`;

  return { date, completedCount, expGained, attributeRewards: mergeRewards(rewards), journalCount: journals.length, mood, level: state.player.level, title: state.player.title, text };
}

function mergeRewards(rewards: AttributeReward[]): AttributeReward[] {
  const map = new Map<string, number>();
  rewards.forEach((r) => map.set(r.attribute, (map.get(r.attribute) || 0) + r.exp));
  return Array.from(map.entries()).map(([attribute, exp]) => ({ attribute: attribute as AttributeReward["attribute"], exp }));
}
