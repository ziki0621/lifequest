import type { Achievement, AppState } from "../types";
import { formatDate, today } from "./date";

interface AchievementCheckResult {
  achievements: Achievement[];
  newlyUnlocked: Achievement[];
}

/** 检查并解锁成就，返回新解锁的成就列表 */
export function checkAchievements(state: AppState): AchievementCheckResult {
  const { tasks, journalEntries, achievements } = state;
  const completedTasks = tasks.filter((t) => t.completed);
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = achievements.map((a) => {
    if (a.unlocked) return a;
    let shouldUnlock = false;

    switch (a.id) {
      case "first-task": {
        shouldUnlock = completedTasks.length >= 1;
        break;
      }
      case "explorer-1": {
        shouldUnlock =
          completedTasks.filter((t) => t.domain === "exploration" || t.type === "exploration").length >= 3;
        break;
      }
      case "balanced-day": {
        // 同一天完成3个不同domain的任务
        const domainsByDay = new Map<string, Set<string>>();
        completedTasks.forEach((t) => {
          if (t.completedAt) {
            const day = t.completedAt.split("T")[0];
            if (!domainsByDay.has(day)) domainsByDay.set(day, new Set());
            domainsByDay.get(day)!.add(t.domain);
          }
        });
        shouldUnlock = Array.from(domainsByDay.values()).some(
          (domains) => domains.size >= 3
        );
        break;
      }
      case "organizer": {
        shouldUnlock =
          completedTasks.filter((t) => t.domain === "home" || t.type === "home").length >= 3;
        break;
      }
      case "reconnect": {
        shouldUnlock =
          completedTasks.filter((t) => t.domain === "relationship" || t.type === "relationship").length >= 2;
        break;
      }
      case "first-journal": {
        shouldUnlock = journalEntries.length >= 1;
        break;
      }
      case "gentle-restart": {
        // 连续3天没完成任务后重新完成一个
        if (completedTasks.length === 0) break;
        const sorted = [...completedTasks].sort(
          (a, b) =>
            new Date(b.completedAt!).getTime() -
            new Date(a.completedAt!).getTime()
        );
        const lastCompleted = new Date(sorted[0].completedAt!);
        const prevDay = new Date(lastCompleted);
        prevDay.setDate(prevDay.getDate() - 4);
        // Check if there was a gap >= 3 days before the latest completion
        let gapDays = 0;
        for (let i = 1; i <= 3; i++) {
          const d = new Date(lastCompleted);
          d.setDate(d.getDate() - i);
          const dayStr = formatDate(d);
          const hasTask = completedTasks.some(
            (t) => t.completedAt && t.completedAt.startsWith(dayStr)
          );
          if (!hasTask) gapDays++;
        }
        shouldUnlock = gapDays >= 3;
        break;
      }
    }

    if (shouldUnlock) {
      newlyUnlocked.push({ ...a, unlocked: true, unlockedAt: today() });
      return { ...a, unlocked: true, unlockedAt: today() };
    }
    return a;
  });

  return {
    achievements: updatedAchievements,
    newlyUnlocked,
  };
}
