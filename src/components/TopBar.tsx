import { useApp } from "../hooks/useApp";
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
  const progress = Math.round(((player.totalExp % 100) / 100) * 100);

  return (
    <header className="sticky top-0 z-40 bg-bg-deep/80 backdrop-blur-xl border-b border-border-subtle px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-text-primary tracking-tight">
            {pageTitles[currentPage] || "人生支线"}
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            {pageSubtitles[currentPage]}
          </p>
        </div>

        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-glass border border-border-subtle">
            <span className="text-xs font-semibold text-accent tracking-tight">
              Lv.{player.level}
            </span>
            <span className="w-px h-3 bg-border-default" />
            <span className="text-[11px] text-text-secondary">
              {player.title}
            </span>
          </div>
          {/* Mini exp bar */}
          <div className="w-24">
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>EXP</span>
              <span>{expToNextLevel(player.totalExp)} → Lv.{player.level + 1}</span>
            </div>
            <div className="h-1 bg-bg-glass rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-soft to-accent rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile compact level */}
        <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-glass border border-border-subtle text-xs">
          <span className="font-semibold text-accent">Lv.{player.level}</span>
        </div>
      </div>
    </header>
  );
}
