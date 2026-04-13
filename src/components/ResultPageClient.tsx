"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { BREEDS } from "@/data/breeds";
import { parseResultUrl, buildMirrorUrl } from "@/lib/url-codec";
import {
  resolveDimensions,
  describeEnergyLevel,
  describeStrategyLevel,
  describeCoreType,
} from "@/lib/scoring";
import { resolveBreedId } from "@/lib/breeds";
import ShareCardButton from "@/components/ShareCardButton";
import type { Breed, Score } from "@/lib/types";

// ─── 动画配置 ──────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ─── 主组件 ────────────────────────────────────────────────

export default function ResultPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const score = useMemo<Score | null>(() => {
    return parseResultUrl(searchParams.toString());
  }, [searchParams]);

  const result = useMemo(() => {
    if (!score) return null;
    const dimensions = resolveDimensions(score);
    const breedId = resolveBreedId(dimensions);
    const breed = BREEDS.find((b) => b.id === breedId);
    if (!breed) return null;
    return { score, dimensions, breed };
  }, [score]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] px-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🤔</p>
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-2">找不到你的结果</h2>
          <p className="text-[#8B9DAF] text-sm mb-6">
            URL 参数无效，请重新完成测试
          </p>
          <Link href="/quiz">
            <button className="px-6 py-3 rounded-2xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)" }}>
              重新测试
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { breed, dimensions, score: s } = result;
  const isCat = breed.core === "cat";

  // Theme colors
  const themeGradient = isCat
    ? "linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)"
    : "linear-gradient(135deg, #E8A87C 0%, #F4A460 100%)";
  const themeColor = isCat ? "#8B9DAF" : "#E8A87C";
  const themeBg = isCat ? "#EEF1F5" : "#FDF3E9";
  const themeLight = isCat ? "#F5F7FA" : "#FFF8F2";

  const mirrorUrl =
    typeof window !== "undefined"
      ? buildMirrorUrl(s, window.location.origin)
      : "";

  function handleShare() {
    const text = `我是${breed.name}（${breed.nickname}）\n${breed.tagline}\n#猫人狗人性格测试`;
    if (navigator.share) {
      navigator.share({ title: "猫人狗人 · 我的动物人格", text, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("链接已复制！");
    }
  }

  const bestMatchBreed = BREEDS.find((b) => b.id === breed.bestMatch);
  const nemesisBreed = BREEDS.find((b) => b.id === breed.nemesis);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* ── Hero 区域 ── */}
      <div
        className="relative overflow-hidden px-6 pt-16 pb-12"
        style={{ background: themeGradient }}
      >
        {/* 装饰圆圈 */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(-30%, 30%)" }} />

        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* 内核标签 */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
            <span className="text-xs text-white/90">
              {isCat ? "🐱 猫系内核" : "🐶 犬系内核"}
            </span>
          </div>

          {/* 品种名称 */}
          <h1 className="text-3xl font-bold text-white mb-1">{breed.name}</h1>
          <p className="text-white/80 text-sm mb-3">{breed.nameEn}</p>

          {/* 代号 */}
          <div className="inline-flex items-center gap-2 bg-white/25 rounded-2xl px-4 py-2 mb-5">
            <span className="text-white font-bold text-lg">「{breed.nickname}」</span>
          </div>

          {/* 标签组 */}
          <div className="flex flex-wrap justify-center gap-2">
            {breed.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-white/90 bg-white/20 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── 内容区 ── */}
      <motion.div
        className="px-5 -mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 一句话人设卡片 */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 shadow-sm border border-[#E8E8E4] mb-4"
        >
          <p className="text-[15px] leading-relaxed text-[#2C2C2C] font-medium text-center italic">
            「{breed.tagline}」
          </p>
        </motion.div>

        {/* 三维解析 */}
        <motion.div variants={itemVariants} className="mb-4">
          <SectionTitle emoji="🔬" title="三维解析" />
          <div className="space-y-2.5">
            <DimRow
              emoji="⚡"
              label="能量"
              value={describeEnergyLevel(dimensions.energyLevel)}
              score={s.energy}
              max={15}
              color="#8B9DAF"
            />
            <DimRow
              emoji="🧩"
              label="策略"
              value={describeStrategyLevel(dimensions.strategyLevel)}
              score={s.strategy}
              max={15}
              color="#D4A574"
            />
            <DimRow
              emoji="🌀"
              label="内核"
              value={describeCoreType(dimensions.coreType, dimensions.coreBorderline)}
              score={s.core}
              max={10}
              color={isCat ? "#B8A9C9" : "#E8A87C"}
            />
          </div>
        </motion.div>

        {/* 超能力 & 软肋 */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              emoji="⚡"
              title="超能力"
              content={breed.superpower}
              bgColor="#F0F9F4"
              textColor="#3D8A5A"
            />
            <InfoCard
              emoji="💧"
              title="软肋"
              content={breed.weakness}
              bgColor="#FFF4F4"
              textColor="#C05050"
            />
          </div>
        </motion.div>

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

        {/* 扎心一句 */}
        <motion.div
          variants={itemVariants}
          className="mb-4 rounded-3xl p-5 border-2"
          style={{ backgroundColor: themeBg, borderColor: `${themeColor}40` }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">💬</span>
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: themeColor }}>
                扎心一句
              </p>
              <p className="text-sm leading-relaxed text-[#2C2C2C]">
                {breed.heartbreaker}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 最佳拍档 & 天敌 */}
        {(bestMatchBreed || nemesisBreed) && (
          <motion.div variants={itemVariants} className="mb-4">
            <SectionTitle emoji="🤝" title="品种关系" />
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
              {bestMatchBreed && (
                <RelationCard
                  emoji="💝"
                  title="最佳拍档"
                  breed={bestMatchBreed}
                  accentColor="#4CAF50"
                  bgColor="#F0FBF1"
                />
              )}
              {nemesisBreed && (
                <RelationCard
                  emoji="⚔️"
                  title="天敌"
                  breed={nemesisBreed}
                  accentColor="#E57373"
                  bgColor="#FFF4F4"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* 临界提示 */}
        {dimensions.coreBorderline && (
          <motion.div
            variants={itemVariants}
            className="mb-4 rounded-3xl p-4 bg-[#FFF8ED] border border-[#F4D78A]"
          >
            <p className="text-xs text-[#B8902A] leading-relaxed">
              🌗 <strong>边界人格提示：</strong>
              {dimensions.coreType === "cat"
                ? "你的内核略带犬系色彩——灵魂偏猫，但比自己以为的更在意连接与认可。"
                : "你的内核略带猫系色彩——关系驱动，但比别人以为的更需要独立空间。"}
            </p>
          </motion.div>
        )}

        {/* 社交玩法 */}
        <motion.div variants={itemVariants} className="mb-4">
          <SectionTitle emoji="🎮" title="更多玩法" />
          <div className="space-y-3">
            <SocialActionCard
              emoji="🪞"
              title="邀朋友来测测你"
              desc="让朋友用他视角回答，看看认知差异有多大"
              color="#A8D8C8"
              href={mirrorUrl}
            />
          </div>
        </motion.div>

        {/* 分享按钮 */}
        <motion.div variants={itemVariants} className="mt-6 space-y-3 pb-8 safe-bottom">
          <motion.button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg"
            style={{ background: themeGradient, boxShadow: `0 8px 24px ${themeColor}40` }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="flex items-center justify-center gap-2">
              分享结果 ✨
            </span>
          </motion.button>

          {/* 生成分享图 */}
          <ShareCardButton breed={breed} dimensions={dimensions} score={s} />

          <button
            onClick={() => router.push("/quiz")}
            className="w-full py-3 rounded-2xl font-medium text-sm border-2 border-[#E8E8E4] text-[#8B9DAF] bg-white"
          >
            重新测试
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}

// ─── 子组件 ────────────────────────────────────────────────

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <span className="text-base">{emoji}</span>
      <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide">{title}</h3>
    </div>
  );
}

function DimRow({
  emoji,
  label,
  value,
  score,
  max,
  color,
}: {
  emoji: string;
  label: string;
  value: string;
  score: number;
  max: number;
  color: string;
}) {
  const pct = ((score - (max === 15 ? 5 : 5)) / (max - (max === 15 ? 5 : 5))) * 100;
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8E8E4]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">{emoji}</span>
          <span className="text-xs font-bold text-[#2C2C2C]">{label}</span>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}>
          {value.split(" · ")[0]}
        </span>
      </div>
      <div className="h-1.5 bg-[#F0F0EC] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <p className="text-xs text-[#8B9DAF] mt-1.5">{value}</p>
    </div>
  );
}

function InfoCard({
  emoji,
  title,
  content,
  bgColor,
  textColor,
}: {
  emoji: string;
  title: string;
  content: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className="rounded-2xl p-4 border border-transparent" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span>{emoji}</span>
        <span className="text-xs font-bold" style={{ color: textColor }}>
          {title}
        </span>
      </div>
      <p className="text-xs text-[#4A4A5A] leading-relaxed">{content}</p>
    </div>
  );
}

function RelationCard({
  emoji,
  title,
  breed,
  accentColor,
  bgColor,
}: {
  emoji: string;
  title: string;
  breed: Breed;
  accentColor: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-2xl p-3.5 border" style={{ backgroundColor: bgColor, borderColor: `${accentColor}30` }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{emoji}</span>
        <span className="text-xs font-bold" style={{ color: accentColor }}>
          {title}
        </span>
      </div>
      <p className="font-bold text-sm text-[#2C2C2C]">{breed.name}</p>
      <p className="text-xs text-[#8B9DAF] mt-0.5">{breed.nickname}</p>
    </div>
  );
}

function SocialActionCard({
  emoji,
  title,
  desc,
  color,
  href,
}: {
  emoji: string;
  title: string;
  desc: string;
  color: string;
  href: string;
}) {
  function handleClick() {
    if (href) {
      navigator.clipboard?.writeText(href);
      alert("链接已复制，快去分享给朋友吧！");
    }
  }

  return (
    <motion.div
      onClick={handleClick}
      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#E8E8E4] shadow-sm cursor-pointer"
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${color}25` }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#2C2C2C]">{title}</p>
        <p className="text-xs text-[#8B9DAF] mt-0.5">{desc}</p>
      </div>
      <span className="text-[#CACACA] text-sm">›</span>
    </motion.div>
  );
}

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
