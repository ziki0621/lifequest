# 人生支线 LifeQuest

把现实生活变成一场温和的 RPG。

一个纯前端 Web Demo，用三种任务类型管理生活：**主线**（分阶段时间线推进）、**日常**（循环打卡养成习惯）、**支线**（一次完成的小冒险）。完成任务获得经验值，提升七种生活属性，解锁成就。数据完全存储在浏览器 `localStorage`。

---

## 技术栈

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- lucide-react（图标）
- React Context（状态管理）
- localStorage（持久化）
- Noto Serif SC（衬线标题字体，Google Fonts）
- oxlint（代码检查）

---

## 快速开始

```bash
cd lifequest
npm install
npm run dev       # → http://localhost:5173
npm run build     # 生产构建 → dist/
npm run lint      # 代码检查
```

---

## 页面结构

| 页面 | 路由 | 内容 |
|------|------|------|
| **今日** | `today` | 仪表盘：当前主线阶段 + 今日日常 + 支线任务，三个面板框 |
| **任务** | `tasks` | 全部任务（主线/日常/支线面板），点击主线进入时间线详情 |
| **日历** | `calendar` | 月视图日历 + 日期完成记录/日记 |
| **日志** | `journal` | 每日日记 Tab + 任务日志 Tab（分三类面板展示已完成记录） |
| **角色** | `character` | 等级/属性/成就/统计 |

页面切换通过 React 状态而非 URL 路由。首次打开显示全屏欢迎页，点击「开始今天的生活冒险」后进入今日页面（首次启用 localStorage 标记，不再显示）。

### 欢迎页

- Sparkles 图标 + 标题「人生支线 LifeQuest」
- 副标题「把现实生活变成一场温和的 RPG。」
- 三行特性：主线 + 日常 + 支线
- CTA 按钮「开始今天的生活冒险」
- 底部「没有 KPI，没有压力，只是一个温柔的陪伴。」

---

## 数据模型

### 全局状态 `AppState`

```ts
{
  player: Player;
  mainQuests: MainQuest[];
  dailyTasks: DailyTask[];
  sideQuests: SideQuest[];
  journalEntries: JournalEntry[];
  achievements: Achievement[];
}
```

### 1. 主线任务 `MainQuest`

```ts
{
  id: string;
  title: string;             // 如 "找回稳定生活节奏"
  description: string;
  domain: LifeDomain;        // 9 个生活领域之一
  status: "active" | "paused" | "completed";
  stages: QuestStage[];      // 嵌入式阶段列表
  createdAt: string;
}

// 阶段
{
  id: string;
  title: string;             // 如 "调整作息"
  description?: string;
  anchorDate?: string;       // 时间锚点，显示在时间线上
  completed: boolean;
  completedAt?: string;
  order: number;             // 排序，从 0 开始
}
```

**规则：** 按 `order` 顺序解锁，只有第一个未完成阶段可以操作。所有阶段完成 → 主线状态变为 `completed`。

### 2. 日常任务 `DailyTask`

```ts
{
  id: string;
  title: string;
  description?: string;
  domain: LifeDomain;
  difficulty: "easy" | "normal" | "hard";   // → 经验: easy=10, normal=20, hard=35
  expReward: number;                         // 单次完成经验
  attributeRewards: AttributeReward[];       // 单次完成属性奖励
  period: "daily" | "weekly" | "monthly";   // 循环周期
  targetCount: number;                       // 每周期目标次数（仅 weekly/monthly）
  completions: string[];                     // YYYY-MM-DD 完成日期数组
  daysOfWeek?: number[];                     // 0=Sun..6=Sat，仅 daily。不设 = 每天
  timesPerDay?: number;                      // 仅 daily，每天需要完成几次。默认 1
  active: boolean;                           // 可暂停/激活
  createdAt: string;
}
```

**到期判断逻辑（`src/utils/date.ts` → `isDailyTaskDue`）：**

- `active=false` → 不显示
- `period=daily`：如果设了 `daysOfWeek` 且今天不在列表 → 不显示；检查 `今天打卡次数 < timesPerDay(默认1)` → 显示
- `period=weekly/monthly`：检查 `周期内打卡次数 < targetCount` → 显示

### 3. 支线任务 `SideQuest`

```ts
{
  id: string;
  title: string;
  description?: string;
  mainQuestId?: string;      // 可选：关联主线
  domain: LifeDomain;
  difficulty: "easy" | "normal" | "hard";
  expReward: number;
  attributeRewards: AttributeReward[];
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}
```

**规则：** 一次完成（不可逆）。可关联到主线，在主线详情页底部展示关联支线。

### 通用枚举

| 类型 | 值 |
|------|-----|
| `LifeDomain`（9 个） | `body`（身体）, `mind`（心情）, `relationship`（关系）, `home`（居住）, `exploration`（探索）, `interest`（兴趣）, `learning`（学习）, `career`（事业）, `finance`（财务） |
| `LifeAttribute`（7 个） | `stamina`（体力）, `mind`（心力）, `perception`（感知）, `connection`（连接）, `order`（秩序）, `creativity`（创造）, `knowledge`（智识） |
| `Mood`（8 个） | `calm`（平静）, `happy`（开心）, `tired`（疲惫）, `anxious`（焦虑）, `sad`（低落）, `satisfied`（满足）, `blank`（空白）, `motivated`（有动力） |
| `EnergyLevel`（3 个） | `low`（低能量）, `normal`（普通）, `high`（高能量） |
| `Difficulty` | `easy`（简单 +10）, `normal`（普通 +20）, `hard`（困难 +35） |

所有枚举在 `src/types.ts` 中配有 `_LABELS` / `_ICONS` / `_COLOR` 映射表。

---

## 经验与等级

| 公式 | 说明 |
|------|------|
| `level = floor(totalExp / 100) + 1` | 总等级，100 EXP / 级 |
| `attrLevel = floor(attrExp / 50) + 1` | 属性等级，50 EXP / 级 |
| 任务难度 | easy=10 / normal=20 / hard=35 EXP |
| 主线阶段 | 第 1 阶段 15 EXP，后续 25 EXP |

**玩家称号（等级阈值）：** 1=初到地球, 5=日常探索者, 10=稳定生活者, 15=城市漫游者, 20=生活经营者, 30=地球资深玩家

### 属性 → 任务领域映射

| 属性 | 关联领域 | 含义 |
|------|---------|------|
| 体力 | body | 运动、睡眠、饮食 |
| 心力 | mind | 日记、情绪、自我照顾 |
| 感知 | exploration | 探索、散步、拍照、观察 |
| 连接 | relationship | 朋友、家人、社交 |
| 秩序 | home, career, finance | 整理、计划、财务 |
| 创造 | interest | 写作、画画、兴趣创作 |
| 智识 | learning | 阅读、学习、研究 |

---

## 成就系统（7 个）

| ID | 名称 | 条件 |
|----|------|------|
| `first-task` | 第一次生活任务 | 完成任意 1 个任务 |
| `explorer-1` | 城市漫游者 I | 完成 3 个探索领域任务 |
| `balanced-day` | 认真生活的一天 | 同一天完成 3 个不同领域任务 |
| `organizer` | 小小整理家 | 完成 3 个居住领域任务 |
| `first-journal` | 写下今天 | 写下第一篇日记 |
| `reconnect` | 连接重新开始 | 完成 2 个关系领域任务 |
| `gentle-restart` | 温和重启 | 两次完成记录之间间隔 ≥ 4 天 |

成就检查在每次完成任务或写日记后自动触发。新解锁的成就通过右下角 Toast 弹出（Trophy 图标 + 滑入动画）。

---

## AppContext API

### Computed Properties

| 属性 | 类型 | 说明 |
|------|------|------|
| `state` | `AppState` | 完整状态树 |
| `todayDailyTasks` | `DailyTask[]` | 今天到期的日常任务 |
| `todaySideQuests` | `SideQuest[]` | 未完成的支线 |
| `todayCompletedCount` | `number` | 今天完成数（含三种类型） |
| `newlyUnlocked` | `Achievement[]` | 待展示 Toast 的新成就 |

### Actions

| Action | 参数 | 返回值 |
|--------|------|--------|
| `completeMainStage` | `(mainQuestId, stageId)` | `CompletionContext \| null` |
| `completeDailyTask` | `(dailyTaskId)` | `CompletionContext \| null` |
| `completeSideQuest` | `(sideQuestId)` | `CompletionContext \| null` |
| `addJournal` | `({ date, mood, energy, content, tags })` | `void` |
| `addMainQuest` | `({ title, description, domain, status, stages })` | `void` |
| `addMainStage` | `(mainQuestId, { title, description, anchorDate, completed, order })` | `void` |
| `addDailyTask` | `({ title, description, domain, difficulty, expReward, attributeRewards, period, targetCount, active })` | `void` |
| `addSideQuest` | `({ title, description, domain, difficulty, expReward, attributeRewards, dueDate?, mainQuestId? })` | `void` |
| `toggleDailyActive` | `(dailyTaskId)` | `void` |
| `resetData` | — | `void` |
| `clearNewlyUnlocked` | — | `void` |

### 完成流程

```
点击完成/打卡
  → Action 验证 + 更新状态
    → 增加总经验 + 属性经验
    → 计算新等级 + 新称号 + 新属性等级
    → checkAchievements() → 新解锁 → Toast
  → 返回 CompletionContext
  → 页面打开 CompleteTaskModal
    → 展示奖励 + 可选日记（心情/能量/正文）
```

`CompletionContext` 结构：

```ts
{
  itemType: "mainStage" | "daily" | "sideQuest";
  title: string;
  expReward: number;
  attributeRewards: AttributeReward[];
}
```

---

## 默认示例数据

**3 条主线（各含 4 个阶段，均为 active）：**

1. 找回稳定生活节奏（domain: mind）
2. 探索我的城市（domain: exploration）
3. 重新连接重要的人（domain: relationship）

**4 条日常（均为 active）：**

1. 出门晒 15 分钟太阳（daily, 每天 1 次）
2. 每周运动 2 次（weekly, 每周 2 次）
3. 做一顿认真吃的饭（daily, 每天 2 次）
4. 整理桌面 10 分钟（daily, 周一至周五, 每天 1 次）

**3 条支线（均未完成）：**

1. 探索一个新的街区（关联主线 2）
2. 读完一本书
3. 和朋友约一次饭（关联主线 3）

**0 篇日记，7 个成就（全部未解锁）。**

---

## 交互细节

### 主线时间线

- 竖线 + 左右交替的阶段节点
- 三态显示：**已完成**（CheckCircle2 + 灰色标题）、**当前**（navy 底色 + Zap + 放大 + 可点击）、**待解锁**（Lock + 半透明）
- 完成当前阶段 → 下一阶段解锁
- 所有阶段完成 → 主线自动标记为 completed

### 日常打卡

- Daily 类型显示当天进度（`今天打卡次数 / 当天目标`）
- Weekly/Monthly 类型显示周期进度（`周期打卡次数 / 周期目标`）
- 暂停按钮可临时停用（不再出现在今日页面）

### 面板布局

Today、Tasks、Journal 页面共用面板框布局：

```
┌─ glass rounded-3xl 容器 ─────────────────────┐
│ ▎ icon  标题        [数量 badge]    [+ 添加] │  ← header
├──────────────────────────────────────────────┤
│ ┌─ bg-white/40 rounded-2xl 子框 ────────────┐│
│ │  任务/记录内容                             ││
│ └───────────────────────────────────────────┘│
│ ┌─ 子框 ───────────────────────────────────┐ │
│ │  ...                                      │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

- 三个面板各有一条彩色竖条（`w-1 h-4`）：**navy** = 主线，**coral** = 日常，**leaf** = 支线
- Header 右侧 `[+ 添加]` 按钮打开对应的创建模态

### FAB（浮动操作按钮）

右下角 navy 圆形按钮，点击展开 3 个选项（新建主线/日常/支线），点击外部关闭。

---

## 组件清单

| 组件 | 文件 | 用途 |
|------|------|------|
| `Layout` | `components/Layout.tsx` | 页面外壳：流体背景 + Sidebar + 内容区 |
| `Sidebar` | `components/Sidebar.tsx` | 桌面左侧导航 + 移动端底部导航 |
| `MainQuestCard` | `components/MainQuestCard.tsx` | 主线摘要卡片（标题 + 进度条 + 状态） |
| `MainStageCard` | `components/MainStageCard.tsx` | 时间线节点（锁定/当前/完成三态） |
| `Timeline` | `components/Timeline.tsx` | 竖线 + 左右交替阶段节点 |
| `DailyTaskCard` | `components/DailyTaskCard.tsx` | 日常卡片（进度 + 打卡 + 暂停） |
| `SideQuestCard` | `components/SideQuestCard.tsx` | 支线卡片（完成按钮） |
| `CompletionCard` | `components/CompletionCard.tsx` | 完成事件卡片（日历/日志用） |
| `JournalCard` | `components/JournalCard.tsx` | 日记卡片（心情/能量/正文/标签） |
| `AchievementCard` | `components/AchievementCard.tsx` | 成就徽章 |
| `StatBar` | `components/StatBar.tsx` | 属性进度条 |
| `CompleteTaskModal` | `components/CompleteTaskModal.tsx` | 完成反馈弹窗（奖励 + 日记引导） |
| `CreateMainQuestModal` | `components/CreateMainQuestModal.tsx` | 创建主线（含阶段动态列表） |
| `CreateStageModal` | `components/CreateStageModal.tsx` | 添加阶段 |
| `CreateDailyTaskModal` | `components/CreateDailyTaskModal.tsx` | 创建日常（含周几选择 + 每天次数） |
| `CreateSideQuestModal` | `components/CreateSideQuestModal.tsx` | 创建支线（含主线关联） |
| `CreateJournalModal` | `components/CreateJournalModal.tsx` | 写日记（心情 + 能量 + 正文 + 标签） |

---

## 项目结构

```
src/
├── main.tsx                          # React 入口
├── App.tsx                           # 根组件 + 欢迎页 + 页面路由 + Toast
├── AppContext.tsx                    # 全局状态 Provider + 所有 action 实现
├── index.css                         # Tailwind 主题 + 流体背景 + 玻璃卡片 + 动画
├── types.ts                          # 所有类型 + 接口 + 图标/标签/颜色映射表
├── context.ts                        # React Context 类型定义
├── assets/                           # 静态资源（Vite 模板遗留）
├── data/
│   └── defaultData.ts                # 默认示例数据工厂
├── hooks/
│   └── useApp.ts                     # useApp() = useContext(AppContext)
├── utils/
│   ├── achievements.ts               # checkAchievements() — 成就条件判断
│   ├── date.ts                       # 日期工具 + 循环周期计算
│   ├── exp.ts                        # 等级/经验/称号计算
│   ├── id.ts                         # genId() — ID 生成
│   └── storage.ts                    # localStorage 读写 + 迁移
├── components/
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── MainQuestCard.tsx
│   ├── MainStageCard.tsx
│   ├── Timeline.tsx
│   ├── DailyTaskCard.tsx
│   ├── SideQuestCard.tsx
│   ├── CompletionCard.tsx
│   ├── JournalCard.tsx
│   ├── AchievementCard.tsx
│   ├── StatBar.tsx
│   ├── CompleteTaskModal.tsx
│   ├── CreateMainQuestModal.tsx
│   ├── CreateStageModal.tsx
│   ├── CreateDailyTaskModal.tsx
│   ├── CreateSideQuestModal.tsx
│   └── CreateJournalModal.tsx
└── pages/
    ├── TodayPage.tsx
    ├── TasksPage.tsx
    ├── CalendarPage.tsx
    ├── JournalPage.tsx
    └── CharacterPage.tsx
```

---

## 视觉设计规范

### 配色

| 颜色 | Hex | 用途 |
|------|-----|------|
| Navy | `#0B192C` | 标题、按钮、进度条、导航激活态 |
| Navy Light | `#1E3E62` | Navy hover |
| Coral | `#FF4D6D` | 强调色、成就、HARD 难度、心力/连接属性 |
| Leaf Blue | `#4A90E2` | EASY 难度、支线面板、感知/智识属性 |
| Cream | `#FFF0F3` | 流体背景底色 |
| Sand | `#F8F6F4` | 暖白 |

### 背景

- `fixed` 定位流体 blob：粉色 + 淡紫，`blur(80-100px)`，`mix-blend-mode: multiply`
- 呼吸动画（8s / 12s pulse-slow）

### 卡片

- `.glass`：`bg-white/60 backdrop-blur-xl border border-white/60`，`rounded-3xl`
- 子框 `.SubFrame`：`bg-white/40 rounded-2xl border border-navy/5`
- Hover：`-translate-y-1` / `-translate-y-0.5`

### 按钮

- `.btn`：`font-bold rounded-full（9999px）inline-flex gap-2 tracking-wider`
- `.btn-primary`：navy 底白字，hover navy-light + shadow
- `.btn-accent`：coral 底白字
- 内联紧凑按钮：`!py-1.5 !px-4 !text-[10px]`

### 输入框

- `.input`：`w-full rounded-full border-navy/10 bg-white/50`，focus 时 navy 边框 + 3px ring
- textarea 用 `rounded-2xl`
- select 自带 chevron SVG 箭头

### 字体

| 用途 | 字体 | weight |
|------|------|--------|
| 页面标题 | Noto Serif SC (`.serif`) | 900 (black) |
| 卡片标题 | Inter | 900 (black) |
| 正文 | Inter | 500 (medium) |
| 标签/状态 | Inter | 700 (bold) |
| 微型标签 | Inter, `text-[9px]`, `tracking-widest`, uppercase | 700 |

### 字号体系

| 尺寸 | 用途 |
|------|------|
| `text-2xl`–`text-3xl` | 页面大标题 |
| `text-[14px]` | 卡片标题 |
| `text-[13px]` | 任务/面板标题 |
| `text-[12px]` | 正文、完成记录 |
| `text-[11px]` | 面板 header |
| `text-[10px]` | 按钮文字、状态标签 |
| `text-[9px]` | 微观标签、难度、领域 |

### 动效

| 类名 | 效果 | 时长 |
|------|------|------|
| `animate-in` | fade-in-up | 0.5s |
| `animate-fade` | fade-in | 0.3s |
| `animate-scale` | scale-in | 0.3s |
| `animate-slide` | slide-right | 0.3s |
| `stagger-1` | 子项逐项延迟（+0.05s/项） | — |
| 进度条 | `transition-all duration-700 ease-out` | 0.7s |
| 按钮/卡片 hover | `transition-all duration-300` | 0.3s |
| 按钮按下 | `active:scale-95` | — |

### 图标

所有图标来自 `lucide-react`。领域用 Dumbbell/Brain/Heart/Home/Compass/Palette/GraduationCap/Briefcase/Wallet，属性用 Dumbbell/Brain/Eye/Heart/ClipboardList/Sparkles/Lightbulb。详见 `src/types.ts` 中的 `DOMAIN_ICONS` / `ATTRIBUTE_ICONS` 映射。

---

## 存储

- **Key：** `lifequest-app-state-v2`（localStorage）
- 每次 state 变化自动写入（`useEffect`）
- 启动时读取，失败则使用默认数据
- 旧版 v1 数据（`lifequest-app-state`）自动清除
- 角色页底部「重置 Demo 数据」按钮清除所有本地数据并恢复默认
