/**
 * 猫人狗人 - 计分引擎
 * executor-logic | Phase 1
 */

import type {
  Answer,
  BreedId,
  CoreType,
  DimensionResult,
  EnergyLevel,
  Score,
  StrategyLevel,
} from './types';

// ─── 维度得分计算 ───────────────────────────────────────────

/**
 * 从答题列表计算三维得分
 * 能量/策略维度：每题1-3分，5题合计5-15
 * 内核维度：每题1-2分，5题合计5-10
 */
export function calculateScore(answers: Answer[]): Score {
  let energy = 0;
  let strategy = 0;
  let core = 0;

  for (const answer of answers) {
    switch (answer.dimension) {
      case 'energy':
        energy += answer.selectedValue;
        break;
      case 'strategy':
        strategy += answer.selectedValue;
        break;
      case 'core':
        core += answer.selectedValue;
        break;
    }
  }

  return { energy, strategy, core };
}

// ─── 维度档位判定 ───────────────────────────────────────────

/**
 * 根据能量总分判定档位
 * 5-8  → low
 * 9-11 → mid
 * 12-15 → high
 */
export function getEnergyLevel(score: number): EnergyLevel {
  if (score <= 8) return 'low';
  if (score <= 11) return 'mid';
  return 'high';
}

/**
 * 根据策略总分判定档位
 * 5-8  → pure
 * 9-11 → fox
 * 12-15 → wolf
 */
export function getStrategyLevel(score: number): StrategyLevel {
  if (score <= 8) return 'pure';
  if (score <= 11) return 'fox';
  return 'wolf';
}

/**
 * 根据内核总分判定档位
 * 5-7  → cat（7分为临界猫，带犬系色彩）
 * 8-10 → dog（8分为临界犬，带猫系色彩）
 */
export function getCoreType(score: number): CoreType {
  return score <= 7 ? 'cat' : 'dog';
}

/**
 * 内核是否处于临界值（7或8分）
 */
export function isCoreBorderline(score: number): boolean {
  return score === 7 || score === 8;
}

/**
 * 解析得分为完整维度结果
 */
export function resolveDimensions(score: Score): DimensionResult {
  return {
    energyLevel: getEnergyLevel(score.energy),
    strategyLevel: getStrategyLevel(score.strategy),
    coreType: getCoreType(score.core),
    coreBorderline: isCoreBorderline(score.core),
  };
}

// ─── 品种判定 ─────────────────────────────────────────────

/** 三维组合 → 品种ID 映射表 */
const BREED_MAP: Record<string, BreedId> = {
  // 猫系内核
  'low-pure-cat':   'british-shorthair',
  'mid-pure-cat':   'american-shorthair',
  'high-pure-cat':  'tuxedo',
  'low-fox-cat':    'russian-blue',
  'mid-fox-cat':    'ragdoll',
  'high-fox-cat':   'abyssinian',
  'low-wolf-cat':   'maine-coon',
  'mid-wolf-cat':   'siamese',
  'high-wolf-cat':  'bengal',
  // 犬系内核
  'low-pure-dog':   'bernese',
  'mid-pure-dog':   'samoyed',
  'high-pure-dog':  'golden-retriever',
  'low-fox-dog':    'shiba-inu',
  'mid-fox-dog':    'corgi',
  'high-fox-dog':   'husky',
  'low-wolf-dog':   'doberman',
  'mid-wolf-dog':   'german-shepherd',
  'high-wolf-dog':  'border-collie',
};

/**
 * 根据维度档位确定品种ID
 */
export function resolveBreed(dimensions: DimensionResult): BreedId {
  const key = `${dimensions.energyLevel}-${dimensions.strategyLevel}-${dimensions.coreType}`;
  const breed = BREED_MAP[key];
  if (!breed) {
    throw new Error(`Unknown breed combination: ${key}`);
  }
  return breed;
}

/**
 * 从Score直接得到品种ID（组合方法）
 */
export function getBreedFromScore(score: Score): BreedId {
  const dimensions = resolveDimensions(score);
  return resolveBreed(dimensions);
}

// ─── 分值校验 ─────────────────────────────────────────────

/**
 * 校验分数合法性
 */
export function validateScore(score: Score): boolean {
  const { energy, strategy, core } = score;
  return (
    Number.isInteger(energy) && energy >= 5 && energy <= 15 &&
    Number.isInteger(strategy) && strategy >= 5 && strategy <= 15 &&
    Number.isInteger(core) && core >= 5 && core <= 10
  );
}

/**
 * 能量维度得分描述
 */
export function describeEnergyLevel(level: EnergyLevel): string {
  const map: Record<EnergyLevel, string> = {
    low:  '低能量 · 安静内收',
    mid:  '中能量 · 温和流动',
    high: '高能量 · 活跃外放',
  };
  return map[level];
}

/**
 * 策略维度得分描述
 */
export function describeStrategyLevel(level: StrategyLevel): string {
  const map: Record<StrategyLevel, string> = {
    pure: '纯系 · 钝感信赖',
    fox:  '狐系 · 机敏高情商',
    wolf: '狼系 · 审视掌控',
  };
  return map[level];
}

/**
 * 内核维度得分描述
 */
export function describeCoreType(type: CoreType, borderline?: boolean): string {
  if (type === 'cat') {
    return borderline ? '猫系内核 · 略带犬系色彩' : '猫系内核 · 自我驱动';
  }
  return borderline ? '犬系内核 · 略带猫系色彩' : '犬系内核 · 关系驱动';
}
