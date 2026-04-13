'use client';

/**
 * ShareCard — 结果分享图卡片（重设计版）
 *
 * 固定 375×667px（iPhone 屏比例），纯 inline styles，
 * 无 Framer Motion，可被 html2canvas 正常截图。
 *
 * 布局（从上到下）：
 *   1. Hero (~200px)  — 渐变背景 + 品种标题区
 *   2. Content (~417px) — 白底内容区
 *   3. Footer (~50px)  — 渐变水印（绝对定位）
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
const ENERGY_ICON: Record<string, string> = { low: '⚡', mid: '⚡', high: '⚡' };
const STRATEGY_ICON: Record<string, string> = { pure: '🧩', fox: '🦊', wolf: '🐺' };
const CORE_ICON: Record<string, string> = { cat: '🌀', dog: '🐾' };

export default function ShareCard({ breed, dimensions, cardRef }: ShareCardProps) {
  const isCat = breed.core === 'cat';

  // ── Theme ──────────────────────────────────────────────────
  const themeGradient = isCat
    ? 'linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)'
    : 'linear-gradient(135deg, #E8A87C 0%, #F4A460 100%)';
  const themeColor = isCat ? '#8B9DAF' : '#E8A87C';
  const themeBg = isCat ? '#EEF1F5' : '#FDF3E9';
  const themeBorder = isCat ? '#8B9DAF40' : '#E8A87C40';

  // ── Dimension pills ────────────────────────────────────────
  const dimPills = [
    {
      icon: ENERGY_ICON[dimensions.energyLevel],
      label: ENERGY_LABEL[dimensions.energyLevel],
    },
    {
      icon: STRATEGY_ICON[dimensions.strategyLevel],
      label: STRATEGY_LABEL[dimensions.strategyLevel],
    },
    {
      icon: CORE_ICON[dimensions.coreType],
      label: CORE_LABEL[dimensions.coreType],
    },
  ];

  return (
    <div
      ref={cardRef}
      style={{
        width: 375,
        height: 667,
        background: '#FAFAF8',
        fontFamily: '-apple-system, "PingFang SC", "Helvetica Neue", sans-serif',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ══════════════════════════════════════════
          1. HERO SECTION  ~200px
      ══════════════════════════════════════════ */}
      <div
        style={{
          background: themeGradient,
          padding: '36px 28px 28px',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* 装饰圆 */}
        <div style={{
          position: 'absolute', top: -36, right: -36,
          width: 130, height: 130, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.22), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -24, left: -24,
          width: 90, height: 90, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.14), transparent)',
          pointerEvents: 'none',
        }} />

        {/* 猫系/犬系 label pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.22)',
          borderRadius: 20, padding: '4px 12px',
          marginBottom: 10,
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.92)', letterSpacing: 0.5 }}>
            {isCat ? '🐱 猫系内核' : '🐶 犬系内核'}
          </span>
        </div>

        {/* 品种名 + 英文名 */}
        <div style={{ fontSize: 30, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 3 }}>
          {breed.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', marginBottom: 12, letterSpacing: 0.8 }}>
          {breed.nameEn}
        </div>

        {/* 代号 pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.28)',
          borderRadius: 14, padding: '6px 16px',
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>「{breed.nickname}」</span>
        </div>

        {/* 3 tag pills */}
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

      {/* ══════════════════════════════════════════
          2. CONTENT SECTION
      ══════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          padding: '18px 20px 60px', /* bottom padding leaves room for footer */
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: 'white',
          overflow: 'hidden',
        }}
      >
        {/* 2a. Tagline — italic, centered card */}
        <div style={{
          background: '#FAFAF8',
          borderRadius: 14,
          padding: '12px 16px',
          border: '1px solid #E8E8E4',
        }}>
          <p style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#2C2C2C',
            lineHeight: 1.65,
            textAlign: 'center',
            fontStyle: 'italic',
            margin: 0,
          }}>
            「{breed.tagline}」
          </p>
        </div>

        {/* 2b. 三维标签行 — compact inline pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'nowrap',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9B9BAA', flexShrink: 0 }}>三维</span>
          <div style={{ width: 1, height: 12, background: '#E0E0E8', flexShrink: 0 }} />
          {dimPills.map((p, i) => (
            <React.Fragment key={i}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: themeColor,
                background: themeBg,
                borderRadius: 20,
                padding: '4px 10px',
                whiteSpace: 'nowrap',
              }}>
                {p.icon} {p.label}
              </span>
              {i < dimPills.length - 1 && (
                <span style={{ fontSize: 11, color: '#D0D0D8', flexShrink: 0 }}>·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 2c. 扎心一句 — visual highlight */}
        <div style={{
          background: themeBg,
          borderRadius: 14,
          padding: '14px 16px',
          border: `1.5px solid ${themeBorder}`,
          borderLeft: `4px solid ${themeColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>💬</span>
            <p style={{
              fontSize: 13,
              color: '#2C2C2C',
              lineHeight: 1.7,
              margin: 0,
              fontWeight: 500,
            }}>
              {breed.heartbreaker}
            </p>
          </div>
        </div>

        {/* 2d. 超能力 + 软肋 2-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{
            background: '#F0F9F4',
            borderRadius: 12,
            padding: '10px 12px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#3D8A5A', margin: '0 0 5px 0' }}>⚡ 超能力</p>
            <p style={{
              fontSize: 11,
              color: '#4A4A5A',
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}>
              {breed.superpower}
            </p>
          </div>
          <div style={{
            background: '#FFF4F4',
            borderRadius: 12,
            padding: '10px 12px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#C05050', margin: '0 0 5px 0' }}>💧 软肋</p>
            <p style={{
              fontSize: 11,
              color: '#4A4A5A',
              lineHeight: 1.55,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}>
              {breed.weakness}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          3. FOOTER — absolute, gradient fade
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 52,
        padding: '0 20px',
        background: 'linear-gradient(0deg, rgba(255,255,255,1) 55%, rgba(255,255,255,0))',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingBottom: 10,
      }}>
        <p style={{ fontSize: 10, color: '#C0C0C8', margin: 0, letterSpacing: 0.5 }}>
          猫人狗人 · 三维动物人格测试
        </p>
        <p style={{ fontSize: 10, color: '#C8C8D0', margin: 0 }}>
          扫码来测 →
        </p>
      </div>
    </div>
  );
}
