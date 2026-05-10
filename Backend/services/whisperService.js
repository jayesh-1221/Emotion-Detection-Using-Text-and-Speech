const fs = require('fs')
const { groq, whisperModel } = require('../config/groqConfig')

async function transcribeFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    const err = new Error('Audio file missing')
    err.status = 400
    throw err
  }

  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: whisperModel,
    response_format: 'json',
  })

  const text = transcription.text?.trim() ?? ''
  if (!text) {
    const err = new Error('Transcription was empty')
    err.status = 422
    throw err
  }

  return text
}

module.exports = {
  transcribeFile,
}
