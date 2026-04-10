'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BREEDS } from '@/data/breeds';
import { parseMirrorUrl, parseResultUrl } from '@/lib/url-codec';
import { generateMirrorReport, getMirrorReportTitle, getMirrorReportSubtitle, getMirrorConclusion, getDimensionChinese } from '@/lib/mirror';
import { resolveDimensions } from '@/lib/scoring';
import { resolveBreedId } from '@/lib/breeds';
import type { MirrorDeviation, Dimension } from '@/lib/types';

// ─── 动画 ───────────────────────────────────────────────────

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

// ─── 内部组件（需要 useSearchParams） ─────────────────────────

function MirrorPageInner() {
  const searchParams = useSearchParams();

  // 解析 from 参数（被测人的自测得分）
  const selfScore = useMemo(() => {
    const fromStr = searchParams.get('from');
    if (!fromStr) return null;
    return parseMirrorUrl(`from=${fromStr}`);
  }, [searchParams]);

  // 解析 e/s/c 参数（朋友的他测得分）
  const friendScore = useMemo(() => {
    return parseResultUrl(searchParams.toString());
  }, [searchParams]);

  const hasFrom = searchParams.has('from');

  // 如果没有 from 参数 → 显示照镜子模式介绍页
  if (!hasFrom) {
    return <MirrorIntroPage />;
  }

  // from 参数解析失败
  if (!selfScore) {
    return <MirrorErrorPage />;
  }

  // 有 from 但没有 e/s/c → 引导朋友去答题
  if (!friendScore) {
    const selfDims = resolveDimensions(selfScore);
    const selfBreedId = resolveBreedId(selfDims);
    const selfBreed = BREEDS.find(b => b.id === selfBreedId);
    return <MirrorStartPage fromCode={searchParams.get('from')!} selfBreed={selfBreed} />;
  }

  // 有完整数据 → 显示对比报告
  const selfDims = resolveDimensions(selfScore);
  const selfBreedId = resolveBreedId(selfDims);
  const selfBreed = BREEDS.find(b => b.id === selfBreedId);

  const friendDims = resolveDimensions(friendScore);
  const friendBreedId = resolveBreedId(friendDims);
  const friendBreed = BREEDS.find(b => b.id === friendBreedId);

  const report = generateMirrorReport(selfScore, friendScore);

  if (!selfBreed || !friendBreed) return <MirrorErrorPage />;

  return <MirrorReportPage report={report} selfBreed={selfBreed} friendBreed={friendBreed} />;
}

// ─── 引导开始页：朋友看到 ─────────────────────────────────────

function MirrorStartPage({
  fromCode,
  selfBreed,
}: {
  fromCode: string;
  selfBreed: typeof BREEDS[number] | undefined;
}) {
  return (
    <main
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#FAFAF8' }}
    >
      {/* 顶部渐变区 */}
      <div
        className="relative px-6 pt-16 pb-10 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #A8D8C8 0%, #6BBFA8 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-5xl mb-4">🪞</div>
          <h1 className="text-2xl font-bold text-white mb-2">你的朋友邀请你</h1>
          <p className="text-white/85 text-base leading-relaxed">
            以你的视角，来评价 TA
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
        {/* 被测人品种提示 */}
        {selfBreed && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-4 mb-4 border border-[#E8E8E4] shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: '#A8D8C820' }}>
                {selfBreed.core === 'cat' ? '🐱' : '🐶'}
              </div>
              <div>
                <p className="text-xs text-[#8B9DAF] mb-0.5">TA 的测试结果</p>
                <p className="font-bold text-sm text-[#2C2C2C]">{selfBreed.name}「{selfBreed.nickname}」</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 模式说明 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 mb-5 border border-[#E8E8E4] shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: '#A8D8C820' }}>
              💬
            </div>
            <div>
              <p className="font-semibold text-sm text-[#2C2C2C] mb-1.5">照镜子模式</p>
              <p className="text-sm text-[#4A4A5A] leading-relaxed">
                用你对 TA 的了解来回答同样的题目——看看你们的认知差距有多大。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 提示：他测视角 */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-4 mb-6 border"
          style={{ backgroundColor: '#F0F9F6', borderColor: '#A8D8C840' }}
        >
          <p className="text-xs text-[#4A7A6A] leading-relaxed">
            📌 作答时，请以<strong>你对这个朋友的了解</strong>来选择选项。
            题目会用「TA」来指代你的朋友，选择最符合 TA 真实反应的答案。
          </p>
        </motion.div>

        {/* 开始按钮 */}
        <motion.div variants={itemVariants}>
          <Link href={`/quiz?from=${fromCode}`} className="block w-full">
            <motion.button
              className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #6BBFA8 0%, #A8D8C8 100%)',
                boxShadow: '0 8px 24px rgba(168, 216, 200, 0.5)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🪞</span>
                开始他测
              </span>
            </motion.button>
          </Link>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-xs text-[#8B9DAF] mt-3">
          约 3 分钟 · 15 道情境题
        </motion.p>
      </motion.div>
    </main>
  );
}

// ─── 报告页：对比结果 ─────────────────────────────────────────

function MirrorReportPage({
  report,
  selfBreed,
  friendBreed,
}: {
  report: ReturnType<typeof generateMirrorReport>;
  selfBreed: typeof BREEDS[number];
  friendBreed: typeof BREEDS[number];
}) {
  const isIdentical = report.isIdentical;
  const themeGradient = isIdentical
    ? 'linear-gradient(135deg, #6BBFA8 0%, #A8D8C8 100%)'
    : 'linear-gradient(135deg, #A8D8C8 0%, #B8A9C9 100%)';
  const themeColor = isIdentical ? '#6BBFA8' : '#A8D8C8';

  const title = getMirrorReportTitle(report);
  const subtitle = getMirrorReportSubtitle(report);
  const conclusion = getMirrorConclusion(report);

  function handleShare() {
    const text = `我让朋友测了我的动物人格\n${title}\n#猫人狗人照镜子`;
    if (navigator.share) {
      navigator.share({ title: '猫人狗人 · 照镜子报告', text, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('链接已复制！');
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-16 pb-12" style={{ background: themeGradient }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(-30%, 30%)' }} />
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
            <span className="text-xs text-white/90">🪞 照镜子报告</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white/80 text-sm leading-relaxed px-4">{subtitle}</p>
        </motion.div>
      </div>

      <motion.div
        className="px-5 -mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 品种对比 */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8E4] mb-4">
          <p className="text-xs font-bold text-[#8B9DAF] mb-3">👤 自测 vs 他测结果</p>
          <div className="grid grid-cols-2 gap-3">
            <BreedCompareCard
              label="TA 眼中的自己"
              breed={selfBreed}
              isMe={true}
            />
            <BreedCompareCard
              label="你眼中的 TA"
              breed={friendBreed}
              isMe={false}
            />
          </div>
          {isIdentical && (
            <div className="mt-3 p-3 rounded-2xl bg-[#F0FBF1] border border-[#B8E4C0]">
              <p className="text-xs text-[#4CAF50] text-center font-medium">
                ✨ 两组结果完全相同！TA 的自我认知出奇准确
              </p>
            </div>
          )}
        </motion.div>

        {/* 偏差详情 */}
        {!isIdentical && report.deviations.length > 0 && (
          <motion.div variants={itemVariants} className="mb-4">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-base">🔍</span>
              <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide">认知偏差详解</h3>
            </div>
            <div className="space-y-3">
              {report.deviations.map((dev) => (
                <DeviationCard key={dev.dimension} deviation={dev} />
              ))}
            </div>
          </motion.div>
        )}

        {/* 综合结论 */}
        <motion.div
          variants={itemVariants}
          className="mb-4 rounded-3xl p-5 border-2"
          style={{ backgroundColor: '#F5F8F7', borderColor: `${themeColor}40` }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
            <div>
              <p className="text-xs font-bold mb-1.5" style={{ color: themeColor }}>综合解读</p>
              <p className="text-sm leading-relaxed text-[#2C2C2C]">{conclusion}</p>
            </div>
          </div>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div variants={itemVariants} className="mt-6 space-y-3">
          <motion.button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg"
            style={{ background: themeGradient, boxShadow: '0 8px 24px rgba(168,216,200,0.4)' }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            分享报告 🪞
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

// ─── 照镜子介绍页（无 from 参数） ──────────────────────────────

function MirrorIntroPage() {
  return (
    <main className="min-h-screen flex flex-col overflow-hidden" style={{ background: '#FAFAF8' }}>
      <div
        className="relative px-6 pt-16 pb-10 text-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #A8D8C8 0%, #6BBFA8 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, white, transparent)', transform: 'translate(30%, -30%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-5xl mb-4">🪞</div>
          <h1 className="text-2xl font-bold text-white mb-2">照镜子</h1>
          <p className="text-white/85 text-sm">让朋友评价你，看看认知差距</p>
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
          <h2 className="font-bold text-[#2C2C2C] mb-3 text-base">什么是照镜子？</h2>
          <div className="space-y-3">
            {[
              { step: '1', text: '你先完成自测，得到你眼中自己的品种' },
              { step: '2', text: '把专属链接发给了解你的朋友' },
              { step: '3', text: '朋友以第三方视角作答同样的题目' },
              { step: '4', text: '对比两份结果，看看认知差距有多大' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: '#A8D8C830', color: '#5BA890' }}
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
                background: 'linear-gradient(135deg, #6BBFA8 0%, #A8D8C8 100%)',
                boxShadow: '0 8px 24px rgba(168, 216, 200, 0.45)',
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
          完成测试后，你会得到可分享的专属镜像链接
        </motion.p>
      </motion.div>
    </main>
  );
}

// ─── 错误页 ─────────────────────────────────────────────────

function MirrorErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#FAFAF8' }}>
      <div className="text-center">
        <p className="text-4xl mb-4">🔗</p>
        <h2 className="text-xl font-bold text-[#2C2C2C] mb-2">链接已失效</h2>
        <p className="text-sm text-[#8B9DAF] mb-6">这个照镜子链接看起来有点问题</p>
        <Link href="/">
          <button className="px-6 py-3 rounded-2xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)' }}>
            返回首页
          </button>
        </Link>
      </div>
    </main>
  );
}

// ─── 子组件 ──────────────────────────────────────────────────

function BreedCompareCard({
  label,
  breed,
  isMe,
}: {
  label: string;
  breed: typeof BREEDS[number];
  isMe: boolean;
}) {
  const isCat = breed.core === 'cat';
  const accentColor = isCat ? '#8B9DAF' : '#E8A87C';
  const bgColor = isCat ? '#EEF1F5' : '#FDF3E9';

  return (
    <div className="rounded-2xl p-3.5" style={{ backgroundColor: bgColor }}>
      <p className="text-xs mb-2" style={{ color: accentColor }}>{label}</p>
      <p className="font-bold text-sm text-[#2C2C2C]">{breed.name}</p>
      <p className="text-xs text-[#8B9DAF] mt-0.5">「{breed.nickname}」</p>
    </div>
  );
}

const DIMENSION_EMOJI: Record<Dimension, string> = {
  energy: '⚡',
  strategy: '🧩',
  core: '🌀',
};

function DeviationCard({ deviation }: { deviation: MirrorDeviation }) {
  const dimName = getDimensionChinese(deviation.dimension);
  const emoji = DIMENSION_EMOJI[deviation.dimension];

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8E8E4]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{emoji}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#A8D8C820] text-[#5BA890]">
          {dimName}维度偏差
        </span>
      </div>
      <p className="text-sm text-[#4A4A5A] leading-relaxed">{deviation.description}</p>
    </div>
  );
}

// ─── 默认导出（带 Suspense） ─────────────────────────────────

export default function MirrorPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAF8' }}>
          <div className="text-[#8B9DAF] text-sm">加载中…</div>
        </main>
      }
    >
      <MirrorPageInner />
    </Suspense>
  );
}
