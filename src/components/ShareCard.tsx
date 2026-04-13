'use client';

/**
 * ShareCard — 结果分享长图
 *
 * 固定宽度 375px，高度自适应内容。
 * 包含结果页所有内容板块：Hero + 人设 + 三维 + 超能力/软肋 +
 * 4个深度画像板块 + 扎心一句 + 品种关系 + 底部水印。
 *
 * 规则：
 * - 纯 inline styles（html2canvas 兼容）
 * - 不用 Framer Motion
 * - 不用 Tailwind class
 */

import React from 'react';
import { BREEDS } from '@/data/breeds';
import type { Breed, DimensionResult, Score } from '@/lib/types';

interface ShareCardProps {
  breed: Breed;
  dimensions: DimensionResult;
  score: Score;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const ENERGY_LABEL: Record<string, string> = { low: '低能量 · 安静内收', mid: '中能量 · 温和流动', high: '高能量 · 活跃外放' };
const STRATEGY_LABEL: Record<string, string> = { pure: '纯系 · 钝感无害', fox: '狐系 · 机敏高情商', wolf: '狼系 · 审视掌控' };
const CORE_LABEL: Record<string, string> = { cat: '猫系 · 自我驱动', dog: '犬系 · 关系驱动' };

const ENERGY_SHORT: Record<string, string> = { low: '低能量', mid: '中能量', high: '高能量' };
const STRATEGY_SHORT: Record<string, string> = { pure: '纯系', fox: '狐系', wolf: '狼系' };
const CORE_SHORT: Record<string, string> = { cat: '猫系', dog: '犬系' };

export default function ShareCard({ breed, dimensions, score, cardRef }: ShareCardProps) {
  const isCat = breed.core === 'cat';
  const themeGradient = isCat
    ? 'linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)'
    : 'linear-gradient(135deg, #E8A87C 0%, #F4A460 100%)';
  const themeColor = isCat ? '#8B9DAF' : '#E8A87C';
  const themeBg = isCat ? '#EEF1F5' : '#FDF3E9';

  const energyPct = Math.round(((score.energy - 5) / 10) * 100);
  const strategyPct = Math.round(((score.strategy - 5) / 10) * 100);
  const corePct = Math.round(((score.core - 5) / 5) * 100);

  const bestMatchBreed = BREEDS.find((b) => b.id === breed.bestMatch);
  const nemesisBreed = BREEDS.find((b) => b.id === breed.nemesis);

  return (
    <div
      ref={cardRef}
      style={{
        width: 375,
        background: '#FAFAF8',
        fontFamily: '-apple-system, "PingFang SC", "Helvetica Neue", sans-serif',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* ── Hero ── */}
      <div style={{
        background: themeGradient,
        padding: '40px 28px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: -20,
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15), transparent)',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.22)',
          borderRadius: 20, padding: '4px 12px', marginBottom: 12,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
            {isCat ? '🐱 猫系内核' : '🐶 犬系内核'}
          </span>
        </div>

        <div style={{ fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 4 }}>
          {breed.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>
          {breed.nameEn}
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.28)',
          borderRadius: 14, padding: '6px 16px', marginBottom: 14,
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>「{breed.nickname}」</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {breed.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 10, color: 'rgba(255,255,255,0.88)',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 12, padding: '3px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '16px 20px 0' }}>

        {/* 一句话人设 */}
        <div style={{
          background: 'white', borderRadius: 20,
          padding: '14px 18px', marginBottom: 14,
          border: '1px solid #E8E8E4',
        }}>
          <p style={{
            fontSize: 13, fontWeight: 500, color: '#2C2C2C',
            lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic', margin: 0,
          }}>
            「{breed.tagline}」
          </p>
        </div>

        {/* 三维解析 */}
        <SectionHeader emoji="🔬" title="三维解析" />
        <div style={{ marginBottom: 14 }}>
          <DimBar label="⚡ 能量" value={ENERGY_SHORT[dimensions.energyLevel]} desc={ENERGY_LABEL[dimensions.energyLevel]} pct={energyPct} color="#8B9DAF" />
          <DimBar label="🧩 策略" value={STRATEGY_SHORT[dimensions.strategyLevel]} desc={STRATEGY_LABEL[dimensions.strategyLevel]} pct={strategyPct} color="#D4A574" />
          <DimBar label="🌀 内核" value={CORE_SHORT[dimensions.coreType]} desc={CORE_LABEL[dimensions.coreType]} pct={corePct} color={isCat ? '#B8A9C9' : '#E8A87C'} />
        </div>

        {/* 超能力 & 软肋 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <MiniCard emoji="⚡" title="超能力" content={breed.superpower} bgColor="#F0F9F4" textColor="#3D8A5A" />
          <MiniCard emoji="💧" title="软肋" content={breed.weakness} bgColor="#FFF4F4" textColor="#C05050" />
        </div>

        {/* 🧠 内在机制 */}
        <ProfileBlock emoji="🧠" title="内在机制" themeColor={themeColor} items={[
          { label: '压力反应', content: breed.innerMechanism.stressResponse },
          { label: '充电方式', content: breed.innerMechanism.rechargeMode },
          { label: '情绪模式', content: breed.innerMechanism.emotionalPattern },
        ]} />

        {/* 💼 职场风格 */}
        <ProfileBlock emoji="💼" title="职场风格" themeColor={themeColor} items={[
          { label: '当领导时', content: breed.workStyle.asLeader },
          { label: '当下属时', content: breed.workStyle.asFollower },
          { label: '开会风格', content: breed.workStyle.meetingStyle },
        ]} />

        {/* ❤️ 恋爱模式 */}
        <ProfileBlock emoji="❤️" title="恋爱模式" themeColor={themeColor} items={[
          { label: '心动信号', content: breed.loveStyle.crushSignal },
          { label: '雷点', content: breed.loveStyle.dealBreaker },
          { label: '理想相处', content: breed.loveStyle.idealRelationship },
        ]} />

        {/* 🤝 社交习惯 */}
        <ProfileBlock emoji="🤝" title="社交习惯" themeColor={themeColor} items={[
          { label: '朋友群角色', content: breed.socialHabit.friendGroupRole },
          { label: '社交电量', content: breed.socialHabit.socialBattery },
          { label: '友谊雷区', content: breed.socialHabit.friendshipRedFlag },
        ]} />

        {/* 扎心一句 */}
        <div style={{
          background: themeBg, borderRadius: 16, padding: '14px 16px',
          border: `1.5px solid ${themeColor}35`, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💬</span>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: themeColor, margin: '0 0 4px 0' }}>扎心一句</p>
              <p style={{ fontSize: 13, color: '#2C2C2C', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                {breed.heartbreaker}
              </p>
            </div>
          </div>
        </div>

        {/* 品种关系 */}
        {(bestMatchBreed || nemesisBreed) && (
          <div style={{ marginBottom: 14 }}>
            <SectionHeader emoji="🤝" title="品种关系" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {bestMatchBreed && (
                <RelationMini emoji="💝" title="最佳拍档" breed={bestMatchBreed} bgColor="#F0FBF1" textColor="#4CAF50" />
              )}
              {nemesisBreed && (
                <RelationMini emoji="⚔️" title="天敌" breed={nemesisBreed} bgColor="#FFF4F4" textColor="#E57373" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '20px 20px 24px',
        textAlign: 'center',
        borderTop: '1px solid #E8E8E4',
        marginTop: 6,
      }}>
        <p style={{ fontSize: 12, color: '#8B9DAF', margin: 0, fontWeight: 600, letterSpacing: 1 }}>
          猫人狗人 · 三维动物人格测试
        </p>
        <p style={{ fontSize: 10, color: '#C0C0C8', margin: '4px 0 0 0' }}>
          来测测你是哪种猫人狗人？
        </p>
      </div>
    </div>
  );
}

// ─── 子组件 ──────────────────────────────────────────

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '0 2px' }}>
      <span style={{ fontSize: 13 }}>{emoji}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#2C2C2C', letterSpacing: 1 }}>{title}</span>
    </div>
  );
}

function DimBar({ label, value, desc, pct, color }: {
  label: string; value: string; desc: string; pct: number; color: string;
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: '10px 12px',
      border: '1px solid #E8E8E4', marginBottom: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#2C2C2C' }}>{label}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
          background: `${color}20`, color,
        }}>{value}</span>
      </div>
      <div style={{ height: 4, background: '#F0F0EC', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </div>
      <p style={{ fontSize: 10, color: '#8B9DAF', margin: 0 }}>{desc}</p>
    </div>
  );
}

function MiniCard({ emoji, title, content, bgColor, textColor }: {
  emoji: string; title: string; content: string; bgColor: string; textColor: string;
}) {
  return (
    <div style={{ background: bgColor, borderRadius: 14, padding: '10px 12px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: textColor, margin: '0 0 4px 0' }}>{emoji} {title}</p>
      <p style={{ fontSize: 11, color: '#4A4A5A', lineHeight: 1.5, margin: 0 }}>{content}</p>
    </div>
  );
}

function ProfileBlock({ emoji, title, themeColor, items }: {
  emoji: string; title: string; themeColor: string;
  items: { label: string; content: string }[];
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: '16px 16px',
      border: '1px solid #E8E8E4', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 15 }}>{emoji}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#2C2C2C' }}>{title}</span>
      </div>
      {items.map((item, i) => (
        <div key={item.label} style={{ marginBottom: i < items.length - 1 ? 10 : 0 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: themeColor, margin: '0 0 3px 0' }}>{item.label}</p>
          <p style={{ fontSize: 12, color: '#4A4A5A', lineHeight: 1.6, margin: 0 }}>{item.content}</p>
        </div>
      ))}
    </div>
  );
}

function RelationMini({ emoji, title, breed, bgColor, textColor }: {
  emoji: string; title: string; breed: Breed; bgColor: string; textColor: string;
}) {
  return (
    <div style={{ background: bgColor, borderRadius: 14, padding: '10px 12px', border: `1px solid ${textColor}25` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        <span style={{ fontSize: 12 }}>{emoji}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: textColor }}>{title}</span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#2C2C2C', margin: 0 }}>{breed.name}</p>
      <p style={{ fontSize: 10, color: '#8B9DAF', margin: '2px 0 0 0' }}>{breed.nickname}</p>
    </div>
  );
}
