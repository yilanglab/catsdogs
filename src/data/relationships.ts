/**
 * 猫人狗人 - 品种关系图谱数据
 * executor-content | Phase 1
 * 数据来源：prd/catsdogs-prd.md §4.2 品种关系图谱
 */

import type { BreedRelationship } from '../lib/types';

export const BREED_RELATIONSHIPS: BreedRelationship[] = [
  {
    breedId: 'british-shorthair',
    bestMatch: 'bernese',
    nemesis: 'siamese',
    bestMatchNote: '两个安静的灵魂互不打扰',
    nemesisNote: '受不了被管',
  },
  {
    breedId: 'american-shorthair',
    bestMatch: 'samoyed',
    nemesis: 'bengal',
    bestMatchNote: '两个好脾气在一起如沐春风',
    nemesisNote: '被能量碾压',
  },
  {
    breedId: 'tuxedo',
    bestMatch: 'husky',
    nemesis: 'doberman',
    bestMatchNote: '两个乐子人一拍即合',
    nemesisNote: '完全不在一个频道',
  },
  {
    breedId: 'russian-blue',
    bestMatch: 'shiba-inu',
    nemesis: 'golden-retriever',
    bestMatchNote: '两个高冷的灵魂相互尊重',
    nemesisNote: '热情过载让蓝猫窒息',
  },
  {
    breedId: 'ragdoll',
    bestMatch: 'german-shepherd',
    nemesis: 'border-collie',
    bestMatchNote: '一个美一个扛，完美分工',
    nemesisNote: '两个人都在算计太累了',
  },
  {
    breedId: 'abyssinian',
    bestMatch: 'corgi',
    nemesis: 'bernese',
    bestMatchNote: '都聪明都有趣聊天不会冷场',
    nemesisNote: '太慢了跟不上节奏',
  },
  {
    breedId: 'maine-coon',
    bestMatch: 'doberman',
    nemesis: 'tuxedo',
    bestMatchNote: '两个沉默的强者互相认可',
    nemesisNote: '混乱 vs 秩序水火不容',
  },
  {
    breedId: 'siamese',
    bestMatch: 'samoyed',
    nemesis: 'shiba-inu',
    bestMatchNote: '一个爱管一个乖乖被管',
    nemesisNote: '两个犟的谁也不让谁',
  },
  {
    breedId: 'bengal',
    bestMatch: 'border-collie',
    nemesis: 'british-shorthair',
    bestMatchNote: '两个野心家互相激励',
    nemesisNote: '一个要征服世界一个只想躺平',
  },
  {
    breedId: 'bernese',
    bestMatch: 'british-shorthair',
    nemesis: 'bengal',
    bestMatchNote: '安静的默契不需要语言',
    nemesisNote: '太激烈了承受不住',
  },
  {
    breedId: 'samoyed',
    bestMatch: 'siamese',
    nemesis: 'russian-blue',
    bestMatchNote: '被管着反而有安全感',
    nemesisNote: '热脸贴冷屁股',
  },
  {
    breedId: 'golden-retriever',
    bestMatch: 'american-shorthair',
    nemesis: 'maine-coon',
    bestMatchNote: '暖阳照到温和的人身上刚刚好',
    nemesisNote: '热情被一面墙挡回来',
  },
  {
    breedId: 'shiba-inu',
    bestMatch: 'russian-blue',
    nemesis: 'golden-retriever',
    bestMatchNote: '两个独立灵魂的平行陪伴',
    nemesisNote: '太粘让柴犬窒息',
  },
  {
    breedId: 'corgi',
    bestMatch: 'abyssinian',
    nemesis: 'maine-coon',
    bestMatchNote: '双商都在线旗鼓相当',
    nemesisNote: '太强势柯基玩不转',
  },
  {
    breedId: 'husky',
    bestMatch: 'tuxedo',
    nemesis: 'doberman',
    bestMatchNote: '混乱联盟快乐加倍',
    nemesisNote: '一个放飞一个克制合不来',
  },
  {
    breedId: 'doberman',
    bestMatch: 'maine-coon',
    nemesis: 'husky',
    bestMatchNote: '沉默中的相互认可和信任',
    nemesisNote: '太吵太乱受不了',
  },
  {
    breedId: 'german-shepherd',
    bestMatch: 'ragdoll',
    nemesis: 'tuxedo',
    bestMatchNote: '一个靠谱一个优雅互相成就',
    nemesisNote: '无法理解对方的行为逻辑',
  },
  {
    breedId: 'border-collie',
    bestMatch: 'bengal',
    nemesis: 'bernese',
    bestMatchNote: '两个最强战力的强强联合',
    nemesisNote: '一个焦虑一个佛系完全不同步',
  },
];

/** 通过品种ID快速获取关系数据 */
export const RELATIONSHIP_MAP = new Map(
  BREED_RELATIONSHIPS.map((r) => [r.breedId, r]),
);
