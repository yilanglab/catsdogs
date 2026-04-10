/**
 * 猫人狗人 - 照镜子差异报告模板
 * executor-content | Phase 3
 * 数据来源：prd/catsdogs-prd.md §5.1 照镜子模式
 *
 * 说明：
 * - 每个维度偏差方向都有具体的解读文案
 * - key 格式：selfLevel_friendLevel（自测档位_他测档位）
 * - 使用函数形式方便插入动态内容
 */

import type { EnergyLevel, StrategyLevel, CoreType } from '../lib/types';

// ─── 能量维度偏差模板 ──────────────────────────────────────

/** 能量维度偏差解读：key = "自测_他测" */
export const ENERGY_DEVIATION_TEMPLATES: Record<
  `${EnergyLevel}_${EnergyLevel}`,
  string
> = {
  // 自测低，他测高
  low_mid:
    'TA 认为自己是安静内敛的人，但在你看来 TA 其实相当随和主动。也许 TA 在熟悉的人面前活力更多地展现出来了。',
  low_high:
    'TA 觉得自己是个安静的人，但你感受到的是满满的活力与存在感。这可能是 TA 在熟人面前才会展现的真实状态。',
  // 自测中，他测低/高
  mid_low:
    'TA 觉得自己还挺随和活跃，但你看到的 TA 更安静、更内收。也许在陌生场合，TA 习惯先观察再出手。',
  mid_high:
    'TA 以为自己节奏稳健，但你眼中的 TA 热情外放、精力充沛。TA 可能低估了自己给周围人带来的能量感。',
  // 自测高，他测低/中
  high_low:
    'TA 觉得自己是个活跃的人，但在你眼里 TA 相当低调内收。有时候，我们以为自己很热闹，其实只是内心很嘈杂。',
  high_mid:
    'TA 觉得自己精力充沛、活跃外放，但你看到的是一个节奏稳健的人。也许 TA 的"高能量"更多表现在思维上，而非行动上。',
  // 一致（无偏差，通常不会触发）
  low_low: '',
  mid_mid: '',
  high_high: '',
};

// ─── 策略维度偏差模板 ──────────────────────────────────────

/** 策略维度偏差解读：key = "自测_他测" */
export const STRATEGY_DEVIATION_TEMPLATES: Record<
  `${StrategyLevel}_${StrategyLevel}`,
  string
> = {
  // 自测纯，他测狐/狼
  pure_fox:
    'TA 觉得自己直来直去、毫无心机，但你观察到 TA 其实相当善于审时度势。TA 的"无害感"可能是一种天然的保护色。',
  pure_wolf:
    'TA 认为自己真诚无害，但你眼中的 TA 颇有掌控欲和领地感。也许 TA 在某些场合展现出了连自己都没意识到的强势。',
  // 自测狐，他测纯/狼
  fox_pure:
    'TA 以为自己颇为灵活变通、善于算计，但在你看来 TA 其实相当真诚直接。或许 TA 的"策略"在你面前从未真正启动。',
  fox_wolf:
    'TA 觉得自己只是情商高、懂变通，但你感受到的是更强的主导欲和压迫感。TA 可能比自己以为的更有控制欲。',
  // 自测狼，他测纯/狐
  wolf_pure:
    'TA 觉得自己目标感强、有掌控欲，但你看到的是一个真诚无害的人。也许在亲近的人面前，TA 的"狼性"完全卸下了。',
  wolf_fox:
    'TA 认为自己审视感强、带有攻击性，但你眼中的 TA 更多是机敏灵活。TA 的"狼系"可能只在特定场合下才会显现。',
  // 一致
  pure_pure: '',
  fox_fox: '',
  wolf_wolf: '',
};

// ─── 内核维度偏差模板 ──────────────────────────────────────

/** 内核维度偏差解读：key = "自测_他测" */
export const CORE_DEVIATION_TEMPLATES: Record<
  `${CoreType}_${CoreType}`,
  string
> = {
  // 自测猫，他测犬
  cat_dog:
    'TA 认为自己独立自主、不在乎外界评价，但你看到的是一个渴望连接、在乎认可的人。也许 TA 把对关系的需求藏得太深了。',
  // 自测犬，他测猫
  dog_cat:
    'TA 觉得自己是个重感情、需要归属感的人，但在你眼里 TA 独立自得、边界清晰。也许在你面前，TA 展现出了更独立的一面。',
  // 一致
  cat_cat: '',
  dog_dog: '',
};

// ─── 综合解读模板 ─────────────────────────────────────────

/** 零偏差：完全一致 */
export const MIRROR_IDENTICAL_MESSAGES = [
  'TA 的自我认知相当精准，你们对 TA 的判断高度吻合。这种"表里如一"其实很少见。',
  '你们看到的是同一个 TA——这说明 TA 是个活得很真实的人，没有在你面前表演。',
  '恭喜你们！认知高度一致意味着 TA 的自我认知非常准确，也意味着你真的懂 TA。',
];

/** 单维度偏差综合总结 */
export function getMirrorSummary(
  selfBreedName: string,
  friendBreedName: string,
  deviationCount: number,
): string {
  if (deviationCount === 0) {
    return `你们眼中的 TA 完全一致：「${selfBreedName}」。TA 的自我认知相当准确。`;
  }
  if (deviationCount === 1) {
    return `TA 眼中自己是「${selfBreedName}」，你眼中 TA 是「${friendBreedName}」，有一处维度不同。`;
  }
  if (deviationCount === 2) {
    return `你们的判断出入不小：TA 认为自己是「${selfBreedName}」，但你看到的是「${friendBreedName}」。`;
  }
  return `三个维度全部出现偏差！TA 眼中的自己「${selfBreedName}」和你眼中的 TA「${friendBreedName}」截然不同。`;
}

/** "真实画像"综合解读 */
export function getRealPortraitDesc(
  outerBreedName: string,
  innerBreedName: string,
): string {
  return `TA 的真实画像可能是：外表是「${outerBreedName}」，内心是「${innerBreedName}」。`;
}
