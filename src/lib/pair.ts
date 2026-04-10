/**
 * 猫人狗人 — CP配对模式逻辑
 *
 * 流程：
 * 1. 用户A完成测试，生成配对链接（a=e{n}s{n}c{n}）
 * 2. 用户B打开链接完成自己的测试
 * 3. 前端拿到双方得分，生成关系分析卡
 *
 * 本模块负责：
 * - 解析 a 参数获取A的得分
 * - 组合类型判定（猫猫/猫狗/狗狗 × 策略组合）
 * - 契合度计算
 * - 关系解读文案生成
 */

import type {
  BreedId,
  CoreType,
  PairResult,
  PairType,
  Score,
  StrategyLevel,
} from './types';
import { parsePairUrl } from './url-codec';
import { resolveDimensions } from './scoring';
import { resolveBreedId, calculateCompatibilityStable, BEST_MATCH_MAP, NEMESIS_MAP } from './breeds';

// ─── URL 解析 ────────────────────────────────────────────────

/**
 * 从配对页面 URL 解析用户A的得分
 * @param search window.location.search 或 URLSearchParams 字符串
 * @returns Score | null
 */
export { parsePairUrl as parsePairScoreA };

// ─── 组合类型判定 ────────────────────────────────────────────

/**
 * 根据双方的内核和策略确定组合类型
 */
export function determinePairType(
  coreA: CoreType,
  coreB: CoreType,
  strategyA: StrategyLevel,
  strategyB: StrategyLevel
): PairType {
  // 先判断强特征组合
  const hasWolf = strategyA === 'wolf' || strategyB === 'wolf';
  const hasPure = strategyA === 'pure' || strategyB === 'pure';

  if (strategyA === 'wolf' && strategyB === 'wolf') return 'power-couple';
  if (strategyA === 'fox' && strategyB === 'fox') return 'fox-fox';
  if (hasWolf && hasPure) return 'wolf-pure';

  // 按内核组合
  if (coreA === 'cat' && coreB === 'cat') return 'cat-cat';
  if (coreA === 'dog' && coreB === 'dog') return 'dog-dog';
  return 'cat-dog'; // 猫+犬 或 犬+猫，统一为互补型
}

// ─── 关系解读文案 ────────────────────────────────────────────

interface PairTypeContent {
  title: string;
  interpretation: string;
  tipForCatOrA: string;
  tipForDogOrB: string;
}

const PAIR_TYPE_CONTENT: Record<PairType, PairTypeContent> = {
  'cat-cat': {
    title: '平行宇宙型',
    interpretation:
      '你们都是独立的灵魂，都在各自的轨道上运转。两个猫人在一起有一种高级的互不打扰感，但也要小心——' +
      '如果都在等对方先开口，关系可能会冷到冻住。',
    tipForCatOrA: '偶尔主动靠近一下，不会伤害你的独立性。',
    tipForDogOrB: '试着接受对方的安静，那不是冷漠，是尊重。',
  },
  'cat-dog': {
    title: '互补充电型',
    interpretation:
      '一个给空间，一个给温暖，经典的互补搭配。猫人的独立给犬人呼吸感，犬人的热情给猫人安全感。' +
      '只要彼此理解各自的充电方式，这是很稳的组合。',
    tipForCatOrA: '偶尔回应对方的热情，哪怕只是一个微笑，对 TA 来说意义巨大。',
    tipForDogOrB: '不要把对方的独处需求理解为拒绝，那只是 TA 在充电。',
  },
  'dog-dog': {
    title: '热情碰撞型',
    interpretation:
      '两个犬人在一起，感情浓度超标，快乐加倍，热闹非凡。但也要注意——两个人都想被关注、被需要，' +
      '谁来当那个理性的那个？记得留出一点安静的空间给彼此。',
    tipForCatOrA: '你们之间不缺热情，缺的是偶尔的冷静和边界感。',
    tipForDogOrB: '你不需要用不停的付出来维持这段关系，对方不会因为你"停下来"就跑掉。',
  },
  'wolf-pure': {
    title: '保护者联盟型',
    interpretation:
      '一个强一个软，一个领一个跟，表面上不平衡，实际上是互补的安全感结构。' +
      '狼系提供方向感和安全感，纯系提供接纳和无条件的信任。' +
      '前提是：强的那个别太控制，软的那个要有自己的声音。',
    tipForCatOrA: '你的保护欲是美好的，但记得问一下对方需不需要——不是所有人都想被"管"。',
    tipForDogOrB: '你值得被依靠，但也要记得表达自己的需求，不要只是配合。',
  },
  'power-couple': {
    title: '强强对决型',
    interpretation:
      '两个狼系在一起，能量巨大，目标清晰，合则双赢，分则两伤。' +
      '你们都有很强的主见和掌控欲，关键是找到"共同目标"而不是互相较劲。' +
      '如果能对准同一个方向，你们会是最强的搭档。',
    tipForCatOrA: '让出一些控制权不代表你输了，有时候"放手"才是更高明的策略。',
    tipForDogOrB: '同上——你们都需要学会这一课。',
  },
  'fox-fox': {
    title: '智者同盟型',
    interpretation:
      '两个狐系在一起，双方都善于察言观色，懂得审时度势，相处极度高效也极度舒适。' +
      '你们都知道分寸，都不会越界，关系优雅而默契。' +
      '但也要小心——如果两个人都戴着面具，谁来先摘下来？',
    tipForCatOrA: '适时展示你真实的样子，对方值得看见那个没有计算的你。',
    tipForDogOrB: '同上——深度只会在真实中生长，高情商也可以用来靠近，不只是用来保持距离。',
  },
  'generic': {
    title: '独特组合型',
    interpretation:
      '你们的组合有自己独特的化学反应，不完全符合某一种固定模式。' +
      '这反而意味着你们之间有更多可以探索的空间。',
    tipForCatOrA: '保持好奇心，去了解对方的逻辑和节奏。',
    tipForDogOrB: '不要急着定义这段关系，先享受相处的过程。',
  },
};

// ─── 最终配对结果生成 ────────────────────────────────────────

/**
 * 生成完整的 CP 配对结果
 * @param scoreA 用户A的得分
 * @param scoreB 用户B的得分
 */
export function generatePairResult(scoreA: Score, scoreB: Score): PairResult {
  const dimsA = resolveDimensions(scoreA);
  const dimsB = resolveDimensions(scoreB);

  const breedA = resolveBreedId(dimsA);
  const breedB = resolveBreedId(dimsB);

  const isBestMatch =
    BEST_MATCH_MAP[breedA] === breedB || BEST_MATCH_MAP[breedB] === breedA;
  const isNemesis =
    NEMESIS_MAP[breedA] === breedB || NEMESIS_MAP[breedB] === breedA;

  const compatibility = calculateCompatibilityStable(breedA, breedB);

  const pairType = determinePairType(
    dimsA.coreType,
    dimsB.coreType,
    dimsA.strategyLevel,
    dimsB.strategyLevel
  );

  const content = PAIR_TYPE_CONTENT[pairType] ?? PAIR_TYPE_CONTENT['generic'];

  // 如果是最佳拍档或天敌，追加特殊提示
  let interpretation = content.interpretation;
  if (isBestMatch) {
    interpretation += `\n\n✨ 特别提示：${breedA} 和 ${breedB} 在品种关系图谱中是「最佳拍档」——你们天生合得来！`;
  } else if (isNemesis) {
    interpretation += `\n\n⚡ 特别提示：${breedA} 和 ${breedB} 在品种关系图谱中是「天敌」——相处需要更多理解和包容，但也可能因此碰出意想不到的火花。`;
  }

  return {
    breedA,
    breedB,
    scoreA,
    scoreB,
    compatibility,
    pairType,
    description: interpretation,
    tips: [content.tipForCatOrA, content.tipForDogOrB],
  };
}

// ─── 工具函数 ────────────────────────────────────────────────

/**
 * 获取配对组合类型中文名
 */
export function getPairTypeName(pairType: PairType): string {
  return PAIR_TYPE_CONTENT[pairType]?.title ?? '独特组合型';
}

/**
 * 获取契合度等级描述
 */
export function getCompatibilityLevel(score: number): {
  level: 'excellent' | 'good' | 'moderate' | 'challenging';
  label: string;
  description: string;
} {
  if (score >= 85) {
    return {
      level: 'excellent',
      label: '天作之合',
      description: '你们简直是命中注定的搭配。',
    };
  }
  if (score >= 70) {
    return {
      level: 'good',
      label: '相处舒适',
      description: '你们有很好的基础，稍加用心就能很好。',
    };
  }
  if (score >= 50) {
    return {
      level: 'moderate',
      label: '互有碰撞',
      description: '你们各有棱角，但碰撞也是一种化学反应。',
    };
  }
  return {
    level: 'challenging',
    label: '势均力敌',
    description: '你们是彼此的挑战者，相处需要更多磨合，但也可能成就彼此。',
  };
}

/**
 * 判断A是否为猫系（用于UI展示逻辑）
 */
export function isCatBreed(breedId: BreedId): boolean {
  const catBreeds: BreedId[] = [
    'british-shorthair', 'american-shorthair', 'tuxedo',
    'russian-blue', 'ragdoll', 'abyssinian',
    'maine-coon', 'siamese', 'bengal',
  ];
  return catBreeds.includes(breedId);
}
