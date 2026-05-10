const express = require('express')
const combinedController = require('../controllers/combinedController')
const { uploadAudio } = require('../middleware/uploadMiddleware')

const router = express.Router()

router.post(
  '/analyze',
  uploadAudio.single('audio'),
  combinedController.analyze,
)

module.exports = router
