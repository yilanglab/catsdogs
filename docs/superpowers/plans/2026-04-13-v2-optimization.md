# V2 优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 扩充结果页为深度人格画像（4 新板块 × 18 品种），移除 CP 配对功能，修复结果页裁切问题。

**Architecture:** 分三阶段：(1) 类型扩展 + CP 移除（逻辑层清理），(2) 18 品种内容数据录入，(3) 结果页 UI 重构展示新板块 + 修复裁切。内容数据已在 PRD v2 (`prd/catsdogs-v2-optimization.md`) 中完整定义。

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion

---

### Task 1: 扩展 Breed 类型定义

**Files:**
- Modify: `src/lib/types.ts:85-115`

- [ ] **Step 1: 添加新的子类型接口**

在 `Breed` 接口之前添加 4 个子类型：

```typescript
/** 🧠 内在机制 */
export interface InnerMechanism {
  /** 压力反应 */
  stressResponse: string;
  /** 充电方式 */
  rechargeMode: string;
  /** 情绪模式 */
  emotionalPattern: string;
}

/** 💼 职场风格 */
export interface WorkStyle {
  /** 当领导时 */
  asLeader: string;
  /** 当下属时 */
  asFollower: string;
  /** 开会风格 */
  meetingStyle: string;
}

/** ❤️ 恋爱模式 */
export interface LoveStyle {
  /** 心动信号 */
  crushSignal: string;
  /** 雷点 */
  dealBreaker: string;
  /** 理想相处 */
  idealRelationship: string;
}

/** 🤝 社交习惯 */
export interface SocialHabit {
  /** 朋友群角色 */
  friendGroupRole: string;
  /** 社交电量 */
  socialBattery: string;
  /** 友谊雷区 */
  friendshipRedFlag: string;
}
```

- [ ] **Step 2: 在 Breed 接口中添加新字段**

在 `Breed` 接口的 `nemesis` 字段之后添加：

```typescript
  /** 🧠 内在机制 */
  innerMechanism: InnerMechanism;
  /** 💼 职场风格 */
  workStyle: WorkStyle;
  /** ❤️ 恋爱模式 */
  loveStyle: LoveStyle;
  /** 🤝 社交习惯 */
  socialHabit: SocialHabit;
```

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx tsc --noEmit 2>&1 | head -30`
Expected: 编译错误（因为 `src/data/breeds.ts` 中的数据尚未包含新字段），这是预期的，确认错误都来自 breeds 数据文件。

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts
git commit -m "feat: extend Breed type with 4 deep profile sections"
```

---

### Task 2: 移除 Pair 相关类型

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: 移除 PairResult 和 PairType 类型**

从 `src/lib/types.ts` 中删除以下内容（约第 217-241 行）：

```typescript
/** CP配对结果 */
export interface PairResult {
  breedA: BreedId;
  breedB: BreedId;
  scoreA: Score;
  scoreB: Score;
  /** 契合度评分 0-100 */
  compatibility: number;
  /** 组合类型名称（如"互补充电型"） */
  pairType: PairType;
  /** 关系解读 */
  description: string;
  /** 给双方的相处建议 */
  tips: [string, string];
}

/** CP配对组合类型 */
export type PairType =
  | 'cat-cat'       // 猫+猫 平行宇宙
  | 'cat-dog'       // 猫+狗 互补充电
  | 'dog-dog'       // 狗+狗 热情碰撞
  | 'wolf-pure'     // 狼+纯 保护者联盟
  | 'power-couple'  // 狼+狼 强强联合
  | 'fox-fox'       // 狐+狐 智者同盟
  | 'generic';      // 其他组合
```

- [ ] **Step 2: 移除 QuizMode 中的 'pair'**

将 `QuizMode` 类型从：
```typescript
export type QuizMode = 'self' | 'mirror' | 'pair';
```
改为：
```typescript
export type QuizMode = 'self' | 'mirror';
```

- [ ] **Step 3: 移除 QuizState 中的 pairFromScore**

从 `QuizState` 接口中删除：
```typescript
  /** CP配对模式：A的得分（来自URL） */
  pairFromScore?: Score;
```

- [ ] **Step 4: 移除 URL 注释中的 pair 格式**

更新 URL 参数注释，将：
```typescript
/**
 * URL 参数格式
 * 结果页：?e=9&s=10&c=8
 * 照镜子：?from=e9s10c8
 * CP配对：?a=e9s10c8
 */
```
改为：
```typescript
/**
 * URL 参数格式
 * 结果页：?e=9&s=10&c=8
 * 照镜子：?from=e9s10c8
 */
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts
git commit -m "refactor: remove Pair types from type definitions"
```

---

### Task 3: 删除 Pair 页面和逻辑文件

**Files:**
- Delete: `src/app/pair/page.tsx` (entire directory)
- Delete: `src/lib/pair.ts`
- Delete: `src/data/pair-templates.ts`

- [ ] **Step 1: 删除文件**

```bash
cd /Users/heyilang/Documents/work/2604/catsdogs
rm -rf src/app/pair
rm src/lib/pair.ts
rm src/data/pair-templates.ts
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "refactor: remove CP pair page, logic, and templates"
```

---

### Task 4: 清理 url-codec.ts 中的 Pair 函数

**Files:**
- Modify: `src/lib/url-codec.ts`

- [ ] **Step 1: 移除 pair 相关函数**

从 `src/lib/url-codec.ts` 中删除以下内容：

1. 删除文件顶部注释中的 `CP配对：/pair?a=e9s10c8` 那行
2. 删除 `parsePairUrl` 函数（第 125-130 行）及其注释
3. 删除 `buildPairUrl` 函数（第 137-139 行）及其注释
4. 删除 `// ─── CP配对链接 ────` 分隔线注释
5. 在 `parseAnyScoreUrl` 函数中，移除 `parsePairUrl(search) ??` 调用

`parseAnyScoreUrl` 改为：
```typescript
export function parseAnyScoreUrl(search: string): Score | null {
  return (
    parseResultUrl(search) ??
    parseMirrorUrl(search) ??
    null
  );
}
```

- [ ] **Step 2: 验证无导出错误**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx tsc --noEmit 2>&1 | head -40`
Expected: 一些 import 错误（其他文件还在引用 `parsePairUrl` / `buildPairUrl`），将在后续 Task 修复。

- [ ] **Step 3: Commit**

```bash
git add src/lib/url-codec.ts
git commit -m "refactor: remove pair URL codec functions"
```

---

### Task 5: 清理 quiz-engine.ts 中的 Pair 引用

**Files:**
- Modify: `src/lib/quiz-engine.ts`

- [ ] **Step 1: 移除 pair 参数和引用**

1. 更新文件顶部注释：将 `支持 self/mirror/pair 三种模式` 改为 `支持 self/mirror 两种模式`

2. `createInitialQuizState` 函数：移除 `pairFromScore` 参数
```typescript
export function createInitialQuizState(
  questions: Question[],
  mode: QuizMode = 'self',
  mirrorFromScore?: Score
): QuizState {
  return {
    mode,
    currentIndex: 0,
    answers: [],
    isCompleted: false,
    mirrorFromScore,
  };
}
```

3. `resetQuiz` 函数：移除 `pairFromScore` 参数
```typescript
export function resetQuiz(
  questions: Question[],
  mode: QuizMode = 'self',
  mirrorFromScore?: Score
): QuizState {
  return createInitialQuizState(
    prepareQuestions(questions),
    mode,
    mirrorFromScore
  );
}
```

4. `getQuestionText` 注释：将 `self / pair` 改为 `self`
```typescript
/**
 * 根据答题模式决定显示题目的哪个文本版本
 * - self：使用自测版 question.text
 * - mirror：使用他测版 question.textMirror
 */
```

5. `getModeName`：移除 pair 项
```typescript
export function getModeName(mode: QuizMode): string {
  const map: Record<QuizMode, string> = {
    self: '自测',
    mirror: '他测（照镜子）',
  };
  return map[mode];
}
```

6. `getQuizTitle`：移除 pair case
```typescript
export function getQuizTitle(mode: QuizMode): string {
  switch (mode) {
    case 'self':    return '测测你是哪种猫人狗人';
    case 'mirror':  return '以你朋友的视角回答';
  }
}
```

7. `deserializeAnswers`：将 `['self', 'mirror', 'pair']` 改为 `['self', 'mirror']`

- [ ] **Step 2: Commit**

```bash
git add src/lib/quiz-engine.ts
git commit -m "refactor: remove pair mode from quiz engine"
```

---

### Task 6: 清理 quiz 页面的 Pair 引用

**Files:**
- Modify: `src/app/quiz/page.tsx`

- [ ] **Step 1: 移除 pair 相关导入和逻辑**

1. 从 import 中移除 `parsePairUrl` 和 `encodeScore`：
```typescript
import { parseMirrorUrl, buildResultUrl } from '@/lib/url-codec';
```
注意：`encodeScore` 仍在 mirror 跳转中使用，检查第 128 行：`encodeScore(mirrorFromScore)` — 是的，保留 `encodeScore` 导入。

修正为：
```typescript
import { parseMirrorUrl, buildResultUrl, encodeScore } from '@/lib/url-codec';
```

2. 移除 mode 判断中的 pair（第 80 行）：
```typescript
  const mode = useMemo<QuizMode>(() => {
    if (searchParams.has('from')) return 'mirror';
    return 'self';
  }, [searchParams]);
```

3. 移除 `pairFromScore` 变量（第 89-92 行整段删掉）

4. 更新 `createInitialQuizState` 调用（第 99 行），移除 `pairFromScore`：
```typescript
    createInitialQuizState(preparedQuestions, mode, mirrorFromScore ?? undefined)
```

5. 移除完成后跳转中的 pair 分支（第 129-131 行）：
```typescript
  useEffect(() => {
    if (quizState.isCompleted) {
      try {
        const { score } = computeResult(quizState);
        if (mode === 'mirror' && mirrorFromScore) {
          router.push(`/mirror?from=${encodeScore(mirrorFromScore)}&e=${score.energy}&s=${score.strategy}&c=${score.core}`);
        } else {
          router.push(buildResultUrl(score));
        }
      } catch (e) {
        console.error('[quiz] compute result error', e);
      }
    }
  }, [quizState.isCompleted, quizState, mode, mirrorFromScore, router]);
```

6. 移除 modeLabel 中的 pair 分支（第 164-168 行）：
```typescript
  const modeLabel = mode === 'mirror'
    ? '他测 · 照镜子'
    : null;
```

- [ ] **Step 2: Commit**

```bash
git add src/app/quiz/page.tsx
git commit -m "refactor: remove pair mode from quiz page"
```

---

### Task 7: 清理结果页和首页的 Pair 入口

**Files:**
- Modify: `src/components/ResultPageClient.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 清理 ResultPageClient.tsx**

1. 从 import 中移除 `buildPairUrl`：
```typescript
import { parseResultUrl, buildMirrorUrl } from "@/lib/url-codec";
```

2. 移除 `pairUrl` 变量（第 93-95 行）

3. 在社交玩法区域，移除「和TA配对」的 SocialActionCard（第 298-303 行）：
删掉：
```tsx
            <SocialActionCard
              emoji="💞"
              title="和 TA 配对"
              desc="一起测，看看你们是什么组合"
              color="#E8A87C"
              href={pairUrl}
            />
```

- [ ] **Step 2: 清理首页 page.tsx**

移除首页底部的 CP 配对社交入口卡片（第 213-219 行）：
删掉：
```tsx
          <SocialCard
            emoji="💞"
            title="CP 配对"
            desc="和 TA 互测，看看你们是什么组合"
            href="/pair"
            color="#E8A87C"
          />
```

- [ ] **Step 3: 清理 ui-copy.ts**

移除 `PAIR_COPY` 导出块（第 138-183 行整段删除），以及 `QUIZ_COPY` 中的 `pairModeHint`（第 29 行）。

- [ ] **Step 4: 清理 QuizPageClient.tsx（如果仍被引用）**

检查 `src/components/QuizPageClient.tsx` 中的 pair 引用。从 import 中移除 `parsePairUrl`：
```typescript
import { buildResultUrl, parseMirrorUrl } from "@/lib/url-codec";
```

移除 mode 判断中的 pair 分支（第 43 行）：
```typescript
  const mode = useMemo<QuizMode>(() => {
    if (searchParams.get("from")) return "mirror";
    return "self";
  }, [searchParams]);
```

移除 `pairScore` 变量（第 58-61 行），更新 `createInitialQuizState` 调用移除 pairScore 参数。

移除 `progressColor` 中的 pair 分支（第 113-117 行）：
```typescript
  const progressColor = mode === "mirror" ? "#A8D8C8" : "#8B9DAF";
```

移除 header 中的 pair 标签（第 151-152 行）：
```tsx
            {mode === "mirror" ? "🪞 他测" : null}
```

- [ ] **Step 5: 验证构建**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx tsc --noEmit 2>&1 | head -30`
Expected: 仅剩 breeds 数据文件的类型错误（因为新字段尚未填充）。

- [ ] **Step 6: Commit**

```bash
git add src/components/ResultPageClient.tsx src/app/page.tsx src/data/ui-copy.ts src/components/QuizPageClient.tsx
git commit -m "refactor: remove all pair UI entries from result page, home page, and quiz"
```

---

### Task 8: 录入 18 品种深度画像数据

**Files:**
- Modify: `src/data/breeds.ts`

这是最大的 Task，涉及 18 个品种 × 4 板块的文案数据。所有文案来源于 `prd/catsdogs-v2-optimization.md` 第二节。

- [ ] **Step 1: 为第 1 个品种添加新字段（british-shorthair）**

在 `src/data/breeds.ts` 的 `british-shorthair` 条目中，`nemesis: 'siamese'` 后面添加：

```typescript
    innerMechanism: {
      stressResponse: '自动进入「世界与我无关」模式，等压力自己过去。如果过不去——那就适应它。',
      rechargeMode: '一个人窝着，什么也不做也不想，「发呆」就是你最高效的充电方式。',
      emotionalPattern: '情绪波动极小，不是没有情绪，是早就跟情绪达成了和平协议。',
    },
    workStyle: {
      asLeader: '佛系放权派，只要结果OK过程随意。下属爱你，但你的上司可能觉得你缺乏野心。',
      asFollower: '最不需要被管的员工。给我任务、给我deadline、然后别来烦我。',
      meetingStyle: '全程安静，只在被点名时用最少的字回答最关键的问题。',
    },
    loveStyle: {
      crushSignal: '开始愿意为对方打破自己的日常节奏——这对你来说已经是惊天动地了。',
      dealBreaker: '对方试图「改造」你，或者觉得你的生活方式是「不上进」。',
      idealRelationship: '各自躺着，偶尔交换一个眼神，不说话也很舒服。',
    },
    socialHabit: {
      friendGroupRole: '潜水冠军，每年冒泡三次，但每次出现大家都很惊喜。',
      socialBattery: '出厂就是省电模式，聚会超过 90 分钟开始心不在焉。',
      friendshipRedFlag: '不请自来的热情、强行组局、以及「你怎么又不出门」的关心。',
    },
```

- [ ] **Step 2: 为剩余 17 个品种添加新字段**

按顺序为以下品种添加相同结构的数据（所有文案从 `prd/catsdogs-v2-optimization.md` 第二节逐一复制）：

- american-shorthair（随和室友）
- tuxedo（神经质乐子人）
- russian-blue（清冷智性恋）
- ragdoll（优雅利己者）
- abyssinian（聪明探险家）
- maine-coon（威严领主）
- siamese（强势管理者）
- bengal（野心征服者）
- bernese（治愈大熊）
- samoyed（甜美天使）
- golden-retriever（燃烧小太阳）
- shiba-inu（倔强哲学家）
- corgi（精明社交家）
- husky（反差表演家）
- doberman（克制守望者）
- german-shepherd（靠谱执行官）
- border-collie（焦虑策略家）

每个品种的完整文案在 PRD v2 中按品种名查找。格式与 Step 1 的 british-shorthair 完全一致。

- [ ] **Step 3: 验证 TypeScript 编译通过**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx tsc --noEmit 2>&1 | head -10`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/data/breeds.ts
git commit -m "feat: add deep personality profiles for all 18 breeds"
```

---

### Task 9: 结果页新增 4 个深度板块 UI

**Files:**
- Modify: `src/components/ResultPageClient.tsx`

- [ ] **Step 1: 添加 ProfileSection 子组件**

在 `ResultPageClient.tsx` 文件末尾（在最后一个子组件之后）添加：

```tsx
function ProfileSection({
  emoji,
  title,
  items,
  themeColor,
}: {
  emoji: string;
  title: string;
  items: { label: string; content: string }[];
  themeColor: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E8E8E4] shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{emoji}</span>
        <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs font-bold mb-1" style={{ color: themeColor }}>
              {item.label}
            </p>
            <p className="text-sm text-[#4A4A5A] leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 在结果页中插入 4 个板块**

在结果页的「超能力 & 软肋」和「扎心一句」之间插入 4 个新板块。找到超能力&软肋结束的 `</motion.div>` 后，在扎心一句之前，添加：

```tsx
        {/* 🧠 内在机制 */}
        <motion.div variants={itemVariants} className="mb-4">
          <ProfileSection
            emoji="🧠"
            title="内在机制"
            items={[
              { label: '压力反应', content: breed.innerMechanism.stressResponse },
              { label: '充电方式', content: breed.innerMechanism.rechargeMode },
              { label: '情绪模式', content: breed.innerMechanism.emotionalPattern },
            ]}
            themeColor={themeColor}
          />
        </motion.div>

        {/* 💼 职场风格 */}
        <motion.div variants={itemVariants} className="mb-4">
          <ProfileSection
            emoji="💼"
            title="职场风格"
            items={[
              { label: '当领导时', content: breed.workStyle.asLeader },
              { label: '当下属时', content: breed.workStyle.asFollower },
              { label: '开会风格', content: breed.workStyle.meetingStyle },
            ]}
            themeColor={themeColor}
          />
        </motion.div>

        {/* ❤️ 恋爱模式 */}
        <motion.div variants={itemVariants} className="mb-4">
          <ProfileSection
            emoji="❤️"
            title="恋爱模式"
            items={[
              { label: '心动信号', content: breed.loveStyle.crushSignal },
              { label: '雷点', content: breed.loveStyle.dealBreaker },
              { label: '理想相处', content: breed.loveStyle.idealRelationship },
            ]}
            themeColor={themeColor}
          />
        </motion.div>

        {/* 🤝 社交习惯 */}
        <motion.div variants={itemVariants} className="mb-4">
          <ProfileSection
            emoji="🤝"
            title="社交习惯"
            items={[
              { label: '朋友群角色', content: breed.socialHabit.friendGroupRole },
              { label: '社交电量', content: breed.socialHabit.socialBattery },
              { label: '友谊雷区', content: breed.socialHabit.friendshipRedFlag },
            ]}
            themeColor={themeColor}
          />
        </motion.div>
```

- [ ] **Step 3: 验证构建成功**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx next build 2>&1 | tail -20`
Expected: 所有页面成功生成，无错误。

- [ ] **Step 4: Commit**

```bash
git add src/components/ResultPageClient.tsx
git commit -m "feat: add 4 deep profile sections to result page UI"
```

---

### Task 10: 修复结果页裁切和布局问题

**Files:**
- Modify: `src/components/ResultPageClient.tsx`

- [ ] **Step 1: 启动 dev server 检查实际问题**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx next dev -p 3456 &`

在浏览器中打开 `http://localhost:3456/result?e=9&s=10&c=7` 检查布局。
用移动端视口（375px 宽度）检查所有区域。

- [ ] **Step 2: 修复 Hero 区溢出**

确保 Hero 区域的装饰圆圈不溢出。在 Hero 容器 div 上确认有 `overflow-hidden`。当前代码已有 `className="relative overflow-hidden px-6 pt-16 pb-12"`，确认无问题。

- [ ] **Step 3: 修复底部安全区遮挡**

在结果页 `<main>` 标签上，将 `pb-16` 改为 `pb-16 pb-safe-bottom`，或在最后一个按钮区域添加底部安全区 padding：

在分享按钮组的容器中，将：
```tsx
<motion.div variants={itemVariants} className="mt-6 space-y-3">
```
改为：
```tsx
<motion.div variants={itemVariants} className="mt-6 space-y-3 pb-safe-bottom">
```

并在 `src/app/globals.css` 中添加安全区 CSS（如果不存在）：
```css
.pb-safe-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

- [ ] **Step 4: 修复品种关系卡小屏挤压**

将品种关系卡的 2 列网格添加响应式断点。将：
```tsx
<div className="grid grid-cols-2 gap-3">
```
改为：
```tsx
<div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
```

- [ ] **Step 5: 验证修复效果**

在 dev server 中以不同视口宽度（320px / 375px / 428px）检查结果页。确认：
- Hero 区装饰圆不超出
- 底部按钮不被 iOS 安全区遮挡
- 品种关系卡在小屏幕正常显示
- 新增的 4 个板块内容完整可见

- [ ] **Step 6: Commit**

```bash
git add src/components/ResultPageClient.tsx src/app/globals.css
git commit -m "fix: resolve result page clipping and layout issues"
```

---

### Task 11: 构建验证和最终清理

**Files:**
- Multiple files (verification only, no changes unless needed)

- [ ] **Step 1: 全项目 TypeScript 检查**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: 全项目构建**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx next build 2>&1 | tail -20`
Expected: 所有页面成功生成，包括 /、/quiz、/result、/mirror（不包含 /pair）

- [ ] **Step 3: 确认 pair 页面已完全移除**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && grep -r "pair" src/ --include="*.ts" --include="*.tsx" -l`
Expected: 仅剩 `src/data/pair-templates.ts`（已删除）或零结果。如果有残留引用，修复。

Run: `ls src/app/pair 2>&1`
Expected: `No such file or directory`

- [ ] **Step 4: 确认 breeds 数据完整性**

Run: `cd /Users/heyilang/Documents/work/2604/catsdogs && npx tsx -e "import {BREEDS} from './src/data/breeds'; console.log('Total breeds:', BREEDS.length); BREEDS.forEach(b => { if (!b.innerMechanism || !b.workStyle || !b.loveStyle || !b.socialHabit) console.log('MISSING:', b.id); }); console.log('All breeds complete')"`
Expected: `Total breeds: 18` + `All breeds complete`（无 MISSING）

- [ ] **Step 5: Commit（如有清理修改）**

```bash
git add -A
git commit -m "chore: final v2 cleanup and verification"
```
