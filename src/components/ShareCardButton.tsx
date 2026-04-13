'use client';

/**
 * ShareCardButton — 生成分享图并触发保存/分享
 *
 * 原理：
 * 1. 将隐藏的 ShareCard DOM 节点用 html2canvas 截成 canvas
 * 2. 导出为 PNG data URL
 * 3. 如果浏览器支持 Web Share API with files，直接分享；
 *    否则触发 <a download> 下载，或在移动端提示长按保存。
 */

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareCard from './ShareCard';
import type { Breed, DimensionResult, Score } from '@/lib/types';

interface ShareCardButtonProps {
  breed: Breed;
  dimensions: DimensionResult;
  score: Score;
}

export default function ShareCardButton({ breed, dimensions, score }: ShareCardButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'preview' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!cardRef.current) return;
    setStatus('generating');

    try {
      // Dynamic import — html2canvas 只在客户端使用
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,             // 2x 高清
        useCORS: true,
        backgroundColor: '#FAFAF8',
        logging: false,
        width: 375,
      });

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewUrl(dataUrl);
      setStatus('preview');
    } catch (err) {
      console.error('[ShareCard] html2canvas error', err);
      setStatus('error');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!previewUrl) return;

    // 尝试 Web Share API（iOS Safari 支持分享图片文件）
    try {
      const blob = await (await fetch(previewUrl)).blob();
      const file = new File([blob], `${breed.name}-${breed.nickname}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `我是${breed.name}`, text: breed.tagline });
        setStatus('idle');
        setPreviewUrl(null);
        return;
      }
    } catch {
      // fallback to download
    }

    // 通用 fallback：触发下载
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `猫人狗人-${breed.name}-${breed.nickname}.png`;
    a.click();
    setStatus('idle');
    setPreviewUrl(null);
  }, [previewUrl, breed]);

  const handleClose = useCallback(() => {
    setStatus('idle');
    setPreviewUrl(null);
  }, []);

  return (
    <>
      {/* 隐藏的分享卡片 DOM（用于截图） */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <ShareCard
          breed={breed}
          dimensions={dimensions}
          score={score}
          cardRef={cardRef}
        />
      </div>

      {/* 生成按钮 */}
      <motion.button
        onClick={handleGenerate}
        disabled={status === 'generating'}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 border-[#E8E8E4] bg-white flex items-center justify-center gap-2"
        style={{ color: status === 'generating' ? '#C0C0C8' : '#4A4A5A' }}
        whileHover={{ scale: status === 'generating' ? 1 : 1.01 }}
        whileTap={{ scale: status === 'generating' ? 1 : 0.98 }}
      >
        {status === 'generating' ? (
          <>
            <Spinner />
            <span>生成中…</span>
          </>
        ) : (
          <>
            <span>🖼️</span>
            <span>生成分享图</span>
          </>
        )}
      </motion.button>

      {/* 错误提示 */}
      {status === 'error' && (
        <p className="text-center text-xs text-[#E57373] mt-1">
          生成失败，请截屏保存 😅
        </p>
      )}

      {/* 预览 Modal */}
      <AnimatePresence>
        {status === 'preview' && previewUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative flex flex-col items-center gap-4 px-5 w-full max-w-sm"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 预览图 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="分享卡片预览"
                style={{
                  width: '100%',
                  maxWidth: 300,
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  borderRadius: 16,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}
              />

              {/* 提示文字 */}
              <p className="text-white/70 text-xs text-center">
                📱 长按图片可直接保存到相册
              </p>

              {/* 操作按钮 */}
              <div className="flex gap-3 w-full">
                <motion.button
                  onClick={handleSave}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #8B9DAF 0%, #B8A9C9 100%)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  保存 / 分享
                </motion.button>
                <motion.button
                  onClick={handleClose}
                  className="px-5 py-3.5 rounded-2xl font-semibold text-sm bg-white/15 text-white border border-white/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  关闭
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── 加载 Spinner ──────────────────────────────────────────

function Spinner() {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="7" cy="7" r="5.5" stroke="#C0C0C8" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="20" strokeDashoffset="8" />
    </svg>
  );
}
