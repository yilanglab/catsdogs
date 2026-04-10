/**
 * 猫人狗人 — 答题状态 React Hook
 * 封装 quiz-engine 的纯函数，提供 React 状态管理接口
 *
 * 使用方式：
 * const { state, currentQuestion, submitAnswer, goBack, result } = useQuizState(questions, mode);
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import type { Option, Question, QuizMode, QuizState, Score } from '../lib/types';
import {
  createInitialQuizState,
  prepareQuestions,
  submitAnswer as engineSubmitAnswer,
  goToPrevQuestion,
  computeResult,
  getProgress,
  getCurrentQuestionNumber,
  getTotalQuestions,
  resetQuiz,
} from '../lib/quiz-engine';

interface UseQuizStateOptions {
  /** 原始题目数据（选项会在初始化时自动随机化） */
  questions: Question[];
  /** 答题模式，默认 'self' */
  mode?: QuizMode;
  /** 照镜子模式：被测人的自测得分 */
  mirrorFromScore?: Score;
  /** CP配对模式：用户A的得分 */
  pairFromScore?: Score;
}

interface UseQuizStateReturn {
  /** 当前完整的答题状态 */
  state: QuizState;
  /** 当前展示的题目（已做选项随机化） */
  currentQuestion: Question | null;
  /** 当前题号（1-based） */
  currentQuestionNumber: number;
  /** 总题数（固定15） */
  totalQuestions: number;
  /** 答题进度 0-100 */
  progress: number;
  /** 是否可以返回上一题 */
  canGoBack: boolean;
  /** 是否已完成所有题目 */
  isCompleted: boolean;
  /** 提交当前题目的答案 */
  submitAnswer: (option: Option) => void;
  /** 返回上一题 */
  goBack: () => void;
  /** 重新开始答题 */
  restart: () => void;
  /** 计算结果（仅在 isCompleted=true 后调用） */
  result: ReturnType<typeof computeResult> | null;
}

export function useQuizState({
  questions,
  mode = 'self',
  mirrorFromScore,
  pairFromScore,
}: UseQuizStateOptions): UseQuizStateReturn {
  // 初始化时随机化选项顺序
  const [preparedQuestions] = useState<Question[]>(() => prepareQuestions(questions));

  const [state, setState] = useState<QuizState>(() =>
    createInitialQuizState(preparedQuestions, mode, mirrorFromScore, pairFromScore)
  );

  const currentQuestion = useMemo<Question | null>(() => {
    if (state.isCompleted || state.currentIndex >= preparedQuestions.length) return null;
    return preparedQuestions[state.currentIndex] ?? null;
  }, [state.currentIndex, state.isCompleted, preparedQuestions]);

  const submitAnswer = useCallback(
    (option: Option) => {
      if (!currentQuestion || state.isCompleted) return;
      setState(prev => engineSubmitAnswer(prev, currentQuestion, option));
    },
    [currentQuestion, state.isCompleted]
  );

  const goBack = useCallback(() => {
    setState(prev => goToPrevQuestion(prev));
  }, []);

  const restart = useCallback(() => {
    setState(resetQuiz(questions, mode, mirrorFromScore, pairFromScore));
  }, [questions, mode, mirrorFromScore, pairFromScore]);

  // 结果只在完成后计算一次（useMemo缓存）
  const result = useMemo<ReturnType<typeof computeResult> | null>(() => {
    if (!state.isCompleted) return null;
    try {
      return computeResult(state);
    } catch (e) {
      console.error('[useQuizState] computeResult failed:', e);
      return null;
    }
  }, [state.isCompleted, state.answers]);

  return {
    state,
    currentQuestion,
    currentQuestionNumber: getCurrentQuestionNumber(state),
    totalQuestions: getTotalQuestions(state),
    progress: getProgress(state),
    canGoBack: state.currentIndex > 0 && !state.isCompleted,
    isCompleted: state.isCompleted,
    submitAnswer,
    goBack,
    restart,
    result,
  };
}
