const fs = require('fs')
const { analyzeEmotionFromText } = require('../services/groqService')
const { transcribeFile } = require('../services/whisperService')

async function analyze(req, res, next) {
  const filePath = req.file?.path
  try {
    if (!filePath) {
      const err = new Error('Audio file is required (field name: audio)')
      err.status = 400
      throw err
    }

    const transcript = await transcribeFile(filePath)
    const emotion = await analyzeEmotionFromText(
      `The following is a transcript of spoken audio. Infer the speaker's dominant emotion from wording and implied tone:\n${transcript}`,
    )

    res.json({
      emotion: emotion.emotion,
      confidence: emotion.confidence,
      transcript,
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
