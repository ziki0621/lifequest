export interface AvatarStage {
  title: string;
  frameLabel: string;
  decoration: string;
}

export function getAvatarStage(level: number): AvatarStage {
  if (level >= 30) return { title: "地球资深玩家", frameLabel: "LEGEND", decoration: "星图徽章" };
  if (level >= 20) return { title: "生活经营者", frameLabel: "HOME", decoration: "生活地图" };
  if (level >= 15) return { title: "城市漫游者", frameLabel: "CITY", decoration: "指南针" };
  if (level >= 10) return { title: "稳定生活者", frameLabel: "STABLE", decoration: "成长叶片" };
  if (level >= 5) return { title: "日常探索者", frameLabel: "QUEST", decoration: "小背包" };
  return { title: "初到地球", frameLabel: "NEW", decoration: "新手光点" };
}
