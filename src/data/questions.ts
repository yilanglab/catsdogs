/**
 * 猫人狗人 - 15道题目数据
 * executor-content | Phase 1
 * 数据来源：prd/catsdogs-prd.md §3.3 题目内容
 *
 * 说明：
 * - 每道题的选项按 PRD 原始 ABC 定义，展示时前端应随机排序
 * - 内核维度题目只有 A/B 两个选项
 * - textMirror 为他测版（照镜子模式）题目措辞，视角切换为"TA"
 */

import type { Question } from '../lib/types';

export const QUESTIONS: Question[] = [
  // Q1 [能量]
  {
    id: 1,
    dimension: 'energy',
    text: '周五晚上，朋友突然拉了个 10 人群说今晚聚餐，你的第一反应是——',
    textMirror: '周五晚上，朋友突然拉了个 10 人群说今晚聚餐，TA 的第一反应最可能是——',
    options: [
      { key: 'A', text: '假装没看到消息，默默祈祷别人不要 @ 自己', value: 1 },
      { key: 'B', text: '回一个"好呀～几点？"然后继续手头的事', value: 2 },
      { key: 'C', text: '秒回"终于！我来选餐厅！"并开始疯狂 @ 所有人', value: 3 },
    ],
  },

  // Q2 [策略]
  {
    id: 2,
    dimension: 'strategy',
    text: '你在排队买咖啡，前面有人明显在插队。你会——',
    textMirror: '在排队买咖啡时，前面有人明显在插队，TA 最可能会——',
    options: [
      { key: 'A', text: '算了，多等两分钟也没什么，不值得起冲突', value: 1 },
      { key: 'B', text: '不说话，但用恰到好处的眼神和站位让对方自觉退后', value: 2 },
      { key: 'C', text: '直接开口："不好意思，这边在排队哦。"', value: 3 },
    ],
  },

  // Q3 [内核]
  {
    id: 3,
    dimension: 'core',
    text: '加班到很晚终于完成了一个很满意的方案。此刻最让你舒服的是——',
    textMirror: '加班到很晚终于完成了一个很满意的方案，此刻最让 TA 舒服的最可能是——',
    options: [
      { key: 'A', text: '"哇，这个方案逻辑完美、细节漂亮，我太厉害了"', value: 1 },
      { key: 'B', text: '"明天展示的时候大家一定会觉得很棒，老板会认可我"', value: 2 },
    ],
  },

  // Q4 [能量]
  {
    id: 4,
    dimension: 'energy',
    text: '难得的三天小长假，你的理想安排是——',
    textMirror: '难得的三天小长假，TA 的理想安排最可能是——',
    options: [
      { key: 'A', text: '关掉社交软件，窝在家里把想看的书/剧/游戏全部消化掉', value: 1 },
      { key: 'B', text: '约两三个朋友去个不远的地方走走，节奏不紧不松', value: 2 },
      { key: 'C', text: '提前半个月就开始规划路线，行程安排精确到小时', value: 3 },
    ],
  },

  // Q5 [策略]
  {
    id: 5,
    dimension: 'strategy',
    text: '公司团建，被安排和一群不熟的人坐一桌。你会——',
    textMirror: '公司团建被安排和一群不熟的人坐一桌，TA 最可能会——',
    options: [
      { key: 'A', text: '安静吃饭，别人找你聊就聊，不找也无所谓', value: 1 },
      { key: 'B', text: '快速观察谁好相处，找到一两个频率相近的人打开话题', value: 2 },
      { key: 'C', text: '主动端起杯子，一圈下来记住所有人的名字和部门', value: 3 },
    ],
  },

  // Q6 [内核]
  {
    id: 6,
    dimension: 'core',
    text: '和朋友吵了一架后冷静下来，你更倾向于——',
    textMirror: '和朋友吵了一架后冷静下来，TA 更可能倾向于——',
    options: [
      {
        key: 'A',
        text: '自己复盘整件事的逻辑，想清楚是不是自己的问题，如果不是就等对方来找',
        value: 1,
      },
      { key: 'B', text: '主动发消息缓和一下，虽然还在气头上但受不了冷战的感觉', value: 2 },
    ],
  },

  // Q7 [能量]
  {
    id: 7,
    dimension: 'energy',
    text: '你刚到一个陌生城市旅行，最可能的状态是——',
    textMirror: 'TA 刚到一个陌生城市旅行，最可能的状态是——',
    options: [
      { key: 'A', text: '先回酒店待一会儿，等适应了环境再慢慢出门', value: 1 },
      { key: 'B', text: '找一家评分高的本地餐厅，边吃边感受氛围', value: 2 },
      { key: 'C', text: '放下行李就冲出去，漫无目的地走街串巷，生怕错过任何东西', value: 3 },
    ],
  },

  // Q8 [策略]
  {
    id: 8,
    dimension: 'strategy',
    text: '有人在背后说你坏话，而且传到了你耳朵里。你会——',
    textMirror: '有人在背后说 TA 坏话，而且传到了 TA 耳朵里，TA 最可能会——',
    options: [
      { key: 'A', text: '有点难受，但不想管，觉得清者自清', value: 1 },
      { key: 'B', text: '不动声色，但私下和关键人物聊聊天，悄悄把事情摆平', value: 2 },
      { key: 'C', text: '直接找到当事人对质，把话说清楚', value: 3 },
    ],
  },

  // Q9 [内核]
  {
    id: 9,
    dimension: 'core',
    text: '你花了很多心思准备的礼物，对方收到后只是随口说了句"谢谢啊"。你的内心是——',
    textMirror:
      'TA 花了很多心思准备的礼物，对方收到后只是随口说了句"谢谢啊"，TA 的内心最可能是——',
    options: [
      { key: 'A', text: '"嗯，我选这个是因为我觉得它好，他喜不喜欢是他的事"', value: 1 },
      { key: 'B', text: '"就这？他是不是不喜欢？还是我选错了？好失落……"', value: 2 },
    ],
  },

  // Q10 [能量]
  {
    id: 10,
    dimension: 'energy',
    text: '忙碌了一整周，周六早上醒来，你的第一念头是——',
    textMirror: '忙碌了一整周，周六早上醒来，TA 的第一念头最可能是——',
    options: [
      { key: 'A', text: '继续睡，今天谁也别找我', value: 1 },
      { key: 'B', text: '懒洋洋赖会儿床，然后看看有没有什么轻松的安排', value: 2 },
      { key: 'C', text: '立刻查手机，看看今天约了什么、有什么好玩的', value: 3 },
    ],
  },

  // Q11 [策略]
  {
    id: 11,
    dimension: 'strategy',
    text: '你和同事同时竞争一个晋升名额，你的态度是——',
    textMirror: 'TA 和同事同时竞争一个晋升名额，TA 的态度最可能是——',
    options: [
      { key: 'A', text: '尽力就好，如果对方更合适那也没办法', value: 1 },
      { key: 'B', text: '在保持关系融洽的前提下，默默让领导看到自己的不可替代性', value: 2 },
      { key: 'C', text: '明确表达自己想要这个机会，拿出业绩说话', value: 3 },
    ],
  },

  // Q12 [内核]
  {
    id: 12,
    dimension: 'core',
    text: '一个人在家时，你更经常出现的状态是——',
    textMirror: '一个人在家时，TA 更经常出现的状态是——',
    options: [
      { key: 'A', text: '觉得很自在，终于可以不用顾及任何人了', value: 1 },
      {
        key: 'B',
        text: '一开始挺爽，但过一会儿会忍不住给谁发个消息或打个电话',
        value: 2,
      },
    ],
  },

  // Q13 [能量]
  {
    id: 13,
    dimension: 'energy',
    text: '别人形容你时，最常用的说法接近——',
    textMirror: '别人形容 TA 时，最常用的说法最接近——',
    options: [
      { key: 'A', text: '"你是不是不太爱说话？"/"你好安静啊"', value: 1 },
      { key: 'B', text: '"你这人挺好相处的"/"你蛮随和的"', value: 2 },
      { key: 'C', text: '"你精力也太好了吧"/"你在的地方永远不会冷场"', value: 3 },
    ],
  },

  // Q14 [策略]
  {
    id: 14,
    dimension: 'strategy',
    text: '你借给朋友的钱，说好一个月还，现在已经两个月了。你会——',
    textMirror: 'TA 借给朋友的钱，说好一个月还，现在已经两个月了，TA 最可能会——',
    options: [
      { key: 'A', text: '不好意思开口，等对方自己想起来', value: 1 },
      {
        key: 'B',
        text: '找个自然的时机提一句，比如聊到最近开销大的话题时顺便带出来',
        value: 2,
      },
      { key: 'C', text: '直接私信："上次借的钱方便还了吗？"', value: 3 },
    ],
  },

  // Q15 [内核]
  {
    id: 15,
    dimension: 'core',
    text: '如果让你选一种理想的生活状态——',
    textMirror: '如果让 TA 选一种理想的生活状态，TA 最可能选——',
    options: [
      { key: 'A', text: '有自己的空间和节奏，不用迁就别人，自由自在', value: 1 },
      { key: 'B', text: '身边有懂我的人，有稳定的关系，被需要的感觉很踏实', value: 2 },
    ],
  },
];

/** 按维度过滤题目 */
export function getQuestionsByDimension(
  dimension: Question['dimension'],
): Question[] {
  return QUESTIONS.filter((q) => q.dimension === dimension);
}
