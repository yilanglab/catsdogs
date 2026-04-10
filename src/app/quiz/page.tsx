'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '@/data/questions';
import {
  prepareQuestions,
  createInitialQuizState,
  submitAnswer,
  goToPrevQuestion,
  getProgress,
  getQuestionText,
  computeResult,
} from '@/lib/quiz-engine';
import { parseMirrorUrl, parsePairUrl, buildResultUrl, encodeScore } from '@/lib/url-codec';
import type { QuizMode, QuizState, Option } from '@/lib/types';

// ─── 动画变体 ──────────────────────────────────────────────────────

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  }),
};

const optionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.08, duration: 0.3, ease: 'easeOut' as const },
  }),
};

// ─── 维度样式映射 ──────────────────────────────────────────────────

const DIMENSION_STYLES = {
  energy: {
    label: '能量',
    emoji: '⚡',
    accent: '#8B9DAF',
    bg: '#EEF1F5',
  },
  strategy: {
    label: '策略',
    emoji: '🧩',
    accent: '#D4A574',
    bg: '#FDF3E9',
  },
  core: {
    label: '内核',
    emoji: '🌀',
    accent: '#B8A9C9',
    bg: '#F5F2F9',
  },
};

// ─── 主组件 ────────────────────────────────────────────────────────

function QuizPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 解析模式和来源得分
  const mode = useMemo<QuizMode>(() => {
    const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
    if (searchParams.has('from')) return 'mirror';
    if (searchParams.has('a')) return 'pair';
    return 'self';
  }, [searchParams]);

  const mirrorFromScore = useMemo(() => {
    if (mode !== 'mirror') return undefined;
    return parseMirrorUrl(`from=${searchParams.get('from') ?? ''}`);
  }, [mode, searchParams]);

  const pairFromScore = useMemo(() => {
    if (mode !== 'pair') return undefined;
    return parsePairUrl(`a=${searchParams.get('a') ?? ''}`);
  }, [mode, searchParams]);

  // 准备随机化题目（只初始化一次）
  const preparedQuestions = useMemo(() => prepareQuestions(QUESTIONS), []);

  // 答题状态
  const [quizState, setQuizState] = useState<QuizState>(() =>
    createInitialQuizState(preparedQuestions, mode, mirrorFromScore ?? undefined, pairFromScore ?? undefined)
  );

  // 选中但未提交的选项（用于动画反馈）
  const [pendingOption, setPendingOption] = useState<Option | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 滑动方向（1=向前，-1=向后）
  const [direction, setDirection] = useState(1);

  // 防抖 ref
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = preparedQuestions[quizState.currentIndex];
  const dimStyle = DIMENSION_STYLES[currentQuestion.dimension];
  const questionText = getQuestionText(currentQuestion, mode);
  const progress = getProgress(quizState);
  const totalQ = 15;
  const currentNum = quizState.currentIndex + 1;

  // 完成后跳转
  useEffect(() => {
    if (quizState.isCompleted) {
      try {
        const { score } = computeResult(quizState);

        // 根据模式跳转到对应的结果/报告页
        if (mode === 'mirror' && mirrorFromScore) {
          // 跳转到照镜子对比报告页
          router.push(`/mirror?from=${encodeScore(mirrorFromScore)}&e=${score.energy}&s=${score.strategy}&c=${score.core}`);
        } else if (mode === 'pair' && pairFromScore) {
          // 跳转到CP配对结果页
          router.push(`/pair?a=${encodeScore(pairFromScore)}&e=${score.energy}&s=${score.strategy}&c=${score.core}`);
        } else {
          router.push(buildResultUrl(score));
        }
      } catch (e) {
        console.error('[quiz] compute result error', e);
      }
    }
  }, [quizState.isCompleted, quizState, mode, mirrorFromScore, pairFromScore, router]);

  // 选择选项
  function handleSelectOption(option: Option) {
    if (isSubmitting) return;
    setPendingOption(option);
    setIsSubmitting(true);

    submitTimer.current = setTimeout(() => {
      setDirection(1);
      setQuizState(prev => submitAnswer(prev, currentQuestion, option));
      setPendingOption(null);
      setIsSubmitting(false);
    }, 350);
  }

  // 返回上一题
  function handleGoBack() {
    if (quizState.currentIndex === 0 || isSubmitting) return;
    setDirection(-1);
    setQuizState(prev => goToPrevQuestion(prev));
    setPendingOption(null);
  }

  // 模式标题
  const modeLabel = mode === 'mirror'
    ? '他测 · 照镜子'
    : mode === 'pair'
    ? 'CP 配对测试'
    : null;

  return (
    <main
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#FAFAF8' }}
    >
      {/* ── 顶部导航栏 ── */}
      <header className="flex items-center justify-between px-5 pt-safe-top pt-4 pb-3 relative z-20">
        {/* 返回按钮 */}
        <button
          onClick={handleGoBack}
          disabled={quizState.currentIndex === 0}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: quizState.currentIndex === 0 ? 'transparent' : '#F0F0F0',
            color: quizState.currentIndex === 0 ? 'transparent' : '#4A4A5A',
          }}
          aria-label="返回上一题"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 题目计数 */}
        <div className="text-sm font-medium" style={{ color: '#6A6A7A' }}>
          {modeLabel && (
            <span
              className="mr-2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: dimStyle.bg, color: dimStyle.accent }}
            >
              {modeLabel}
            </span>
          )}
          <span className="font-bold" style={{ color: '#2C2C2C' }}>{currentNum}</span>
          <span> / {totalQ}</span>
        </div>

        {/* 占位 */}
        <div className="w-9" />
      </header>

      {/* ── 进度条 ── */}
      <div className="px-5 pb-2 relative z-20">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EBEBEB' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${dimStyle.accent} 0%, ${dimStyle.accent}99 100%)` }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── 问题卡片区域 ── */}
      <div className="flex-1 px-5 flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={quizState.currentIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col gap-4"
          >
            {/* 维度标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: dimStyle.bg, color: dimStyle.accent }}
              >
                <span>{dimStyle.emoji}</span>
                <span>{dimStyle.label}维度</span>
              </span>
            </motion.div>

            {/* 题目文字 */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl font-semibold leading-relaxed"
              style={{ color: '#2C2C2C' }}
            >
              {questionText}
            </motion.h2>

            {/* 选项列表 */}
            <div className="flex flex-col gap-3 mt-2">
              {currentQuestion.options.map((option, i) => {
                const isSelected = pendingOption?.key === option.key;
                return (
                  <motion.button
                    key={option.key}
                    custom={i}
                    variants={optionVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => handleSelectOption(option)}
                    disabled={isSubmitting}
                    className="w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 relative overflow-hidden"
                    style={{
                      background: isSelected ? dimStyle.bg : 'white',
                      borderColor: isSelected ? dimStyle.accent : '#E8E8E4',
                      color: '#2C2C2C',
                      boxShadow: isSelected
                        ? `0 0 0 3px ${dimStyle.accent}22`
                        : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    whileTap={{ scale: 0.985 }}
                  >
                    {/* 选中时的背景填充 */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ background: `${dimStyle.accent}10` }}
                      />
                    )}

                    <div className="relative flex items-start gap-3">
                      {/* 序号圆圈 */}
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-all"
                        style={{
                          background: isSelected ? dimStyle.accent : '#F0F0F0',
                          color: isSelected ? 'white' : '#8B8B9B',
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm leading-relaxed" style={{ color: '#3C3C4C' }}>
                        {option.text}
                      </span>
                    </div>

                    {/* 选中勾选标记 */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.05 }}
                        className="absolute top-3 right-3"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: dimStyle.accent }}
                        >
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 底部提示 ── */}
      <footer className="px-5 pb-8 pt-4 text-center safe-bottom">
        <p className="text-xs" style={{ color: '#C0C0C8' }}>
          点击选项即自动进入下一题
        </p>
      </footer>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
        <div className="text-[#8B9DAF] text-sm">加载中…</div>
      </main>
    }>
      <QuizPageInner />
    </Suspense>
  );
}
