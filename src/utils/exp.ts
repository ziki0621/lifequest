import type { AttributeReward, AttributeState, Difficulty, LifeAttribute, LifeDomain, QuestBook } from "../types";

/** 每100总经验升1级 */
export function calcLevel(totalExp: number): number { return Math.floor(totalExp / 100) + 1; }

/** 每50属性经验升1级 */
export function calcAttributeLevel(exp: number): number { return Math.floor(exp / 50) + 1; }

export function expToNextLevel(totalExp: number): number { return 100 - (totalExp % 100); }

export function attributeExpToNextLevel(exp: number): number { return 50 - (exp % 50); }

/** 任务难度 -> 基础经验 */
export function difficultyExp(difficulty: Difficulty): number {
  switch (difficulty) { case "easy": return 10; case "normal": return 20; case "hard": return 35; default: return 10; }
}

export function defaultAttributeRewards(domain: LifeDomain, totalExp: number): AttributeReward[] {
  const map: Partial<Record<LifeDomain, LifeAttribute[]>> = {
    body: ["stamina"],
    mind: ["mind"],
    relationship: ["connection"],
    home: ["order"],
    exploration: ["perception"],
    interest: ["creativity"],
    learning: ["knowledge"],
    career: ["order", "knowledge"],
    finance: ["order"],
  };
  const attrs = map[domain] || ["mind"];
  const per = Math.floor(totalExp / attrs.length);
  return attrs.map((attribute) => ({ attribute, exp: per }));
}

export function makeAttributeState(exp: number = 0): AttributeState {
  return { level: calcAttributeLevel(exp), exp };
}

export function createInitialAttributes(overrides?: Partial<Record<LifeAttribute, number>>): Record<LifeAttribute, AttributeState> {
  return {
    stamina: makeAttributeState(overrides?.stamina ?? 0),
    mind: makeAttributeState(overrides?.mind ?? 0),
    perception: makeAttributeState(overrides?.perception ?? 0),
    connection: makeAttributeState(overrides?.connection ?? 0),
    order: makeAttributeState(overrides?.order ?? 0),
    creativity: makeAttributeState(overrides?.creativity ?? 0),
    knowledge: makeAttributeState(overrides?.knowledge ?? 0),
  };
}

export function getPlayerTitle(level: number): string {
  const titles = [
    { minLevel: 1, title: "初到地球" }, { minLevel: 5, title: "日常探索者" },
    { minLevel: 10, title: "稳定生活者" }, { minLevel: 15, title: "城市漫游者" },
    { minLevel: 20, title: "生活经营者" }, { minLevel: 30, title: "地球资深玩家" },
  ];
  let title = titles[0].title;
  for (const t of titles) { if (level >= t.minLevel) title = t.title; }
  return title;
}

/** Get stage reward: first stage 15, rest 25 */
export function getStageReward(questBook: QuestBook, questLineId: string, stageIdx: number): { expReward: number; attributeRewards: AttributeReward[] } {
  const ql = questBook.questLines.find((l) => l.id === questLineId);
  const order = ql?.stages[stageIdx]?.order ?? stageIdx;
  const expReward = order === 0 ? 15 : 25;
  return { expReward, attributeRewards: defaultAttributeRewards(questBook.domain, expReward) };
}
