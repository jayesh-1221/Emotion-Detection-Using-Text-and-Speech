const ALLOWED_EMOTIONS = new Set([
  'Joy',
  'Sadness',
  'Anger',
  'Fear',
  'Neutral',
])

const ALIAS = {
  happy: 'Joy',
  happiness: 'Joy',
  joy: 'Joy',
  excited: 'Joy',
  sad: 'Sadness',
  sadness: 'Sadness',
  depressed: 'Sadness',
  angry: 'Anger',
  anger: 'Anger',
  mad: 'Anger',
  fear: 'Fear',
  scared: 'Fear',
  anxious: 'Fear',
  anxiety: 'Fear',
  worried: 'Fear',
  neutral: 'Neutral',
  calm: 'Neutral',
}

function clamp01(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return 0
  return Math.min(1, Math.max(0, x))
}

function normalizeEmotionLabel(raw) {
  if (raw == null || typeof raw !== 'string') return 'Neutral'
  const trimmed = raw.trim()
  if (!trimmed) return 'Neutral'
  const titled =
    trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
  if (ALLOWED_EMOTIONS.has(trimmed)) return raw
  if (ALLOWED_EMOTIONS.has(titled)) return titled
  const lower = trimmed.toLowerCase()
  return ALIAS[lower] || 'Neutral'
}

function parseJsonObject(content) {
  if (!content || typeof content !== 'string') return null
  const trimmed = content.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

function normalizeEmotionPayload(parsed) {
  const emotion = normalizeEmotionLabel(parsed?.emotion ?? parsed?.label)
  const confidence = clamp01(parsed?.confidence ?? parsed?.score ?? 0)
  return { emotion, confidence }
}

module.exports = {
  ALLOWED_EMOTIONS,
  clamp01,
  normalizeEmotionLabel,
  parseJsonObject,
  normalizeEmotionPayload,
}
