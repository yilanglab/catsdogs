'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { parsePairUrl, parseResultUrl } from '@/lib/url-codec';
import { generatePairResult, getCompatibilityLevel, isCatBreed } from '@/lib/pair';
import { resolveDimensions } from '@/lib/scoring';
import { resolveBreedId } from '@/lib/breeds';
import { BREEDS } from '@/data/breeds';
import type { PairResult } from '@/lib/types';

// ─── 动画 ────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
};

// ─── 内部组件 ────────────────────────────────────────────────

function PairPageInner() {
  const searchParams = useSearchParams();

  const scoreA = useMemo(() => {
    const aStr = searchParams.get('a');
    if (!aStr) return null;
    return parsePairUrl(`a=${aStr}`);
  }, [searchParams]);

  const scoreB = useMemo(() => {
    return parseResultUrl(searchParams.toString());
  }, [searchParams]);

  const hasA = searchParams.has('a');

  // 没有 a 参数 → 介绍页
  if (!hasA) {
    return <PairIntroPage />;
  }

  // a 参数解析失败
  if (!scoreA) {
    return <PairErrorPage />;
  }

  // 有 a 但没有 e/s/c → B 尚未测试，显示引导页
  if (!scoreB) {
    const dimsA = resolveDimensions(scoreA);
    const isCatA = dimsA.coreType === 'cat';
    return <PairStartPage aParam={searchParams.get('a')!} isCatA={isCatA} />;
  }

  // 双方都有得分 → 显示配对结果
  const pairResult = generatePairResult(scoreA, scoreB);
  const breedA = BREEDS.find(b => b.id === pairResult.breedA);
  const breedB = BREEDS.find(b => b.id === pairResult.breedB);

  if (!breedA || !breedB) return <PairErrorPage />;

  return <PairResultView pairResult={pairResult} breedAData={breedA} breedBData={breedB} />;
}

// ─── 引导开始页（B看到此页，点击开始测试） ─────────────────────

function PairStartPage({
  aParam,
  isCatA,
}: {
  aParam: string;
  isCatA: boolean;
}) {
  return (
    <main
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#FAFAF8' }}
    >
      {/* 顶部渐变区 */}
      <div
        className="relative px-6 pt-16 pb-10 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #E8A87C 0%, #F4C4A0 100%)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, white, transparent)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-4 text-4xl mb-4">
            <span>{isCatA ? '🐱' : '🐶'}</span>
            <span className="text-2xl">💞</span>
            <span>❓</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            你的 {isCatA ? '猫系' : '犬系'}朋友
          </h1>
          <p className="text-white/85 text-sm">
            已完成测试，等你来配对
          </p>
        </motion.div>
      </div>

      {/* 内容区 */}
      <motion.div
        className="flex-1 px-5 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 说明卡 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 mb-5 border border-[#E8E8E4] shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: '#E8A87C20' }}
            >
              💞
            </div>
            <div>
              <p className="font-semibold text-sm text-[#2C2C2C] mb-1.5">
                CP 配对测试
              </p>
              <p className="text-sm text-[#4A4A5A] leading-relaxed">
                你的朋友已完成自测。现在轮到你了——完成测试后，我们会分析你们的契合度和相处模式。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 提示卡 */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-4 mb-6 border"
          style={{ backgroundColor: '#FFF8F2', borderColor: '#E8A87C40' }}
        >
          <p className="text-xs text-[#8A5A3A] leading-relaxed">
            🎯 诚实作答更准确——完成后你会看到两人的品种、契合度分析和专属相处建议。
          </p>
        </motion.div>

        {/* 开始按钮 */}
        <motion.div variants={itemVariants}>
          <Link
            href={`/quiz?a=${aParam}`}
            className="block w-full"
          >
            <motion.button
              className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #E8A87C 0%, #F4A460 100%)',
                boxShadow: '0 8px 24px rgba(232, 168, 124, 0.5)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>💞</span>
                开始配对测试
              </span>
            </motion.button>
          </Link>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-[#8B9DAF] mt-3"
        >
          约 3 分钟 · 15 道情境题
        </motion.p>
      </motion.div>
    </main>
  );
}

// ─── 配对结果页 ───────────────────────────────────────────────

function PairResultView({
  pairResult,
  breedAData,
  breedBData,
}: {
  pairResult: PairResult;
  breedAData: typeof BREEDS[number];
  breedBData: typeof BREEDS[number];
}) {
  const compat = getCompatibilityLevel(pairResult.compatibility);
  const isCatA = isCatBreed(pairResult.breedA);
  const isCatB = isCatBreed(pairResult.breedB);

  // 渐变色：互补型用橙蓝渐变，猫猫用蓝紫，狗狗用橙粉
  const heroGradient = isCatA !== isCatB
    ? 'linear-gradient(135deg, #8B9DAF 0%, #E8A87C 100%)'
    : isCatA
    ? 'linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)'
    : 'linear-gradient(135deg, #E8A87C 0%, #F4C4A0 100%)';

  const accentColor = isCatA !== isCatB ? '#D4A574' : isCatA ? '#8B9DAF' : '#E8A87C';

  function handleShare() {
    const text = `我们测了 CP 契合度\n${pairResult.compatibility}分 · ${compat.label}\n#猫人狗人CP配对`;
    if (navigator.share) {
      navigator.share({ title: '猫人狗人 · CP配对结果', text, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('链接已复制！');
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-16">
      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 pt-16 pb-12"
        style={{ background: heroGradient }}
      >
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-30%, 30%)' }}
        />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
            <span className="text-xs text-white/90">💞 CP配对结果</span>
          </div>
          {/* 契合度大数字 */}
          <div className="flex items-end justify-center gap-1 mb-2">
            <span className="text-6xl font-black text-white leading-none">{pairResult.compatibility}</span>
            <span className="text-xl text-white/80 mb-2">分</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/25 rounded-full px-4 py-1.5 mb-3">
            <span className="text-sm font-bold text-white">{compat.label}</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed px-4">{compat.description}</p>
        </motion.div>
      </div>

      <motion.div
        className="px-5 -mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 品种卡 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8E4] mb-4"
        >
          <p className="text-xs font-bold text-[#8B9DAF] mb-3">👤 你们的品种</p>
          <div className="grid grid-cols-2 gap-3">
            <BreedCard label="你" breed={breedBData} isCat={isCatB} />
            <BreedCard label="TA" breed={breedAData} isCat={isCatA} />
          </div>
        </motion.div>

        {/* 组合类型卡 */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl p-5 mb-4 border-2"
          style={{ backgroundColor: '#FAFAF8', borderColor: `${accentColor}40` }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{getPairTypeEmoji(pairResult.pairType)}</span>
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: accentColor }}>你们是</p>
              <p className="font-bold text-base text-[#2C2C2C] mb-2">{getPairTypeName(pairResult.pairType)}</p>
              <p className="text-sm text-[#4A4A5A] leading-relaxed">{pairResult.description}</p>
            </div>
          </div>
        </motion.div>

        {/* 相处建议 */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-base">💡</span>
            <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide">相处建议</h3>
          </div>
          <div className="space-y-3">
            {pairResult.tips.map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-[#E8E8E4]"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ backgroundColor: i === 0 ? (isCatB ? '#8B9DAF' : '#E8A87C') : (isCatA ? '#8B9DAF' : '#E8A87C') }}
                  >
                    {i === 0 ? '你' : 'TA'}
                  </span>
                  <p className="text-sm text-[#4A4A5A] leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div variants={itemVariants} className="mt-6 space-y-3">
          <motion.button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg"
            style={{
              background: heroGradient,
              boxShadow: '0 8px 24px rgba(232,168,124,0.35)',
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            分享配对结果 💞
          </motion.button>
          <Link href="/">
            <button className="w-full py-3 rounded-2xl font-medium text-sm border-2 border-[#E8E8E4] text-[#8B9DAF] bg-white">
              返回首页
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

// ─── 子组件 ──────────────────────────────────────────────────

function BreedCard({
  label,
  breed,
  isCat,
}: {
  label: string;
  breed: typeof BREEDS[number];
  isCat: boolean;
}) {
  const accentColor = isCat ? '#8B9DAF' : '#E8A87C';
  const bgColor = isCat ? '#EEF1F5' : '#FDF3E9';

  return (
    <div className="rounded-2xl p-3.5" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-lg">{isCat ? '🐱' : '🐶'}</span>
        <span className="text-xs font-bold" style={{ color: accentColor }}>{label}</span>
      </div>
      <p className="font-bold text-sm text-[#2C2C2C]">{breed.name}</p>
      <p className="text-xs text-[#8B9DAF] mt-0.5">「{breed.nickname}」</p>
    </div>
  );
}

const PAIR_TYPE_EMOJI: Record<string, string> = {
  'cat-cat': '🌌',
  'cat-dog': '⚡',
  'dog-dog': '🔥',
  'wolf-pure': '🛡️',
  'power-couple': '👑',
  'fox-fox': '🦊',
  'generic': '⚖️',
};

const PAIR_TYPE_NAMES: Record<string, string> = {
  'cat-cat': '平行宇宙型',
  'cat-dog': '互补充电型',
  'dog-dog': '热情碰撞型',
  'wolf-pure': '保护者联盟型',
  'power-couple': '强强对决型',
  'fox-fox': '智者同盟型',
  'generic': '独特组合型',
};

function getPairTypeEmoji(pairType: string): string {
  return PAIR_TYPE_EMOJI[pairType] ?? '💞';
}

function getPairTypeName(pairType: string): string {
  return PAIR_TYPE_NAMES[pairType] ?? '独特组合型';
}

// ─── CP配对介绍页（无 a 参数） ──────────────────────────────────

function PairIntroPage() {
  return (
    <main
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#FAFAF8' }}
    >
      <div
        className="relative px-6 pt-16 pb-10 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #E8A87C 0%, #F4C4A0 100%)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, white, transparent)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-4">💞</div>
          <h1 className="text-2xl font-bold text-white mb-2">CP 配对</h1>
          <p className="text-white/85 text-sm">和 TA 一起测，看看你们的契合度</p>
        </motion.div>
      </div>

      <motion.div
        className="flex-1 px-5 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 mb-4 border border-[#E8E8E4] shadow-sm"
        >
          <h2 className="font-bold text-[#2C2C2C] mb-3 text-base">怎么玩？</h2>
          <div className="space-y-3">
            {[
              { step: '1', text: '你先完成自测，拿到属于你的品种结果' },
              { step: '2', text: '在结果页生成专属配对链接，发给 TA' },
              { step: '3', text: 'TA 完成测试后，看到双方契合度分析' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#E8A87C30', color: '#C07840' }}
                >
                  {step}
                </div>
                <p className="text-sm text-[#4A4A5A] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/quiz" className="block">
            <motion.button
              className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #E8A87C 0%, #F4A460 100%)',
                boxShadow: '0 8px 24px rgba(232, 168, 124, 0.45)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              先完成自测
            </motion.button>
          </Link>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-xs text-[#8B9DAF] mt-4">
          完成测试后，结果页会有配对链接
        </motion.p>
      </motion.div>
    </main>
  );
}

// ─── 错误页 ──────────────────────────────────────────────────

function PairErrorPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#FAFAF8' }}
    >
      <div className="text-center">
        <p className="text-4xl mb-4">🔗</p>
        <h2 className="text-xl font-bold text-[#2C2C2C] mb-2">链接已失效</h2>
        <p className="text-sm text-[#8B9DAF] mb-6">
          这个配对链接看起来有点问题
        </p>
        <Link href="/">
          <button
            className="px-6 py-3 rounded-2xl font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)',
            }}
          >
            返回首页
          </button>
        </Link>
      </div>
    </main>
  );
}

// ─── 默认导出 ─────────────────────────────────────────────────

export default function PairPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen flex items-center justify-center"
          style={{ background: '#FAFAF8' }}
        >
          <div className="text-[#8B9DAF] text-sm">加载中…</div>
        </main>
      }
    >
      <PairPageInner />
    </Suspense>
  );
}
