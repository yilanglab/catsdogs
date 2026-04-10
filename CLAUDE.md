# 猫人狗人 — 项目指南

> 项目：猫人狗人 · 三维动物人格测试游戏
> 技术栈：Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Framer Motion
> 部署目标：Vercel（静态导出）
> 协作模式：Claude Agent Teams + Gemini 视觉协作

---

## 🎯 项目目标

通过 15 道场景化情境题，从「能量」「策略」「内核」三个维度定位用户的隐藏动物人格（18 种猫狗品种之一）。纯前端项目，所有数据通过 URL 参数传递，不需要后端、不需要账号、不存储任何用户个人信息。

详细需求见：`prd/catsdogs-prd.md`

---

## 🤖 Agent Team 配置

### Team 成员

| Teammate | 职责 | 定义文件 | 颜色 |
|----------|------|---------|------|
| executor-ui | 页面布局、组件开发、动画交互、响应式、分享图 | `.claude/agents/executor-ui.md` | blue |
| executor-logic | 计分算法、URL编解码、品种判定、状态管理 | `.claude/agents/executor-logic.md` | green |
| executor-content | 15题文案、18品种档案、社交玩法文案的数据录入 | `.claude/agents/executor-content.md` | yellow |

Gemini 视觉协作通过 Bash 调用，任何 teammate 均可使用（见下方协议）。

### 启动 Team

在 Claude Code 中对 Lead 说：
```
创建 team，使用所有可用的 agent 定义，启动所有 teammate，
然后根据项目需求拆分任务分配给各 teammate 并行执行。
```

### 团队协作规则

1. **文件所有权**：
   - `src/components/`, `src/app/`, `src/styles/`, `public/` → executor-ui
   - `src/lib/`, `src/hooks/` → executor-logic
   - `src/data/` → executor-content
2. **依赖关系**：executor-logic 先产出类型定义（`src/lib/types.ts`），executor-content 和 executor-ui 依赖这些类型
3. **通信方式**：通过 mailbox 直接通信，或通过 task list 协调
4. **冲突预防**：如需修改他人文件，先通过 mailbox 协商
5. **质检**：Lead 在整合阶段审查所有 teammate 的产出

### 依赖启动顺序

```
Phase 1（可并行）:
  executor-logic → types.ts + scoring.ts + url-codec.ts
  executor-content → 读取 PRD，准备数据（等 types.ts 出来后写入文件）
  executor-ui → 项目脚手架 + 基础布局 + tailwind 配置

Phase 2（可并行）:
  executor-content → questions.ts + breeds.ts + relationships.ts
  executor-logic → quiz-engine.ts + breeds.ts（判定逻辑）
  executor-ui → 首页 + 答题页骨架

Phase 3（可并行）:
  executor-ui → 结果页 + 分享图生成
  executor-logic → mirror.ts + pair.ts
  executor-content → mirror-templates.ts + pair-templates.ts

Phase 4:
  executor-ui → 照镜子页 + CP配对页 + 整体联调
```

---

## 🎨 Gemini 视觉协作协议

本项目集成 Gemini CLI 用于视觉设计任务。Team Lead 和任何 Teammate 都可以通过 Bash 调用 Gemini 获取视觉反馈。

### 何时调用 Gemini

- ✅ 截图与设计稿对比（像素级差异检查）
- ✅ UI 美观度评审（布局、配色、间距建议）
- ✅ 组件视觉一致性审查
- ❌ 不要用于纯逻辑/数据任务（浪费）

### Gemini CLI 检测

```bash
if command -v gemini-internal &>/dev/null; then
  GEMINI_CMD="gemini-internal"
elif command -v gemini &>/dev/null; then
  GEMINI_CMD="gemini"
else
  echo "⚠️ Gemini CLI 不可用"; GEMINI_CMD=""
fi
```

### 调用方式

**UI 审查：**
```bash
$GEMINI_CMD -p "审查这个组件的 UI 实现：
@./src/components/ResultCard.tsx
重点关注：布局合理性、间距一致性、猫系冷色/犬系暖色配色是否到位" --yolo -o text < /dev/null
```

**截图对比：**
```bash
$GEMINI_CMD -p "对比设计稿和实际截图：
@./mtl/design.png
@./mtl/screenshot.png
重点关注：布局、间距、字号、颜色" --yolo -o text < /dev/null
```

**保存结果供团队共享：**
```bash
$GEMINI_CMD -p "..." --yolo -o text < /dev/null > .gemini-review.md 2>&1
cat .gemini-review.md
```

### Gemini 调用注意事项

| 参数 | 必须 | 说明 |
|------|------|------|
| `--yolo` | ✅ | 自动批准所有操作 |
| `-o text` | ✅ | 纯文本输出 |
| `< /dev/null` | ✅ | 防止 stdin 阻塞 |
| `@./path` | — | 引用项目内文件/图片 |

- 单次调用不要传太多文件（建议 ≤ 3 个）
- Gemini 的建议仅供参考，最终决策由 Claude teammate 做出
- 如果 Gemini CLI 不可用，跳过视觉审查步骤，不要阻塞开发

---

## 🗂️ 项目结构

```
catsdogs/
├── CLAUDE.md                    ← 本文件
├── prd/
│   ├── catsdogs-prd.md          ← PRD（内容数据的唯一来源）
│   └── 猫人狗人chat.md           ← 原始聊天记录（参考）
├── mtl/                         ← 设计稿、截图、静态资源
├── .claude/
│   └── agents/
│       ├── executor-ui.md
│       ├── executor-logic.md
│       └── executor-content.md
├── public/                      ← 静态资源（图标、字体、OG图片）
├── src/
│   ├── app/                     ← Next.js App Router 页面
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← 首页
│   │   ├── quiz/page.tsx        ← 答题页
│   │   ├── result/page.tsx      ← 结果页 (?e=&s=&c=)
│   │   ├── mirror/page.tsx      ← 照镜子 (?from=)
│   │   └── pair/page.tsx        ← CP配对 (?a=)
│   ├── components/              ← UI 组件（executor-ui）
│   ├── lib/                     ← 核心逻辑（executor-logic）
│   │   ├── types.ts
│   │   ├── scoring.ts
│   │   ├── breeds.ts
│   │   ├── url-codec.ts
│   │   ├── quiz-engine.ts
│   │   ├── mirror.ts
│   │   └── pair.ts
│   ├── data/                    ← 内容数据（executor-content）
│   │   ├── questions.ts
│   │   ├── breeds.ts
│   │   ├── relationships.ts
│   │   ├── mirror-templates.ts
│   │   ├── pair-templates.ts
│   │   └── ui-copy.ts
│   ├── hooks/                   ← 自定义 hooks（executor-logic）
│   └── styles/                  ← 全局样式（executor-ui）
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 设计规范

- **整体基调**：轻松、有质感、略带幽默感，不过于幼稚也不过于严肃
- **猫系配色**：冷色调（蓝灰 `#8B9DAF`、薰衣草 `#B8A9C9`、薄荷 `#A8D8C8`）
- **犬系配色**：暖色调（琥珀 `#E8A87C`、暖橘 `#F4A460`、奶油黄 `#F5E6CA`）
- **狐系点缀**：金色/琥珀色 `#D4A574`
- **狼系质感**：深灰/墨色 `#4A4A5A`
- **圆角**：大圆角为主（12px-16px），营造友好感
- **移动端优先**：首要确保在手机微信浏览器中体验良好
- **字体**：系统字体栈（`-apple-system, "PingFang SC", "Helvetica Neue", sans-serif`）

---

## ✅ 已确认事项

1. ✅ 技术栈：Next.js + React + TypeScript + Tailwind CSS
2. ✅ 纯前端项目，不需要后端、不存储用户个人信息
3. ✅ 所有社交玩法（照镜子、CP配对）通过 URL 参数传递数据
4. ✅ 部署到 Vercel（静态导出）
5. ✅ Agent Team 分工：UI + Logic + Content（3 agents）
6. ✅ MVP 范围：Phase 1（核心测试）+ Phase 2（社交裂变）

---

## 🚫 禁止事项

- 未经用户确认，不自行决定重要设计/技术方案
- 不在对话中展示敏感信息
- teammate 之间不直接修改对方负责的文件
- 不要自行创作或修改 PRD 中的题目文案和品种描述，以 PRD 为准
- 不引入不必要的第三方依赖

---

*CLAUDE.md v1.0 | 2026-04-10 | Agent Teams + Gemini*
