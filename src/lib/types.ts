/**
 * 猫人狗人 - 核心类型定义
 * executor-logic | Phase 1
 */

// ─── 维度类型 ──────────────────────────────────────────────

/** 三个维度 */
export type Dimension = 'energy' | 'strategy' | 'core';

/** 能量维度档位 */
export type EnergyLevel = 'low' | 'mid' | 'high';

/** 策略维度档位 */
export type StrategyLevel = 'pure' | 'fox' | 'wolf';

/** 内核维度档位 */
export type CoreType = 'cat' | 'dog';

// ─── 得分 ─────────────────────────────────────────────────

/** 三维得分结构（能量/策略 5-15，内核 5-10） */
export interface Score {
  /** 能量维度总分 5-15 */
  energy: number;
  /** 策略维度总分 5-15 */
  strategy: number;
  /** 内核维度总分 5-10 */
  core: number;
}

/** 解析后的维度档位 */
export interface DimensionResult {
  energyLevel: EnergyLevel;
  strategyLevel: StrategyLevel;
  coreType: CoreType;
  /** 是否处于边界值（内核7分=临界猫，8分=临界犬） */
  coreBorderline: boolean;
}

// ─── 品种 ─────────────────────────────────────────────────

/**
 * 18种品种代号（能量_策略_内核）
 * low_pure_cat   = british-shorthair   英国短毛猫
 * mid_pure_cat   = american-shorthair  美国短毛猫
 * high_pure_cat  = tuxedo              奶牛猫
 * low_fox_cat    = russian-blue        俄罗斯蓝猫
 * mid_fox_cat    = ragdoll             布偶猫
 * high_fox_cat   = abyssinian          阿比西尼亚猫
 * low_wolf_cat   = maine-coon          缅因猫
 * mid_wolf_cat   = siamese             暹罗猫
 * high_wolf_cat  = bengal              孟加拉豹猫
 * low_pure_dog   = bernese             伯恩山犬
 * mid_pure_dog   = samoyed             萨摩耶
 * high_pure_dog  = golden-retriever    金毛/拉布拉多
 * low_fox_dog    = shiba-inu           柴犬
 * mid_fox_dog    = corgi               柯基/泰迪
 * high_fox_dog   = husky               哈士奇
 * low_wolf_dog   = doberman            杜宾犬
 * mid_wolf_dog   = german-shepherd     德国牧羊犬
 * high_wolf_dog  = border-collie       边境牧羊犬
 */
export type BreedId =
  | 'british-shorthair'
  | 'american-shorthair'
  | 'tuxedo'
  | 'russian-blue'
  | 'ragdoll'
  | 'abyssinian'
  | 'maine-coon'
  | 'siamese'
  | 'bengal'
  | 'bernese'
  | 'samoyed'
  | 'golden-retriever'
  | 'shiba-inu'
  | 'corgi'
  | 'husky'
  | 'doberman'
  | 'german-shepherd'
  | 'border-collie';

/** 🧠 内在机制 */
export interface InnerMechanism {
  /** 压力反应 */
  stressResponse: string;
  /** 充电方式 */
  rechargeMode: string;
  /** 情绪模式 */
  emotionalPattern: string;
}

/** 💼 职场风格 */
export interface WorkStyle {
  /** 当领导时 */
  asLeader: string;
  /** 当下属时 */
  asFollower: string;
  /** 开会风格 */
  meetingStyle: string;
}

/** ❤️ 恋爱模式 */
export interface LoveStyle {
  /** 心动信号 */
  crushSignal: string;
  /** 雷点 */
  dealBreaker: string;
  /** 理想相处 */
  idealRelationship: string;
}

/** 🤝 社交习惯 */
export interface SocialHabit {
  /** 朋友群角色 */
  friendGroupRole: string;
  /** 社交电量 */
  socialBattery: string;
  /** 友谊雷区 */
  friendshipRedFlag: string;
}

/** 品种档案完整结构 */
export interface Breed {
  id: BreedId;
  /** 品种名称（中文） */
  name: string;
  /** 品种名称（英文） */
  nameEn: string;
  /** 代号/绰号 */
  nickname: string;
  /** 一句话人设 */
  tagline: string;
  /** 三个标签 */
  tags: [string, string, string];
  /** 超能力 */
  superpower: string;
  /** 软肋 */
  weakness: string;
  /** 扎心一句 */
  heartbreaker: string;
  /** 所属内核 */
  core: CoreType;
  /** 能量档位 */
  energyLevel: EnergyLevel;
  /** 策略档位 */
  strategyLevel: StrategyLevel;
  /** 品种代表色（hex） */
  color: string;
  /** 最佳拍档品种ID */
  bestMatch: BreedId;
  /** 天敌品种ID */
  nemesis: BreedId;
  /** 🧠 内在机制 */
  innerMechanism: InnerMechanism;
  /** 💼 职场风格 */
  workStyle: WorkStyle;
  /** ❤️ 恋爱模式 */
  loveStyle: LoveStyle;
  /** 🤝 社交习惯 */
  socialHabit: SocialHabit;
}

// ─── 题目 ─────────────────────────────────────────────────

/** 题目归属维度 */
export type QuestionDimension = Dimension;

/** 单个选项 */
export interface Option {
  /** 选项文字 */
  text: string;
  /** 该选项对应的分值 */
  value: number;
  /** 选项字母标识（A/B/C，仅用于数据定义，展示时可乱序） */
  key: 'A' | 'B' | 'C';
}

/** 单道题目 */
export interface Question {
  /** 题目ID，1-15 */
  id: number;
  /** 题目所属维度 */
  dimension: QuestionDimension;
  /** 题目文本（自测版，第一人称视角） */
  text: string;
  /** 题目文本（他测版，第三人称视角） */
  textMirror: string;
  /** 选项列表（内核题2个，其余3个） */
  options: Option[];
}

// ─── 答题状态 ─────────────────────────────────────────────

/** 答题模式 */
export type QuizMode = 'self' | 'mirror';

/** 单题作答记录 */
export interface Answer {
  questionId: number;
  selectedValue: number;
  dimension: QuestionDimension;
}

/** 答题引擎状态 */
export interface QuizState {
  /** 当前模式 */
  mode: QuizMode;
  /** 当前题目索引（0-14） */
  currentIndex: number;
  /** 已作答列表 */
  answers: Answer[];
  /** 是否完成 */
  isCompleted: boolean;
  /** 照镜子模式：被测人的自测得分（来自URL） */
  mirrorFromScore?: Score;
}

// ─── URL 编解码 ────────────────────────────────────────────

/**
 * URL 参数格式
 * 结果页：?e=9&s=10&c=8
 * 照镜子：?from=e9s10c8
 */
export interface ResultUrlParams {
  e: number; // energy score 5-15
  s: number; // strategy score 5-15
  c: number; // core score 5-10
}

/** 紧凑编码字符串格式：e{n}s{n}c{n}，如 e9s10c8 */
export type CompactScore = string;

// ─── 社交功能 ──────────────────────────────────────────────

/** 认知差异报告 */
export interface MirrorReport {
  /** 被测人自测品种 */
  selfBreed: BreedId;
  /** 朋友他测品种 */
  friendBreed: BreedId;
  /** 被测人自测得分 */
  selfScore: Score;
  /** 朋友他测得分 */
  friendScore: Score;
  /** 产生偏差的维度列表 */
  deviations: MirrorDeviation[];
  /** 是否完全一致（表里如一） */
  isIdentical: boolean;
}

/** 单维度偏差记录 */
export interface MirrorDeviation {
  dimension: Dimension;
  selfLevel: EnergyLevel | StrategyLevel | CoreType;
  friendLevel: EnergyLevel | StrategyLevel | CoreType;
  description: string;
}

// ─── 关系图谱 ─────────────────────────────────────────────

/** 品种关系条目 */
export interface BreedRelationship {
  breedId: BreedId;
  bestMatch: BreedId;
  nemesis: BreedId;
  /** 与最佳拍档的关系描述 */
  bestMatchNote: string;
  /** 与天敌的关系描述 */
  nemesisNote: string;
}

// ─── 分享 ─────────────────────────────────────────────────

/** 分享卡片数据 */
export interface ShareCardData {
  breed: Breed;
  score: Score;
  dimensionResult: DimensionResult;
  shareUrl: string;
}
