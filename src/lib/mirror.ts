/**
 * 猫人狗人 — 照镜子模式逻辑
 *
 * 流程：
 * 1. 用户A完成自测，生成 mirror 链接（from=e{n}s{n}c{n}）
 * 2. 朋友B以第三人称模式完成答题，得到他测得分
 * 3. 前端对比两组得分，生成认知差异报告
 *
 * 本模块负责：
 * - 解析 from 参数获取 A 的自测得分
 * - 对比两组维度档位，生成 MirrorReport
 * - 生成文案描述（维度偏差解读）
 */

import type {
  BreedId,
  CoreType,
  Dimension,
  DimensionResult,
  EnergyLevel,
  MirrorDeviation,
  MirrorReport,
  Score,
  StrategyLevel,
} from './types';
import { parseMirrorUrl } from './url-codec';
import { resolveDimensions } from './scoring';
import { resolveBreedId } from './breeds';

// ─── URL 解析 ────────────────────────────────────────────────

/**
 * 从照镜子页面 URL 解析被测人（A）的自测得分
 * @param search window.location.search 或 URLSearchParams 字符串
 * @returns Score | null
 */
export { parseMirrorUrl as parseMirrorTargetScore };

// ─── 差异报告生成 ────────────────────────────────────────────

/**
 * 生成认知差异报告
 * @param selfScore 被测人（A）的自测得分
 * @param friendScore 朋友（B）对A的他测得分
 */
export function generateMirrorReport(
  selfScore: Score,
  friendScore: Score
): MirrorReport {
  const selfDims = resolveDimensions(selfScore);
  const friendDims = resolveDimensions(friendScore);

  const selfBreed = resolveBreedId(selfDims);
  const friendBreed = resolveBreedId(friendDims);
  const isIdentical = selfBreed === friendBreed;

  const deviations: MirrorDeviation[] = buildDeviations(selfDims, friendDims);

  return {
    selfBreed,
    friendBreed,
    selfScore,
    friendScore,
    deviations,
    isIdentical,
  };
}

/**
 * 逐维度对比，生成偏差列表
 */
function buildDeviations(
  selfDims: DimensionResult,
  friendDims: DimensionResult
): MirrorDeviation[] {
  const deviations: MirrorDeviation[] = [];

  // 能量维度
  if (selfDims.energyLevel !== friendDims.energyLevel) {
    deviations.push({
      dimension: 'energy',
      selfLevel: selfDims.energyLevel,
      friendLevel: friendDims.energyLevel,
      description: describeEnergyDeviation(selfDims.energyLevel, friendDims.energyLevel),
    });
  }

  // 策略维度
  if (selfDims.strategyLevel !== friendDims.strategyLevel) {
    deviations.push({
      dimension: 'strategy',
      selfLevel: selfDims.strategyLevel,
      friendLevel: friendDims.strategyLevel,
      description: describeStrategyDeviation(selfDims.strategyLevel, friendDims.strategyLevel),
    });
  }

  // 内核维度
  if (selfDims.coreType !== friendDims.coreType) {
    deviations.push({
      dimension: 'core',
      selfLevel: selfDims.coreType,
      friendLevel: friendDims.coreType,
      description: describeCoreDeviation(selfDims.coreType, friendDims.coreType),
    });
  }

  return deviations;
}

// ─── 文案生成 ────────────────────────────────────────────────

const ENERGY_LABEL: Record<EnergyLevel, string> = {
  low: '低能量（安静内收型）',
  mid: '中能量（温和流动型）',
  high: '高能量（活跃外放型）',
};

const STRATEGY_LABEL: Record<StrategyLevel, string> = {
  pure: '纯系（真诚无害型）',
  fox: '狐系（机敏高情商型）',
  wolf: '狼系（审视掌控型）',
};

const CORE_LABEL: Record<CoreType, string> = {
  cat: '猫系（自我驱动型）',
  dog: '犬系（关系驱动型）',
};

const ENERGY_DIFF_TEMPLATES: Partial<Record<string, string>> = {
  'low→mid': '你觉得自己更安静内收，但朋友眼中的你其实更温和流动——也许在对方面前，你比平时更放松。',
  'low→high': '你觉得自己低调，但朋友眼中的你精力充沛——也许你的热情在不经意间已经溢出来了。',
  'mid→low': '你觉得自己挺活跃的，但朋友眼中的你更安静——也许你的存在感比你以为的更低调。',
  'mid→high': '你以为自己还算克制，但朋友眼中的你已经是能量中心——你可能低估了自己的感染力。',
  'high→low': '你以为自己精力四射，但朋友眼中的你反而安静——也许你在这段关系中会不自觉地收起自己。',
  'high→mid': '你觉得自己很high，但朋友眼中的你其实挺稳的——也许在熟悉的人面前你会自然降温。',
};

const STRATEGY_DIFF_TEMPLATES: Partial<Record<string, string>> = {
  'pure→fox': '你觉得自己很真诚直接，但朋友眼中的你更会审时度势——也许你的高情商在不知不觉中已经展现了。',
  'pure→wolf': '你觉得自己随和无害，但朋友眼中的你有点强势——也许你的边界感比你意识到的更明显。',
  'fox→pure': '你觉得自己在精于计算，但朋友眼中的你其实很真诚——对方看到的是你更本真的那一面。',
  'fox→wolf': '你觉得自己灵活变通，但朋友眼中的你其实挺有掌控欲——也许你的主见比你以为的更外显。',
  'wolf→pure': '你以为自己很强势，但朋友眼中的你其实挺无害的——也许面对熟悉的人，你会卸下盔甲。',
  'wolf→fox': '你觉得自己很有原则，但朋友眼中的你更机敏灵活——也许你的策略感比你认为的更圆滑。',
};

const CORE_DIFF_TEMPLATES: Record<string, string> = {
  'cat→dog': '你以为自己是自我驱动的猫系，但朋友眼中的你更在乎关系和认可——也许你对连接的渴望比自己愿意承认的更深。',
  'dog→cat': '你以为自己很需要关系和认可，但朋友眼中的你其实很独立——也许你的自我意识比自己以为的更强。',
};

function describeEnergyDeviation(self: EnergyLevel, friend: EnergyLevel): string {
  const key = `${self}→${friend}`;
  return ENERGY_DIFF_TEMPLATES[key] ??
    `你觉得自己是${ENERGY_LABEL[self]}，但朋友眼中的你是${ENERGY_LABEL[friend]}。你的能量状态在不同人面前会有不同的展现。`;
}

function describeStrategyDeviation(self: StrategyLevel, friend: StrategyLevel): string {
  const key = `${self}→${friend}`;
  return STRATEGY_DIFF_TEMPLATES[key] ??
    `你觉得自己是${STRATEGY_LABEL[self]}，但朋友眼中的你是${STRATEGY_LABEL[friend]}。你的处事方式可能比你自己意识到的更多面。`;
}

function describeCoreDeviation(self: CoreType, friend: CoreType): string {
  const key = `${self}→${friend}`;
  return CORE_DIFF_TEMPLATES[key] ??
    `你觉得自己是${CORE_LABEL[self]}，但朋友眼中的你是${CORE_LABEL[friend]}。`;
}

// ─── 报告摘要 ────────────────────────────────────────────────

/**
 * 根据偏差数量和偏差维度生成报告标题
 */
export function getMirrorReportTitle(report: MirrorReport): string {
  if (report.isIdentical) {
    return '你的自我认知出奇准确';
  }
  if (report.deviations.length === 1) {
    return '你有一个隐藏侧面';
  }
  if (report.deviations.length === 2) {
    return '你的外壳和内核，有点出入';
  }
  return '朋友眼中的你，是另一个人';
}

/**
 * 生成报告副标题（一句话总结）
 */
export function getMirrorReportSubtitle(report: MirrorReport): string {
  if (report.isIdentical) {
    return `你眼中的自己和朋友眼中的你，都是【${report.selfBreed}】。表里如一，难得。`;
  }

  const deviatedDimensions = report.deviations.map(d => getDimensionChinese(d.dimension));
  const dims = deviatedDimensions.join('、');

  return `在【${dims}】维度上，你们对你的判断出现了偏差。`;
}

/**
 * 获取维度中文名
 */
export function getDimensionChinese(dimension: Dimension): string {
  const map: Record<Dimension, string> = {
    energy: '能量',
    strategy: '策略',
    core: '内核',
  };
  return map[dimension];
}

/**
 * 生成结论性解读（品种A皮品种B骨）
 */
export function getMirrorConclusion(report: MirrorReport): string {
  if (report.isIdentical) {
    return '你对自己的理解，和朋友对你的理解高度一致。这种清醒和表里如一，是一种难得的自知。';
  }

  return `你的真实画像可能是：外表是【${report.friendBreed}】的气质，内心深处更像【${report.selfBreed}】。` +
    `别人看到的你，和你真正感受到的自己，在某些层面上并不完全一样——这本身也是你的有趣之处。`;
}
