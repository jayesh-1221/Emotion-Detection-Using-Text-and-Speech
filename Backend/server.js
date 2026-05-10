require('dotenv').config()
const express = require('express')
const cors = require('cors')

const textRoutes = require('./routes/textRoutes')
const audioRoutes = require('./routes/audioRoutes')
const combinedRoutes = require('./routes/combinedRoutes')

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/text', textRoutes)
app.use('/api/audio', audioRoutes)
app.use('/api/combined', combinedRoutes)

app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Audio file too large' })
  }

  const status = err.status || err.statusCode || 500
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Unexpected error'
  if (status >= 500) console.error(err)
  res.status(status).json({ error: message })
})

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
