require('dotenv').config()

const Groq = require('groq-sdk')

const apiKey = process.env.GROQ_API_KEY
if (!apiKey) {
  console.warn(
    '[groqConfig] GROQ_API_KEY is not set. Emotion and transcription calls will fail until it is configured.',
  )
}

const groq = new Groq({
  apiKey: apiKey || 'missing',
})

const chatModel =
  process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile'

const whisperModel =
  process.env.GROQ_WHISPER_MODEL || 'whisper-large-v3-turbo'

module.exports = {
  groq,
  chatModel,
  whisperModel,
}
