/**
 * 猫人狗人 — URL编解码工具
 * 负责得分与URL参数之间的双向转换
 *
 * URL格式：
 *   结果页：/result?e=9&s=10&c=8
 *   照镜子：/mirror?from=e9s10c8
 */

import type { CompactScore, ResultUrlParams, Score } from './types';
import { validateScore } from './scoring';

// ─── 紧凑编码（CompactScore） ────────────────────────────────

/**
 * 将 Score 编码为紧凑字符串 `e{n}s{n}c{n}`
 * @example encodeScore({energy:9, strategy:10, core:8}) → "e9s10c8"
 */
export function encodeScore(score: Score): CompactScore {
  return `e${score.energy}s${score.strategy}c${score.core}`;
}

/**
 * 将紧凑字符串解码为 Score
 * @example decodeScore("e9s10c8") → {energy:9, strategy:10, core:8}
 * @returns Score | null（格式错误或值超范围时返回null）
 */
export function decodeScore(code: CompactScore): Score | null {
  const match = code.match(/^e(\d{1,2})s(\d{1,2})c(\d{1,2})$/);
  if (!match) return null;

  const score: Score = {
    energy: parseInt(match[1], 10),
    strategy: parseInt(match[2], 10),
    core: parseInt(match[3], 10),
  };

  return validateScore(score) ? score : null;
}

// ─── 结果页参数（ResultUrlParams） ──────────────────────────

/**
 * Score → ResultUrlParams（用于构造 /result 页面URL）
 * @example scoreToResultParams({energy:9, strategy:10, core:8})
 *          → {e:9, s:10, c:8}
 */
export function scoreToResultParams(score: Score): ResultUrlParams {
  return { e: score.energy, s: score.strategy, c: score.core };
}

/**
 * ResultUrlParams → Score
 * @returns Score | null（参数缺失或超范围时返回null）
 */
export function resultParamsToScore(params: ResultUrlParams): Score | null {
  const score: Score = {
    energy: params.e,
    strategy: params.s,
    core: params.c,
  };
  return validateScore(score) ? score : null;
}

/**
 * 从 URL Search Params 字符串解析结果页得分
 * @example parseResultUrl("e=9&s=10&c=8") → {energy:9, strategy:10, core:8}
 */
export function parseResultUrl(search: string): Score | null {
  const params = new URLSearchParams(search);
  const e = params.get('e');
  const s = params.get('s');
  const c = params.get('c');

  if (e === null || s === null || c === null) return null;

  const score: Score = {
    energy: parseInt(e, 10),
    strategy: parseInt(s, 10),
    core: parseInt(c, 10),
  };

  return validateScore(score) ? score : null;
}

/**
 * 构造结果页URL
 * @example buildResultUrl({energy:9, strategy:10, core:8}, "https://catsdogs.com")
 *          → "https://catsdogs.com/result?e=9&s=10&c=8"
 */
export function buildResultUrl(score: Score, baseUrl = ''): string {
  const { e, s, c } = scoreToResultParams(score);
  return `${baseUrl}/result?e=${e}&s=${s}&c=${c}`;
}

// ─── 照镜子链接 ────────────────────────────────────────────

/**
 * 从照镜子URL的 `from` 参数解析被测人得分
 * @example parseMirrorUrl("from=e9s10c8") → {energy:9, strategy:10, core:8}
 */
export function parseMirrorUrl(search: string): Score | null {
  const params = new URLSearchParams(search);
  const from = params.get('from');
  if (!from) return null;
  return decodeScore(from);
}

/**
 * 构造照镜子链接（A邀请B测测他）
 * @example buildMirrorUrl({energy:9, strategy:10, core:8}, "https://catsdogs.com")
 *          → "https://catsdogs.com/mirror?from=e9s10c8"
 */
export function buildMirrorUrl(selfScore: Score, baseUrl = ''): string {
  return `${baseUrl}/mirror?from=${encodeScore(selfScore)}`;
}

// ─── 工具函数 ──────────────────────────────────────────────

/**
 * 安全解析整数，失败时返回 NaN
 */
function safeInt(val: string | null): number {
  if (val === null) return NaN;
  const n = parseInt(val, 10);
  return isNaN(n) ? NaN : n;
}

/**
 * 通用URL得分解析（自动识别结果页/照镜子格式）
 * 用于需要在多种URL格式下尝试解析得分的场景
 */
export function parseAnyScoreUrl(search: string): Score | null {
  return (
    parseResultUrl(search) ??
    parseMirrorUrl(search) ??
    null
  );
}

// 导出 safeInt 供其他模块使用（如需要）
export { safeInt };
