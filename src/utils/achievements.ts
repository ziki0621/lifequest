import type { AppState, Achievement } from "../types";
import { today } from "./date";

interface AchievementCheckResult {
  achievements: Achievement[];
  newlyUnlocked: Achievement[];
}

export function checkAchievements(state: AppState): AchievementCheckResult {
  const { mainQuests, dailyTasks, sideQuests, journalEntries, achievements } = state;
  const newlyUnlocked: Achievement[] = [];

  // Flatten all completions + their dates for cross-type queries
  const allCompletions: { domain: string; date: string }[] = [];

  // Main stages
  mainQuests.forEach((mq) => {
    mq.stages.forEach((s) => {
      if (s.completed && s.completedAt) {
        allCompletions.push({ domain: mq.domain, date: s.completedAt.slice(0, 10) });
      }
    });
  });
  // Daily task completions
  dailyTasks.forEach((dt) => {
    dt.completions.forEach((c) => allCompletions.push({ domain: dt.domain, date: c }));
  });
  // Side quests
  sideQuests.forEach((sq) => {
    if (sq.completed && sq.completedAt) {
      allCompletions.push({ domain: sq.domain, date: sq.completedAt.slice(0, 10) });
    }
  });

  const totalCompletions = allCompletions.length;
  const explorationCompletions = allCompletions.filter((c) => c.domain === "exploration").length;
  const homeCompletions = allCompletions.filter((c) => c.domain === "home").length;
  const relationshipCompletions = allCompletions.filter((c) => c.domain === "relationship").length;
  const hasJournal = journalEntries.length >= 1;

  // Check any single day has 3+ distinct domains
  const domainsByDay = new Map<string, Set<string>>();
  allCompletions.forEach((c) => {
    if (!domainsByDay.has(c.date)) domainsByDay.set(c.date, new Set());
    domainsByDay.get(c.date)!.add(c.domain);
  });
  const hasBalancedDay = Array.from(domainsByDay.values()).some((s) => s.size >= 3);

  // Gentle restart: check for 3+ day gap before most recent completion
  let hasRestart = false;
  if (totalCompletions >= 1) {
    const sortedDates = [...new Set(allCompletions.map((c) => c.date))].sort();
    if (sortedDates.length >= 2) {
      const last = sortedDates[sortedDates.length - 1];
      const prev = sortedDates[sortedDates.length - 2];
      const d1 = new Date(prev);
      const d2 = new Date(last);
      const gapDays = Math.round((d2.getTime() - d1.getTime()) / 86400000);
      hasRestart = gapDays >= 4; // 4+ days between any two completion dates
    }
  }

  const updatedAchievements = achievements.map((a) => {
    if (a.unlocked) return a;
    let unlock = false;
    switch (a.id) {
      case "first-task": unlock = totalCompletions >= 1; break;
      case "explorer-1": unlock = explorationCompletions >= 3; break;
      case "balanced-day": unlock = hasBalancedDay; break;
      case "organizer": unlock = homeCompletions >= 3; break;
      case "reconnect": unlock = relationshipCompletions >= 2; break;
      case "first-journal": unlock = hasJournal; break;
      case "gentle-restart": unlock = hasRestart; break;
    }
    if (unlock) {
      newlyUnlocked.push({ ...a, unlocked: true, unlockedAt: today() });
      return { ...a, unlocked: true, unlockedAt: today() };
    }
    return a;
  });

  return { achievements: updatedAchievements, newlyUnlocked };
}
