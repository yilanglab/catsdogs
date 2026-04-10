/**
 * 猫人狗人 - CP 配对组合模板
 * executor-content | Phase 3
 * 数据来源：prd/catsdogs-prd.md §5.2 CP 配对模式
 *
 * 说明：
 * - pairType 由双方内核类型（cat/dog）和策略档位（pure/fox/wolf）组合决定
 * - 契合度分数基于品种关系图谱（bestMatch=高分，nemesis=低分，其他=中等）
 * - 相处建议给出双方各一条提醒
 */

import type { PairType, CoreType, StrategyLevel } from '../lib/types';

// ─── 组合类型判定 ──────────────────────────────────────────

/**
 * 根据双方内核和策略，判断组合类型
 */
export function determinePairType(
  coreA: CoreType,
  stratA: StrategyLevel,
  coreB: CoreType,
  stratB: StrategyLevel,
): PairType {
  // 强强联合：双方都是狼系
  if (stratA === 'wolf' && stratB === 'wolf') return 'power-couple';

  // 保护者联盟：一狼一纯
  if (
    (stratA === 'wolf' && stratB === 'pure') ||
    (stratA === 'pure' && stratB === 'wolf')
  )
    return 'wolf-pure';

  // 狐系同盟：双方都是狐系
  if (stratA === 'fox' && stratB === 'fox') return 'fox-fox';

  // 平行宇宙：双方都是猫核
  if (coreA === 'cat' && coreB === 'cat') return 'cat-cat';

  // 热情碰撞：双方都是犬核
  if (coreA === 'dog' && coreB === 'dog') return 'dog-dog';

  // 互补充电：一猫一犬
  if (
    (coreA === 'cat' && coreB === 'dog') ||
    (coreA === 'dog' && coreB === 'cat')
  )
    return 'cat-dog';

  // 其余通用
  return 'generic';
}

// ─── 组合类型描述 ─────────────────────────────────────────

export const PAIR_TYPE_DATA: Record<
  PairType,
  {
    title: string;
    description: string;
    emoji: string;
  }
> = {
  'cat-cat': {
    title: '平行宇宙型',
    emoji: '🌌',
    description:
      '猫+猫 = 互不打扰的高级感，两个独立灵魂各自发光，没有粘腻，只有默契。但要小心冷到冻住——偶尔主动打破沉默，关系才会流动。',
  },
  'cat-dog': {
    title: '互补充电型',
    emoji: '⚡',
    description:
      '猫+狗 = 一个给空间一个给温暖，经典搭配。猫系给关系留白，犬系填满情感，形成完美的能量循环。',
  },
  'dog-dog': {
    title: '热情碰撞型',
    emoji: '🔥',
    description:
      '狗+狗 = 感情浓度超标，两个人都需要被看见、被爱，在一起热闹非凡。但要注意——谁来当那个理性冷静的人？',
  },
  'wolf-pure': {
    title: '保护者联盟型',
    emoji: '🛡️',
    description:
      '狼+纯 = 一个强一个软，自然形成保护关系。前提是强的那个别把"保护"变成控制，软的那个也别让自己消失在关系里。',
  },
  'power-couple': {
    title: '强强联合型',
    emoji: '👑',
    description:
      '狼+狼 = 两个都有掌控欲的人在一起，能量强强碰撞。关键是方向要一致，否则容易变成权力游戏。一起对外，别对内。',
  },
  'fox-fox': {
    title: '智者同盟型',
    emoji: '🦊',
    description:
      '狐+狐 = 两个都懂得审时度势的人，彼此都清楚对方在算什么，反而形成了一种奇妙的坦诚。高情商的人相互尊重，关系清爽不腻。',
  },
  generic: {
    title: '均衡搭档型',
    emoji: '⚖️',
    description:
      '你们的组合相对均衡，各有所长，互相补位。没有特别强烈的化学反应，但稳定、可靠，是最能长期相处的搭配。',
  },
};

// ─── 契合度计算 ──────────────────────────────────────────

/**
 * 基础契合度分数（基于内核和策略组合）
 * 范围 0-100，最终分数还会加上品种关系图谱加成
 */
export function getBaseCompatibility(
  coreA: CoreType,
  stratA: StrategyLevel,
  coreB: CoreType,
  stratB: StrategyLevel,
): number {
  // 互补充电：猫犬互补，基础分高
  if (
    (coreA === 'cat' && coreB === 'dog') ||
    (coreA === 'dog' && coreB === 'cat')
  ) {
    return 75;
  }

  // 双猫：高度独立，契合但不亲密
  if (coreA === 'cat' && coreB === 'cat') {
    return 65;
  }

  // 双犬：热情相投，但需要平衡
  if (coreA === 'dog' && coreB === 'dog') {
    return 70;
  }

  // 策略相同加分
  if (stratA === stratB) {
    return 68;
  }

  return 60;
}

// ─── 相处建议模板 ─────────────────────────────────────────

/** 通用相处建议（按内核+策略组合） */
export const PAIR_TIPS: Record<
  PairType,
  { forCatCore: string; forDogCore: string; forAny: string }
> = {
  'cat-cat': {
    forCatCore: '适当打破沉默，主动说出"我在想你"——对方也在等这句话。',
    forDogCore: '给彼此足够的独处空间，不用时刻确认关系，安静也是一种陪伴。',
    forAny: '偶尔走出各自的轨道，一起做一件事，关系才会有共同记忆。',
  },
  'cat-dog': {
    forCatCore: '对方的热情是真心的，不是打扰。试着偶尔主动接住，而不是躲开。',
    forDogCore: '给猫系一些空间和时间，TA 不是冷漠，只是需要用自己的节奏来爱你。',
    forAny: '一个给空间，一个给温暖，保持这个默契，你们会是彼此最好的补给。',
  },
  'dog-dog': {
    forCatCore: '两个都渴望被看见——试着先看见对方，再等待被看见。',
    forDogCore: '热情满满，但别忘了留出"冷静对话"的空间，感情也需要理性维护。',
    forAny: '在情绪最高点做决定之前，先缓一缓——激情是好事，但别让它代替沟通。',
  },
  'wolf-pure': {
    forCatCore: '你的强势是保护，但别忘了问对方：TA 想要被保护吗？',
    forDogCore: '接受被照顾的同时，保留自己的声音——你的需求也值得被看见。',
    forAny: '强弱搭配的关键是尊重，而不是依赖。力量要用于支撑，而非掌控。',
  },
  'power-couple': {
    forCatCore: '两个都想赢——在关系里，"我们一起赢"比"我比你强"更值得追求。',
    forDogCore: '把征服欲用在共同目标上，而不是互相较劲，你们会是最强的搭档。',
    forAny: '方向一致时，你们势不可挡；方向不同时，记得回到谈判桌。',
  },
  'fox-fox': {
    forCatCore: '你们都懂得算计，但在这段关系里，试着放下盔甲，真诚一次。',
    forDogCore: '高情商不等于不表达——偶尔说出心里话，关系会更深一层。',
    forAny: '两个聪明人在一起，最重要的是愿意"装傻"——不是每件事都要赢。',
  },
  generic: {
    forCatCore: '稳定不等于无聊——珍惜这种平衡，它比激烈的化学反应更持久。',
    forDogCore: '不必强求刺激，均衡的关系里有最深的安全感。',
    forAny: '你们不需要证明什么，只需要持续地选择彼此就够了。',
  },
};

/**
 * 根据品种关系，获取相处建议
 * @param pairType 组合类型
 * @param coreA A 的内核类型
 * @param coreB B 的内核类型
 * @returns [给A的建议, 给B的建议]
 */
export function getPairTips(
  pairType: PairType,
  coreA: CoreType,
  coreB: CoreType,
): [string, string] {
  const tips = PAIR_TIPS[pairType];

  const tipA = coreA === 'cat' ? tips.forCatCore : tips.forDogCore;
  const tipB = coreB === 'cat' ? tips.forCatCore : tips.forDogCore;

  return [tipA, tipB];
}

// ─── 品种配对特殊文案 ─────────────────────────────────────

/**
 * 特殊品种组合的专属解读（PRD 关系图谱中的高亮组合）
 * key = "breedIdA_breedIdB"（字母序排列）
 */
export const SPECIAL_PAIR_NOTES: Record<string, string> = {
  'bengal_border-collie':
    '两个最强战力的强强联合，目标感和执行力爆表，只要方向一致，没有什么做不到的。',
  'bernese_british-shorthair':
    '两个安静的灵魂，用沉默建立深厚的默契。不需要说太多，靠近就是安心。',
  'doberman_maine-coon':
    '两个沉默的强者，彼此之间有最纯粹的相互认可。话不多，但信任是最坚固的。',
  'husky_tuxedo':
    '混乱联盟快乐加倍！两个乐子人在一起，每天都是限定版表情包，笑死也值了。',
  'ragdoll_german-shepherd':
    '一个美一个扛，完美分工。德牧负责靠谱，布偶负责优雅，各司其职互相成就。',
  'russian-blue_shiba-inu':
    '两个独立灵魂的平行陪伴。互相尊重边界，在适当的距离里欣赏彼此，高级感拉满。',
};
