const express = require('express')
const audioController = require('../controllers/audioController')
const { uploadAudio } = require('../middleware/uploadMiddleware')

const router = express.Router()

router.post('/analyze', uploadAudio.single('audio'), audioController.analyze)

module.exports = router
