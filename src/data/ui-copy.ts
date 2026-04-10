/**
 * 猫人狗人 - UI 通用文案
 * executor-content | Phase 2
 * 数据来源：prd/catsdogs-prd.md
 */

// ─── 首页 ─────────────────────────────────────────────────

export const HOME_COPY = {
  title: '猫人狗人',
  subtitle: '三维动物人格测试',
  description: '15 道场景题，从「能量」「策略」「内核」三个维度，精准定位你是哪种猫/狗',
  startButton: '开始测试',
  questionCount: '共 15 题',
  timeEstimate: '约 3-5 分钟',
  tagline: '不止猫/狗二分，而是 18 种具体品种',
} as const;

// ─── 答题页 ──────────────────────────────────────────────

export const QUIZ_COPY = {
  progress: (current: number, total: number) => `${current} / ${total}`,
  progressLabel: '答题进度',
  nextButton: '下一题',
  prevButton: '上一题',
  submitButton: '查看结果',
  mirrorModeHint: '你正在以朋友的视角作答',
  pairModeHint: '完成测试后查看你们的 CP 契合度',
  selectPrompt: '选择最接近你真实反应的选项',
} as const;

// ─── 结果页 ──────────────────────────────────────────────

export const RESULT_COPY = {
  // 第一层：大身份揭晓
  catReveal: '你是猫人 🐱',
  dogReveal: '你是狗人 🐶',
  catSubtitle: '独立、自我驱动、有边界感',
  dogSubtitle: '关系导向、渴望连接、需要归属',

  // 品种卡片
  breedCardLabel: '你的精准品种',
  tagLabel: '标签',
  powersSection: '人格解析',
  superpowerLabel: '超能力',
  weaknessLabel: '软肋',
  heartbreakerLabel: '扎心一句',

  // 维度说明
  dimensionSection: '三维解构',
  energyLabel: '能量',
  strategyLabel: '策略',
  coreLabel: '内核',

  // 能量档位文案
  energyLevels: {
    low: '低能量 · 安静内收',
    mid: '中能量 · 温和流动',
    high: '高能量 · 活跃外放',
  },

  // 策略档位文案
  strategyLevels: {
    pure: '纯系 · 钝感无害',
    fox: '狐系 · 机敏高情商',
    wolf: '狼系 · 审视掌控',
  },

  // 内核档位文案
  coreTypes: {
    cat: '猫系 · 自我驱动',
    dog: '犬系 · 关系驱动',
  },

  // 临界值提示
  coreBorderlineCat: '你身上带有一定的犬系特质',
  coreBorderlineDog: '你身上带有一定的猫系特质',

  // 关系图谱
  relationshipSection: '品种关系',
  bestMatchLabel: '最佳拍档',
  nemesisLabel: '天敌',

  // 分享操作
  shareSection: '分享与玩法',
  shareButton: '分享结果',
  shareImageButton: '生成分享图',
  copyLinkButton: '复制链接',
  inviteMirrorButton: '邀请朋友测测我',
  invitePairButton: '邀请 TA 一起测',
  retestButton: '重新测试',

  // 分享文案模板
  shareText: (breedName: string, nickname: string) =>
    `我测出来是「${breedName}」—— ${nickname}，你来测测是哪种？`,
} as const;

// ─── 照镜子模式 ──────────────────────────────────────────

export const MIRROR_COPY = {
  // 入口提示
  pageTitle: '照镜子模式',
  intro: '你的朋友想知道，在你眼中 TA 是什么品种',
  subIntro: '以 TA 为对象，选择最接近 TA 真实反应的选项',

  // 差异报告
  reportTitle: '认知差异报告',
  selfBreedLabel: 'TA 眼中的自己',
  friendBreedLabel: '你眼中的 TA',

  // 完全一致
  identicalTitle: '表里如一 ✨',
  identicalDesc: 'TA 的自我认知非常准确，你们对 TA 的判断完全一致！',

  // 有偏差
  deviationTitle: '发现认知差异',
  deviationDesc: (count: number) => `你们在 ${count} 个维度上出现了偏差`,

  // 偏差维度文案
  deviationLabels: {
    energy: '能量维度',
    strategy: '策略维度',
    core: '内核维度',
  },

  // 综合解读
  summaryPrefix: 'TA 的真实画像可能是：',
  summaryTemplate: (outerBreed: string, innerCore: string) =>
    `外表是${outerBreed}的特质，内心有${innerCore}的底色`,

  // 操作按钮
  shareReportButton: '分享差异报告',
  selfTestButton: '我也来测一测',
} as const;

// ─── CP 配对模式 ──────────────────────────────────────────

export const PAIR_COPY = {
  // 入口提示
  pageTitle: 'CP 配对',
  intro: '完成测试，看看你们的契合度',

  // 配对结果
  compatibilityLabel: '契合度',
  compatibilityUnit: '分',
  pairTypeLabel: '你们是',

  // 组合类型
  pairTypes: {
    'cat-cat': '平行宇宙型',
    'cat-dog': '互补充电型',
    'dog-dog': '热情碰撞型',
    'wolf-pure': '保护者联盟型',
    'power-couple': '强强联合型',
    'fox-fox': '智者同盟型',
    generic: '均衡搭档型',
  },

  // 组合类型描述
  pairTypeDescriptions: {
    'cat-cat': '猫+猫 = 互不打扰的高级感，但要小心冷到冻住',
    'cat-dog': '猫+狗 = 一个给空间一个给温暖，经典搭配',
    'dog-dog': '狗+狗 = 感情浓度超标，但要注意谁来当理性那个',
    'wolf-pure': '狼+纯 = 一个强一个软，前提是强的那个别太控制',
    'power-couple': '两个强者的组合，能量满满但要注意方向一致',
    'fox-fox': '两个高情商的人在一起，清爽不腻，彼此尊重',
    generic: '均衡搭档，各有所长，互相补位',
  },

  // 相处建议标签
  tipsLabel: '相处建议',
  tipForALabel: '给你的建议',
  tipForBLabel: '给 TA 的建议',

  // 品种并排展示
  meLabel: '你',
  partnerLabel: 'TA',

  // 操作按钮
  shareCardButton: '分享配对结果',
  retestButton: '重新测试',
  inviteOtherButton: '换个人来配对',
} as const;

// ─── 通用 ─────────────────────────────────────────────────

export const COMMON_COPY = {
  // 加载
  loading: '计算中…',
  calculating: '正在分析你的人格维度…',

  // 错误
  invalidUrl: '链接参数有误，请重新测试',
  notFound: '页面不存在',

  // 导航
  backToHome: '返回首页',
  backToResult: '返回结果',

  // 维度名称（简短版）
  dimensions: {
    energy: '能量',
    strategy: '策略',
    core: '内核',
  },

  // 猫犬系标识
  coreTypeLabel: {
    cat: '猫系',
    dog: '犬系',
  },
} as const;
