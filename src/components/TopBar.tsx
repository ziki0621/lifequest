import { useApp } from "../AppContext";
import { expToNextLevel } from "../utils/exp";

const pageTitles: Record<string, string> = {
  today: "今日",
  tasks: "任务",
  calendar: "地球时间轴",
  journal: "生活日志",
  character: "角色成长",
};

const pageSubtitles: Record<string, string> = {
  today: "今天也在地球好好生活。",
  tasks: "选择一个小任务，让今天稍微变好一点。",
  calendar: "空白也是生活的一部分。",
  journal: "记录你在地球上的生活痕迹。",
  character: "你正在一点点经营自己的现实生活。",
};

export default function TopBar({ currentPage }: { currentPage: string }) {
  const { state } = useApp();
  const { player } = state;
  const progress = Math.round(
    ((player.totalExp % 100) / 100) * 100
  );

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-sage-light/30 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-text-primary">
            {pageTitles[currentPage] || "人生支线"}
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {pageSubtitles[currentPage]}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden sm:flex items-center gap-2 bg-white/60 rounded-full px-3 py-1.5 shadow-sm">
            <span className="text-warm-gold font-medium">
              Lv.{player.level}
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-text-secondary text-xs">
              {player.title}
            </span>
          </div>
          {/* Exp mini bar */}
          <div className="hidden sm:block w-20">
            <div className="text-xs text-text-muted mb-0.5 text-right">
              {expToNextLevel(player.totalExp)} EXP → Lv.{player.level + 1}
            </div>
            <div className="h-1.5 bg-sage-light/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {/* Mobile compact */}
          <div className="sm:hidden flex items-center gap-1 bg-white/60 rounded-full px-2 py-1 text-xs shadow-sm">
            <span className="text-warm-gold font-medium">Lv.{player.level}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
