const { analyzeEmotionFromText } = require('../services/groqService')

async function analyze(req, res, next) {
  try {
    const result = await analyzeEmotionFromText(req.body?.text)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  analyze,
}
