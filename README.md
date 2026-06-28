# LifeQuest

LifeQuest 是一个把现实生活轻量 RPG 化的本地 Web 应用。你可以把日常行动拆成任务和主线，通过完成任务获得经验、提升生活属性，并用日记记录完成后的状态。

## 功能

- 今日页：按主线、小冒险、自我照顾、关系任务组织当天可做的事。
- 任务页：管理主线任务、支线任务和独立任务。
- 日历页：查看每天的任务、完成记录和日记。
- 日记页：记录每日心情、能量和生活片段。
- 角色页：查看等级、总经验、生活属性和成就。
- 本地存储：数据保存在浏览器 `localStorage`，不依赖后端服务。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- lucide-react
- oxlint

## 开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

代码检查：

```bash
npm run lint
```

## 数据说明

应用状态定义在 `src/types.ts`，默认数据位于 `src/data/defaultData.ts`。运行时状态会写入浏览器的 `lifequest-app-state` localStorage key。角色页提供“重置 Demo 数据”入口，可清除本地状态并重新生成默认数据。

## 项目结构

```text
src/
  components/   通用 UI 组件
  data/         默认主线、任务和成就
  pages/        今日、任务、日历、日记、角色页面
  utils/        日期、经验、成就、存储等工具
  AppContext.tsx 全局应用状态和操作
```
