/**
 * 猫人狗人 — 品种判定逻辑 (lib)
 * 根据三维度档位组合确定品种，并提供品种相关工具函数
 *
 * 注意：品种完整档案数据在 src/data/breeds.ts
 *       本文件只负责判定逻辑，不包含品种文案数据
 */

import type {
  BreedId,
  CoreType,
  DimensionResult,
  EnergyLevel,
  MirrorDeviation,
  MirrorReport,
  Score,
  StrategyLevel,
} from './types';
import {
  resolveDimensions,
  getEnergyLevel,
  getStrategyLevel,
  getCoreType,
  isCoreBorderline,
} from './scoring';

// ─── 三维组合 → 品种 ID 映射 ─────────────────────────────────

/**
 * 完整映射表：`${energy}-${strategy}-${core}` → BreedId
 *
 * 18种组合（3能量 × 3策略 × 2内核）
 */
export const BREED_MAP: Readonly<Record<string, BreedId>> = {
  // ── 猫系内核 ──
  'low-pure-cat': 'british-shorthair',   // 英国短毛猫 · 佛系禅师
  'mid-pure-cat': 'american-shorthair',  // 美国短毛猫 · 随和室友
  'high-pure-cat': 'tuxedo',             // 奶牛猫     · 神经质乐子人
  'low-fox-cat': 'russian-blue',         // 俄罗斯蓝猫 · 清冷智性恋
  'mid-fox-cat': 'ragdoll',              // 布偶猫     · 优雅利己者
  'high-fox-cat': 'abyssinian',          // 阿比西尼亚猫 · 聪明探险家
  'low-wolf-cat': 'maine-coon',          // 缅因猫     · 威严领主
  'mid-wolf-cat': 'siamese',             // 暹罗猫     · 强势管理者
  'high-wolf-cat': 'bengal',             // 孟加拉豹猫 · 野心征服者
  // ── 犬系内核 ──
  'low-pure-dog': 'bernese',             // 伯恩山犬   · 治愈大熊
  'mid-pure-dog': 'samoyed',             // 萨摩耶     · 甜美天使
  'high-pure-dog': 'golden-retriever',   // 金毛/拉布拉多 · 燃烧小太阳
  'low-fox-dog': 'shiba-inu',            // 柴犬       · 倔强哲学家
  'mid-fox-dog': 'corgi',                // 柯基/泰迪  · 精明社交家
  'high-fox-dog': 'husky',               // 哈士奇     · 反差表演家
  'low-wolf-dog': 'doberman',            // 杜宾犬     · 克制守望者
  'mid-wolf-dog': 'german-shepherd',     // 德国牧羊犬 · 靠谱执行官
  'high-wolf-dog': 'border-collie',      // 边境牧羊犬 · 焦虑策略家
} as const;

// ─── 品种判定核心函数 ────────────────────────────────────────

/**
 * 根据维度档位组合确定品种ID
 * @throws 如果组合无效（理论上不会发生，除非传入非法 DimensionResult）
 */
export function resolveBreedId(dimensions: DimensionResult): BreedId {
  const key = `${dimensions.energyLevel}-${dimensions.strategyLevel}-${dimensions.coreType}`;
  const breedId = BREED_MAP[key];
  if (!breedId) {
    throw new Error(`[breeds] 无效的维度组合: ${key}`);
  }
  return breedId;
}

/**
 * 从得分直接推导品种ID（快捷方法）
 */
export function getBreedIdFromScore(score: Score): BreedId {
  const dimensions = resolveDimensions(score);
  return resolveBreedId(dimensions);
}

/**
 * 从维度档位字符串快速查找品种（供内部使用）
 */
export function getBreedIdByKey(
  energy: EnergyLevel,
  strategy: StrategyLevel,
  core: CoreType
): BreedId {
  return BREED_MAP[`${energy}-${strategy}-${core}`] as BreedId;
}

// ─── 内核类型判断 ────────────────────────────────────────────

/**
 * 判断一个品种是猫系还是犬系
 */
export function getBreedCore(breedId: BreedId): CoreType {
  const catBreeds: BreedId[] = [
    'british-shorthair', 'american-shorthair', 'tuxedo',
    'russian-blue', 'ragdoll', 'abyssinian',
    'maine-coon', 'siamese', 'bengal',
  ];
  return catBreeds.includes(breedId) ? 'cat' : 'dog';
}

/**
 * 判断两个品种是否同系（同为猫/同为犬）
 */
export function isSameCore(breedA: BreedId, breedB: BreedId): boolean {
  return getBreedCore(breedA) === getBreedCore(breedB);
}

// ─── 维度差异分析（照镜子模式） ──────────────────────────────

/**
 * 比较自测与他测的维度差异，生成差异报告
 */
export function analyzeMirrorDiff(
  selfScore: Score,
  friendScore: Score
): MirrorReport {
  const selfDims = resolveDimensions(selfScore);
  const friendDims = resolveDimensions(friendScore);

  const selfBreed = resolveBreedId(selfDims);
  const friendBreed = resolveBreedId(friendDims);
  const isIdentical = selfBreed === friendBreed;

  const deviations: MirrorDeviation[] = [];

  // 能量维度对比
  if (selfDims.energyLevel !== friendDims.energyLevel) {
    deviations.push({
      dimension: 'energy',
      selfLevel: selfDims.energyLevel,
      friendLevel: friendDims.energyLevel,
      description: generateEnergyDiffDesc(selfDims.energyLevel, friendDims.energyLevel),
    });
  }

  // 策略维度对比
  if (selfDims.strategyLevel !== friendDims.strategyLevel) {
    deviations.push({
      dimension: 'strategy',
      selfLevel: selfDims.strategyLevel,
      friendLevel: friendDims.strategyLevel,
      description: generateStrategyDiffDesc(selfDims.strategyLevel, friendDims.strategyLevel),
    });
  }

  // 内核维度对比
  if (selfDims.coreType !== friendDims.coreType) {
    deviations.push({
      dimension: 'core',
      selfLevel: selfDims.coreType,
      friendLevel: friendDims.coreType,
      description: generateCoreDiffDesc(selfDims.coreType, friendDims.coreType),
    });
  }

  return {
    selfBreed,
    friendBreed,
    selfScore,
    friendScore,
    deviations,
    isIdentical,
  };
}

// ─── 差异描述生成 ────────────────────────────────────────────

const ENERGY_LABEL: Record<EnergyLevel, string> = {
  low: '低能量（安静内收）',
  mid: '中能量（温和流动）',
  high: '高能量（活跃外放）',
};

const STRATEGY_LABEL: Record<StrategyLevel, string> = {
  pure: '纯系（真诚无害）',
  fox: '狐系（机敏高情商）',
  wolf: '狼系（审视掌控）',
};

const CORE_LABEL: Record<CoreType, string> = {
  cat: '猫系（自我驱动）',
  dog: '犬系（关系驱动）',
};

function generateEnergyDiffDesc(self: EnergyLevel, friend: EnergyLevel): string {
  return `你觉得自己是${ENERGY_LABEL[self]}，而朋友眼中的你是${ENERGY_LABEL[friend]}。` +
    `也许你的能量状态在不同场合有差异，对方看到的是你更外在的一面。`;
}

function generateStrategyDiffDesc(self: StrategyLevel, friend: StrategyLevel): string {
  return `你觉得自己是${STRATEGY_LABEL[self]}，而朋友眼中的你是${STRATEGY_LABEL[friend]}。` +
    `这说明你的处事方式可能比你自己意识到的更复杂，或者你在不同关系中展现了不同的策略。`;
}

function generateCoreDiffDesc(self: CoreType, friend: CoreType): string {
  if (self === 'cat' && friend === 'dog') {
    return `你觉得自己是猫系（自我驱动），但朋友眼中的你更像犬系（关系驱动）。` +
      `也许你比自己以为的更在意他人的看法和认可。`;
  }
  return `你觉得自己是犬系（关系驱动），但朋友眼中的你更像猫系（自我驱动）。` +
    `也许你的独立面貌在外人看来比你内心感受到的更强烈。`;
}

// ─── 契合度计算（CP配对模式） ────────────────────────────────

/**
 * 最佳拍档 / 天敌 关系表
 * Key: `${breedA}:${breedB}` （不分顺序，两个方向均存储）
 */
export const BEST_MATCH_MAP: Readonly<Record<BreedId, BreedId>> = {
  'british-shorthair': 'bernese',
  'american-shorthair': 'samoyed',
  'tuxedo': 'husky',
  'russian-blue': 'shiba-inu',
  'ragdoll': 'german-shepherd',
  'abyssinian': 'corgi',
  'maine-coon': 'doberman',
  'siamese': 'samoyed',
  'bengal': 'border-collie',
  'bernese': 'british-shorthair',
  'samoyed': 'siamese',
  'golden-retriever': 'american-shorthair',
  'shiba-inu': 'russian-blue',
  'corgi': 'abyssinian',
  'husky': 'tuxedo',
  'doberman': 'maine-coon',
  'german-shepherd': 'ragdoll',
  'border-collie': 'bengal',
} as const;

export const NEMESIS_MAP: Readonly<Record<BreedId, BreedId>> = {
  'british-shorthair': 'siamese',
  'american-shorthair': 'bengal',
  'tuxedo': 'doberman',
  'russian-blue': 'golden-retriever',
  'ragdoll': 'border-collie',
  'abyssinian': 'bernese',
  'maine-coon': 'tuxedo',
  'siamese': 'shiba-inu',
  'bengal': 'british-shorthair',
  'bernese': 'bengal',
  'samoyed': 'russian-blue',
  'golden-retriever': 'maine-coon',
  'shiba-inu': 'golden-retriever',
  'corgi': 'maine-coon',
  'husky': 'doberman',
  'doberman': 'husky',
  'german-shepherd': 'tuxedo',
  'border-collie': 'bernese',
} as const;

/**
 * 计算两个品种的契合度（0-100）
 * 基于品种关系图谱 + 维度相似度
 */
export function calculateCompatibility(breedA: BreedId, breedB: BreedId): number {
  // 最佳拍档：90-100
  if (BEST_MATCH_MAP[breedA] === breedB || BEST_MATCH_MAP[breedB] === breedA) {
    return 92 + Math.floor(Math.random() * 8); // 92-99，避免总是100
  }
  // 天敌：10-30
  if (NEMESIS_MAP[breedA] === breedB || NEMESIS_MAP[breedB] === breedA) {
    return 15 + Math.floor(Math.random() * 15); // 15-29
  }

  // 相同品种：75-85（自测）
  if (breedA === breedB) {
    return 78 + Math.floor(Math.random() * 7);
  }

  // 同系（猫+猫 或 犬+犬）：55-75
  if (isSameCore(breedA, breedB)) {
    return 55 + Math.floor(Math.random() * 20);
  }

  // 异系（猫+犬）：60-80（互补效应）
  return 60 + Math.floor(Math.random() * 20);
}

/**
 * 确定性契合度（不含随机，用于SSR/分享场景）
 * 使用breedId的hash确保同一对总是得到相同分数
 */
export function calculateCompatibilityStable(breedA: BreedId, breedB: BreedId): number {
  if (BEST_MATCH_MAP[breedA] === breedB || BEST_MATCH_MAP[breedB] === breedA) {
    return 95;
  }
  if (NEMESIS_MAP[breedA] === breedB || NEMESIS_MAP[breedB] === breedA) {
    return 22;
  }
  if (breedA === breedB) return 80;
  if (isSameCore(breedA, breedB)) return 65;
  return 72; // 异系互补
}
