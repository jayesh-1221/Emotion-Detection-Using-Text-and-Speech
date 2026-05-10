const path = require('path')
const fs = require('fs')
const multer = require('multer')

const uploadDir = path.join(__dirname, '..', 'uploads', 'audio')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.webm'
    cb(
      null,
      `${Date.now()}-${Math.random().toString(36).slice(2, 12)}${ext}`,
    )
  },
})

function audioMimeOk(mimetype) {
  if (!mimetype) return false
  if (mimetype.startsWith('audio/')) return true
  return mimetype === 'video/webm'
}

const uploadAudio = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (audioMimeOk(file.mimetype)) cb(null, true)
    else cb(new Error('Only audio uploads are allowed'))
  },
})

module.exports = {
  uploadAudio,
  uploadDir,
}
