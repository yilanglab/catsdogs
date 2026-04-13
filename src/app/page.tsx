"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const floatingVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const floatingVariantsDelay = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 0.5,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#FAFAF8] overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 猫系色晕 - 左上 */}
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #B8A9C9, transparent)" }}
        />
        {/* 犬系色晕 - 右下 */}
        <div
          className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #E8A87C, transparent)" }}
        />
        {/* 薄荷色晕 - 右上 */}
        <div
          className="absolute top-1/3 -right-12 w-48 h-48 rounded-full opacity-15 blur-2xl"
          style={{ background: "radial-gradient(circle, #A8D8C8, transparent)" }}
        />
      </div>

      {/* 主内容区 */}
      <motion.div
        className="relative flex flex-col flex-1 items-center justify-center px-6 py-12 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 动物 emoji 浮动区 */}
        <div className="flex items-end gap-6 mb-8">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="text-5xl select-none"
          >
            🐱
          </motion.div>
          <motion.div
            className="text-3xl select-none mb-2 opacity-50"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            ✨
          </motion.div>
          <motion.div
            variants={floatingVariantsDelay}
            animate="animate"
            className="text-5xl select-none"
          >
            🐶
          </motion.div>
        </div>

        {/* 主标题 */}
        <motion.div variants={itemVariants} className="text-center mb-3">
          <h1 className="text-4xl font-bold tracking-tight text-[#2C2C2C]">
            猫人狗人
          </h1>
          <p className="text-sm text-[#8B9DAF] mt-1 tracking-widest font-medium">
            CATS · DOGS · PERSONALITY
          </p>
        </motion.div>

        {/* 副标题 */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[#4A4A5A]/70 text-base leading-relaxed max-w-xs mb-10"
        >
          15 道情境题
          <br />
          揭开你的隐藏动物人格
        </motion.p>

        {/* 三维标签展示 */}
        <motion.div
          variants={itemVariants}
          className="flex gap-2 mb-10 flex-wrap justify-center"
        >
          <DimensionBadge
            emoji="⚡"
            label="能量"
            desc="内收 / 流动 / 外放"
            color="#8B9DAF"
            bg="#EEF1F5"
          />
          <DimensionBadge
            emoji="🧩"
            label="策略"
            desc="纯系 / 狐系 / 狼系"
            color="#D4A574"
            bg="#FDF3E9"
          />
          <DimensionBadge
            emoji="🌀"
            label="内核"
            desc="猫系 / 犬系"
            color="#B8A9C9"
            bg="#F5F2F9"
          />
        </motion.div>

        {/* 品种数量说明 */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-sm border border-[#E8E8E4]">
            <span className="text-lg">🐾</span>
            <span className="text-sm text-[#4A4A5A]">
              <span className="font-bold text-[#2C2C2C] text-base">18</span> 种动物品种等待解锁
            </span>
          </div>
        </motion.div>

        {/* 开始按钮 */}
        <motion.div variants={itemVariants} className="w-full max-w-xs">
          <Link href="/quiz" className="block">
            <motion.button
              className="w-full py-4 rounded-2xl font-semibold text-lg text-white shadow-lg shadow-[#8B9DAF]/30 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                开始测试
                <span className="text-xl">→</span>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* 时长说明 */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[#8B9DAF] text-xs mt-4"
        >
          约 3 分钟 · 无需注册 · 纯前端运行
        </motion.p>

        {/* 分隔线 */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px bg-[#E8E8E4] my-8"
        />

        {/* 社交玩法入口 */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-xs space-y-3"
        >
          <p className="text-center text-xs text-[#8B9DAF] tracking-wider font-medium mb-4">
            更多玩法
          </p>
          <SocialCard
            emoji="🪞"
            title="照镜子"
            desc="让朋友来测你，看看认知差异"
            href="/mirror"
            color="#A8D8C8"
          />
        </motion.div>

      </motion.div>

      {/* 底部版权 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 text-center text-xs text-[#8B9DAF]/50 py-6 safe-bottom"
      >
        猫人狗人 · 三维动物人格测试
      </motion.footer>
    </main>
  );
}

function DimensionBadge({
  emoji,
  label,
  desc,
  color,
  bg,
}: {
  emoji: string;
  label: string;
  desc: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
      style={{ backgroundColor: bg, color }}
    >
      <span>{emoji}</span>
      <span className="font-bold">{label}</span>
      <span className="opacity-70">{desc}</span>
    </div>
  );
}

function SocialCard({
  emoji,
  title,
  desc,
  href,
  color,
}: {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-[#E8E8E4] shadow-sm cursor-pointer"
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${color}30` }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#2C2C2C]">{title}</p>
          <p className="text-xs text-[#8B9DAF] mt-0.5 truncate">{desc}</p>
        </div>
        <span className="text-[#8B9DAF] text-sm">›</span>
      </motion.div>
    </Link>
  );
}
