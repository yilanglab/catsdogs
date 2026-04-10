/**
 * 猫人狗人 — 答题引擎
 * 管理答题流程：选项随机化、答案收集、进度追踪、得分计算
 *
 * 设计原则：
 * - 纯函数为主，状态在 React 层管理（通过 useQuizState hook）
 * - 选项乱序：分值跟随选项文字，保证乱序后计分正确
 * - 支持 self/mirror/pair 三种模式
 */

import type {
  Answer,
  BreedId,
  DimensionResult,
  Option,
  Question,
  QuizMode,
  QuizState,
  Score,
} from './types';
import { calculateScore, resolveDimensions, isCoreBorderline } from './scoring';
import { resolveBreedId } from './breeds';

// ─── 选项随机化 ───────────────────────────────────────────────

/**
 * Fisher-Yates 洗牌算法（不可变，返回新数组）
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 将题目的选项顺序随机打乱
 * 分值跟随选项文字移动，不影响计分结果
 */
export function shuffleOptions(question: Question): Question {
  return {
    ...question,
    options: shuffleArray(question.options),
  };
}

/**
 * 批量随机化题目列表的所有选项
 * 题目本身顺序不变（1-15按顺序展示），只打乱每题内部选项
 */
export function prepareQuestions(questions: Question[]): Question[] {
  return questions.map(shuffleOptions);
}

// ─── 答题状态初始化 ───────────────────────────────────────────

/**
 * 创建初始答题状态
 * @param questions 已准备好（选项乱序）的题目列表
 * @param mode 答题模式
 * @param mirrorFromScore 照镜子模式：被测人的自测得分（从URL解码）
 * @param pairFromScore CP配对模式：用户A的得分（从URL解码）
 */
export function createInitialQuizState(
  questions: Question[],
  mode: QuizMode = 'self',
  mirrorFromScore?: Score,
  pairFromScore?: Score
): QuizState {
  return {
    mode,
    currentIndex: 0,
    answers: [],
    isCompleted: false,
    mirrorFromScore,
    pairFromScore,
  };
}

// ─── 答题操作 ────────────────────────────────────────────────

/**
 * 提交当前题目的答案，返回新状态
 * 纯函数：不修改原状态
 *
 * @param state 当前答题状态
 * @param question 当前题目
 * @param selectedOption 用户选择的选项
 */
export function submitAnswer(
  state: QuizState,
  question: Question,
  selectedOption: Option
): QuizState {
  const answer: Answer = {
    questionId: question.id,
    selectedValue: selectedOption.value,
    dimension: question.dimension,
  };

  const newAnswers = [...state.answers, answer];
  const isLastQuestion = state.currentIndex >= getTotalQuestions(state) - 1;

  return {
    ...state,
    answers: newAnswers,
    currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
    isCompleted: isLastQuestion,
  };
}

/**
 * 返回上一题（撤销最后一个答案）
 * 返回新状态
 */
export function goToPrevQuestion(state: QuizState): QuizState {
  if (state.currentIndex <= 0) return state;

  return {
    ...state,
    currentIndex: state.currentIndex - 1,
    answers: state.answers.slice(0, -1),
    isCompleted: false,
  };
}

/**
 * 重置答题状态（重新开始）
 */
export function resetQuiz(
  questions: Question[],
  mode: QuizMode = 'self',
  mirrorFromScore?: Score,
  pairFromScore?: Score
): QuizState {
  return createInitialQuizState(
    prepareQuestions(questions),
    mode,
    mirrorFromScore,
    pairFromScore
  );
}

// ─── 进度查询 ────────────────────────────────────────────────

/**
 * 获取总题数（固定为15）
 */
export function getTotalQuestions(_state: QuizState): number {
  return 15;
}

/**
 * 获取当前进度（1-based），例如：第3题返回3
 */
export function getCurrentQuestionNumber(state: QuizState): number {
  return state.currentIndex + 1;
}

/**
 * 获取答题进度百分比 (0-100)
 */
export function getProgress(state: QuizState): number {
  return Math.round((state.answers.length / getTotalQuestions(state)) * 100);
}

/**
 * 检查某题是否已作答
 */
export function isQuestionAnswered(state: QuizState, questionId: number): boolean {
  return state.answers.some(a => a.questionId === questionId);
}

/**
 * 获取某题已选择的答案（如有）
 */
export function getAnswerForQuestion(state: QuizState, questionId: number): Answer | undefined {
  return state.answers.find(a => a.questionId === questionId);
}

// ─── 结果计算 ────────────────────────────────────────────────

/**
 * 答题完成后计算最终结果
 * 返回得分、维度档位和品种ID
 *
 * @throws 如果答案不足15题
 */
export function computeResult(state: QuizState): {
  score: Score;
  dimensions: DimensionResult;
  breedId: BreedId;
  isBorderline: boolean;
  borderlineNote: string | undefined;
} {
  if (state.answers.length < 15) {
    throw new Error(`[quiz-engine] 答案不足: ${state.answers.length}/15`);
  }

  const score = calculateScore(state.answers);
  const dimensions = resolveDimensions(score);
  const breedId = resolveBreedId(dimensions);
  const isBorderline = isCoreBorderline(score.core);

  let borderlineNote: string | undefined;
  if (isBorderline) {
    if (score.core === 7) {
      borderlineNote = '你身上带有一定的犬系特质——虽然灵魂偏猫，但你比自己以为的更在意连接与认可。';
    } else {
      borderlineNote = '你身上带有一定的猫系特质——虽然关系驱动，但你比别人以为的更需要独立空间。';
    }
  }

  return { score, dimensions, breedId, isBorderline, borderlineNote };
}

// ─── 模式相关工具 ────────────────────────────────────────────

/**
 * 根据答题模式决定显示题目的哪个文本版本
 * - self / pair：使用自测版 question.text
 * - mirror：使用他测版 question.textMirror
 */
export function getQuestionText(question: Question, mode: QuizMode): string {
  return mode === 'mirror' ? question.textMirror : question.text;
}

/**
 * 获取答题模式的中文描述
 */
export function getModeName(mode: QuizMode): string {
  const map: Record<QuizMode, string> = {
    self: '自测',
    mirror: '他测（照镜子）',
    pair: '配对测试',
  };
  return map[mode];
}

/**
 * 根据模式生成答题页标题
 */
export function getQuizTitle(mode: QuizMode): string {
  switch (mode) {
    case 'self':    return '测测你是哪种猫人狗人';
    case 'mirror':  return '以你朋友的视角回答';
    case 'pair':    return '测测你和 TA 是什么搭配';
  }
}

// ─── 序列化/反序列化（用于本地存储或URL传递） ─────────────────

/**
 * 将答题状态序列化为简洁字符串
 * 格式：`{mode}|{answers}`
 * answers 用逗号分隔：`{questionId}:{value}`
 */
export function serializeQuizState(state: QuizState): string {
  const answerStr = state.answers
    .map(a => `${a.questionId}:${a.selectedValue}`)
    .join(',');
  return `${state.mode}|${answerStr}`;
}

/**
 * 反序列化答题状态（仅恢复 mode 和 answers，题目列表需重新传入）
 * 用于从 sessionStorage 恢复进度
 */
export function deserializeAnswers(
  serialized: string
): { mode: QuizMode; answers: Pick<Answer, 'questionId' | 'selectedValue'>[] } | null {
  try {
    const [modeStr, answerStr] = serialized.split('|');
    const mode = modeStr as QuizMode;
    if (!['self', 'mirror', 'pair'].includes(mode)) return null;

    const answers = answerStr
      ? answerStr.split(',').map(part => {
          const [qid, val] = part.split(':');
          return { questionId: parseInt(qid, 10), selectedValue: parseInt(val, 10) };
        })
      : [];

    return { mode, answers };
  } catch {
    return null;
  }
}
