"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/data/questions";
import {
  prepareQuestions,
  submitAnswer,
  goToPrevQuestion,
  getProgress,
  getQuestionText,
  computeResult,
  createInitialQuizState,
} from "@/lib/quiz-engine";
import { buildResultUrl, parseMirrorUrl } from "@/lib/url-codec";
import type { QuizState, Question, Option, QuizMode } from "@/lib/types";

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-40%" : "40%",
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

export default function QuizPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine mode from URL
  const mode = useMemo<QuizMode>(() => {
    if (searchParams.get("from")) return "mirror";
    return "self";
  }, [searchParams]);

  // Prepare shuffled questions (stable per session)
  const [preparedQuestions] = useState<Question[]>(() =>
    prepareQuestions(QUESTIONS)
  );

  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const mirrorScore =
      mode === "mirror"
        ? parseMirrorUrl(`from=${searchParams.get("from")}`)
        : undefined;
    return createInitialQuizState(preparedQuestions, mode, mirrorScore ?? undefined);
  });

  // Slide direction
  const [direction, setDirection] = useState(1);
  // Selected option before confirming
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  // Auto-advance after selection
  const [isAdvancing, setIsAdvancing] = useState(false);

  const currentQuestion = preparedQuestions[quizState.currentIndex];
  const progress = getProgress(quizState);

  // Handle option selection with slight delay for animation
  const handleSelect = useCallback(
    (option: Option) => {
      if (isAdvancing) return;
      setSelectedOption(option);
      setIsAdvancing(true);

      setTimeout(() => {
        setDirection(1);
        const newState = submitAnswer(quizState, currentQuestion, option);
        setQuizState(newState);
        setSelectedOption(null);
        setIsAdvancing(false);

        if (newState.isCompleted) {
          const result = computeResult(newState);
          const url = buildResultUrl(result.score);
          router.push(url);
        }
      }, 350);
    },
    [quizState, currentQuestion, router, isAdvancing]
  );

  const handleBack = useCallback(() => {
    if (quizState.currentIndex === 0) {
      router.back();
      return;
    }
    setDirection(-1);
    setSelectedOption(null);
    setQuizState((prev) => goToPrevQuestion(prev));
  }, [quizState.currentIndex, router]);

  const questionText = getQuestionText(currentQuestion, mode);

  // Progress bar color based on mode/core
  const progressColor =
    mode === "mirror"
      ? "#A8D8C8"
      : "#8B9DAF";

  return (
    <main className="flex flex-col min-h-screen bg-[#FAFAF8] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 safe-top">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-[#E8E8E4] text-[#4A4A5A] active:scale-95 transition-transform"
          aria-label="返回"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M11 4L6 9L11 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="text-xs text-[#8B9DAF] font-medium">
          {quizState.currentIndex + 1} / 15
        </span>

        {mode === "mirror" && (
          <span
            className="text-xs font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${progressColor}20`,
              color: progressColor,
            }}
          >
            🪞 他测
          </span>
        )}
        {mode === "self" && <div className="w-9" />}
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="h-1.5 bg-[#E8E8E4] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: progressColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col px-5 pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={quizState.currentIndex}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col flex-1"
          >
            {/* Question text */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 mb-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: getDimensionColor(
                      currentQuestion.dimension
                    ).bg,
                    color: getDimensionColor(currentQuestion.dimension).text,
                  }}
                >
                  {getDimensionLabel(currentQuestion.dimension)}
                </span>
              </div>
              <h2 className="text-[17px] font-semibold text-[#2C2C2C] leading-relaxed">
                {questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <OptionButton
                  key={option.key}
                  option={option}
                  index={idx}
                  isSelected={selectedOption?.key === option.key}
                  onSelect={handleSelect}
                  disabled={isAdvancing}
                  accentColor={progressColor}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="text-center text-xs text-[#8B9DAF]/60 pb-6 safe-bottom px-5">
        选择最符合你真实反应的选项
      </div>
    </main>
  );
}

function OptionButton({
  option,
  index,
  isSelected,
  onSelect,
  disabled,
  accentColor,
}: {
  option: Option;
  index: number;
  isSelected: boolean;
  onSelect: (opt: Option) => void;
  disabled: boolean;
  accentColor: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 28 }}
      onClick={() => !disabled && onSelect(option)}
      className="w-full text-left"
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="relative px-4 py-4 rounded-2xl border-2 transition-colors"
        style={{
          backgroundColor: isSelected ? `${accentColor}15` : "white",
          borderColor: isSelected ? accentColor : "#E8E8E4",
          boxShadow: isSelected
            ? `0 0 0 0px ${accentColor}40`
            : "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
            style={{
              backgroundColor: isSelected ? accentColor : "#F0F0EC",
              color: isSelected ? "white" : "#8B9DAF",
            }}
          >
            {["A", "B", "C"][index]}
          </div>
          <span
            className="text-sm leading-relaxed"
            style={{ color: isSelected ? "#2C2C2C" : "#4A4A5A" }}
          >
            {option.text}
          </span>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill={accentColor} />
              <path
                d="M6 10L9 13L14 7"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

function getDimensionLabel(dim: Question["dimension"]): string {
  const map = { energy: "⚡ 能量", strategy: "🧩 策略", core: "🌀 内核" };
  return map[dim];
}

function getDimensionColor(dim: Question["dimension"]) {
  const map = {
    energy: { bg: "#EEF1F5", text: "#8B9DAF" },
    strategy: { bg: "#FDF3E9", text: "#D4A574" },
    core: { bg: "#F5F2F9", text: "#B8A9C9" },
  };
  return map[dim];
}
