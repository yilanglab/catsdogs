'use client';

/**
 * ShareCard — 结果分享图卡片
 *
 * 设计为固定 375×660px，绘制时不可见（通过 ref 导出 DOM 节点）。
 * 由 ShareCardButton 调用 html2canvas 截图后触发下载/分享。
 */

import React from 'react';
import type { Breed, DimensionResult, Score } from '@/lib/types';

interface ShareCardProps {
  breed: Breed;
  dimensions: DimensionResult;
  score: Score;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const ENERGY_LABEL: Record<string, string> = {
  low: '低能量',
  mid: '中能量',
  high: '高能量',
};
const STRATEGY_LABEL: Record<string, string> = {
  pure: '纯系',
  fox: '狐系',
  wolf: '狼系',
};
const CORE_LABEL: Record<string, string> = {
  cat: '猫系',
  dog: '犬系',
};

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

  return (
    <div
      ref={cardRef}
      style={{
        width: 375,
        height: 660,
        background: '#FAFAF8',
        fontFamily: '-apple-system, "PingFang SC", "Helvetica Neue", sans-serif',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Hero 渐变头部 */}
      <div style={{
        background: themeGradient,
        padding: '40px 28px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 装饰圆 */}
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

        {/* 内核标签 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.22)',
          borderRadius: 20, padding: '4px 12px',
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
            {isCat ? '🐱 猫系内核' : '🐶 犬系内核'}
          </span>
        </div>

        {/* 品种名 */}
        <div style={{ fontSize: 28, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 4 }}>
          {breed.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>
          {breed.nameEn}
        </div>

        {/* 代号 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.28)',
          borderRadius: 14, padding: '6px 16px',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>「{breed.nickname}」</span>
        </div>

        {/* 标签 */}
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

      {/* 内容区 */}
      <div style={{ padding: '16px 20px 16px' }}>
        {/* 一句话人设 */}
        <div style={{
          background: 'white', borderRadius: 20,
          padding: '14px 18px', marginBottom: 12,
          border: '1px solid #E8E8E4',
        }}>
          <p style={{
            fontSize: 13, fontWeight: 500, color: '#2C2C2C',
            lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic', margin: 0,
          }}>
            「{breed.tagline}」
          </p>
        </div>

        {/* 三维数据 */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#8B9DAF', marginBottom: 8, margin: '0 0 8px 0' }}>
            🔬 三维解析
          </p>
          <DimBarStatic label="⚡ 能量" value={ENERGY_LABEL[dimensions.energyLevel]} pct={energyPct} color="#8B9DAF" />
          <DimBarStatic label="🧩 策略" value={STRATEGY_LABEL[dimensions.strategyLevel]} pct={strategyPct} color="#D4A574" />
          <DimBarStatic label="🌀 内核" value={CORE_LABEL[dimensions.coreType]} pct={corePct} color={themeColor} />
        </div>

        {/* 超能力/软肋 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div style={{ background: '#F0F9F4', borderRadius: 14, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#3D8A5A', margin: '0 0 4px 0' }}>⚡ 超能力</p>
            <p style={{ fontSize: 11, color: '#4A4A5A', lineHeight: 1.5, margin: 0 }}>{breed.superpower}</p>
          </div>
          <div style={{ background: '#FFF4F4', borderRadius: 14, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#C05050', margin: '0 0 4px 0' }}>💧 软肋</p>
            <p style={{ fontSize: 11, color: '#4A4A5A', lineHeight: 1.5, margin: 0 }}>{breed.weakness}</p>
          </div>
        </div>

        {/* 扎心一句 */}
        <div style={{
          background: themeBg, borderRadius: 16, padding: '12px 16px',
          border: `1.5px solid ${themeColor}35`, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💬</span>
            <p style={{ fontSize: 12, color: '#2C2C2C', lineHeight: 1.6, margin: 0 }}>
              {breed.heartbreaker}
            </p>
          </div>
        </div>
      </div>

      {/* 底部水印 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 20px',
        background: 'linear-gradient(0deg, rgba(250,250,248,1) 60%, transparent)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 11, color: '#C0C0C8', margin: 0 }}>
          猫人狗人 · 三维动物人格测试
        </p>
      </div>
    </div>
  );
}

// ─── 静态维度条（不用 Framer Motion，html2canvas 可正常渲染） ──

function DimBarStatic({
  label, value, pct, color,
}: {
  label: string; value: string; pct: number; color: string;
}) {
  return (
    <div style={{
      background: 'white', borderRadius: 12, padding: '8px 12px',
      border: '1px solid #E8E8E4', marginBottom: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#2C2C2C' }}>{label}</span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
          background: `${color}20`, color,
        }}>
          {value}
        </span>
      </div>
      <div style={{ height: 4, background: '#F0F0EC', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}
