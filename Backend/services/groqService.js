const { groq, chatModel } = require('../config/groqConfig')
const {
  parseJsonObject,
  normalizeEmotionPayload,
} = require('../utils/helper')

const SYSTEM = `You classify the dominant emotion expressed in the user's message.
Respond with a single JSON object only (no markdown), shape:
{"emotion":"<label>","confidence":<number between 0 and 1>}

Allowed emotion labels (use exactly one): Joy, Sadness, Anger, Fear, Neutral,confused.
Base confidence on how clearly the text supports that label; use lower values when ambiguous.
confidence should not be above 93% `

async function analyzeEmotionFromText(text) {
  const trimmed = String(text ?? '').trim()
  if (!trimmed) {
    const err = new Error('Text is required')
    err.status = 400
    throw err
  }

  const completion = await groq.chat.completions.create({
    model: chatModel,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: trimmed },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content ?? '{}'
  const parsed = parseJsonObject(raw)
  if (!parsed || typeof parsed !== 'object') {
    const err = new Error('Could not parse model emotion response')
    err.status = 502
    throw err
  }

  return normalizeEmotionPayload(parsed)
}

module.exports = {
  analyzeEmotionFromText,
}
