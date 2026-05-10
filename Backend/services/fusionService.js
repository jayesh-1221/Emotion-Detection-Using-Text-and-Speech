function fuseEmotions(textResult, audioResult) {
  if (textResult && !audioResult) {
    return {
      emotion: textResult.emotion,
      confidence: textResult.confidence,
    }
  }
  if (!textResult && audioResult) {
    return {
      emotion: audioResult.emotion,
      confidence: audioResult.confidence,
    }
  }
  if (!textResult && !audioResult) {
    return null
  }

  if (textResult.emotion === audioResult.emotion) {
    return {
      emotion: textResult.emotion,
      confidence: (textResult.confidence + audioResult.confidence) / 2,
    }
  }

  return {
    emotion: 'Mixed',
    confidence:
      Math.min(textResult.confidence, audioResult.confidence) * 0.85,
  }
}

module.exports = {
  fuseEmotions,
}
