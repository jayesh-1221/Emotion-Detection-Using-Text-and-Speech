const fs = require('fs')
const { analyzeEmotionFromText } = require('../services/groqService')
const { transcribeFile } = require('../services/whisperService')
const { fuseEmotions } = require('../services/fusionService')

async function analyze(req, res, next) {
  const filePath = req.file?.path
  try {
    const rawText = req.body?.text
    const textTrimmed =
      typeof rawText === 'string' ? rawText.trim() : ''

    let textResult = null
    if (textTrimmed) {
      textResult = await analyzeEmotionFromText(textTrimmed)
    }

    let audioBlock = null
    if (filePath) {
      const transcript = await transcribeFile(filePath)
      const audioEmotion = await analyzeEmotionFromText(
        `The following is a transcript of spoken audio. Infer the speaker's dominant emotion from wording and implied tone:\n${transcript}`,
      )
      audioBlock = {
        emotion: audioEmotion.emotion,
        confidence: audioEmotion.confidence,
        transcript,
      }
    }

    if (!textResult && !audioBlock) {
      const err = new Error('Provide text and/or an audio file (field name: audio)')
      err.status = 400
      throw err
    }

    const combined = fuseEmotions(textResult, audioBlock)

    res.json({
      combined,
      text: textResult,
      audio: audioBlock,
    })
  } catch (err) {
    next(err)
  } finally {
    if (filePath) fs.unlink(filePath, () => {})
  }
}

module.exports = {
  analyze,
}
